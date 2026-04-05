import Navbar from "@/components/Navbar";
import Link from "next/link";
import connectDB from "@/lib/db";
import { Shop } from "@/models/Shop";
import { Product } from "@/models/Product";

async function getShop(id: string) {
    try {
        await connectDB();
        const shop = await Shop.findById(id).lean();
        return shop ? JSON.parse(JSON.stringify(shop)) : null;
    } catch (error) {
        console.error('Error fetching shop:', error);
        return null;
    }
}

async function getShopProducts(shopId: string) {
    try {
        await connectDB();
        const products = await Product.find({ shopId })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error('Error fetching shop products:', error);
        return [];
    }
}

export default async function ShopDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const shop = await getShop(params.id);
    const products = await getShopProducts(params.id);

    if (!shop) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
                        <Link href="/shops" className="text-amazon-blue hover:underline">
                            Back to Shops
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-amazon-background">
                <div className="max-w-[1500px] mx-auto px-4 py-6">
                    {/* Shop Header */}
                    <div className="a-box p-8 mb-6">
                        <div className="flex items-start gap-6">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                {shop.logo ? (
                                    <img
                                        src={shop.logo}
                                        alt={shop.shopName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl">🏪</span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{shop.shopName}</h1>
                                {shop.description && (
                                    <p className="text-gray-700 mb-4">{shop.description}</p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Products</p>
                                        <p className="text-xl font-bold">{shop.totalProducts || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <span className="text-amazon-secondary text-xl">★</span>
                                            <span className="text-xl font-bold">
                                                {shop.rating?.toFixed(1) || "0.0"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Reviews</p>
                                        <p className="text-xl font-bold">{shop.totalReviews || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Joined</p>
                                        <p className="text-sm">
                                            {new Date(shop.joinedDate || shop.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shop Products */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Products from this Shop</h2>

                        {products.length === 0 ? (
                            <div className="a-box p-12 text-center">
                                <p className="text-gray-600">This shop hasn't listed any products yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {products.map((product: any) => (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="product-card p-4 block"
                                    >
                                        <div className="aspect-square bg-gray-100 mb-3 flex items-center justify-center">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-6xl">📦</div>
                                            )}
                                        </div>
                                        <h3 className="font-normal text-sm mb-1 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="flex text-amazon-secondary text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>
                                                        {i < Math.floor(product.averageRating) ? "★" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-600">
                                                ({product.totalReviews})
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold">
                                            ৳{product.price.toLocaleString()}
                                        </div>
                                        {product.stock > 0 ? (
                                            <p className="text-xs text-green-700 mt-1">In Stock</p>
                                        ) : (
                                            <p className="text-xs text-red-700 mt-1">Out of Stock</p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
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
