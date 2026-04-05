import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { authOptions } from '@/lib/auth';

// GET /api/reviews?productId=X&page=1&limit=5
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const currentUserId = searchParams.get('userId');

        if (!productId) {
            return NextResponse.json({ error: 'productId is required' }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        // If we have a current user, fetch their review separately to show first
        let userReview = null;
        if (currentUserId && page === 1) {
            userReview = await Review.findOne({ productId, userId: currentUserId })
                .populate('userId', 'name email')
                .lean();
        }

        // Fetch other reviews (excluding user's own if on page 1)
        const query: any = { productId };
        if (currentUserId && page === 1 && userReview) {
            query.userId = { $ne: currentUserId };
        }

        const totalOtherReviews = await Review.countDocuments(query);
        const adjustedSkip = (currentUserId && page === 1 && userReview) ? 0 : skip - (userReview ? 1 : 0);

        const reviews = await Review.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(Math.max(0, page === 1 ? 0 : skip - (userReview ? 1 : 0)))
            .limit(page === 1 && userReview ? limit - 1 : limit)
            .lean();

        const totalReviews = await Review.countDocuments({ productId });

        // Combine: user review first, then others
        const allReviews = page === 1 && userReview ? [userReview, ...reviews] : reviews;

        return NextResponse.json({
            reviews: allReviews,
            pagination: {
                page,
                limit,
                total: totalReviews,
                hasMore: skip + limit < totalReviews,
            },
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST /api/reviews — Create a review
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { productId, rating, title, comment, images } = body;
        console.log('[Review POST] Received body:', JSON.stringify({ productId, rating, title, comment, images }));

        if (!productId || !rating || !comment) {
            return NextResponse.json({ error: 'productId, rating, and comment are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Check if user has purchased this product
        const order = await Order.findOne({
            customerId: session.user.id,
            'items.productId': productId,
            status: { $in: ['pending', 'confirmed', 'delivered', 'completed', 'shipped'] },
        });

        if (!order) {
            return NextResponse.json({ error: 'You must purchase this product before reviewing' }, { status: 403 });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ productId, userId: session.user.id });
        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
        }

        // Create the review
        const reviewData = {
            productId,
            userId: session.user.id,
            orderId: order._id,
            rating,
            title: title || '',
            comment,
            images: images || [],
        };
        console.log('[Review POST] Creating review with data:', JSON.stringify(reviewData));
        const review = await Review.create(reviewData);
        console.log('[Review POST] Created review:', JSON.stringify(review));

        // Recalculate product averageRating and totalReviews
        const stats = await Review.aggregate([
            { $match: { productId: review.productId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                totalReviews: stats[0].count,
            });
        }

        const populatedReview = await Review.findById(review._id).populate('userId', 'name email').lean();
        return NextResponse.json(populatedReview, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
        }
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
