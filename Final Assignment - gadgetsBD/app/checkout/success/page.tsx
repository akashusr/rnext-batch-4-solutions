"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Check, Download } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 flex items-center justify-center">
                        <p>Loading...</p>
                    </main>
                </div>
            }
        >
            <OrderSuccessContent />
        </Suspense>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            }
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}/invoice`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `invoice-${order?.orderNumber || orderId}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                        <Link href="/" className="text-amazon-blue hover:underline">
                            Go to Homepage
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";

    return (
        <div className="bg-white text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-[800px] mx-auto w-full p-8 py-12">
                {/* Success Header Card */}
                <div className="flex items-start gap-4 p-6 border border-gray-300 rounded shadow-sm">
                    {/* Check Icon */}
                    <div className="bg-white border border-green-600 rounded-full p-1 self-start mt-1">
                        <Check className="w-6 h-6 text-green-600 stroke-[3]" />
                    </div>

                    <div className="space-y-4 flex-1">
                        <h1 className="text-xl font-bold text-green-700">
                            Order placed, thank you!
                        </h1>
                        <p className="text-sm">
                            Confirmation will be sent to your email.
                        </p>

                        {/* Shipping & Order Info Cards */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
                                <span className="font-bold block mb-1">
                                    Shipping to{" "}
                                    {order.deliveryAddress?.name || "Customer"}
                                </span>
                                <p className="text-gray-600">
                                    {order.deliveryAddress?.address}
                                    <br />
                                    {order.deliveryAddress?.city}
                                    {order.deliveryAddress?.postalCode &&
                                        `, ${order.deliveryAddress.postalCode}`}
                                </p>
                            </div>
                            <div className="flex-1 text-sm bg-gray-50 p-4 border border-gray-200 rounded">
                                <span className="font-bold block mb-1">
                                    Order Number
                                </span>
                                <p className="text-gray-600 font-mono">
                                    #{order.orderNumber}
                                </p>
                                {orderDate && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Placed on {orderDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
                            <button
                                onClick={handleDownloadInvoice}
                                className="w-full sm:w-auto px-8 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-xs transition-colors text-center flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download Invoice
                            </button>
                            <Link
                                href="/orders"
                                className="w-full sm:w-auto px-8 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-xs transition-colors text-center"
                            >
                                View All Orders
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-8 py-2 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold shadow-xs transition-colors text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mt-12 space-y-6">
                    <h2 className="text-2xl font-normal border-b border-gray-200 pb-4">
                        Order Details
                    </h2>

                    {/* Product Items */}
                    {order.items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={`flex gap-4 items-start ${index > 0
                                ? "pt-4 border-t border-gray-100"
                                : ""
                                }`}
                        >
                            <div className="w-20 h-20 flex-shrink-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover border border-gray-200 rounded"
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-2xl">
                                        📦
                                    </div>
                                )}
                            </div>
                            <div>
                                <Link
                                    href={`/products/${item.productId || "#"}`}
                                    className="text-amazon-blue hover:underline font-bold text-sm"
                                >
                                    {item.title}
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">
                                    Quantity: {item.quantity}
                                </p>
                                <p className="text-xs text-amazon-orange font-bold mt-1">
                                    ৳{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Order Summary */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="max-w-sm ml-auto space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>৳{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span className={`${order.deliveryFee === 0 ? "text-green-600 font-bold" : ""}`}>
                                    {order.deliveryFee === 0
                                        ? "FREE"
                                        : `৳${order.deliveryFee?.toLocaleString()}`}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span>Service Fee:</span>
                                <span>৳{order.serviceFee?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-amazon-orange">
                                <span>Total:</span>
                                <span>
                                    ৳{order.totalAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-10 bg-gray-50 border-t border-gray-300">
                <div className="max-w-[1000px] mx-auto text-center text-[10px] text-gray-500 space-y-2">
                    <div className="flex justify-center gap-6 text-amazon-blue text-xs mb-2">
                        <a href="#" className="hover:underline">
                            Conditions of Use
                        </a>
                        <a href="#" className="hover:underline">
                            Privacy Notice
                        </a>
                        <a href="#" className="hover:underline">
                            Help
                        </a>
                    </div>
                    <p>
                        &copy; 2026 Gadgets BD - Premium Tech Marketplace. All
                        rights reserved by LWS.
                    </p>
                </div>
            </footer>
        </div>
    );
}
