import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/nodemailer';
import crypto from 'crypto';

// POST /api/auth/forgot-password - Request password reset
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save token to user (expires in 1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Send email
        const emailResult = await sendPasswordResetEmail(
            user.email,
            resetToken,
            user.name
        );

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send reset email. Please try again later.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}
