"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
    BarChart3,
    Package,
    DollarSign,
    ShoppingBag,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    Archive,
} from "lucide-react";

interface Analytics {
    totalOrders: number;
    totalRevenue: number;
    totalItemsSold: number;
    productCount: number;
    outOfStockCount: number;
    statusCounts: Record<string, number>;
    monthlySales: Record<string, number>;
    topProducts: Array<{ title: string; quantity: number; revenue: number }>;
    lowStockProducts: Array<{ _id: string; title: string; stock: number; price: number }>;
}

export default function AnalyticsDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            if (session?.user?.userType !== "shopOwner") {
                router.push("/");
                return;
            }
            fetchAnalytics();
        }
    }, [status]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/shop-owner/analytics");
            if (res.ok) {
                setAnalytics(await res.json());
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading analytics...</p>
                </main>
            </div>
        );
    }

    const maxMonthlyRevenue = analytics
        ? Math.max(...Object.values(analytics.monthlySales), 1)
        : 1;

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            <main className="max-w-[1200px] mx-auto w-full p-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <Link
                        href="/shop-owner/products/manage"
                        className="text-amazon-blue hover:underline"
                    >
                        Shop Dashboard
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-amazon-orange">Analytics</span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-7 h-7 text-amazon-blue" />
                    <h1 className="text-3xl font-normal">Shop Analytics</h1>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                            <DollarSign className="w-4 h-4" /> TOTAL REVENUE
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            ৳{analytics?.totalRevenue?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                            <ShoppingBag className="w-4 h-4" /> TOTAL ORDERS
                        </div>
                        <p className="text-2xl font-bold">
                            {analytics?.totalOrders || 0}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                            <Package className="w-4 h-4" /> PRODUCTS
                        </div>
                        <p className="text-2xl font-bold">
                            {analytics?.productCount || 0}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
                            <TrendingUp className="w-4 h-4" /> ITEMS SOLD
                        </div>
                        <p className="text-2xl font-bold text-amazon-blue">
                            {analytics?.totalItemsSold || 0}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Sales Chart */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-amazon-blue" /> Monthly Revenue
                        </h2>
                        {analytics && Object.keys(analytics.monthlySales).length > 0 ? (
                            <div className="space-y-3">
                                {Object.entries(analytics.monthlySales).map(
                                    ([month, revenue]) => (
                                        <div key={month} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 w-20 text-right">
                                                {month}
                                            </span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-amazon-secondary to-amazon-orange h-full rounded-full flex items-center justify-end px-2"
                                                    style={{
                                                        width: `${Math.max(
                                                            (revenue / maxMonthlyRevenue) * 100,
                                                            15
                                                        )}%`,
                                                    }}
                                                >
                                                    <span className="text-xs font-bold text-black">
                                                        ৳{revenue.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8">
                                No sales data yet
                            </p>
                        )}
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4">Order Status Breakdown</h2>
                        <div className="space-y-3">
                            {analytics &&
                                Object.entries(analytics.statusCounts).map(([s, count]) => {
                                    const colors: Record<string, string> = {
                                        pending: "bg-yellow-400",
                                        confirmed: "bg-blue-500",
                                        shipped: "bg-purple-500",
                                        delivered: "bg-green-500",
                                        cancelled: "bg-red-500",
                                    };
                                    return (
                                        <div key={s} className="flex items-center gap-3">
                                            <span className="capitalize text-sm w-24">{s}</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                                <div
                                                    className={`${colors[s] || "bg-gray-400"} h-full rounded-full`}
                                                    style={{
                                                        width: `${analytics.totalOrders > 0
                                                            ? Math.max(
                                                                (count /
                                                                    analytics.totalOrders) *
                                                                100,
                                                                count > 0 ? 8 : 0
                                                            )
                                                            : 0
                                                            }%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" /> Top Selling
                            Products
                        </h2>
                        {analytics && analytics.topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {analytics.topProducts.map((p, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                                    >
                                        <span className="w-6 h-6 rounded-full bg-amazon-light text-white text-xs flex items-center justify-center font-bold">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {p.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {p.quantity} sold
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-green-600">
                                            ৳{p.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8">
                                No sales yet
                            </p>
                        )}
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" /> Stock
                            Alerts
                        </h2>

                        {analytics && analytics.outOfStockCount > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Archive className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-700 font-medium">
                                        {analytics.outOfStockCount} product
                                        {analytics.outOfStockCount !== 1 ? "s" : ""} out of
                                        stock
                                    </span>
                                </div>
                            </div>
                        )}

                        {analytics && analytics.lowStockProducts.length > 0 ? (
                            <div className="space-y-2">
                                {analytics.lowStockProducts.map((p) => (
                                    <div
                                        key={p._id}
                                        className="flex items-center justify-between p-2 rounded bg-orange-50 border border-orange-100"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">
                                                {p.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ৳{p.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-orange-600 ml-2">
                                            {p.stock} left
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">
                                All products are well-stocked!
                            </p>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-amazon-light text-white mt-8">
                <div className="border-t border-gray-600 text-center py-8">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <span className="text-2xl font-bold tracking-tighter">
                            gadgets<span className="italic text-gray-400">BD</span>
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">
                        &copy; 2026 Gadgets BD - Premium Tech Marketplace. All rights
                        reserved by LWS.
                    </p>
                </div>
            </footer>
        </div>
    );
}
