import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/shop-owner/analytics - Get shop analytics data
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.userType !== 'shopOwner' || !session.user.shopId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const shopId = new mongoose.Types.ObjectId(session.user.shopId);

        // Get all orders containing this shop's items
        const orders = await Order.find({ 'items.shopId': shopId }).lean();

        // Calculate shop-specific revenue and items from each order
        let totalRevenue = 0;
        let totalItemsSold = 0;
        const statusCounts: Record<string, number> = {
            pending: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };
        const monthlySales: Record<string, number> = {};
        const topProducts: Record<string, { title: string; quantity: number; revenue: number }> = {};

        for (const order of orders) {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

            for (const item of order.items) {
                if (item.shopId.toString() === session.user.shopId) {
                    const itemRevenue = item.price * item.quantity;
                    totalRevenue += itemRevenue;
                    totalItemsSold += item.quantity;

                    // Monthly breakdown
                    const month = new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                    });
                    monthlySales[month] = (monthlySales[month] || 0) + itemRevenue;

                    // Top products
                    const pid = item.productId.toString();
                    if (!topProducts[pid]) {
                        topProducts[pid] = { title: item.title, quantity: 0, revenue: 0 };
                    }
                    topProducts[pid].quantity += item.quantity;
                    topProducts[pid].revenue += itemRevenue;
                }
            }
        }

        // Get product count
        const productCount = await Product.countDocuments({ shopId: shopId });

        // Get low stock products
        const lowStockProducts = await Product.find({
            shopId: shopId,
            stock: { $lte: 5, $gt: 0 },
        })
            .select('title stock price')
            .sort({ stock: 1 })
            .limit(5)
            .lean();

        // Get out of stock count
        const outOfStockCount = await Product.countDocuments({
            shopId: shopId,
            stock: 0,
        });

        // Sort top products by revenue
        const sortedTopProducts = Object.values(topProducts)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return NextResponse.json({
            totalOrders: orders.length,
            totalRevenue,
            totalItemsSold,
            productCount,
            outOfStockCount,
            statusCounts,
            monthlySales,
            topProducts: sortedTopProducts,
            lowStockProducts,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
