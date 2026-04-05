import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Shop } from '@/models/Shop';

// GET /api/shops/[id] - Get shop details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const shop = await Shop.findById(params.id).lean();

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        return NextResponse.json(shop);
    } catch (error) {
        console.error('Error fetching shop:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shop' },
            { status: 500 }
        );
    }
}
