"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

interface RecentProduct {
    _id: string;
    title: string;
    price: number;
    image: string;
}

const STORAGE_KEY = "gadgets_bd_recently_viewed";
const MAX_ITEMS = 8;

export function recordView(product: { _id: string; title: string; price: number; images?: string[] }) {
    if (typeof window === "undefined") return;
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
        const filtered = stored.filter((p) => p._id !== product._id);
        filtered.unshift({
            _id: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch {
        // ignore
    }
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
    const [products, setProducts] = useState<RecentProduct[]>([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
            setProducts(excludeId ? stored.filter((p) => p._id !== excludeId) : stored);
        } catch {
            // ignore
        }
    }, [excludeId]);

    if (products.length === 0) return null;

    return (
        <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amazon-blue" />
                Your Recently Viewed Items
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {products.map((p) => (
                    <Link
                        key={p._id}
                        href={`/products/${p._id}`}
                        className="flex-none w-40 border border-gray-200 rounded p-3 hover:shadow-md transition bg-white"
                    >
                        <div className="bg-gray-50 h-32 flex items-center justify-center mb-2 rounded">
                            {p.image ? (
                                <img
                                    src={p.image}
                                    className="h-full object-contain"
                                    alt={p.title}
                                />
                            ) : (
                                <div className="text-4xl">📦</div>
                            )}
                        </div>
                        <p className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2 mb-1">
                            {p.title}
                        </p>
                        <p className="text-sm font-bold">৳{p.price?.toLocaleString()}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
