import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import connectDB from './db';
import { User } from '@/models/User';
import { Shop } from '@/models/Shop';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    getAccessTokenExpiry,
    getRefreshTokenExpiry,
} from './tokens';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    userType: user.userType,
                    shopId: user.shopId?.toString(),
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                await connectDB();

                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    // Read the userType from cookie header (set by registration form)
                    let signupUserType: 'customer' | 'shopOwner' = 'customer';
                    try {
                        const headersList = await headers();
                        const cookieHeader = headersList.get('cookie') || '';
                        const match = cookieHeader.match(/google_signup_userType=([^;]+)/);
                        if (match?.[1] === 'shopOwner') {
                            signupUserType = 'shopOwner';
                        }
                    } catch {
                        // If headers can't be read, default to customer
                    }

                    // Create new user from Google OAuth
                    const newUser = await User.create({
                        name: user.name,
                        email: user.email,
                        googleId: account.providerAccountId,
                        image: user.image,
                        userType: signupUserType,
                    });

                    // If shop owner, create a shop for them
                    if (signupUserType === 'shopOwner') {
                        const shop = await Shop.create({
                            shopName: `${user.name}'s Shop`,
                            ownerId: newUser._id,
                        });
                        newUser.shopId = shop._id;
                        await newUser.save();
                        user.shopId = shop._id.toString();
                    }

                    user.id = newUser._id.toString();
                    user.userType = newUser.userType;
                } else {
                    // Update existing user's image from Google if it has changed
                    if (user.image && existingUser.image !== user.image) {
                        await User.findByIdAndUpdate(existingUser._id, {
                            image: user.image
                        });
                    }
                    user.id = existingUser._id.toString();
                    user.userType = existingUser.userType;
                    user.shopId = existingUser.shopId?.toString();
                    user.image = user.image || existingUser.image; // Use Google image or fallback to stored image
                }
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign-in: generate access + refresh tokens
            if (user) {
                token.id = user.id;
                token.userType = user.userType;
                token.shopId = user.shopId;
                token.image = user.image;

                // Generate tokens
                const accessToken = generateAccessToken(user.id, user.userType);
                const refreshToken = generateRefreshToken(user.id);

                token.accessToken = accessToken;
                token.refreshToken = refreshToken;
                token.accessTokenExpires = getAccessTokenExpiry();
                token.refreshTokenExpires = getRefreshTokenExpiry();

                // Store refresh token hash in database
                try {
                    await connectDB();
                    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
                    await User.findByIdAndUpdate(user.id, {
                        refreshToken: hashedRefreshToken,
                        refreshTokenExpires: new Date(token.refreshTokenExpires),
                    });
                } catch (error) {
                    console.error('Error storing refresh token:', error);
                }

                return token;
            }

            // Handle session update
            if (trigger === 'update' && session) {
                token = { ...token, ...session };
                return token;
            }

            // Check if access token has expired
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                // Access token is still valid
                return token;
            }

            // Access token expired — try to refresh
            if (token.refreshToken && token.refreshTokenExpires) {
                // Check if refresh token is also expired
                if (Date.now() >= token.refreshTokenExpires) {
                    // Refresh token expired — user must re-login
                    return { ...token, error: 'RefreshTokenExpired' };
                }

                // Verify the refresh token
                const decoded = verifyRefreshToken(token.refreshToken);
                if (!decoded) {
                    return { ...token, error: 'RefreshTokenInvalid' };
                }

                // Verify refresh token matches what's stored in DB
                try {
                    await connectDB();
                    const dbUser = await User.findById(token.id);
                    if (!dbUser || !dbUser.refreshToken) {
                        return { ...token, error: 'RefreshTokenInvalid' };
                    }

                    const isValidRefreshToken = await bcrypt.compare(
                        token.refreshToken,
                        dbUser.refreshToken
                    );

                    if (!isValidRefreshToken) {
                        return { ...token, error: 'RefreshTokenInvalid' };
                    }

                    // Generate new access token (rotation)
                    const newAccessToken = generateAccessToken(
                        token.id,
                        token.userType
                    );

                    // Generate new refresh token (full rotation)
                    const newRefreshToken = generateRefreshToken(token.id);
                    const newRefreshExpiry = getRefreshTokenExpiry();

                    // Update refresh token in DB
                    const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 10);
                    await User.findByIdAndUpdate(token.id, {
                        refreshToken: hashedNewRefresh,
                        refreshTokenExpires: new Date(newRefreshExpiry),
                    });

                    return {
                        ...token,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        accessTokenExpires: getAccessTokenExpiry(),
                        refreshTokenExpires: newRefreshExpiry,
                        error: undefined,
                    };
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    return { ...token, error: 'RefreshTokenError' };
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.userType = token.userType as 'customer' | 'shopOwner';
                session.user.shopId = token.shopId as string | undefined;
                // Use our custom image, or NextAuth's default picture from Google OAuth
                session.user.image = (token.image || token.picture) as string | null | undefined;
            }

            // Expose token info to the client
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.accessTokenExpires = token.accessTokenExpires;
            session.error = token.error;

            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
