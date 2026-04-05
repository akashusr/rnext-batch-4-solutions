"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
    ChevronRight,
    Trash2,
    Star,
    GitCompareArrows,
    ShoppingCart,
    Trophy,
    Zap,
    TrendingUp,
    Shield,
    DollarSign,
    ThumbsUp,
    Award,
} from "lucide-react";

const STORAGE_KEY = "gadgets_bd_compare";

interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
    brand?: string;
    stock: number;
    averageRating: number;
    totalReviews: number;
    features?: string[];
    specifications?: Record<string, any>;
    description?: string;
}

export default function ComparePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompareProducts();
    }, []);

    const fetchCompareProducts = async () => {
        try {
            const ids: string[] = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );
            if (ids.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            // Fetch each product
            const results = await Promise.all(
                ids.map(async (id) => {
                    const res = await fetch(`/api/products/${id}`);
                    if (res.ok) return res.json();
                    return null;
                })
            );
            setProducts(results.filter(Boolean));
        } catch (error) {
            console.error("Error fetching compare products:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = (productId: string) => {
        const ids: string[] = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
        const updated = ids.filter((id) => id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setProducts((prev) => prev.filter((p) => p._id !== productId));
    };

    const clearAll = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        setProducts([]);
    };

    if (loading) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading comparison...</p>
                </main>
            </div>
        );
    }

    // Collect all specification keys across products
    const allSpecKeys = new Set<string>();
    products.forEach((p) => {
        if (p.specifications) {
            Object.keys(p.specifications).forEach((k) => allSpecKeys.add(k));
        }
    });

    // Collect max features count
    const maxFeatures = Math.max(
        0,
        ...products.map((p) => p.features?.length || 0)
    );

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            <main className="max-w-[1200px] mx-auto w-full p-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <Link href="/products" className="text-amazon-blue hover:underline">
                        Products
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-amazon-orange">Compare Products</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <GitCompareArrows className="w-7 h-7 text-amazon-blue" />
                        <h1 className="text-3xl font-normal">Compare Products</h1>
                        <span className="text-sm text-gray-500 mt-2">
                            ({products.length} product{products.length !== 1 ? "s" : ""})
                        </span>
                    </div>
                    {products.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="bg-white border border-gray-300 rounded-lg p-12 text-center">
                        <GitCompareArrows className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-normal mb-2">
                            No products to compare
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Add products to compare by clicking the &quot;Compare&quot; button on any
                            product.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block py-2 px-6 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 bg-gray-50 border-b border-r border-gray-200 w-36 text-sm font-bold text-gray-600">
                                        Feature
                                    </th>
                                    {products.map((product) => (
                                        <th
                                            key={product._id}
                                            className="p-4 bg-gray-50 border-b border-r border-gray-200 last:border-r-0 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => removeProduct(product._id)}
                                                    className="self-end text-gray-400 hover:text-red-500"
                                                    title="Remove from comparison"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link href={`/products/${product._id}`}>
                                                    <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="text-4xl">📦</div>
                                                        )}
                                                    </div>
                                                </Link>
                                                <Link
                                                    href={`/products/${product._id}`}
                                                    className="text-sm text-amazon-blue hover:underline font-medium line-clamp-2"
                                                >
                                                    {product.title}
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Price */}
                                <tr>
                                    <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                        Price
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-lg font-bold"
                                        >
                                            ৳{p.price?.toLocaleString()}
                                        </td>
                                    ))}
                                </tr>

                                {/* Rating */}
                                <tr>
                                    <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                        Rating
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center"
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`w-4 h-4 ${s <= Math.round(p.averageRating)
                                                                ? "fill-amazon-secondary text-amazon-secondary"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    ({p.totalReviews})
                                                </span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr>
                                    <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                        Category
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-sm"
                                        >
                                            {p.category}
                                        </td>
                                    ))}
                                </tr>

                                {/* Brand */}
                                <tr>
                                    <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                        Brand
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-sm"
                                        >
                                            {p.brand || "—"}
                                        </td>
                                    ))}
                                </tr>

                                {/* Stock */}
                                <tr>
                                    <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                        Availability
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-sm"
                                        >
                                            {p.stock > 0 ? (
                                                <span className="text-green-600 font-medium">
                                                    In Stock ({p.stock})
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-medium">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>

                                {/* Specifications */}
                                {Array.from(allSpecKeys).map((key) => (
                                    <tr key={key}>
                                        <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50 capitalize">
                                            {key}
                                        </td>
                                        {products.map((p) => (
                                            <td
                                                key={p._id}
                                                className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-sm"
                                            >
                                                {p.specifications?.[key]?.toString() || "—"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {/* Features */}
                                {maxFeatures > 0 &&
                                    Array.from({ length: maxFeatures }).map((_, idx) => (
                                        <tr key={`feature-${idx}`}>
                                            <td className="p-3 border-b border-r border-gray-200 text-sm font-bold bg-gray-50">
                                                {idx === 0 ? "Features" : ""}
                                            </td>
                                            {products.map((p) => (
                                                <td
                                                    key={p._id}
                                                    className="p-3 border-b border-r border-gray-200 last:border-r-0 text-center text-sm"
                                                >
                                                    {p.features?.[idx] ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span className="text-green-500">✓</span>{" "}
                                                            {p.features[idx]}
                                                        </span>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                {/* Add to Cart row */}
                                <tr>
                                    <td className="p-4 border-r border-gray-200 bg-gray-50 text-sm font-bold">
                                        Action
                                    </td>
                                    {products.map((p) => (
                                        <td
                                            key={p._id}
                                            className="p-4 border-r border-gray-200 last:border-r-0 text-center"
                                        >
                                            <Link
                                                href={`/products/${p._id}`}
                                                className="inline-flex items-center gap-1 py-2 px-4 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-xs font-bold"
                                            >
                                                <ShoppingCart className="w-3 h-3" /> View Product
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Best Buy Recommendation */}
                {products.length >= 2 && (
                    <BestBuyAnalysis products={products} />
                )}

                {/* Link to add more */}
                {products.length > 0 && products.length < 3 && (
                    <div className="mt-4 text-center">
                        <Link
                            href="/products"
                            className="text-sm text-amazon-blue hover:underline"
                        >
                            + Add more products to compare (max 3)
                        </Link>
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

/* ───────── Best Buy Analysis Component ───────── */

function BestBuyAnalysis({ products }: { products: Product[] }) {
    // ── Scoring algorithm ──
    const scores = products.map((product) => {
        const maxPrice = Math.max(...products.map((p) => p.price || 0));
        const maxReviews = Math.max(...products.map((p) => p.totalReviews || 0));
        const maxFeatures = Math.max(...products.map((p) => p.features?.length || 0));
        const maxSpecs = Math.max(...products.map((p) => Object.keys(p.specifications || {}).length));
        const maxStock = Math.max(...products.map((p) => p.stock || 0));

        // Price score: lower is better (inverted)
        const priceScore = maxPrice > 0 ? (1 - (product.price || 0) / maxPrice) * 100 : 50;
        // Rating score: out of 5 → percentage
        const ratingScore = ((product.averageRating || 0) / 5) * 100;
        // Review count score
        const reviewScore = maxReviews > 0 ? ((product.totalReviews || 0) / maxReviews) * 100 : 0;
        // Features score
        const featuresScore = maxFeatures > 0 ? ((product.features?.length || 0) / maxFeatures) * 100 : 0;
        // Specs score
        const specsCount = Object.keys(product.specifications || {}).length;
        const specsScore = maxSpecs > 0 ? (specsCount / maxSpecs) * 100 : 0;
        // Stock score
        const stockScore = maxStock > 0 ? ((product.stock || 0) / maxStock) * 100 : 0;

        // Weighted total
        const total =
            priceScore * 0.30 +
            ratingScore * 0.25 +
            reviewScore * 0.10 +
            featuresScore * 0.15 +
            specsScore * 0.10 +
            stockScore * 0.10;

        return {
            product,
            total: Math.round(total),
            breakdown: { priceScore, ratingScore, reviewScore, featuresScore, specsScore, stockScore },
        };
    });

    // Sort by score descending
    const sorted = [...scores].sort((a, b) => b.total - a.total);
    const winner = sorted[0];

    // Category winners
    const cheapest = [...products].sort((a, b) => (a.price || 0) - (b.price || 0))[0];
    const highestRated = [...products].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))[0];
    const mostReviewed = [...products].sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))[0];
    const mostFeatures = [...products].sort((a, b) => (b.features?.length || 0) - (a.features?.length || 0))[0];
    const bestStock = [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0))[0];

    // Generate reasoning
    const reasons: string[] = [];
    const w = winner.product;
    if (w._id === cheapest._id) reasons.push("Offers the lowest price among compared products");
    if (w._id === highestRated._id && w.averageRating > 0) reasons.push(`Highest rated at ${w.averageRating.toFixed(1)} stars`);
    if (w._id === mostReviewed._id && w.totalReviews > 0) reasons.push(`Most reviewed with ${w.totalReviews} customer reviews`);
    if (w._id !== cheapest._id) {
        const savings = ((w.price - cheapest.price) / w.price * 100).toFixed(0);
        if (Number(savings) < 30) reasons.push("Strong balance between price and quality");
        else reasons.push("Premium choice with superior specs and ratings");
    }
    if (w._id === mostFeatures._id && (w.features?.length || 0) > 0) reasons.push("Comes with the most features");
    if (w._id === bestStock._id && w.stock > 0) reasons.push("Best availability — ships immediately");
    if (reasons.length === 0) reasons.push("Best overall score across price, quality, and features");

    const categories = [
        { label: "Best Price", icon: <DollarSign className="w-4 h-4" />, winner: cheapest, color: "text-green-600" },
        { label: "Highest Rated", icon: <Star className="w-4 h-4" />, winner: highestRated, color: "text-yellow-600" },
        { label: "Most Reviewed", icon: <ThumbsUp className="w-4 h-4" />, winner: mostReviewed, color: "text-blue-600" },
        { label: "Most Features", icon: <Zap className="w-4 h-4" />, winner: mostFeatures, color: "text-purple-600" },
        { label: "Best Availability", icon: <Shield className="w-4 h-4" />, winner: bestStock, color: "text-teal-600" },
    ];

    return (
        <div className="mt-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-amazon-orange" />
                <h2 className="text-2xl font-normal">Best Buy Analysis</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Winner Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 relative overflow-hidden">
                    {/* Trophy badge */}
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-yellow-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> BEST BUY
                    </div>

                    <div className="flex flex-col items-center text-center mt-4">
                        {/* Product image */}
                        <div className="w-28 h-28 mb-3 flex items-center justify-center">
                            {winner.product.images?.[0] ? (
                                <img
                                    src={winner.product.images[0]}
                                    alt={winner.product.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-5xl">🏆</div>
                            )}
                        </div>

                        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                            {winner.product.title}
                        </h3>
                        <p className="text-2xl font-bold text-amazon-orange mb-2">
                            ৳{winner.product.price?.toLocaleString()}
                        </p>

                        {/* Overall Score */}
                        <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white transition-all duration-1000"
                                style={{ width: `${winner.total}%` }}
                            >
                                {winner.total}/100
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Overall Score</p>

                        {/* Reasons */}
                        <div className="mt-4 text-left w-full space-y-1.5">
                            {reasons.slice(0, 3).map((reason, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                                    <span>{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Score Comparison + Category Winners */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Score Bars */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Overall Scores
                        </h3>
                        <div className="space-y-4">
                            {sorted.map((s, idx) => (
                                <div key={s.product._id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            {idx === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                                            <span className={`text-sm font-medium ${idx === 0 ? 'text-amber-700' : 'text-gray-700'}`}>
                                                {s.product.title}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-bold ${idx === 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                                            {s.total}/100
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${idx === 0
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                                : idx === 1
                                                    ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                                                    : 'bg-gradient-to-r from-gray-200 to-gray-300'
                                                }`}
                                            style={{ width: `${s.total}%` }}
                                        />
                                    </div>
                                    {/* Mini breakdown */}
                                    <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                                        <span>Price: {Math.round(s.breakdown.priceScore)}%</span>
                                        <span>Rating: {Math.round(s.breakdown.ratingScore)}%</span>
                                        <span>Features: {Math.round(s.breakdown.featuresScore)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Winners */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">
                            Category Winners
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {categories.map((cat) => (
                                <div
                                    key={cat.label}
                                    className="border border-gray-100 rounded-lg p-3 text-center bg-gray-50 hover:bg-white transition-colors"
                                >
                                    <div className={`flex justify-center mb-1 ${cat.color}`}>
                                        {cat.icon}
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 mb-1">{cat.label}</p>
                                    <p className="text-xs text-gray-800 font-medium line-clamp-2">
                                        {cat.winner.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scoring Methodology */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <details className="text-sm">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">
                        How is the score calculated?
                    </summary>
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs text-gray-600">
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">30%</p>
                            <p>Price</p>
                        </div>
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">25%</p>
                            <p>Rating</p>
                        </div>
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">15%</p>
                            <p>Features</p>
                        </div>
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">10%</p>
                            <p>Reviews</p>
                        </div>
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">10%</p>
                            <p>Specs</p>
                        </div>
                        <div className="bg-white rounded-md p-2 border border-gray-100 text-center">
                            <p className="font-bold text-gray-800">10%</p>
                            <p>Stock</p>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
