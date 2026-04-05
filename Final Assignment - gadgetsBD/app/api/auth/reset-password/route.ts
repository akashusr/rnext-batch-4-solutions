import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// POST /api/auth/reset-password - Reset password with token
export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        await connectDB();

        // Hash the token to compare with stored hash
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid (non-expired) reset token
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token. Please request a new password reset.' },
                { status: 400 }
            );
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully. You can now sign in with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
