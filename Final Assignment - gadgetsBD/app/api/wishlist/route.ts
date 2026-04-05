import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Wishlist } from '@/models/Wishlist';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/wishlist - Get user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const wishlistItems = await Wishlist.find({ userId: session.user.id })
            .populate({
                path: 'productId',
                select: 'title price images stock averageRating totalReviews category brand',
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(wishlistItems);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST /api/wishlist - Toggle product in wishlist (add/remove)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await connectDB();

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            userId: session.user.id,
            productId,
        });

        if (existing) {
            // Remove from wishlist (toggle off)
            await Wishlist.deleteOne({ _id: existing._id });
            return NextResponse.json({ action: 'removed', productId });
        } else {
            // Add to wishlist (toggle on)
            await Wishlist.create({ userId: session.user.id, productId });
            return NextResponse.json({ action: 'added', productId });
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}

// DELETE /api/wishlist?productId=xxx - Remove from wishlist
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
        }

        await connectDB();

        await Wishlist.deleteOne({ userId: session.user.id, productId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
