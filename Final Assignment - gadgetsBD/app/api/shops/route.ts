import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Shop } from '@/models/Shop';

// GET /api/shops - List all shops
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const shops = await Shop.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json(shops);
    } catch (error) {
        console.error('Error fetching shops:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shops' },
            { status: 500 }
        );
    }
}
