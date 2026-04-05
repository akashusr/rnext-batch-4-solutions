"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { X, Minus, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";

// Read selected item IDs from sessionStorage (set by cart page)
function getSelectedItemIds(): string[] | null {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("checkoutItems");
    if (!raw) return null;
    try {
        return JSON.parse(raw) as string[];
    } catch {
        return null;
    }
}

interface CartItem {
    productId: {
        _id: string;
        title: string;
        price: number;
        images: string[];
    };
    quantity: number;
    price: number;
}

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedProductIds, setSelectedProductIds] = useState<string[] | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItems, setEditItems] = useState<CartItem[]>([]);
    const [editAddress, setEditAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });
    const [savingChanges, setSavingChanges] = useState(false);

    const [deliveryAddress, setDeliveryAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
        method: "Credit Card",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated") {
            const ids = getSelectedItemIds();
            setSelectedProductIds(ids);
            fetchCart(ids);
        }
    }, [status]);

    const fetchCart = async (ids: string[] | null) => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                // Filter to selected items only
                if (ids && ids.length > 0) {
                    data.items = data.items.filter((item: CartItem) =>
                        ids.includes(item.productId._id)
                    );
                }
                if (data.items.length === 0) {
                    router.push("/cart");
                }
                setCart(data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const deliveryFee = 60;
    const serviceFee = Math.round(calculateSubtotal() * 0.02);
    const total = calculateSubtotal() + deliveryFee + serviceFee;

    // Edit Modal Handlers
    const openEditModal = () => {
        if (cart) {
            setEditItems(cart.items.map((item) => ({ ...item, quantity: item.quantity })));
        }
        setEditAddress({ ...deliveryAddress });
        setShowEditModal(true);
    };

    const handleEditQuantity = (productId: string, newQty: number) => {
        if (newQty < 1) return;
        setEditItems((prev) =>
            prev.map((item) =>
                item.productId._id === productId ? { ...item, quantity: newQty } : item
            )
        );
    };

    const handleRemoveEditItem = (productId: string) => {
        setEditItems((prev) => prev.filter((item) => item.productId._id !== productId));
    };

    const handleSaveChanges = async () => {
        setSavingChanges(true);
        try {
            // Update quantities via cart API
            for (const editItem of editItems) {
                const originalItem = cart?.items.find(
                    (item) => item.productId._id === editItem.productId._id
                );
                if (!originalItem || originalItem.quantity !== editItem.quantity) {
                    await fetch("/api/cart", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            productId: editItem.productId._id,
                            quantity: editItem.quantity,
                        }),
                    });
                }
            }

            // Remove deleted items
            const editItemIds = editItems.map((item) => item.productId._id);
            const removedItems = cart?.items.filter(
                (item) => !editItemIds.includes(item.productId._id)
            ) || [];
            for (const removed of removedItems) {
                await fetch(`/api/cart?productId=${removed.productId._id}`, {
                    method: "DELETE",
                });
            }

            // Update delivery address
            setDeliveryAddress({ ...editAddress });

            // Refresh cart
            await fetchCart(selectedProductIds);
            setShowEditModal(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error("Failed to save changes");
        } finally {
            setSavingChanges(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deliveryAddress,
                    paymentInfo,
                    selectedItems: selectedProductIds,
                }),
            });

            if (res.ok) {
                const order = await res.json();
                // Clear selected items from sessionStorage
                sessionStorage.removeItem("checkoutItems");
                router.push(`/checkout/success?orderId=${order._id}`);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to place order");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 bg-amazon-background">
                <div className="max-w-[1200px] mx-auto px-4 py-6">
                    <h1 className="text-3xl font-normal mb-6">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Forms */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Delivery Address */}
                                <div className="a-box p-6">
                                    <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={deliveryAddress.name}
                                                onChange={(e) =>
                                                    setDeliveryAddress({ ...deliveryAddress, name: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={deliveryAddress.phone}
                                                onChange={(e) =>
                                                    setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-1">
                                                Address
                                            </label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={deliveryAddress.address}
                                                onChange={(e) =>
                                                    setDeliveryAddress({
                                                        ...deliveryAddress,
                                                        address: e.target.value,
                                                    })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">City</label>
                                            <input
                                                type="text"
                                                required
                                                value={deliveryAddress.city}
                                                onChange={(e) =>
                                                    setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={deliveryAddress.postalCode}
                                                onChange={(e) =>
                                                    setDeliveryAddress({
                                                        ...deliveryAddress,
                                                        postalCode: e.target.value,
                                                    })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="a-box p-6">
                                    <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                                    <p className="text-sm text-gray-600 mb-4">
                                        This is a fake payment simulation. No real charges will be made.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-1">
                                                Card Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={paymentInfo.cardHolder}
                                                onChange={(e) =>
                                                    setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })
                                                }
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-1">
                                                Card Number
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="1234 5678 9012 3456"
                                                    inputMode="numeric"
                                                    maxLength={
                                                        (() => {
                                                            const raw = paymentInfo.cardNumber.replace(/\s/g, "");
                                                            if (/^3[47]/.test(raw)) return 17; // Amex: 4+6+5 + 2 spaces
                                                            return 19; // Others: 4+4+4+4 + 3 spaces
                                                        })()
                                                    }
                                                    value={paymentInfo.cardNumber}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, "");
                                                        let formatted = "";
                                                        if (/^3[47]/.test(raw)) {
                                                            // Amex: 4-6-5
                                                            for (let i = 0; i < raw.length && i < 15; i++) {
                                                                if (i === 4 || i === 10) formatted += " ";
                                                                formatted += raw[i];
                                                            }
                                                        } else {
                                                            // Visa/MC/Others: 4-4-4-4
                                                            for (let i = 0; i < raw.length && i < 16; i++) {
                                                                if (i > 0 && i % 4 === 0) formatted += " ";
                                                                formatted += raw[i];
                                                            }
                                                        }
                                                        setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                                                    }}
                                                    className="input-field pr-14 font-mono tracking-wider"
                                                />
                                                {/* Card Type Icon */}
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-7 flex items-center justify-center">
                                                    {(() => {
                                                        const raw = paymentInfo.cardNumber.replace(/\s/g, "");
                                                        if (/^4/.test(raw)) {
                                                            // Visa
                                                            return (
                                                                <svg viewBox="0 0 48 32" className="w-10 h-7">
                                                                    <rect width="48" height="32" rx="4" fill="#1A1F71" />
                                                                    <text x="24" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fontStyle="italic" fill="#FFFFFF">VISA</text>
                                                                </svg>
                                                            );
                                                        }
                                                        if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) {
                                                            // Mastercard
                                                            return (
                                                                <svg viewBox="0 0 48 32" className="w-10 h-7">
                                                                    <rect width="48" height="32" rx="4" fill="#252525" />
                                                                    <circle cx="19" cy="16" r="9" fill="#EB001B" opacity="0.9" />
                                                                    <circle cx="29" cy="16" r="9" fill="#F79E1B" opacity="0.9" />
                                                                    <circle cx="24" cy="16" r="5.5" fill="#FF5F00" opacity="0.8" />
                                                                </svg>
                                                            );
                                                        }
                                                        if (/^3[47]/.test(raw)) {
                                                            // Amex
                                                            return (
                                                                <svg viewBox="0 0 48 32" className="w-10 h-7">
                                                                    <rect width="48" height="32" rx="4" fill="#2E77BC" />
                                                                    <text x="24" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF">AMEX</text>
                                                                </svg>
                                                            );
                                                        }
                                                        if (/^6(?:011|5)/.test(raw)) {
                                                            // Discover
                                                            return (
                                                                <svg viewBox="0 0 48 32" className="w-10 h-7">
                                                                    <rect width="48" height="32" rx="4" fill="#FF6000" />
                                                                    <text x="24" y="19" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFFFFF">DISCOVER</text>
                                                                </svg>
                                                            );
                                                        }
                                                        // Default card icon
                                                        return (
                                                            <svg viewBox="0 0 48 32" className="w-10 h-7 text-gray-300">
                                                                <rect width="48" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                                                <rect x="4" y="8" width="12" height="8" rx="1" fill="currentColor" />
                                                                <line x1="4" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="2" />
                                                                <line x1="4" y1="26" x2="20" y2="26" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="MM/YY"
                                                inputMode="numeric"
                                                maxLength={5}
                                                value={paymentInfo.expiryDate}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    const prev = paymentInfo.expiryDate;

                                                    // If user is deleting, allow it
                                                    if (val.length < prev.length) {
                                                        setPaymentInfo({ ...paymentInfo, expiryDate: val });
                                                        return;
                                                    }

                                                    // Strip non-digits except /
                                                    const raw = val.replace(/[^\d]/g, "");
                                                    let formatted = "";
                                                    if (raw.length >= 2) {
                                                        formatted = raw.substring(0, 2) + "/" + raw.substring(2, 4);
                                                    } else {
                                                        formatted = raw;
                                                    }
                                                    setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                                                }}
                                                className="input-field font-mono tracking-wider"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">CVV</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="•••"
                                                inputMode="numeric"
                                                maxLength={(() => {
                                                    const raw = paymentInfo.cardNumber.replace(/\s/g, "");
                                                    return /^3[47]/.test(raw) ? 4 : 3; // Amex has 4-digit CVV
                                                })()}
                                                value={paymentInfo.cvv}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, "");
                                                    setPaymentInfo({ ...paymentInfo, cvv: val });
                                                }}
                                                className="input-field font-mono tracking-[0.3em]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="lg:col-span-1">
                                {/* Edit Order Details Button */}
                                <button
                                    type="button"
                                    onClick={openEditModal}
                                    className="w-full mb-4 py-2 px-4 flex items-center justify-center gap-2 border border-gray-400 rounded-md bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Order Details
                                </button>
                                <div className="a-box p-4 sticky top-4">
                                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                                    <div className="space-y-3 mb-4">
                                        {cart?.items.map((item) => (
                                            <div key={item.productId._id} className="flex gap-3">
                                                <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                                                    {item.productId.images?.[0] && (
                                                        <img
                                                            src={item.productId.images[0]}
                                                            alt={item.productId.title}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm line-clamp-2">
                                                        {item.productId.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-bold">
                                                    ৳{(item.price * item.quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-300 pt-4 space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>৳{calculateSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Delivery Fee:</span>
                                            <span>৳{deliveryFee}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Service Fee:</span>
                                            <span>৳{serviceFee}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-300 pt-4 mb-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span>৳{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-2 a-button-primary rounded-sm font-medium disabled:opacity-50"
                                    >
                                        {submitting ? "Processing..." : "Place Order"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="bg-amazon text-white py-8 mt-auto">
                <div className="max-w-[1500px] mx-auto px-4 text-center">
                    <p>&copy; 2026 Gadgets BD. All rights reserved.</p>
                </div>
            </footer>

            {/* Edit Order Details Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowEditModal(false)}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
                            <h2 className="text-xl font-bold text-amazon-text">Edit Order Details</h2>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Products Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                    Products ({editItems.length} items)
                                </h3>
                                <div className="space-y-3">
                                    {editItems.map((item) => (
                                        <div
                                            key={item.productId._id}
                                            className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                        >
                                            <div className="w-16 h-16 bg-gray-50 rounded flex-shrink-0 overflow-hidden">
                                                {item.productId.images?.[0] && (
                                                    <img
                                                        src={item.productId.images[0]}
                                                        alt={item.productId.title}
                                                        className="w-full h-full object-contain"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {item.productId.title}
                                                </p>
                                                <p className="text-sm text-amazon-orange font-bold">
                                                    ৳{item.price.toLocaleString()} each
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditQuantity(item.productId._id, item.quantity - 1)
                                                    }
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm font-medium bg-gray-50">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditQuantity(item.productId._id, item.quantity + 1)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEditItem(item.productId._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="text-sm font-bold text-right w-24">
                                                ৳{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    {editItems.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No items in order. Add products from the shop.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                    Delivery Address
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editAddress.name}
                                            onChange={(e) =>
                                                setEditAddress({ ...editAddress, name: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amazon-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={editAddress.phone}
                                            onChange={(e) =>
                                                setEditAddress({ ...editAddress, phone: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amazon-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editAddress.address}
                                            onChange={(e) =>
                                                setEditAddress({ ...editAddress, address: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amazon-blue focus:border-transparent outline-none resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={editAddress.city}
                                            onChange={(e) =>
                                                setEditAddress({ ...editAddress, city: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amazon-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            value={editAddress.postalCode}
                                            onChange={(e) =>
                                                setEditAddress({ ...editAddress, postalCode: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amazon-blue focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                disabled={savingChanges || editItems.length === 0}
                                className="px-5 py-2 a-button-primary rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {savingChanges ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
