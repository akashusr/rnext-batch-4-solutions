"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function ManageProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Filters
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterCategory, setFilterCategory] = useState("All Categories");
    const [filterBrand, setFilterBrand] = useState("All Brands");
    const [searchQuery, setSearchQuery] = useState("");

    // Edit modal
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        product: any | null;
        saving: boolean;
    }>({ isOpen: false, product: null, saving: false });

    useEffect(() => {
        if (status === "unauthenticated" || session?.user.userType !== "shopOwner") {
            router.push("/");
            return;
        }
        if (status === "authenticated") {
            fetchProducts();
        }
    }, [status, session]);

    const fetchProducts = async () => {
        try {
            const shopId = session?.user.shopId;
            const res = await fetch(`/api/products?shopId=${shopId}&limit=100`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchProducts();
            } else {
                toast.error("Failed to delete product");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });
            if (res.ok) {
                fetchProducts();
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    const saveEdit = async () => {
        if (!editModal.product) return;
        setEditModal((prev) => ({ ...prev, saving: true }));
        try {
            const p = editModal.product;
            const res = await fetch(`/api/products/${p._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: p.title,
                    price: parseFloat(p.price),
                    stock: parseInt(p.stock),
                    category: p.category,
                    brand: p.brand,
                    description: p.description,
                }),
            });
            if (res.ok) {
                setEditModal({ isOpen: false, product: null, saving: false });
                fetchProducts();
            } else {
                toast.error("Failed to update product");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setEditModal((prev) => ({ ...prev, saving: false }));
        }
    };

    // Toggle select a single product
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedIds.length === filteredProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map((p) => p._id));
        }
    };

    // Stock-based status for a product
    const getStockStatus = (product: any) => {
        if (product.stock === 0)
            return {
                label: "Out of Stock",
                bg: "bg-red-100",
                text: "text-red-700",
            };
        if (product.stock <= 5)
            return {
                label: "Low Stock",
                bg: "bg-yellow-100",
                text: "text-yellow-700",
            };
        return {
            label: "In Stock",
            bg: "bg-green-100",
            text: "text-green-700",
        };
    };

    // Filtered products
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            // Status filter
            if (filterStatus === "Active" && !p.isPublished) return false;
            if (filterStatus === "Inactive" && p.isPublished) return false;

            // Category filter
            if (filterCategory !== "All Categories" && p.category !== filterCategory)
                return false;

            // Brand filter
            if (filterBrand !== "All Brands" && p.brand !== filterBrand)
                return false;

            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const sku = p.specifications?.sku || "";
                if (
                    !p.title.toLowerCase().includes(q) &&
                    !sku.toLowerCase().includes(q)
                )
                    return false;
            }

            return true;
        });
    }, [products, filterStatus, filterCategory, filterBrand, searchQuery]);

    // Get unique brands from products
    const uniqueBrands = useMemo(() => {
        const brands = new Set(products.map((p) => p.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [products]);

    // Get unique categories from products
    const uniqueCategories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [products]);

    const inputClasses =
        "border border-gray-300 py-1 px-2 rounded outline-none focus:ring-1 focus:ring-[#007185]";

    if (loading) {
        return (
            <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading products...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="w-full p-6">
                <div className="max-w-[1500px] mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-normal">Manage Inventory</h1>
                        <Link
                            href="/shop-owner/products/add"
                            className="bg-[#FFD814] hover:bg-[#F7CA00] px-6 py-2 rounded-md text-sm font-bold shadow-sm border border-[#FFA41C] transition-colors"
                        >
                            Add a Product
                        </Link>
                    </div>

                    {/* ── Filters ── */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Status:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={inputClasses}
                            >
                                <option>All</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                            <span className="font-bold">Category:</span>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={inputClasses}
                            >
                                <option>All Categories</option>
                                {uniqueCategories.map((cat) => (
                                    <option key={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                            <span className="font-bold">Brand:</span>
                            <select
                                value={filterBrand}
                                onChange={(e) => setFilterBrand(e.target.value)}
                                className={inputClasses}
                            >
                                <option>All Brands</option>
                                {uniqueBrands.map((brand) => (
                                    <option key={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 flex items-center gap-2 border-l border-gray-300 pl-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by SKU or Name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-[#007185]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white border border-gray-300 rounded shadow-sm p-12 text-center">
                            <h2 className="text-2xl font-normal mb-4">No products found</h2>
                            <p className="text-gray-600 mb-4">
                                {products.length === 0
                                    ? "You haven't added any products yet."
                                    : "No products match your current filters."}
                            </p>
                            {products.length === 0 && (
                                <Link
                                    href="/shop-owner/products/add"
                                    className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] px-6 py-2 rounded-md text-sm font-bold shadow-sm border border-[#FFA41C] transition-colors"
                                >
                                    Add Your First Product
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 border-b border-gray-300 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                                    <tr>
                                        <th className="p-3 text-center w-12">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedIds.length ===
                                                    filteredProducts.length &&
                                                    filteredProducts.length > 0
                                                }
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Image</th>
                                        <th className="p-3">Product Name</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Brand</th>
                                        <th className="p-3">Price (৳)</th>
                                        <th className="p-3">Available</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProducts.map((product) => {
                                        const stockStatus = getStockStatus(product);
                                        return (
                                            <tr
                                                key={product._id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(
                                                            product._id
                                                        )}
                                                        onChange={() =>
                                                            toggleSelect(product._id)
                                                        }
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`inline-block px-2 py-1 ${stockStatus.bg} ${stockStatus.text} text-xs font-bold rounded`}
                                                    >
                                                        {stockStatus.label}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.title}
                                                            className="w-12 h-12 object-cover rounded border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200" />
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium">
                                                        {product.title}
                                                    </div>
                                                    {product.specifications?.sku && (
                                                        <div className="text-xs text-gray-500">
                                                            SKU:{" "}
                                                            {product.specifications.sku}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {product.category}
                                                </td>
                                                <td className="p-3 text-gray-600">
                                                    {product.brand || "—"}
                                                </td>
                                                <td className="p-3 font-bold">
                                                    {product.price?.toLocaleString()}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`font-bold ${product.stock > 5
                                                            ? "text-green-600"
                                                            : product.stock > 0
                                                                ? "text-yellow-600"
                                                                : "text-red-600"
                                                            }`}
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setEditModal({
                                                                    isOpen: true,
                                                                    product: {
                                                                        ...product,
                                                                        price: String(
                                                                            product.price
                                                                        ),
                                                                        stock: String(
                                                                            product.stock
                                                                        ),
                                                                    },
                                                                    saving: false,
                                                                })
                                                            }
                                                            className="p-1.5 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4 text-[#007185]" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                togglePublish(
                                                                    product._id,
                                                                    product.isPublished
                                                                )
                                                            }
                                                            className="p-1.5 hover:bg-gray-100 rounded"
                                                            title={
                                                                product.isPublished
                                                                    ? "Unpublish"
                                                                    : "Publish"
                                                            }
                                                        >
                                                            {product.isPublished ? (
                                                                <EyeOff className="w-4 h-4 text-gray-600" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-gray-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                deleteProduct(product._id)
                                                            }
                                                            className="p-1.5 hover:bg-gray-100 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Pagination Info ── */}
                    {filteredProducts.length > 0 && (
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                            <div>
                                Showing 1-{filteredProducts.length} of{" "}
                                {filteredProducts.length} products
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Edit Modal ── */}
            {editModal.isOpen && editModal.product && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-300">
                            <h2 className="text-lg font-bold">Edit Product</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={editModal.product.title}
                                    onChange={(e) =>
                                        setEditModal((prev) => ({
                                            ...prev,
                                            product: {
                                                ...prev.product,
                                                title: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Price (৳)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={editModal.product.price}
                                        onChange={(e) =>
                                            setEditModal((prev) => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    price: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editModal.product.stock}
                                        onChange={(e) =>
                                            setEditModal((prev) => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    stock: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={editModal.product.category}
                                        onChange={(e) =>
                                            setEditModal((prev) => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    category: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                    >
                                        <option>Laptops & Computers</option>
                                        <option>Smartphones & Tablets</option>
                                        <option>Audio & Headphones</option>
                                        <option>Gaming Accessories</option>
                                        <option>Cameras & Photography</option>
                                        <option>Wearables & Smartwatches</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Brand
                                    </label>
                                    <select
                                        value={editModal.product.brand || "Other"}
                                        onChange={(e) =>
                                            setEditModal((prev) => ({
                                                ...prev,
                                                product: {
                                                    ...prev.product,
                                                    brand: e.target.value,
                                                },
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                    >
                                        <option>Apple</option>
                                        <option>Samsung</option>
                                        <option>Dell</option>
                                        <option>HP</option>
                                        <option>Lenovo</option>
                                        <option>Sony</option>
                                        <option>Razer</option>
                                        <option>Logitech</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={editModal.product.description}
                                    onChange={(e) =>
                                        setEditModal((prev) => ({
                                            ...prev,
                                            product: {
                                                ...prev.product,
                                                description: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185]"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setEditModal({
                                        isOpen: false,
                                        product: null,
                                        saving: false,
                                    })
                                }
                                className="px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                disabled={editModal.saving}
                                className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FFA41C] rounded-md text-sm font-bold disabled:opacity-50"
                            >
                                {editModal.saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seller Central Footer */}
            <footer className="mt-auto py-6 bg-white border-t border-gray-300">
                <div className="max-w-[1500px] mx-auto text-center text-xs text-gray-500">
                    <p>&copy; 2026 Gadgets BD Seller Central. All rights reserved by LWS.</p>
                </div>
            </footer>
        </div>
    );
}
