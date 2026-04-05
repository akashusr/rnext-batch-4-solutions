import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderInvoiceEmail } from '@/lib/nodemailer';

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        let orders;
        if (session.user.userType === 'shopOwner') {
            // Get orders for shop owner's products
            orders = await Order.find({ 'items.shopId': session.user.shopId })
                .populate('customerId', 'name email')
                .sort({ createdAt: -1 });
        } else {
            // Get customer's orders
            orders = await Order.find({ customerId: session.user.id }).sort({
                createdAt: -1,
            });
        }

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create order
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.userType !== 'customer') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { deliveryAddress, paymentInfo, selectedItems } = await req.json();

        await connectDB();

        // Get cart
        const cart = await Cart.findOne({ userId: session.user.id }).populate({
            path: 'items.productId',
            select: 'title price images stock shopId',
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Filter to selected items only (if selectedItems provided)
        const itemsToOrder = selectedItems && selectedItems.length > 0
            ? cart.items.filter((item: any) => selectedItems.includes(item.productId._id.toString()))
            : cart.items;

        if (itemsToOrder.length === 0) {
            return NextResponse.json({ error: 'No selected items found in cart' }, { status: 400 });
        }

        // Check stock availability
        for (const item of itemsToOrder) {
            const product = item.productId as any;
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.title}` },
                    { status: 400 }
                );
            }
        }

        // Calculate totals
        const subtotal = itemsToOrder.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        const deliveryFee = 60; // Fixed delivery fee
        const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
        const totalAmount = subtotal + deliveryFee + serviceFee;

        // Prepare order items
        const orderItems = itemsToOrder.map((item: any) => ({
            productId: item.productId._id,
            shopId: item.productId.shopId,
            title: item.productId.title,
            price: item.price,
            quantity: item.quantity,
            image: item.productId.images[0] || '',
        }));

        // Create order
        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            customerId: session.user.id,
            items: orderItems,
            deliveryAddress,
            subtotal,
            deliveryFee,
            serviceFee,
            totalAmount,
            paymentInfo: {
                ...paymentInfo,
                cardNumber: paymentInfo.cardNumber.slice(-4), // Store only last 4 digits
            },
            status: 'pending',
        });

        // Reduce stock for each product
        for (const item of itemsToOrder) {
            await Product.findByIdAndUpdate((item.productId as any)._id, {
                $inc: { stock: -item.quantity, purchaseCount: item.quantity },
            });
        }

        // Remove ordered items from cart (keep unselected items)
        const orderedProductIds = itemsToOrder.map((item: any) => item.productId._id.toString());
        cart.items = cart.items.filter(
            (item: any) => !orderedProductIds.includes(item.productId._id.toString())
        );
        await cart.save();

        // Send confirmation email with PDF invoice (non-blocking)
        if (session.user.email) {
            sendOrderInvoiceEmail(
                session.user.email,
                session.user.name || 'Customer',
                order
            ).catch((err: any) => console.error('Failed to send invoice email:', err));
        }

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
