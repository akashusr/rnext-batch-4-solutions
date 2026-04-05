"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Truck } from "lucide-react";

interface CartItem {
    productId: {
        _id: string;
        title: string;
        price: number;
        images: string[];
        stock: number;
    };
    quantity: number;
    price: number;
}

interface Cart {
    items: CartItem[];
}

export default function CartPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { refreshCart } = useCart();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            fetchCart();
        }
    }, [status]);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCart(data);
                // Select all items by default
                if (data.items) {
                    setSelectedIds(data.items.map((item: CartItem) => item.productId._id));
                }
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: newQuantity }),
            });

            if (res.ok) {
                const data = await res.json();
                setCart(data);
                refreshCart();
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const res = await fetch(`/api/cart?productId=${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const data = await res.json();
                setCart(data);
                refreshCart();
                // Remove from selected
                setSelectedIds((prev) => prev.filter((id) => id !== productId));
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Toggle selection of a single item
    const toggleSelect = (productId: string) => {
        setSelectedIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    // Toggle select all / deselect all
    const toggleSelectAll = () => {
        if (!cart) return;
        if (selectedIds.length === cart.items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cart.items.map((item) => item.productId._id));
        }
    };

    // Subtotal only for selected items
    const calculateSubtotal = () => {
        if (!cart) return 0;
        return cart.items
            .filter((item) => selectedIds.includes(item.productId._id))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const selectedItemCount = cart
        ? cart.items
            .filter((item) => selectedIds.includes(item.productId._id))
            .reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Proceed to checkout with selected items
    const handleProceedToCheckout = () => {
        if (selectedIds.length === 0) return;
        // Store selected product IDs in sessionStorage
        sessionStorage.setItem("checkoutItems", JSON.stringify(selectedIds));
        router.push("/checkout");
    };

    if (loading) {
        return (
            <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading cart...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-[1500px] mx-auto w-full p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Cart Items */}
                    <div className="flex-1">
                        {/* Cart Header */}
                        <div className="bg-white p-4 mb-4 border-b border-gray-300">
                            <h1 className="text-2xl font-normal mb-2">Shopping Cart</h1>
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/products"
                                    className="text-amazon-blue hover:underline text-sm"
                                >
                                    Continue shopping
                                </Link>
                                {cart && cart.items.length > 0 && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-sm text-amazon-blue hover:underline"
                                    >
                                        {selectedIds.length === cart.items.length
                                            ? "Deselect all items"
                                            : "Select all items"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="bg-white">
                            {!cart || cart.items.length === 0 ? (
                                <div className="p-12 text-center">
                                    <h2 className="text-2xl font-normal mb-4">
                                        Your cart is empty
                                    </h2>
                                    <Link
                                        href="/products"
                                        className="inline-block py-2 px-6 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {cart.items.map((item) => {
                                        const isSelected = selectedIds.includes(
                                            item.productId._id
                                        );
                                        return (
                                            <div
                                                key={item.productId._id}
                                                className={`p-4 border-b border-gray-300 flex gap-4 hover:bg-gray-50 ${!isSelected ? "opacity-60" : ""
                                                    }`}
                                            >
                                                {/* Checkbox */}
                                                <div className="flex items-start pt-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelect(item.productId._id)
                                                        }
                                                        className="w-4 h-4 accent-[#007185] cursor-pointer"
                                                    />
                                                </div>

                                                {/* Product Image */}
                                                <Link
                                                    href={`/products/${item.productId._id}`}
                                                    className="w-32 h-32 flex-shrink-0"
                                                >
                                                    {item.productId.images?.[0] ? (
                                                        <img
                                                            src={item.productId.images[0]}
                                                            className="w-full h-full object-cover rounded border border-gray-200"
                                                            alt={item.productId.title}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-4xl">
                                                            📦
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Product Details */}
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-base mb-1">
                                                        <Link
                                                            href={`/products/${item.productId._id}`}
                                                            className="text-amazon-blue hover:text-amazon-orange hover:underline"
                                                        >
                                                            {item.productId.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-green-700 font-medium">
                                                        {item.productId.stock > 0
                                                            ? "In Stock"
                                                            : "Out of Stock"}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Eligible for FREE Shipping
                                                    </p>

                                                    <div className="flex items-center gap-4 mt-3">
                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-600">
                                                                Qty:
                                                            </label>
                                                            <select
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateQuantity(
                                                                        item.productId._id,
                                                                        parseInt(e.target.value)
                                                                    )
                                                                }
                                                                className="border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-50 outline-none focus:ring-1 focus:ring-amazon-blue"
                                                            >
                                                                {Array.from(
                                                                    {
                                                                        length: Math.min(
                                                                            item.productId.stock,
                                                                            10
                                                                        ),
                                                                    },
                                                                    (_, i) => i + 1
                                                                ).map((num) => (
                                                                    <option key={num} value={num}>
                                                                        {num}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <span className="text-gray-300">|</span>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() =>
                                                                removeItem(item.productId._id)
                                                            }
                                                            className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
                                                        >
                                                            Delete
                                                        </button>

                                                        <span className="text-gray-300">|</span>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-amazon-orange">
                                                        ৳
                                                        {(
                                                            item.price * item.quantity
                                                        ).toLocaleString()}
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-gray-500">
                                                            ৳{item.price.toLocaleString()} each
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Subtotal at bottom of items */}
                                    <div className="p-4 text-right">
                                        <p className="text-lg">
                                            Subtotal ({selectedItemCount} items):{" "}
                                            <span className="font-bold text-amazon-orange">
                                                ৳{calculateSubtotal().toLocaleString()}
                                            </span>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    {cart && cart.items.length > 0 && (
                        <div className="lg:w-80">
                            <div className="bg-white p-4 border border-gray-300 rounded">
                                {/* Free Shipping Notice */}
                                <div className="mb-4">
                                    <p className="text-sm mb-2">
                                        <CheckCircle className="w-4 h-4 inline text-green-600 mr-1" />
                                        <span className="text-green-700 font-medium">
                                            Your order qualifies for FREE Shipping!
                                        </span>
                                    </p>
                                </div>

                                {/* Subtotal (selected items only) */}
                                <div className="mb-4">
                                    <p className="text-lg mb-1">
                                        Subtotal ({selectedItemCount} items):{" "}
                                        <span className="font-bold text-amazon-orange">
                                            ৳{calculateSubtotal().toLocaleString()}
                                        </span>
                                    </p>
                                    <div className="flex items-start gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            id="gift"
                                            className="mt-0.5"
                                        />
                                        <label htmlFor="gift" className="text-gray-700">
                                            This order contains a gift
                                        </label>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleProceedToCheckout}
                                    disabled={selectedIds.length === 0}
                                    className="w-full py-2 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout ({selectedItemCount})
                                </button>

                                {selectedIds.length === 0 && (
                                    <p className="text-xs text-red-600 text-center mb-2">
                                        Please select at least one item to proceed
                                    </p>
                                )}

                                {/* Security Info */}
                                <div className="text-xs text-gray-600 mt-4">
                                    <p className="mb-2">
                                        <ShieldCheck className="w-3 h-3 inline mr-1" />
                                        Secure transaction
                                    </p>
                                    <p>
                                        <Truck className="w-3 h-3 inline mr-1" />
                                        Ships from Gadgets BD
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-amazon-light text-white mt-12">
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
                                <Link href="/shop-owner/products/add" className="hover:underline">
                                    Become a Vendor
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Payment Products</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <a href="#" className="hover:underline">
                                    Gadgets BD Card
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
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-600 text-center py-8">
                    <p className="text-xs text-gray-400">
                        &copy; 2026 Gadgets BD - Premium Tech Marketplace. All rights
                        reserved by LWS.
                    </p>
                </div>
            </footer>
        </div>
    );
}
