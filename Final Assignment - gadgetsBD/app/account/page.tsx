"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    ChevronRight,
    Save,
    Package,
    Heart,
    Calendar,
    Store,
} from "lucide-react";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    userType: "customer" | "shopOwner";
    image?: string;
    createdAt: string;
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", mobile: "" });
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setForm({ name: data.name, mobile: data.mobile });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const updated = await res.json();
                setProfile(updated);
                setEditing(false);
                setMessage({ type: "success", text: "Profile updated successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const err = await res.json();
                setMessage({ type: "error", text: err.error || "Failed to update profile" });
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white text-amazon-text flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading profile...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen">
            <Navbar />

            <main className="max-w-[900px] mx-auto w-full p-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm mb-4">
                    <Link href="/" className="text-amazon-blue hover:underline">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-amazon-orange">My Account</span>
                </div>

                <h1 className="text-3xl font-normal mb-6">Your Account</h1>

                {message && (
                    <div
                        className={`mb-4 px-4 py-3 rounded text-sm font-medium ${message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User className="w-5 h-5" /> Profile Information
                            </h2>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-sm text-amazon-blue hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-amazon-light flex items-center justify-center text-white text-3xl font-bold">
                                {profile?.image ? (
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="w-full h-full rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    profile?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">{profile?.name}</h3>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amazon-secondary/10 text-amazon-secondary text-xs rounded-full">
                                    <ShieldCheck className="w-3 h-3" />
                                    {profile?.userType === "shopOwner"
                                        ? "Shop Owner"
                                        : "Customer"}
                                </span>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-1 mb-1">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, name: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amazon-secondary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-base">{profile?.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-1 mb-1">
                                    <Mail className="w-4 h-4" /> Email Address
                                </label>
                                <p className="text-base text-gray-600">{profile?.email}</p>
                                <span className="text-xs text-gray-400">
                                    Email cannot be changed
                                </span>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-1 mb-1">
                                    <Phone className="w-4 h-4" /> Mobile Number
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={form.mobile}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, mobile: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amazon-secondary focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-base">{profile?.mobile}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-1 mb-1">
                                    <Calendar className="w-4 h-4" /> Member Since
                                </label>
                                <p className="text-base">
                                    {profile?.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {editing && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1 py-2 px-6 bg-amazon-yellow hover:bg-amazon-yellow-hover border border-amazon-secondary rounded-md text-sm font-bold disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setForm({
                                            name: profile?.name || "",
                                            mobile: profile?.mobile || "",
                                        });
                                    }}
                                    className="py-2 px-6 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
                            <div className="space-y-3">
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition text-sm"
                                >
                                    <Package className="w-5 h-5 text-amazon-blue" />
                                    Your Orders
                                </Link>
                                {profile?.userType === "shopOwner" ? (
                                    <Link
                                        href="/shop-owner/profile"
                                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition text-sm"
                                    >
                                        <Store className="w-5 h-5 text-amazon-secondary" />
                                        Shop Profile
                                    </Link>
                                ) : (
                                    <Link
                                        href="/wishlist"
                                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition text-sm"
                                    >
                                        <Heart className="w-5 h-5 text-red-500" />
                                        Your Wishlist
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-bold mb-2">Account Security</h2>
                            <p className="text-xs text-gray-500 mb-4">
                                Manage your password and security settings.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-amazon-blue hover:underline"
                            >
                                Change Password →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-amazon-light text-white mt-8">
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
