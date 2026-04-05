import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Truck, ShieldCheck, Headphones, CreditCard } from "lucide-react";
import FeaturedProducts from "@/components/FeaturedProducts";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import "@/models/Shop";

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({
      isPublished: true,
      purchaseCount: { $gt: 0 },
    })
      .populate("shopId", "shopName")
      .sort({ purchaseCount: -1 })
      .limit(10)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full">
        {/* Hero Banner */}
        <div
          className="relative w-full h-64 md:h-80 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2574&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-amazon-background to-transparent"></div>
        </div>

        {/* Categories & Content Grid */}
        <div className="relative z-10 -mt-32 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Laptops & PCs */}
            <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20">
              <h2 className="text-xl font-bold">Laptops &amp; PCs</h2>
              <div className="grid grid-cols-2 gap-2 h-full">
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"
                  className="w-full h-full object-cover mb-1"
                  alt="Laptop"
                />
                <img
                  src="https://images.unsplash.com/photo-1675868374786-3edd36dddf04?w=300"
                  className="w-full h-full object-cover mb-1"
                  alt="Keyboard"
                />
                <img
                  src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300"
                  className="w-full h-full object-cover mb-1"
                  alt="Desktop"
                />
                <img
                  src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300"
                  className="w-full h-full object-cover mb-1"
                  alt="Notebook"
                />
              </div>
              <Link
                href="/products?category=Laptops %26 Computers"
                className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
              >
                See all laptops
              </Link>
            </div>

            {/* Card 2 - Smartphones */}
            <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20">
              <h2 className="text-xl font-bold">Smartphones</h2>
              <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
                  className="w-full h-full object-cover"
                  alt="Smartphone"
                />
              </div>
              <Link
                href="/products?category=Smartphones %26 Tablets"
                className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
              >
                Shop smartphones
              </Link>
            </div>

            {/* Card 3 - Accessories */}
            <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20">
              <h2 className="text-xl font-bold">Accessories</h2>
              <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                  className="w-full h-full object-cover"
                  alt="Accessories"
                />
              </div>
              <Link
                href="/products?category=Accessories"
                className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
              >
                Shop accessories
              </Link>
            </div>

            {/* Card 4 - Sign in promo */}
            <div className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20 justify-between">
              <div className="shrink-0">
                <h2 className="text-xl font-bold">
                  Sign in for the best tech deals
                </h2>
                <button className="bg-amazon-yellow w-full py-2 rounded-md shadow-sm mt-4 text-sm hover:bg-amazon-yellow-hover">
                  Sign in securely
                </button>
              </div>
              <div className="mt-4 grow h-full">
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
                  className="w-full h-full object-cover"
                  alt="Tech deals"
                />
              </div>
            </div>
          </div>

          {/* Featured Product Carousel (Dynamic - Purchase Based) */}
          {featuredProducts.length > 0 && (
            <FeaturedProducts products={featuredProducts} />
          )}
        </div>

        {/* Why Shop With Us Section */}
        <div className="bg-white py-12 mt-8">
          <div className="max-w-[1500px] mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Why Shop with Gadgets BD?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-amazon" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">
                  Get your gadgets delivered within 24-48 hours across
                  Bangladesh
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-amazon" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Authentic</h3>
                <p className="text-sm text-gray-600">
                  All products are genuine with official warranty and
                  certifications
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-amazon" />
                </div>
                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Our customer service team is always ready to help you
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-amazon-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-amazon" />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  Multiple payment options with 100% secure transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories Section */}
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/products?category=Laptops %26 Computers"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200"
                  className="h-full object-cover"
                  alt="Laptops"
                />
              </div>
              <h3 className="font-medium text-sm">Laptops</h3>
            </Link>
            <Link
              href="/products?category=Smartphones %26 Tablets"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"
                  className="h-full object-cover"
                  alt="Smartphones"
                />
              </div>
              <h3 className="font-medium text-sm">Smartphones</h3>
            </Link>
            <Link
              href="/products?category=Audio %26 Headphones"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
                  className="h-full object-cover"
                  alt="Headphones"
                />
              </div>
              <h3 className="font-medium text-sm">Audio</h3>
            </Link>
            <Link
              href="/products?category=Gaming Accessories"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200"
                  className="h-full object-cover"
                  alt="Gaming"
                />
              </div>
              <h3 className="font-medium text-sm">Gaming</h3>
            </Link>
            <Link
              href="/products?category=Cameras %26 Photography"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200"
                  className="h-full object-cover"
                  alt="Cameras"
                />
              </div>
              <h3 className="font-medium text-sm">Cameras</h3>
            </Link>
            <Link
              href="/products?category=Wearables %26 Smartwatches"
              className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
            >
              <div className="h-32 flex items-center justify-center mb-2">
                <img
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200"
                  className="h-full object-cover"
                  alt="Wearables"
                />
              </div>
              <h3 className="font-medium text-sm">Wearables</h3>
            </Link>
          </div>
        </div>

        {/* Shop by Brand Section */}
        <div className="bg-white py-8 mt-8">
          <div className="max-w-[1500px] mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Shop by Brand</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {["Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "Razer", "Logitech"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className="text-2xl font-bold text-gray-400">
                      {brand}
                    </span>
                  </div>
                )
              )}
            </div>
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
                <Link href="#" className="hover:underline">
                  About Gadgets BD
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Careers
                </Link>
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
                <Link href="#" className="hover:underline">
                  Supply to Gadgets BD
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Become an Affiliate
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Payment Products</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:underline">
                  Gadgets BD Business Card
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shop with Points
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Reload Your Balance
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="#" className="hover:underline">
                  Your Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:underline">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shipping Rates &amp; Policies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Returns &amp; Replacements
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Manage Your Content and Devices
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Help
                </Link>
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
