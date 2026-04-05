"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
    CheckCircle,
    AlertCircle,
    Eye,
    Pencil,
    Star,
    Upload,
    Store,
    MapPin,
    Phone,
    Mail,
    Globe,
    Users,
    Calendar,
    Award,
} from "lucide-react";

interface ShopData {
    shopName: string;
    description: string;
    address: string;
    phone: string;
    city: string;
    specialization: string;
    yearEstablished: string;
    employees: string;
    brandPartnerships: string;
    website: string;
    banner: string;
    rating: number;
    totalReviews: number;
    totalProducts: number;
}

export default function ShopProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [uploading, setUploading] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ShopData>({
        shopName: "",
        description: "",
        address: "",
        phone: "",
        city: "",
        specialization: "",
        yearEstablished: "",
        employees: "",
        brandPartnerships: "",
        website: "",
        banner: "",
        rating: 0,
        totalReviews: 0,
        totalProducts: 0,
    });

    const [ownerInfo, setOwnerInfo] = useState<{
        name?: string;
        email?: string;
        mobile?: string;
    } | null>(null);

    useEffect(() => {
        if (status === "loading") return;

        if (
            status === "unauthenticated" ||
            session?.user.userType !== "shopOwner"
        ) {
            router.push("/");
            return;
        }

        const fetchShopProfile = async () => {
            try {
                const res = await fetch("/api/shops/profile");
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        shopName: data.shop?.shopName || "",
                        description: data.shop?.description || "",
                        address: data.shop?.address || "",
                        phone: data.shop?.phone || "",
                        city: data.shop?.city || "",
                        specialization: data.shop?.specialization || "",
                        yearEstablished:
                            data.shop?.yearEstablished?.toString() || "",
                        employees: data.shop?.employees?.toString() || "",
                        brandPartnerships:
                            data.shop?.brandPartnerships || "",
                        website: data.shop?.website || "",
                        banner: data.shop?.banner || "",
                        rating: data.shop?.rating || 0,
                        totalReviews: data.shop?.totalReviews || 0,
                        totalProducts: data.shop?.totalProducts || 0,
                    });
                    setOwnerInfo(data.owner || null);
                }
            } catch (error) {
                console.error("Error fetching shop profile:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchShopProfile();
    }, [status, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/shops/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopName: formData.shopName,
                    description: formData.description,
                    address: formData.address,
                    phone: formData.phone,
                    city: formData.city,
                    specialization: formData.specialization,
                    yearEstablished: formData.yearEstablished || undefined,
                    employees: formData.employees || undefined,
                    brandPartnerships: formData.brandPartnerships,
                    website: formData.website,
                    banner: formData.banner || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({
                    type: "error",
                    text: data.error || "Failed to update profile",
                });
                return;
            }

            // Sync formData from the server response to ensure consistency
            if (data.shop) {
                setFormData({
                    shopName: data.shop.shopName || "",
                    description: data.shop.description || "",
                    address: data.shop.address || "",
                    phone: data.shop.phone || "",
                    city: data.shop.city || "",
                    specialization: data.shop.specialization || "",
                    yearEstablished: data.shop.yearEstablished?.toString() || "",
                    employees: data.shop.employees?.toString() || "",
                    brandPartnerships: data.shop.brandPartnerships || "",
                    website: data.shop.website || "",
                    banner: data.shop.banner || "",
                    rating: data.shop.rating || 0,
                    totalReviews: data.shop.totalReviews || 0,
                    totalProducts: data.shop.totalProducts || 0,
                });
            }

            setMessage({
                type: "success",
                text: "Shop profile updated successfully!",
            });
            // Switch back to view mode on success
            setTimeout(() => {
                setMode("view");
                setMessage(null);
            }, 1500);
        } catch {
            setMessage({
                type: "error",
                text: "An error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBannerUpload = async (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File is too large. Maximum size is 5MB.' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            // Upload to ImageKit via existing API
            const uploadData = new FormData();
            uploadData.append('files', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });

            const uploadResult = await uploadRes.json();

            if (!uploadRes.ok) {
                setMessage({ type: 'error', text: uploadResult.error || 'Failed to upload banner' });
                return;
            }

            const bannerUrl = uploadResult.images[0]?.url;
            if (!bannerUrl) {
                setMessage({ type: 'error', text: 'Upload succeeded but no URL returned' });
                return;
            }

            // Save banner URL to shop profile
            const saveRes = await fetch('/api/shops/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopName: formData.shopName,
                    description: formData.description,
                    address: formData.address,
                    phone: formData.phone,
                    city: formData.city,
                    specialization: formData.specialization,
                    yearEstablished: formData.yearEstablished || undefined,
                    employees: formData.employees || undefined,
                    brandPartnerships: formData.brandPartnerships,
                    website: formData.website,
                    banner: bannerUrl,
                }),
            });

            if (!saveRes.ok) {
                setMessage({ type: 'error', text: 'Upload succeeded but failed to save banner' });
                return;
            }

            setFormData({ ...formData, banner: bannerUrl });
            setMessage({ type: 'success', text: 'Banner uploaded successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'An error occurred while uploading the banner.' });
        } finally {
            setUploading(false);
        }
    };

    const cities = [
        "Dhaka",
        "Chittagong",
        "Sylhet",
        "Rajshahi",
        "Khulna",
        "Barisal",
        "Rangpur",
        "Mymensingh",
    ];

    const specializations = [
        "Laptops & PCs",
        "Smartphones",
        "Gaming Gear",
        "Audio & Headphones",
        "Cameras & Lenses",
        "Wearables",
        "Accessories",
    ];

    if (status === "loading" || fetching) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 bg-amazon-background">
                    <div className="max-w-[1200px] mx-auto px-4 py-6">
                        {/* Header skeleton */}
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
                                <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                        {/* Card skeleton */}
                        <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
                            <div className="h-48 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(rating)
                    ? "text-amazon-secondary fill-current"
                    : "text-gray-300"
                    }`}
            />
        ));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-amazon-background">
                <div className="max-w-[1200px] mx-auto w-full p-6">
                    {/* Page Header */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-normal">
                                Shop Profile
                            </h1>
                            <p className="text-sm text-gray-600">
                                Manage your shop information and appearance on
                                Gadgets BD
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode("view")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${mode === "view"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                View Mode
                            </button>
                            <button
                                onClick={() => setMode("edit")}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-1.5 ${mode === "edit"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary"
                                    }`}
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Mode
                            </button>
                        </div>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div
                            className={`mb-4 p-3 rounded-sm flex items-center gap-2 text-sm ${message.type === "success"
                                ? "bg-green-50 border border-green-300 text-green-700"
                                : "bg-red-50 border border-red-300 text-red-700"
                                }`}
                        >
                            {message.type === "success" ? (
                                <CheckCircle className="w-4 h-4 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            {message.text}
                        </div>
                    )}

                    {/* =================== VIEW MODE =================== */}
                    {mode === "view" && (
                        <div className="space-y-6">
                            {/* Shop Preview Card */}
                            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex justify-between items-center">
                                    <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                        Shop Preview
                                    </h2>
                                    <span className="flex items-center bg-green-50 px-2 py-1 rounded border border-green-200">
                                        <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                        <span className="text-[10px] font-bold text-green-700 uppercase">
                                            Verified
                                        </span>
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-sm overflow-hidden shadow-md">
                                        {/* Banner */}
                                        <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                                            {formData.banner ? (
                                                <img
                                                    src={formData.banner}
                                                    className="w-full h-full object-cover"
                                                    alt="Shop Banner"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Store className="w-16 h-16 text-blue-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-amazon-blue mb-1">
                                                {formData.shopName ||
                                                    "Your Shop Name"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3">
                                                {formData.city
                                                    ? `${formData.city}, Bangladesh`
                                                    : "Location not set"}
                                            </p>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                <div className="flex">
                                                    {renderStars(
                                                        formData.rating
                                                    )}
                                                </div>
                                                <span className="text-xs text-amazon-blue">
                                                    {formData.totalReviews.toLocaleString()}{" "}
                                                    ratings
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-4">
                                                {formData.description ||
                                                    "No description yet. Edit your profile to add one."}
                                            </p>

                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <div className="text-xs">
                                                    <span className="text-gray-500">
                                                        Specializes in:{" "}
                                                    </span>
                                                    <span className="font-bold">
                                                        {formData.specialization ||
                                                            "Not set"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shop Information */}
                            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                                    <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                                        Shop Information
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoField
                                        icon={<Store className="w-4 h-4 text-gray-400" />}
                                        label="Shop Name"
                                        value={formData.shopName}
                                    />
                                    <InfoField
                                        icon={<Users className="w-4 h-4 text-gray-400" />}
                                        label="Owner Name"
                                        value={ownerInfo?.name}
                                    />
                                    <InfoField
                                        icon={<Mail className="w-4 h-4 text-gray-400" />}
                                        label="Email"
                                        value={ownerInfo?.email}
                                    />
                                    <InfoField
                                        icon={<Phone className="w-4 h-4 text-gray-400" />}
                                        label="Phone Number"
                                        value={
                                            formData.phone ||
                                            ownerInfo?.mobile
                                        }
                                    />
                                    <InfoField
                                        icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                        label="Location"
                                        value={
                                            formData.city
                                                ? `${formData.city}, Bangladesh`
                                                : undefined
                                        }
                                    />
                                    <InfoField
                                        icon={<Award className="w-4 h-4 text-gray-400" />}
                                        label="Specialization"
                                        value={formData.specialization}
                                    />
                                    <div className="md:col-span-2">
                                        <InfoField
                                            label="Shop Description"
                                            value={formData.description}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InfoField
                                            icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                            label="Address"
                                            value={formData.address}
                                        />
                                    </div>
                                    {formData.website && (
                                        <InfoField
                                            icon={<Globe className="w-4 h-4 text-gray-400" />}
                                            label="Website"
                                            value={formData.website}
                                        />
                                    )}
                                    {formData.yearEstablished && (
                                        <InfoField
                                            icon={<Calendar className="w-4 h-4 text-gray-400" />}
                                            label="Year Established"
                                            value={formData.yearEstablished}
                                        />
                                    )}
                                    {formData.employees && (
                                        <InfoField
                                            icon={<Users className="w-4 h-4 text-gray-400" />}
                                            label="Employees"
                                            value={formData.employees}
                                        />
                                    )}
                                    {formData.brandPartnerships && (
                                        <InfoField
                                            icon={<Award className="w-4 h-4 text-gray-400" />}
                                            label="Brand Partnerships"
                                            value={formData.brandPartnerships}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =================== EDIT MODE =================== */}
                    {mode === "edit" && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <Section title="Basic Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Shop Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.shopName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    shopName: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Owner Name
                                        </label>
                                        <input
                                            type="text"
                                            value={ownerInfo?.name || ""}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={ownerInfo?.email || ""}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Shop Description *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        placeholder="Tell customers about your shop..."
                                    />
                                </div>
                            </Section>

                            {/* Location & Specialization */}
                            <Section title="Location & Specialization">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            City/Location *
                                        </label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    city: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        >
                                            <option value="">
                                                Select a city
                                            </option>
                                            {cities.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Specialization *
                                        </label>
                                        <select
                                            value={formData.specialization}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    specialization:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        >
                                            <option value="">
                                                Select specialization
                                            </option>
                                            {specializations.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Full Address *
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                        placeholder="Enter your full shop address..."
                                    />
                                </div>
                            </Section>

                            {/* Shop Banner */}
                            <Section title="Shop Banner Image">
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">
                                        Current Banner
                                    </label>
                                    <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-md border border-gray-300">
                                        {formData.banner ? (
                                            <img
                                                src={formData.banner}
                                                className="w-full h-full object-cover"
                                                alt="Current Banner"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <Store className="w-12 h-12 mx-auto mb-2" />
                                                    <p className="text-sm">
                                                        No banner uploaded
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Upload New Banner
                                    </label>
                                    <input
                                        type="file"
                                        ref={bannerInputRef}
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleBannerUpload(file);
                                            e.target.value = '';
                                        }}
                                    />
                                    <div
                                        onClick={() => bannerInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleBannerUpload(file);
                                        }}
                                        className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-amazon-blue transition-colors cursor-pointer"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-12 h-12 mx-auto mb-2 border-4 border-gray-200 border-t-amazon-blue rounded-full animate-spin" />
                                                <p className="text-sm text-gray-600 mb-1">Uploading banner...</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG up to 5MB (Recommended:
                                                    1200 x 400 pixels)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Section>

                            {/* Additional Information */}
                            <Section title="Additional Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Year Established
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 2014"
                                            value={formData.yearEstablished}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    yearEstablished:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">
                                            Number of Employees
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 25"
                                            value={formData.employees}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    employees: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Official Brand Partnerships
                                        (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Apple, Dell, HP, Lenovo"
                                        value={formData.brandPartnerships}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                brandPartnerships:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate multiple brands with commas
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">
                                        Website URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://www.yourshop.com"
                                        value={formData.website}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
                                    />
                                </div>
                            </Section>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setMode("view")}
                                    className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
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

/* ───────── Helper Components ───────── */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                    {title}
                </h2>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
    );
}

function InfoField({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value?: string;
}) {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                {icon}
                {label}
            </label>
            <p className="font-medium">{value || "—"}</p>
        </div>
    );
}
