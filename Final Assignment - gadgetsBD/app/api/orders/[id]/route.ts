import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderStatusEmail } from '@/lib/nodemailer';

// GET /api/orders/[id] - Get order details
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check authorization
        if (
            session.user.userType === 'customer' &&
            order.customerId.toString() !== session.user.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

// PATCH /api/orders/[id] - Update order status (shop owner or customer cancel)
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await req.json();

        await connectDB();

        const order = await Order.findById(params.id);

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Customer can only cancel their own orders
        if (session.user.userType === 'customer') {
            if (order.customerId.toString() !== session.user.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            if (status !== 'cancelled') {
                return NextResponse.json({ error: 'Customers can only cancel orders' }, { status: 400 });
            }
            if (!['pending', 'confirmed', 'shipped'].includes(order.status)) {
                return NextResponse.json({ error: 'Order cannot be cancelled in its current state' }, { status: 400 });
            }
        }

        // Shop owner can update status for their products
        if (session.user.userType === 'shopOwner') {
            const hasProducts = order.items.some(
                (item: any) => item.shopId.toString() === session.user.shopId
            );
            if (!hasProducts) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        order.status = status;
        await order.save();

        // Send status update email (non-blocking)
        const customer = await User.findById(order.customerId).select('email name');
        if (customer?.email) {
            sendOrderStatusEmail(customer.email, {
                orderNumber: order.orderNumber,
                customerName: customer.name || 'Customer',
                newStatus: status,
                totalAmount: order.totalAmount,
            }).catch((err: any) => console.error('Failed to send status email:', err));
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
