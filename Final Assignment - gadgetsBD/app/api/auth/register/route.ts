import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Shop } from '@/models/Shop';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    mobile: z.string().min(10, 'Invalid mobile number'),
    userType: z.enum(['customer', 'shopOwner']),
    shopName: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = registerSchema.parse(body);

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            mobile: validatedData.mobile,
            userType: validatedData.userType,
        });

        // If shop owner, create shop
        if (validatedData.userType === 'shopOwner' && validatedData.shopName) {
            const shop = await Shop.create({
                ownerId: user._id,
                shopName: validatedData.shopName,
            });

            // Update user with shop ID
            user.shopId = shop._id;
            await user.save();
        }

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
