import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Review } from '@/models/Review';
import { Order } from '@/models/Order';
import { authOptions } from '@/lib/auth';

// GET /api/reviews/check-eligibility?productId=X
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ canReview: false, hasPurchased: false, hasReviewed: false });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'productId is required' }, { status: 400 });
        }

        // Check if user purchased
        const order = await Order.findOne({
            customerId: session.user.id,
            'items.productId': productId,
            status: { $in: ['pending', 'confirmed', 'delivered', 'completed', 'shipped'] },
        });
        const hasPurchased = !!order;

        // Check if user already reviewed
        const existingReview = await Review.findOne({ productId, userId: session.user.id });
        const hasReviewed = !!existingReview;

        return NextResponse.json({
            canReview: hasPurchased && !hasReviewed,
            hasPurchased,
            hasReviewed,
        });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 });
    }
}
