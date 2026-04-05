import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/profile - Get current user's profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id).select(
            '-password -resetPasswordToken -resetPasswordExpires -refreshToken -refreshTokenExpires'
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT /api/profile - Update profile
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, mobile, image } = await req.json();

        await connectDB();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (image !== undefined) updateData.image = image;

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires -refreshToken -refreshTokenExpires');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
