"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { OrderRowSkeleton } from "@/components/Skeleton";
import {
    ChevronRight,
    CheckCircle,
    Truck,
    Clock,
    Package,
    XCircle,
    Download,
    Star,
    ShoppingCart,
    X,
    RefreshCw,
    Camera,
} from "lucide-react";

interface ReviewModalState {
    isOpen: boolean;
    productId: string;
    productTitle: string;
    productImage: string;
    rating: number;
    hoverRating: number;
    title: string;
    comment: string;
    submitting: boolean;
    error: string;
    success: boolean;
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reorderingId, setReorderingId] = useState<string | null>(null);

    const [reviewModal, setReviewModal] = useState<ReviewModalState>({
        isOpen: false,
        productId: "",
        productTitle: "",
        productImage: "",
        rating: 0,
        hoverRating: 0,
        title: "",
        comment: "",
        submitting: false,
        error: "",
        success: false,
    });

    const [reviewImages, setReviewImages] = useState<File[]>([]);
    const [reviewImagePreviews, setReviewImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    const handleDownloadInvoice = async (orderId: string, orderNumber: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/invoice`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `invoice-${orderNumber}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    // ─── Re-order: add all items from an order to cart ───
    const handleReorder = async (order: any) => {
        setReorderingId(order._id);
        try {
            for (const item of order.items) {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: item.productId,
                        quantity: item.quantity,
                    }),
                });
            }
            router.push("/cart");
        } catch (error) {
            console.error("Error re-ordering:", error);
            toast.error("Failed to add items to cart. Please try again.");
        } finally {
            setReorderingId(null);
        }
    };

    // ─── Review modal helpers ───
    const openReviewModal = (productId: string, productTitle: string, productImage: string) => {
        setReviewModal({
            isOpen: true,
            productId,
            productTitle,
            productImage,
            rating: 0,
            hoverRating: 0,
            title: "",
            comment: "",
            submitting: false,
            error: "",
            success: false,
        });
        setReviewImages([]);
        setReviewImagePreviews([]);
    };

    const closeReviewModal = () => {
        setReviewModal((prev) => ({ ...prev, isOpen: false }));
        setReviewImages([]);
        setReviewImagePreviews([]);
    };

    const getRatingLabel = (rating: number) => {
        const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
        return labels[rating] || "";
    };

    const submitReview = async () => {
        if (reviewModal.rating === 0) {
            setReviewModal((prev) => ({ ...prev, error: "Please select a rating." }));
            return;
        }
        if (!reviewModal.comment.trim()) {
            setReviewModal((prev) => ({ ...prev, error: "Please write a review." }));
            return;
        }
        setReviewModal((prev) => ({ ...prev, submitting: true, error: "" }));
        try {
            // Upload images first if any
            let uploadedImageUrls: string[] = [];
            if (reviewImages.length > 0) {
                const formData = new FormData();
                reviewImages.forEach((file) => formData.append("files", file));
                try {
                    const uploadRes = await fetch("/api/upload/review", {
                        method: "POST",
                        body: formData,
                    });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        uploadedImageUrls = uploadData.images.map((img: any) => img.url);
                    } else {
                        const errData = await uploadRes.json().catch(() => ({}));
                        console.error("Image upload failed:", errData);
                        setReviewModal((prev) => ({
                            ...prev,
                            submitting: false,
                            error: errData.error || "Failed to upload images. Please try again.",
                        }));
                        return;
                    }
                } catch (uploadErr) {
                    console.error("Image upload error:", uploadErr);
                    setReviewModal((prev) => ({
                        ...prev,
                        submitting: false,
                        error: "Failed to upload images. Please try again.",
                    }));
                    return;
                }
            }

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: reviewModal.productId,
                    rating: reviewModal.rating,
                    title: reviewModal.title,
                    comment: reviewModal.comment,
                    images: uploadedImageUrls,
                }),
            });
            if (res.ok) {
                setReviewModal((prev) => ({ ...prev, submitting: false, success: true }));
            } else {
                const data = await res.json();
                setReviewModal((prev) => ({
                    ...prev,
                    submitting: false,
                    error: data.error || "Failed to submit review",
                }));
            }
        } catch {
            setReviewModal((prev) => ({
                ...prev,
                submitting: false,
                error: "An error occurred. Please try again.",
            }));
        }
    };

    const getStatusBadge = (orderStatus: string) => {
        switch (orderStatus) {
            case "delivered":
                return {
                    icon: <CheckCircle className="w-3 h-3 inline mr-1" />,
                    text: "Delivered",
                    className: "bg-green-100 text-green-700",
                };
            case "shipped":
                return {
                    icon: <Truck className="w-3 h-3 inline mr-1" />,
                    text: "Shipped",
                    className: "bg-blue-100 text-blue-700",
                };
            case "confirmed":
                return {
                    icon: <Package className="w-3 h-3 inline mr-1" />,
                    text: "Confirmed",
                    className: "bg-purple-100 text-purple-700",
                };
            case "cancelled":
                return {
                    icon: <XCircle className="w-3 h-3 inline mr-1" />,
                    text: "Cancelled",
                    className: "bg-red-100 text-red-700",
                };
            default:
                return {
                    icon: <Clock className="w-3 h-3 inline mr-1" />,
                    text: "Pending",
                    className: "bg-yellow-100 text-yellow-700",
                };
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
                    <div className="h-8 w-48 animate-skeleton rounded mb-6" />
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <OrderRowSkeleton key={i} />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-[1000px] mx-auto w-full p-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <Link href="/" className="text-amazon-blue hover:underline">
                        Your Account
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-amazon-orange">Your Orders</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-3xl font-normal">
                        {session?.user.userType === "shopOwner"
                            ? "Shop Orders"
                            : "Your Orders"}
                    </h1>
                </div>

                {/* Order count */}
                <div className="text-sm mb-6 flex items-center gap-1">
                    <span className="font-bold">
                        {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </span>
                    <span>placed</span>
                </div>

                {orders.length === 0 ? (
                    <div className="border border-gray-300 rounded-lg p-12 text-center">
                        <h2 className="text-2xl font-normal mb-4">No orders yet</h2>
                        <Link
                            href="/products"
                            className="inline-block py-2 px-6 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="border border-gray-300 rounded-lg overflow-hidden"
                            >
                                {/* Order Header — Gray bar */}
                                <div className="bg-gray-100 p-4 flex flex-wrap justify-between items-center text-xs text-gray-600 border-b border-gray-300">
                                    <div className="flex gap-10">
                                        <div>
                                            <div className="uppercase tracking-tighter">
                                                Order Placed
                                            </div>
                                            <div className="font-normal text-sm text-gray-900 mt-1">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="uppercase tracking-tighter">Total</div>
                                            <div className="font-normal text-sm text-gray-900 mt-1">
                                                ৳{order.totalAmount?.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="uppercase tracking-tighter">
                                                Ship to
                                            </div>
                                            <div className="font-normal text-sm text-amazon-blue mt-1 hover:underline cursor-pointer">
                                                {order.deliveryAddress?.name || "Customer"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="uppercase tracking-tighter mb-1">
                                            Order # {order.orderNumber}
                                        </div>
                                        <Link
                                            href={`/checkout/success?orderId=${order._id}`}
                                            className="text-amazon-blue hover:underline"
                                        >
                                            View order details
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Body — Items */}
                                <div className="p-6 space-y-6">
                                    {order.items.map((item: any, index: number) => {
                                        const badge = getStatusBadge(order.status);
                                        return (
                                            <div
                                                key={index}
                                                className={`flex gap-4 ${index > 0
                                                    ? "pt-6 border-t border-gray-200"
                                                    : ""
                                                    }`}
                                            >
                                                {/* Product Image */}
                                                <div className="w-32 h-32 shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            className="w-full h-full object-cover border border-gray-200 rounded"
                                                            alt={item.title}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-3xl">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/products/${item.productId || "#"}`}
                                                        className="text-amazon-blue hover:underline font-bold text-sm"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        ৳
                                                        {(
                                                            item.price * item.quantity
                                                        ).toLocaleString()}
                                                    </p>

                                                    {/* Status Badge */}
                                                    <div className="mt-2">
                                                        <span
                                                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${badge.className}`}
                                                        >
                                                            {badge.icon}
                                                            {badge.text}
                                                        </span>
                                                    </div>

                                                    {/* Order Status Timeline */}
                                                    {order.status !== "cancelled" && index === 0 && (
                                                        <div className="mt-3 flex items-center gap-0 w-full max-w-sm">
                                                            {["pending", "confirmed", "shipped", "delivered"].map((step, si) => {
                                                                const steps = ["pending", "confirmed", "shipped", "delivered"];
                                                                const currentIdx = steps.indexOf(order.status);
                                                                const done = si <= currentIdx;
                                                                const isLast = si === steps.length - 1;
                                                                return (
                                                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                                                        <div className="flex flex-col items-center">
                                                                            <div
                                                                                className={`w-3 h-3 rounded-full border-2 ${done
                                                                                    ? "bg-green-500 border-green-500"
                                                                                    : "bg-white border-gray-300"
                                                                                    }`}
                                                                            />
                                                                            <span className={`text-[10px] mt-1 capitalize ${done ? "text-green-700 font-bold" : "text-gray-400"}`}>
                                                                                {step}
                                                                            </span>
                                                                        </div>
                                                                        {!isLast && (
                                                                            <div
                                                                                className={`flex-1 h-0.5 mx-1 ${si < currentIdx ? "bg-green-500" : "bg-gray-200"}`}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {/* Download Invoice — always visible */}
                                                        <button
                                                            onClick={() =>
                                                                handleDownloadInvoice(
                                                                    order._id,
                                                                    order.orderNumber
                                                                )
                                                            }
                                                            className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex items-center gap-1"
                                                        >
                                                            <Download className="w-3 h-3" />
                                                            Download Invoice
                                                        </button>

                                                        {/* ── Customer buttons ── */}
                                                        {session?.user.userType !== "shopOwner" && (
                                                            <>
                                                                {/* Write a Review — only for delivered */}
                                                                {order.status === "delivered" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            openReviewModal(
                                                                                item.productId,
                                                                                item.title,
                                                                                item.image || ""
                                                                            )
                                                                        }
                                                                        className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex items-center gap-1"
                                                                    >
                                                                        <Star className="w-3 h-3" />
                                                                        Write a Review
                                                                    </button>
                                                                )}

                                                                {/* Buy it again — for delivered orders */}
                                                                {order.status === "delivered" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleReorder(order)
                                                                        }
                                                                        disabled={
                                                                            reorderingId ===
                                                                            order._id
                                                                        }
                                                                        className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50"
                                                                    >
                                                                        {reorderingId ===
                                                                            order._id ? (
                                                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                                                        ) : (
                                                                            <ShoppingCart className="w-3 h-3" />
                                                                        )}
                                                                        Buy it again
                                                                    </button>
                                                                )}

                                                                {/* Cancel Order — pending/confirmed/shipped */}
                                                                {(order.status === "pending" ||
                                                                    order.status === "confirmed" ||
                                                                    order.status ===
                                                                    "shipped") && (
                                                                        <button
                                                                            onClick={() =>
                                                                                updateOrderStatus(
                                                                                    order._id,
                                                                                    "cancelled"
                                                                                )
                                                                            }
                                                                            className="px-4 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100 flex items-center gap-1"
                                                                        >
                                                                            <XCircle className="w-3 h-3" />
                                                                            Cancel Order
                                                                        </button>
                                                                    )}
                                                            </>
                                                        )}

                                                        {/* ── Shop owner buttons ── */}
                                                        {session?.user.userType ===
                                                            "shopOwner" && (
                                                                <>
                                                                    {order.status === "pending" && (
                                                                        <button
                                                                            onClick={() =>
                                                                                updateOrderStatus(
                                                                                    order._id,
                                                                                    "confirmed"
                                                                                )
                                                                            }
                                                                            className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                                                        >
                                                                            Confirm Order
                                                                        </button>
                                                                    )}
                                                                    {order.status === "confirmed" && (
                                                                        <button
                                                                            onClick={() =>
                                                                                updateOrderStatus(
                                                                                    order._id,
                                                                                    "shipped"
                                                                                )
                                                                            }
                                                                            className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-xs hover:bg-purple-700"
                                                                        >
                                                                            Mark as Shipped
                                                                        </button>
                                                                    )}
                                                                    {order.status === "shipped" && (
                                                                        <button
                                                                            onClick={() =>
                                                                                updateOrderStatus(
                                                                                    order._id,
                                                                                    "delivered"
                                                                                )
                                                                            }
                                                                            className="px-4 py-1.5 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                                                                        >
                                                                            Mark as Delivered
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ═══════════════ Review Modal ═══════════════ */}
            {reviewModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
                        {reviewModal.success ? (
                            /* Success State */
                            <div className="p-8 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-green-700 mb-2">
                                    Review Submitted!
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    Thank you for reviewing{" "}
                                    <strong>{reviewModal.productTitle}</strong>.
                                </p>
                                <button
                                    onClick={closeReviewModal}
                                    className="px-8 py-2 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md font-bold cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            /* Review Form — matching ReviewModal.html */
                            <div>
                                {/* Header */}
                                <div className="flex justify-between items-center px-6 pt-6">
                                    <h2 className="text-3xl font-normal">Create Review</h2>
                                    <button
                                        onClick={closeReviewModal}
                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Product info strip */}
                                <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-6">
                                    {reviewModal.productImage ? (
                                        <img
                                            src={reviewModal.productImage}
                                            className="w-16 h-16 object-cover border border-gray-200 rounded"
                                            alt={reviewModal.productTitle}
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                    )}
                                    <h3 className="font-bold text-sm">{reviewModal.productTitle}</h3>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="space-y-10 pt-6">
                                        {/* 1. Overall Rating */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold">Overall rating</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const activeRating = reviewModal.hoverRating || reviewModal.rating;
                                                        return (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() =>
                                                                    setReviewModal((prev) => ({
                                                                        ...prev,
                                                                        rating: star,
                                                                    }))
                                                                }
                                                                onMouseEnter={() =>
                                                                    setReviewModal((prev) => ({
                                                                        ...prev,
                                                                        hoverRating: star,
                                                                    }))
                                                                }
                                                                onMouseLeave={() =>
                                                                    setReviewModal((prev) => ({
                                                                        ...prev,
                                                                        hoverRating: 0,
                                                                    }))
                                                                }
                                                                className="transition-transform hover:scale-110 cursor-pointer"
                                                            >
                                                                <Star
                                                                    className={`w-8 h-8 fill-current ${star <= activeRating
                                                                        ? "text-amazon-yellow"
                                                                        : "text-gray-300"
                                                                        }`}
                                                                />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {(reviewModal.hoverRating || reviewModal.rating) > 0 && (
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        {getRatingLabel(reviewModal.hoverRating || reviewModal.rating)}
                                                    </span>
                                                )}
                                            </div>
                                        </section>

                                        <hr className="border-gray-200" />

                                        {/* 2. Add a photo or video */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold">Add a photo or video</h3>
                                            <p className="text-sm">
                                                Shoppers find images and videos more helpful than text alone.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                {reviewImagePreviews.map((src, idx) => (
                                                    <div key={idx} className="relative w-24 h-24 group">
                                                        <img
                                                            src={src}
                                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                            alt={`Preview ${idx + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setReviewImages((prev) => prev.filter((_, i) => i !== idx));
                                                                setReviewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {reviewImages.length < 5 && (
                                                    <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amazon-blue transition-colors gap-2">
                                                        <Camera className="w-8 h-8 text-gray-400" />
                                                        <span className="text-xs text-gray-500">Add media</span>
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            multiple
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const files = Array.from(e.target.files || []);
                                                                const remaining = 5 - reviewImages.length;
                                                                const newFiles = files.slice(0, remaining);
                                                                setReviewImages((prev) => [...prev, ...newFiles]);
                                                                newFiles.forEach((file) => {
                                                                    const reader = new FileReader();
                                                                    reader.onload = (ev) => {
                                                                        setReviewImagePreviews((prev) => [...prev, ev.target?.result as string]);
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                });
                                                                e.target.value = "";
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </section>

                                        <hr className="border-gray-200" />

                                        {/* 3. Add a headline */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold">Add a headline</h3>
                                            <input
                                                type="text"
                                                value={reviewModal.title}
                                                onChange={(e) =>
                                                    setReviewModal((prev) => ({
                                                        ...prev,
                                                        title: e.target.value,
                                                    }))
                                                }
                                                placeholder="What's most important to know?"
                                                className="w-full border border-gray-300 rounded p-2 outline-none focus:ring-1 focus:ring-amazon-blue"
                                            />
                                        </section>

                                        <hr className="border-gray-200" />

                                        {/* 4. Add a written review */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold">Add a written review</h3>
                                            <textarea
                                                rows={6}
                                                value={reviewModal.comment}
                                                onChange={(e) =>
                                                    setReviewModal((prev) => ({
                                                        ...prev,
                                                        comment: e.target.value,
                                                    }))
                                                }
                                                placeholder="What did you like or dislike? What did you use this product for?"
                                                className="w-full border border-gray-300 rounded p-4 outline-none focus:ring-1 focus:ring-amazon-blue"
                                            />
                                        </section>

                                        {/* Error */}
                                        {reviewModal.error && (
                                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                                                {reviewModal.error}
                                            </p>
                                        )}

                                        {/* Submit */}
                                        <div className="border-t border-gray-200 pt-8 flex justify-end">
                                            <button
                                                onClick={submitReview}
                                                disabled={reviewModal.submitting}
                                                className="bg-amazon-yellow hover:bg-amazon-yellow-hover px-8 py-2 rounded-md shadow-sm border border-amazon-secondary font-bold disabled:opacity-50 cursor-pointer"
                                            >
                                                {reviewModal.submitting ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-amazon-light text-white mt-8">
                <div className="max-w-[1000px] mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div>
                        <h3 className="font-bold mb-4">Get to Know Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href="/about" className="hover:underline">
                                    About Gadgets BD
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <Link href="/shops" className="hover:underline">
                                    Our Top Brands
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Make Money with Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link href="/register" className="hover:underline">
                                    Sell on Gadgets BD
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Supply to Gadgets BD
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Become an Affiliate
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Payment Products</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="hover:underline">
                                    Gadgets BD Business Card
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Shop with Points
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Reload Your Balance
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Let Us Help You</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="hover:underline">
                                    Your Account
                                </a>
                            </li>
                            <li>
                                <Link href="/orders" className="hover:underline">
                                    Your Orders
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Shipping Rates &amp; Policies
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Returns &amp; Replacements
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Help
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

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
