import Navbar from "@/components/Navbar";
import SortSelect from "@/components/SortSelect";
import CompareButton from "@/components/CompareButton";
import StockBadge from "@/components/StockBadge";
import ProductFilters from "@/components/ProductFilters";
import Link from "next/link";
import { Star, GitCompareArrows } from "lucide-react";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import "@/models/Shop";

async function getProducts(searchParams: any) {
    try {
        await connectDB();

        const filter: any = { isPublished: true };

        if (searchParams.q) {
            filter.$text = { $search: searchParams.q };
        }
        if (searchParams.category && searchParams.category !== 'All') {
            filter.category = searchParams.category;
        }
        if (searchParams.brand) {
            filter.brand = searchParams.brand;
        }

        let sortOption: any = {};
        switch (searchParams.sort) {
            case 'price-asc': sortOption = { price: 1 }; break;
            case 'price-desc': sortOption = { price: -1 }; break;
            case 'rating': sortOption = { averageRating: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        const page = 1;
        const limit = 20;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('shopId', 'shopName')
                .sort(sortOption)
                .skip(0)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return {
            products: JSON.parse(JSON.stringify(products)),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], pagination: { total: 0 } };
    }
}

async function getCategories() {
    try {
        await connectDB();
        const categories = await Product.distinct('category', { isPublished: true });
        return categories.filter(Boolean).sort().map((name: string) => ({ name }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

function StarRating({
    rating,
    count,
}: {
    rating: number;
    count: number;
}) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="flex text-amazon-secondary">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-current" : ""
                            }`}
                    />
                ))}
            </div>
            <span className="text-sm text-amazon-blue">{count?.toLocaleString()}</span>
        </div>
    );
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; brand?: string; sort?: string };
}) {
    const [data, categories] = await Promise.all([
        getProducts(searchParams),
        getCategories(),
    ]);
    const { products, pagination } = data;

    const categoryList = [
        "Laptops & Computers",
        "Smartphones & Tablets",
        "Audio & Headphones",
        "Gaming Accessories",
        "Cameras & Photography",
        "Wearables & Smartwatches",
        "Accessories",
    ];

    const brandList = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "Razer"];

    const priceRanges = [
        "Under ৳10,000",
        "৳10,000 - ৳25,000",
        "৳25,000 - ৳50,000",
        "৳50,000 - ৳1,00,000",
        "Over ৳1,00,000",
    ];

    const displayCategories =
        categories && categories.length > 0
            ? categories.map((c: any) => c.name)
            : categoryList;

    return (
        <div className="bg-white text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 max-w-[1500px] mx-auto w-full p-4">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-4 shadow-sm border-b pb-2">
                    <div className="text-sm">
                        <span>
                            1-{products.length} of over{" "}
                            {pagination?.total || products.length} results
                            {searchParams.q && " for "}
                        </span>
                        {searchParams.q && (
                            <span className="font-bold text-amazon-orange">
                                &quot;{searchParams.q}&quot;
                            </span>
                        )}
                        {searchParams.category && !searchParams.q && (
                            <>
                                {" for "}
                                <span className="font-bold text-amazon-orange">
                                    &quot;{searchParams.category}&quot;
                                </span>
                            </>
                        )}
                        {!searchParams.q && !searchParams.category && (
                            <>
                                {" for "}
                                <span className="font-bold text-amazon-orange">
                                    &quot;Electronics&quot;
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/compare"
                            className="flex items-center gap-1 text-sm text-amazon-blue hover:underline"
                        >
                            <GitCompareArrows className="w-4 h-4" />
                            Compare
                        </Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm">Sort by:</span>
                        <SortSelect defaultValue={searchParams.sort || "createdAt"} />
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-64 hidden lg:block flex-shrink-0 border-r pr-4">
                        <ProductFilters
                            categories={displayCategories}
                            brands={brandList}
                        />

                        {/* Customer Reviews */}
                        <div className="border-t pt-4 mb-6">
                            <h3 className="font-bold text-base mb-3">
                                Customer Reviews
                            </h3>
                            <div className="space-y-2">
                                {[4, 3].map((stars) => (
                                    <label
                                        key={stars}
                                        className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                        />
                                        <div className="flex items-center gap-1">
                                            <div className="flex text-amazon-secondary text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < stars
                                                            ? "fill-current"
                                                            : ""
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm">& Up</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="border-t pt-4 mb-6">
                            <h3 className="font-bold text-base mb-3">Price</h3>
                            <div className="space-y-2">
                                {priceRanges.map((range) => (
                                    <label
                                        key={range}
                                        className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                        />
                                        <span className="text-sm">{range}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="border-t pt-4 mb-6">
                            <h3 className="font-bold text-base mb-3">Availability</h3>
                            <div className="space-y-2">
                                {["In Stock", "Pre-Order"].map((opt) => (
                                    <label
                                        key={opt}
                                        className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                        />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="border-t pt-4 mb-6">
                            <h3 className="font-bold text-base mb-3">Condition</h3>
                            <div className="space-y-2">
                                {["New", "Renewed"].map((opt) => (
                                    <label
                                        key={opt}
                                        className="flex items-center gap-2 cursor-pointer hover:text-amazon-orange"
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-amazon-secondary focus:ring-amazon-secondary"
                                            defaultChecked={opt === "New"}
                                        />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <div className="space-y-4">
                                {products.map((product: any) => (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="flex gap-4 p-4 border rounded hover:shadow-md transition"
                                    >
                                        {/* Product Image */}
                                        <div className="w-48 h-48 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="h-full object-cover mix-blend-multiply"
                                                />
                                            ) : (
                                                <div className="text-6xl">📦</div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg text-amazon-blue hover:text-amazon-orange font-normal mb-1">
                                                {product.title}
                                            </h3>

                                            <StarRating
                                                rating={product.averageRating || 0}
                                                count={product.totalReviews || 0}
                                            />

                                            <div className="mb-2">
                                                <span className="text-2xl font-normal">
                                                    ৳{product.price?.toLocaleString()}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-2">
                                                FREE delivery{" "}
                                                <strong>Tomorrow</strong>
                                            </p>

                                            {/* Stock Alert Badge */}
                                            {product.stock !== undefined && (
                                                <div className="mb-2">
                                                    <StockBadge stock={product.stock} />
                                                </div>
                                            )}

                                            {product.description && (
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* Compare Button */}
                                            <div className="mt-2">
                                                <CompareButton productId={product._id} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center border rounded">
                                <p className="text-lg text-gray-600 mb-2">
                                    No products found
                                </p>
                                <Link
                                    href="/products"
                                    className="text-amazon-blue hover:underline"
                                >
                                    View all products
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-amazon-light text-white mt-8">
                <div className="max-w-[1000px] mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div>
                        <h3 className="font-bold mb-4">Get to Know Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="hover:underline">
                                    About Gadgets BD
                                </a>
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
                                <Link
                                    href="/shop-owner/products/add"
                                    className="hover:underline"
                                >
                                    Supply to Gadgets BD
                                </Link>
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
                                    Shipping Rates & Policies
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Returns & Replacements
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
                            gadgets
                            <span className="italic text-gray-400">BD</span>
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">
                        &copy; 2026 Gadgets BD - Premium Tech Marketplace. All
                        rights reserved by LWS.
                    </p>
                </div>
            </footer>
        </div>
    );
}


