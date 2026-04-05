import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import {
    verifyRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    getAccessTokenExpiry,
    getRefreshTokenExpiry,
} from '@/lib/tokens';

/**
 * POST /api/auth/refresh
 * Accepts a refresh token and returns new access + refresh tokens
 */
export async function POST(req: NextRequest) {
    try {
        const { refreshToken } = await req.json();

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Verify the refresh token signature
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        await connectDB();

        // Find user and verify refresh token matches DB
        const user = await User.findById(decoded.userId);
        if (!user || !user.refreshToken) {
            return NextResponse.json(
                { error: 'User not found or no active session' },
                { status: 401 }
            );
        }

        // Check if refresh token has expired in DB
        if (user.refreshTokenExpires && new Date() > user.refreshTokenExpires) {
            // Clear expired refresh token
            await User.findByIdAndUpdate(decoded.userId, {
                refreshToken: null,
                refreshTokenExpires: null,
            });

            return NextResponse.json(
                { error: 'Refresh token has expired. Please login again.' },
                { status: 401 }
            );
        }

        // Verify the provided refresh token matches the stored hash
        const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValidToken) {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            );
        }

        // Generate new tokens (full rotation)
        const newAccessToken = generateAccessToken(user._id.toString(), user.userType);
        const newRefreshToken = generateRefreshToken(user._id.toString());
        const accessTokenExpires = getAccessTokenExpiry();
        const refreshTokenExpires = getRefreshTokenExpiry();

        // Store new refresh token hash in DB
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        await User.findByIdAndUpdate(decoded.userId, {
            refreshToken: hashedRefreshToken,
            refreshTokenExpires: new Date(refreshTokenExpires),
        });

        return NextResponse.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpires,
            refreshTokenExpires,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        );
    }
}
