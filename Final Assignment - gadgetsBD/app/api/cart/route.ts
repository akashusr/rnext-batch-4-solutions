import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        let cart = await Cart.findOne({ userId: session.user.id }).populate({
            path: 'items.productId',
            select: 'title price images stock',
        });

        if (!cart) {
            cart = await Cart.create({ userId: session.user.id, items: [] });
        }

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity = 1 } = await req.json();

        await connectDB();

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }

        let cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            cart = await Cart.create({
                userId: session.user.id,
                items: [{ productId, quantity, price: product.price }],
            });
        } else {
            const existingItem = cart.items.find(
                (item: any) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, price: product.price });
            }

            await cart.save();
        }

        await cart.populate({
            path: 'items.productId',
            select: 'title price images stock',
        });

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await req.json();

        await connectDB();

        const cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        const item = cart.items.find((item: any) => item.productId.toString() === productId);

        if (!item) {
            return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: 'title price images stock',
        });

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

// DELETE /api/cart - Remove item from cart
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

        const cart = await Cart.findOne({ userId: session.user.id });

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
        await cart.save();

        await cart.populate({
            path: 'items.productId',
            select: 'title price images stock',
        });

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
    }
}
