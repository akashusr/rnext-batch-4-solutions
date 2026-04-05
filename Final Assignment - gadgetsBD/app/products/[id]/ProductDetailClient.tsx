"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import ReviewsSection from "@/components/ReviewsSection";
import RecentlyViewed, { recordView } from "@/components/RecentlyViewed";
import Link from "next/link";
import { ShieldCheck, Truck, Package, CheckCircle, Star, Heart } from "lucide-react";
import StockBadge from "@/components/StockBadge";
import CompareButton from "@/components/CompareButton";
import { useToast } from "@/components/Toast";
import { useCart } from "@/components/CartContext";

interface ProductDetailClientProps {
    product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { data: session } = useSession();
    const toast = useToast();
    const router = useRouter();
    const { refreshCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shop">("description");
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [shopInfo, setShopInfo] = useState<any>(null);
    const [wishlisted, setWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Fetch related products
    useEffect(() => {
        if (product.category) {
            fetch(`/api/products?category=${encodeURIComponent(product.category)}&limit=6`)
                .then((res) => res.json())
                .then((data) => {
                    const filtered = (data.products || []).filter((p: any) => p._id !== product._id);
                    setRelatedProducts(filtered.slice(0, 6));
                })
                .catch(console.error);
        }
    }, [product.category, product._id]);

    // Record recently viewed
    useEffect(() => {
        recordView(product);
    }, [product._id]);

    // Fetch shop info
    useEffect(() => {
        if (product.shopId?._id) {
            fetch(`/api/shops/${product.shopId._id}`)
                .then((res) => res.json())
                .then((data) => setShopInfo(data))
                .catch(console.error);
        }
    }, [product.shopId]);

    // Check wishlist status
    useEffect(() => {
        if (session) {
            fetch("/api/wishlist")
                .then((res) => res.json())
                .then((items: any[]) => {
                    setWishlisted(items.some((item: any) => item.productId?._id === product._id));
                })
                .catch(console.error);
        }
    }, [session, product._id]);

    const toggleWishlist = async () => {
        if (!session) {
            router.push("/login");
            return;
        }
        setWishlistLoading(true);
        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id }),
            });
            if (res.ok) {
                const data = await res.json();
                setWishlisted(data.action === "added");
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id, quantity }),
            });

            if (res.ok) {
                toast.success("Added to cart!");
                await refreshCart();
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!session) {
            router.push("/login");
            return;
        }
        await handleAddToCart();
        router.push("/checkout");
    };

    const images = product.images && product.images.length > 0 ? product.images : [];

    const renderStars = (rating: number) => (
        <div className="flex text-amazon-secondary">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i <= Math.floor(rating) ? "fill-current" : ""}`}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-white">
                <div className="max-w-[1500px] mx-auto w-full p-4">
                    {/* Breadcrumb */}
                    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <Link href="/" className="hover:underline">Home</Link>
                        <span>›</span>
                        <Link href="/products" className="hover:underline">Products</Link>
                        {product.category && (
                            <>
                                <span>›</span>
                                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">
                                    {product.category}
                                </Link>
                            </>
                        )}
                        <span>›</span>
                        <span className="text-amazon-text font-bold">{product.title?.slice(0, 30)}...</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Image Gallery */}
                        <div className="lg:col-span-5 flex gap-4">
                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex flex-col gap-2">
                                    {images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`w-10 h-10 border rounded overflow-hidden hover:shadow-md cursor-pointer ${selectedImage === idx
                                                ? "border-amazon-secondary"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                className="w-full h-full object-cover"
                                                alt={`Thumbnail ${idx + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Main Image — hover-to-zoom */}
                            <div
                                className="flex-1 border border-gray-200 rounded p-4 bg-gray-50 overflow-hidden relative cursor-zoom-in group"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                                    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                                    if (img) {
                                        img.style.transformOrigin = `${x}% ${y}%`;
                                    }
                                }}
                            >
                                {images.length > 0 ? (
                                    <img
                                        src={images[selectedImage]}
                                        alt={product.title}
                                        className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[2.5]"
                                    />
                                ) : (
                                    <div className="aspect-square flex items-center justify-center">
                                        <div className="text-9xl">📦</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center: Product Info */}
                        <div className="lg:col-span-4">
                            <h1 className="text-2xl font-normal mb-2">{product.title}</h1>

                            {product.shopId?.shopName && (
                                <p className="text-sm text-gray-600 mb-3">
                                    Visit the{" "}
                                    <Link
                                        href={`/shops/${product.shopId._id || ""}`}
                                        className="text-amazon-blue hover:underline"
                                    >
                                        {product.shopId.shopName}
                                    </Link>
                                </p>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                                {renderStars(product.averageRating || 0)}
                                <span className="text-sm text-amazon-blue hover:underline cursor-pointer">
                                    {product.totalReviews || 0} ratings
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-sm">Price:</span>
                                    <span className="text-3xl text-amazon-orange">
                                        ৳{product.price?.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Inclusive of all taxes</p>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <h3 className="font-bold text-base mb-2">About this item</h3>
                                {product.features && product.features.length > 0 ? (
                                    <ul className="text-sm space-y-1 list-disc list-inside">
                                        {product.features.map((feature: string, idx: number) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-700">{product.description}</p>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                {product.category && (
                                    <p className="text-sm mb-2">
                                        <span className="font-bold">Category:</span> {product.category}
                                    </p>
                                )}
                                {product.brand && (
                                    <p className="text-sm mb-2">
                                        <span className="font-bold">Brand:</span>{" "}
                                        <span className="text-amazon-blue">{product.brand}</span>
                                    </p>
                                )}
                                <p className="text-sm">
                                    <span className="font-bold">Stock:</span>{" "}
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            {product.stock} units available
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Out of Stock</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Right: Buy Box */}
                        <div className="lg:col-span-3">
                            <div className="border border-gray-200 rounded p-4 sticky top-4">
                                <div className="text-3xl text-amazon-orange mb-2">
                                    ৳{product.price?.toLocaleString()}
                                </div>
                                <p className="text-sm mb-3">
                                    <span className="font-bold">FREE delivery</span>{" "}
                                    <strong>Tomorrow</strong>
                                </p>

                                {product.stock > 0 ? (
                                    <>
                                        <p className="text-green-600 font-bold text-sm mb-2">In Stock</p>
                                        <StockBadge stock={product.stock} />

                                        <div className="mb-4">
                                            <label className="text-sm font-bold block mb-2">Quantity:</label>
                                            <select
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                className="border border-gray-300 rounded px-3 py-1 text-sm w-20"
                                            >
                                                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            disabled={loading}
                                            className="w-full bg-amazon-yellow hover:bg-amazon-yellow-hover py-2 rounded-md shadow-sm mb-2 text-sm font-medium border border-amazon-secondary disabled:opacity-50 cursor-pointer"
                                        >
                                            {loading ? "Adding..." : "Add to Cart"}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={loading}
                                            className="w-full bg-amazon-secondary hover:bg-amazon-secondary-hover py-2 rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 cursor-pointer"
                                        >
                                            Buy Now
                                        </button>

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={toggleWishlist}
                                            disabled={wishlistLoading}
                                            className={`w-full py-2 rounded-md text-sm font-medium mt-2 border flex items-center justify-center gap-2 cursor-pointer transition-colors ${wishlisted
                                                ? "bg-red-50 border-red-300 text-red-600"
                                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                                            {wishlisted ? "In Wishlist" : "Add to Wishlist"}
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-red-700 font-bold">Currently Unavailable</p>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                                    <p className="mb-1 flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 inline" /> Secure transaction
                                    </p>
                                    <p className="mb-1 flex items-center gap-1">
                                        <Truck className="w-4 h-4 inline" /> Ships from Gadgets BD
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <Package className="w-4 h-4 inline" /> Sold by{" "}
                                        {product.shopId?.shopName || "Gadgets BD"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-12">
                        <div className="border-b border-gray-300 mb-6">
                            <div className="flex gap-8">
                                {(["description", "reviews", "shop"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-2 px-1 text-sm font-medium cursor-pointer transition-colors ${activeTab === tab
                                            ? "border-b-2 border-amazon-orange text-amazon-orange"
                                            : "text-gray-600 hover:text-amazon-orange"
                                            }`}
                                    >
                                        {tab === "description"
                                            ? "Description"
                                            : tab === "reviews"
                                                ? "Reviews"
                                                : "Shop Info"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description Tab */}
                        {activeTab === "description" && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                                <div className="prose max-w-none text-sm">
                                    <p className="mb-4">{product.description}</p>
                                    {product.features && product.features.length > 0 && (
                                        <>
                                            <h3 className="font-bold mt-6 mb-2">Key Features:</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {product.features.map((f: string, i: number) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === "reviews" && (
                            <ReviewsSection
                                productId={product._id}
                                averageRating={product.averageRating || 0}
                                totalReviews={product.totalReviews || 0}
                                productTitle={product.title}
                                productImage={product.images?.[0]}
                            />
                        )}

                        {/* Shop Info Tab */}
                        {activeTab === "shop" && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Shop Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold mb-2">
                                            {shopInfo?.shopName || product.shopId?.shopName || "Unknown Shop"}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {shopInfo?.description || "No description available."}
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            {shopInfo?.rating !== undefined && (
                                                <p>
                                                    <span className="font-bold">Rating:</span>{" "}
                                                    {shopInfo.rating}/5 ({shopInfo.totalReviews || 0} reviews)
                                                </p>
                                            )}
                                            {shopInfo?.totalProducts !== undefined && (
                                                <p>
                                                    <span className="font-bold">Products:</span>{" "}
                                                    {shopInfo.totalProducts} items
                                                </p>
                                            )}
                                            {shopInfo?.joinedDate && (
                                                <p>
                                                    <span className="font-bold">Joined:</span>{" "}
                                                    {new Date(shopInfo.joinedDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                    })}
                                                </p>
                                            )}
                                            {shopInfo?.responseTime && (
                                                <p>
                                                    <span className="font-bold">Response Time:</span>{" "}
                                                    {shopInfo.responseTime}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">Policies</h3>
                                        <div className="space-y-2 text-sm">
                                            <p className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                {shopInfo?.policies?.returnPolicy || "14-day return policy"}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                {shopInfo?.policies?.warranty || "1-year official warranty"}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                {shopInfo?.policies?.shipping || "Free shipping on orders over ৳50,000"}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Secure payment options
                                            </p>
                                        </div>
                                        {product.shopId?._id && (
                                            <Link
                                                href={`/shops/${product.shopId._id}`}
                                                className="inline-block mt-4 text-amazon-blue hover:underline text-sm"
                                            >
                                                Visit Shop Page →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12 border-t border-gray-200 pt-8">
                            <h2 className="text-xl font-bold mb-6">Related Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {relatedProducts.map((rp: any) => (
                                    <Link
                                        key={rp._id}
                                        href={`/products/${rp._id}`}
                                        className="border border-gray-200 rounded p-3 hover:shadow-md transition"
                                    >
                                        <div className="bg-gray-50 h-32 flex items-center justify-center mb-2">
                                            {rp.images?.[0] ? (
                                                <img
                                                    src={rp.images[0]}
                                                    className="h-full object-cover"
                                                    alt={rp.title}
                                                />
                                            ) : (
                                                <div className="text-4xl">📦</div>
                                            )}
                                        </div>
                                        <p className="text-sm text-amazon-blue hover:text-amazon-orange line-clamp-2 mb-1">
                                            {rp.title}
                                        </p>
                                        <p className="text-sm font-bold">
                                            ৳{rp.price?.toLocaleString()}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recently Viewed */}
                    <RecentlyViewed excludeId={product._id} />
                </div>
            </main>

            <footer className="bg-amazon text-white py-8 mt-auto">
                <div className="max-w-[1500px] mx-auto px-4 text-center">
                    <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
