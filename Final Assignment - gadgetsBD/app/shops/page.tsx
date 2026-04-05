import Navbar from "@/components/Navbar";
import Link from "next/link";
import connectDB from "@/lib/db";
import { Shop } from "@/models/Shop";

async function getShops() {
    try {
        await connectDB();
        const shops = await Shop.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(shops));
    } catch (error) {
        console.error('Error fetching shops:', error);
        return [];
    }
}

export default async function ShopsPage() {
    const shops = await getShops();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-amazon-background">
                <div className="max-w-[1500px] mx-auto px-4 py-6">
                    <h1 className="text-3xl font-normal mb-6">All Shops</h1>

                    {shops.length === 0 ? (
                        <div className="a-box p-12 text-center">
                            <h2 className="text-2xl font-normal mb-4">No shops available</h2>
                            <p className="text-gray-600">Check back later for new shops!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shops.map((shop: any) => (
                                <Link
                                    key={shop._id}
                                    href={`/shops/${shop._id}`}
                                    className="a-box p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="text-center mb-4">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                                            {shop.logo ? (
                                                <img
                                                    src={shop.logo}
                                                    alt={shop.shopName}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-4xl">🏪</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{shop.shopName}</h3>
                                        {shop.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {shop.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Products:</span>
                                            <span className="font-bold">{shop.totalProducts || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Rating:</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-amazon-secondary">★</span>
                                                <span className="font-bold">
                                                    {shop.rating?.toFixed(1) || "0.0"}
                                                </span>
                                                <span className="text-gray-600">
                                                    ({shop.totalReviews || 0})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Joined:</span>
                                            <span>
                                                {new Date(shop.joinedDate || shop.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <span className="block w-full text-center py-2 bg-amazon-yellow hover:bg-amazon-yellow-hover rounded-sm font-medium text-sm border border-amazon-orange">
                                            Visit Shop
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
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
