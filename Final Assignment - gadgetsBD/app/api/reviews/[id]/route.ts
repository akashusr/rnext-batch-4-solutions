import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { Review } from '@/models/Review';
import { Product } from '@/models/Product';
import { authOptions } from '@/lib/auth';

// PUT /api/reviews/:id — Edit own review
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const review = await Review.findById(params.id);
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        if (review.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { rating, title, comment } = await req.json();

        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        if (rating) review.rating = rating;
        if (title !== undefined) review.title = title;
        if (comment) review.comment = comment;

        await review.save();

        // Recalculate product averageRating
        const stats = await Review.aggregate([
            { $match: { productId: review.productId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(review.productId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                totalReviews: stats[0].count,
            });
        }

        const populated = await Review.findById(review._id).populate('userId', 'name email').lean();
        return NextResponse.json(populated);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE /api/reviews/:id — Delete own review
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connectDB();
        const review = await Review.findById(params.id);
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        if (review.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const productId = review.productId;
        await Review.findByIdAndDelete(params.id);

        // Recalculate product averageRating
        const stats = await Review.aggregate([
            { $match: { productId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                totalReviews: stats[0].count,
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                averageRating: 0,
                totalReviews: 0,
            });
        }

        return NextResponse.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
