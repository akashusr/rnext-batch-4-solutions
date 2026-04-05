import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';

// GET /api/products/categories - Get distinct product categories
export async function GET() {
    try {
        await connectDB();

        const categories = await Product.distinct('category', { isPublished: true });

        // Return as array of objects with name property (matching frontend expectation)
        const result = categories
            .filter(Boolean)
            .sort()
            .map((name: string) => ({ name }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
