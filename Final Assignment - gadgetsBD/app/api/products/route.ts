import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products - List products with filters
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const brand = searchParams.get('brand');
        const shopId = searchParams.get('shopId');
        const sort = searchParams.get('sort') || 'createdAt';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build filter
        const filter: any = {};

        // If shopId is provided (shop owner viewing their products), show all
        // Otherwise only show published products (public browsing)
        if (shopId) {
            filter.shopId = shopId;
        } else {
            filter.isPublished = true;
        }

        if (query) {
            filter.$text = { $search: query };
        }

        if (category && category !== 'All') {
            filter.category = category;
        }

        if (brand) {
            filter.brand = brand;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Build sort
        let sortOption: any = {};
        switch (sort) {
            case 'price-asc':
                sortOption = { price: 1 };
                break;
            case 'price-desc':
                sortOption = { price: -1 };
                break;
            case 'rating':
                sortOption = { averageRating: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('shopId', 'shopName')
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products - Create product (shop owners only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!session.user.shopId) {
            return NextResponse.json(
                { error: 'Shop not found' },
                { status: 400 }
            );
        }

        const body = await req.json();

        await connectDB();

        const product = await Product.create({
            ...body,
            shopId: session.user.shopId,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
