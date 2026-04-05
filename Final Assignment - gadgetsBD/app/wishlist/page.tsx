"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { WishlistCardSkeleton } from "@/components/Skeleton";
import {
    Heart,
    ShoppingCart,
    Trash2,
    Star,
    ChevronRight,
} from "lucide-react";

interface WishlistItem {
    _id: string;
    productId: {
        _id: string;
        title: string;
        price: number;
        images: string[];
        stock: number;
        averageRating: number;
        totalReviews: number;
        category: string;
        brand?: string;
    };
    createdAt: string;
}

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            fetchWishlist();
        }
    }, [status]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/wishlist");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setItems((prev) =>
                    prev.filter((item) => item.productId._id !== productId)
                );
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const addToCart = async (productId: string) => {
        setAddingToCart(productId);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) {
                // Remove from wishlist after adding to cart
                await removeFromWishlist(productId);
                toast.success("Added to cart!");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="max-w-[1200px] mx-auto w-full p-4 py-6">
                    <div className="h-6 w-48 animate-skeleton rounded mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <WishlistCardSkeleton key={i} />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            <main className="max-w-[1200px] mx-auto w-full p-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <Link href="/" className="text-amazon-blue hover:underline">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-amazon-orange">Your Wishlist</span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-7 h-7 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-normal">Your Wishlist</h1>
                    <span className="text-sm text-gray-500 mt-2">
                        ({items.length} item{items.length !== 1 ? "s" : ""})
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-normal mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Save items you love to your wishlist and revisit them anytime.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block py-2 px-6 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold"
                        >
                            Discover Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items.map((item) => {
                            const product = item.productId;
                            if (!product) return null;
                            const outOfStock = product.stock === 0;
                            return (
                                <div
                                    key={item._id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    {/* Product Image */}
                                    <Link href={`/products/${product._id}`}>
                                        <div className="relative h-52 bg-gray-50 flex items-center justify-center p-4">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-5xl">📦</div>
                                            )}
                                            {outOfStock && (
                                                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <Link
                                            href={`/products/${product._id}`}
                                            className="text-sm text-amazon-blue hover:underline font-medium line-clamp-2 mb-1"
                                        >
                                            {product.title}
                                        </Link>

                                        {/* Rating */}
                                        {product.totalReviews > 0 && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`w-3 h-3 ${s <= Math.round(product.averageRating)
                                                                ? "fill-amazon-secondary text-amazon-secondary"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    ({product.totalReviews})
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-lg font-bold mt-auto">
                                            ৳{product.price?.toLocaleString()}
                                        </p>

                                        {product.stock > 0 && product.stock <= 5 && (
                                            <p className="text-xs text-orange-600 font-medium mt-1">
                                                Only {product.stock} left!
                                            </p>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => addToCart(product._id)}
                                                disabled={outOfStock || addingToCart === product._id}
                                                className="flex-1 py-2 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ShoppingCart className="w-3 h-3" />
                                                {addingToCart === product._id
                                                    ? "Adding..."
                                                    : outOfStock
                                                        ? "Unavailable"
                                                        : "Add to Cart"}
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(product._id)}
                                                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
