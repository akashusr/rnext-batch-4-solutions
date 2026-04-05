"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

interface FeaturedProduct {
    _id: string;
    title: string;
    price: number;
    images: string[];
    shopId?: { shopName?: string };
    purchaseCount: number;
}

export default function FeaturedProducts({
    products,
}: {
    products: FeaturedProduct[];
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAddToCart = async (productId: string) => {
        if (!session) {
            router.push("/login");
            return;
        }

        setLoadingId(productId);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            });

            if (res.ok) {
                toast.success("Added to cart!");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add to cart");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="mt-8 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">Featured Products</h2>
                <Link
                    href="/products"
                    className="text-amazon-blue text-sm hover:underline hover:text-red-700"
                >
                    View All
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                {products.map((product) => (
                    <div key={product._id} className="flex-none w-48">
                        <Link href={`/products/${product._id}`}>
                            <div className="bg-gray-50 h-48 flex items-center justify-center mb-2 p-2">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        className="h-full object-cover mix-blend-multiply"
                                        alt={product.title}
                                    />
                                ) : (
                                    <div className="text-6xl">📦</div>
                                )}
                            </div>
                            <div className="text-sm hover:text-amazon-orange text-amazon-blue line-clamp-2">
                                {product.title}
                            </div>
                        </Link>
                        <div className="text-xs text-gray-500">
                            {product.shopId?.shopName || "Unknown Shop"}
                        </div>
                        <div className="mt-1">
                            <span className="text-xs align-top">৳</span>
                            <span className="text-xl font-bold">
                                {product.price?.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                            {product.purchaseCount > 0
                                ? `${product.purchaseCount} sold`
                                : "Get it by Tomorrow"}
                        </div>
                        <button
                            onClick={() => handleAddToCart(product._id)}
                            disabled={loadingId === product._id}
                            className="w-full bg-amazon-yellow hover:bg-amazon-yellow-hover text-sm py-1.5 rounded-md shadow-sm font-medium border border-amazon-secondary transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {loadingId === product._id
                                ? "Adding..."
                                : "Add to Cart"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
