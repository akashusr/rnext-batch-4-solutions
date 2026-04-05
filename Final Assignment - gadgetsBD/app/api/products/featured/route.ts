import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import '@/models/Shop';

// GET /api/products/featured - Get products with highest purchase counts
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find({
            isPublished: true,
            purchaseCount: { $gt: 0 },
        })
            .populate('shopId', 'shopName')
            .sort({ purchaseCount: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured products' },
            { status: 500 }
        );
    }
}
