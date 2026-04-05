"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, LogOut, Menu, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();

    const categories = ["All", "Laptops & Computers", "Smartphones & Tablets", "Audio & Headphones", "Gaming Accessories", "Cameras & Photography", "Wearables & Smartwatches", "Accessories"];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        router.push(`/products?${params.toString()}`);
    };

    const isShopOwner = session?.user?.userType === "shopOwner";

    // Role-based navigation links
    const navLinks = session
        ? isShopOwner
            ? [
                { href: "/", label: "Home" },
                { href: "/shop-owner/products/add", label: "Add Product" },
                { href: "/shop-owner/products/manage", label: "Manage Products" },
                // { href: "/shop-owner/profile", label: "Shop Profile" },
            ]
            : [
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/shops", label: "Shops" },
                { href: "/orders", label: "My Orders" },
            ]
        : [];

    return (
        <nav className="bg-amazon text-white sticky top-0 z-50">
            {/* Top Nav */}
            <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1"
                >
                    <span className="text-2xl font-bold tracking-tighter whitespace-nowrap">
                        gadgets<span className="italic text-amazon-secondary">BD</span>
                    </span>
                </Link>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex flex-1 h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary"
                >
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 cursor-pointer hover:bg-gray-200"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Gadgets, Laptops, Phones..."
                        className="flex-1 px-3 text-black outline-none bg-white border-0"
                    />
                    <button
                        type="submit"
                        className="bg-amazon-secondary hover:bg-[#fa8900] px-4 flex items-center justify-center"
                    >
                        <Search className="text-black w-5 h-5" />
                    </button>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-4 ml-auto md:ml-0">
                    {/* Language */}
                    <div className="hidden md:flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer">
                        <div className="font-bold text-sm">EN</div>
                    </div>

                    {/* Account */}
                    {session ? (
                        <Link
                            href="/account"
                            className="hidden md:flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
                        >
                            {/* User Image */}
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-400"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-amazon-secondary flex items-center justify-center text-sm font-bold text-black">
                                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div>
                                <div className="text-xs leading-none text-gray-300">
                                    Hello, {session.user.name?.split(" ")[0]}
                                </div>
                                <div className="font-bold text-sm">Account &amp; Lists</div>
                            </div>
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
                        >
                            <div className="text-xs leading-none text-gray-300">
                                Hello, Sign in
                            </div>
                            <div className="font-bold text-sm">Account &amp; Lists</div>
                        </Link>
                    )}

                    {/* Wishlist (hidden for shop owners) */}
                    {!isShopOwner && (
                        <Link
                            href="/wishlist"
                            className="flex items-center hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer"
                            title="Wishlist"
                        >
                            <Heart className="w-6 h-6" />
                        </Link>
                    )}

                    {/* Cart (hidden for shop owners) */}
                    {!isShopOwner && (
                        <Link
                            href="/cart"
                            className="flex items-end hover:outline hover:outline-1 hover:outline-white rounded-sm p-1 cursor-pointer relative"
                        >
                            <ShoppingCart className="w-8 h-8" />
                            <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#ffa41c] text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
                                {cartCount}
                            </span>
                            <span className="font-bold text-sm hidden md:block">Cart</span>
                        </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Bottom Nav — Desktop role-based links */}
            {navLinks.length > 0 && (
                <div className="hidden md:block bg-amazon-light">
                    <div className="max-w-[1500px] mx-auto flex items-center gap-1 px-2 py-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-white hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 py-1"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Logout */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="text-sm text-white hover:outline hover:outline-1 hover:outline-white rounded-sm px-2 py-1 flex items-center gap-1 ml-auto"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-amazon-light border-t border-gray-600">
                    {/* Mobile Search */}
                    <form
                        onSubmit={(e) => {
                            handleSearch(e);
                            setMobileMenuOpen(false);
                        }}
                        className="flex h-10 m-2 rounded-md overflow-hidden"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 px-3 text-black outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-amazon-secondary px-4 flex items-center justify-center"
                        >
                            <Search className="text-black w-5 h-5" />
                        </button>
                    </form>

                    {/* Mobile user info */}
                    {session && (
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-600">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-400"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-amazon-secondary flex items-center justify-center text-lg font-bold text-black">
                                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <div>
                                <div className="text-sm font-bold">{session.user.name}</div>
                                <div className="text-xs text-gray-400">{session.user.email}</div>
                            </div>
                        </div>
                    )}

                    {/* Mobile nav links */}
                    <div className="py-2">
                        {session ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-white hover:bg-[#485769]"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        signOut({ callbackUrl: "/login" });
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#485769] flex items-center gap-2 border-t border-gray-600 mt-1"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2.5 text-sm text-amazon-secondary font-bold hover:bg-[#485769]"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
