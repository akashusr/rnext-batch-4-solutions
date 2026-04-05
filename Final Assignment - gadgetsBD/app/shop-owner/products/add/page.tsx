"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Upload, X, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function AddProductPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Laptops & Computers",
        brand: "Apple",
        condition: "New",
        price: "",
        stock: "",
        sku: "",
        availability: "In Stock",
        warranty: "No Warranty",
        images: [] as string[],
        // Technical Specifications
        processor: "",
        ram: "",
        storage: "",
        displaySize: "",
        otherSpecs: "",
    });

    if (status === "loading") {
        return (
            <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    if (status === "unauthenticated" || session?.user.userType !== "shopOwner") {
        router.push("/");
        return null;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (formData.images.length + files.length > 5) {
            toast.info("You can upload a maximum of 5 images per product");
            return;
        }

        setUploading(true);
        try {
            const formDataToUpload = new FormData();
            Array.from(files).forEach((file) => {
                formDataToUpload.append("files", file);
            });

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataToUpload,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Upload failed");
            }

            const data = await res.json();
            const uploadedUrls = data.images.map((img: any) => img.url);

            setFormData({
                ...formData,
                images: [...formData.images, ...uploadedUrls],
            });

            toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
        } catch (error: any) {
            toast.error(error.message || "Failed to upload images");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            toast.info("Please upload at least one product image");
            return;
        }

        setLoading(true);

        try {
            // Build specifications object from individual fields
            const specifications: Record<string, string> = {};
            if (formData.processor) specifications["Processor/Chipset"] = formData.processor;
            if (formData.ram) specifications["RAM/Memory"] = formData.ram;
            if (formData.storage) specifications["Storage"] = formData.storage;
            if (formData.displaySize) specifications["Display Size"] = formData.displaySize;
            if (formData.otherSpecs) specifications["Other"] = formData.otherSpecs;

            // Build features from specs for backward compatibility
            const features = Object.entries(specifications).map(
                ([key, val]) => `${key}: ${val}`
            );

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    brand: formData.brand,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    images: formData.images,
                    features,
                    specifications: {
                        ...specifications,
                        condition: formData.condition,
                        sku: formData.sku || undefined,
                        availability: formData.availability,
                        warranty: formData.warranty,
                    },
                }),
            });

            if (res.ok) {
                toast.success("Product published successfully!");
                router.push("/shop-owner/products/manage");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add product");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses =
        "w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-[#007185] focus:border-[#007185]";

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-[1000px] mx-auto w-full p-6">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-normal">Add a Product</h1>
                        <p className="text-sm text-gray-600">
                            Create a new listing for your gadget product.
                        </p>
                    </div>
                    <Link
                        href="/shop-owner/products/manage"
                        className="text-[#007185] hover:underline text-sm flex items-center gap-1"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Manage List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Step 1: Product Identity ── */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                Step 1: Product Identity
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="e.g., Apple MacBook Pro M2 - 16GB RAM"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        className={inputClasses}
                                    >
                                        <option>Laptops & Computers</option>
                                        <option>Smartphones & Tablets</option>
                                        <option>Audio & Headphones</option>
                                        <option>Gaming Accessories</option>
                                        <option>Cameras & Photography</option>
                                        <option>Wearables & Smartwatches</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Brand</label>
                                    <select
                                        value={formData.brand}
                                        onChange={(e) =>
                                            setFormData({ ...formData, brand: e.target.value })
                                        }
                                        className={inputClasses}
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
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Condition
                                    </label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) =>
                                            setFormData({ ...formData, condition: e.target.value })
                                        }
                                        className={inputClasses}
                                    >
                                        <option>New</option>
                                        <option>Renewed</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Describe your product features, specifications, and benefits..."
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Step 2: Pricing & Inventory ── */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                Step 2: Pricing & Inventory
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Price (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        placeholder="0.00"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({ ...formData, stock: e.target.value })
                                        }
                                        placeholder="0"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        SKU (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sku: e.target.value })
                                        }
                                        placeholder="e.g., MBP-M2-16-1TB"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Availability
                                    </label>
                                    <select
                                        value={formData.availability}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                availability: e.target.value,
                                            })
                                        }
                                        className={inputClasses}
                                    >
                                        <option>In Stock</option>
                                        <option>Pre-Order</option>
                                        <option>Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Warranty Period
                                    </label>
                                    <select
                                        value={formData.warranty}
                                        onChange={(e) =>
                                            setFormData({ ...formData, warranty: e.target.value })
                                        }
                                        className={inputClasses}
                                    >
                                        <option>No Warranty</option>
                                        <option>6 Months</option>
                                        <option>1 Year</option>
                                        <option>2 Years</option>
                                        <option>3 Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 3: Product Images ── */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                Step 3: Product Images
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Main Product Image Upload */}
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Main Product Image *
                                </label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-[#007185] transition-colors cursor-pointer"
                                    onClick={() =>
                                        document.getElementById("main-image-upload")?.click()
                                    }
                                >
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                    {uploading ? (
                                        <p className="text-sm text-[#007185] font-medium">
                                            Uploading images...
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG up to 5MB
                                            </p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        id="main-image-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading || formData.images.length >= 5}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Additional Images (Optional)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Existing uploaded images */}
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={url}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover rounded-md border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove image"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-1 left-1 bg-amazon-secondary text-black text-xs px-2 py-0.5 rounded font-bold">
                                                    Main
                                                </span>
                                            )}
                                        </div>
                                    ))}

                                    {/* Empty slots */}
                                    {formData.images.length < 5 &&
                                        Array.from({
                                            length: Math.min(
                                                4 - formData.images.length,
                                                5 - formData.images.length
                                            ),
                                        }).map((_, i) => (
                                            <div
                                                key={`empty-${i}`}
                                                onClick={() =>
                                                    document
                                                        .getElementById("additional-image-upload")
                                                        ?.click()
                                                }
                                                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-[#007185] transition-colors cursor-pointer aspect-square flex items-center justify-center"
                                            >
                                                <Plus className="w-8 h-8 text-gray-400" />
                                            </div>
                                        ))}
                                    <input
                                        type="file"
                                        id="additional-image-upload"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploading || formData.images.length >= 5}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Step 4: Technical Specifications ── */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                            <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                Step 4: Technical Specifications (Optional)
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Processor/Chipset
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.processor}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                processor: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Apple M2 Max"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        RAM/Memory
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ram}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ram: e.target.value })
                                        }
                                        placeholder="e.g., 32GB"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Storage</label>
                                    <input
                                        type="text"
                                        value={formData.storage}
                                        onChange={(e) =>
                                            setFormData({ ...formData, storage: e.target.value })
                                        }
                                        placeholder="e.g., 1TB SSD"
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Display Size
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.displaySize}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                displaySize: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., 16 inch"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">
                                    Other Specifications
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.otherSpecs}
                                    onChange={(e) =>
                                        setFormData({ ...formData, otherSpecs: e.target.value })
                                    }
                                    placeholder="Add any other technical details (Battery life, Connectivity, Ports, etc.)"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => router.push("/shop-owner/products/manage")}
                            className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FFA41C] rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish Product"}
                        </button>
                    </div>
                </form>
            </main>

            {/* Seller Central Footer */}
            <footer className="mt-auto py-6 bg-white border-t border-gray-300">
                <div className="max-w-[1000px] mx-auto text-center text-xs text-gray-500">
                    <p>&copy; 2026 Gadgets BD Seller Central. All rights reserved by LWS.</p>
                </div>
            </footer>
        </div>
    );
}
