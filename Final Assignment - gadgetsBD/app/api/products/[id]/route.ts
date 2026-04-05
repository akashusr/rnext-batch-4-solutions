import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/products/[id] - Get single product
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const product = await Product.findById(params.id)
            .populate('shopId', 'shopName logo')
            .lean();

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Update product (owner only)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if user owns this product
        if (product.shopId.toString() !== session.user.shopId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        );

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Delete product (owner only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.userType !== 'shopOwner') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if user owns this product
        if (product.shopId.toString() !== session.user.shopId) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        await Product.findByIdAndDelete(params.id);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
