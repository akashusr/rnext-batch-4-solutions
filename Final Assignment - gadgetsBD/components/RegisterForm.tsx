"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, Check, X, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
    isModal?: boolean;
}

export default function RegisterForm({ isModal = false }: RegisterFormProps) {
    const router = useRouter();
    const [userType, setUserType] = useState<"customer" | "shopOwner">("customer");
    const [formData, setFormData] = useState({
        name: "",
        shopName: "",
        mobile: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (userType === "shopOwner" && !formData.shopName) {
            setError("Shop name is required for shop owners");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    mobile: `+880${formData.mobile}`,
                    userType,
                    shopName: userType === "shopOwner" ? formData.shopName : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            // Auto sign-in after registration
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.ok) {
                if (userType === "shopOwner") {
                    // Shop owners go directly to their profile page
                    router.push("/shop-owner/profile");
                } else if (isModal) {
                    router.back();
                    router.refresh();
                } else {
                    router.push("/");
                }
            } else {
                router.push("/login");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-normal mb-4">Create account</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-sm text-sm text-red-700">
                    <Info className="w-4 h-4 inline mr-1" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Account Type Toggle */}
                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-sm">
                    <button
                        type="button"
                        onClick={() => setUserType("customer")}
                        className={`flex-1 py-1 text-xs font-bold rounded-sm ${userType === "customer"
                            ? "bg-white shadow-sm"
                            : "text-gray-500"
                            }`}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType("shopOwner")}
                        className={`flex-1 py-1 text-xs font-bold rounded-sm ${userType === "shopOwner"
                            ? "bg-white shadow-sm"
                            : "text-gray-500"
                            }`}
                    >
                        Shop Owner
                    </button>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-1">
                        Your name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="First and last name"
                        className="input-field"
                    />
                </div>

                {/* Shop Name (Only for Shop Owner) */}
                {userType === "shopOwner" && (
                    <div>
                        <label htmlFor="shopName" className="block text-sm font-bold mb-1">
                            Shop name
                        </label>
                        <input
                            type="text"
                            id="shopName"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            placeholder="Your shop name"
                            className="input-field"
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="mobile" className="block text-sm font-bold mb-1">
                        Mobile number
                    </label>
                    <div className="flex gap-2">
                        <select className="px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary">
                            <option>BD +880</option>
                        </select>
                        <input
                            type="tel"
                            id="mobile"
                            inputMode="numeric"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                            required
                            placeholder="Mobile number"
                            className="flex-1 input-field"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="reg-email" className="block text-sm font-bold mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="reg-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="reg-password" className="block text-sm font-bold mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="reg-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="At least 6 characters"
                            className="input-field pr-9"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        <Info className="w-3 h-3 inline mr-1" />
                        Passwords must be at least 6 characters.
                    </p>
                </div>

                <div>
                    <label htmlFor="passwordConfirm" className="block text-sm font-bold mb-1">
                        Re-enter password
                    </label>
                    <div className="relative">
                        <input
                            type={showPasswordConfirm ? "text" : "password"}
                            id="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={(e) =>
                                setFormData({ ...formData, passwordConfirm: e.target.value })
                            }
                            required
                            className={`input-field pr-9 ${formData.passwordConfirm
                                ? formData.password.startsWith(formData.passwordConfirm) || formData.password === formData.passwordConfirm
                                    ? "!border-green-500 focus:!ring-green-400 focus:!border-green-500"
                                    : "!border-red-500 focus:!ring-red-400 focus:!border-red-500"
                                : ""
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {formData.passwordConfirm && (
                        <p
                            className={`text-xs mt-1 flex items-center gap-1 ${formData.password === formData.passwordConfirm
                                ? "text-green-600"
                                : formData.password.startsWith(formData.passwordConfirm)
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {formData.password === formData.passwordConfirm ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    Passwords match
                                </>
                            ) : formData.password.startsWith(formData.passwordConfirm) ? (
                                <>
                                    <Check className="w-3 h-3" />
                                    Correct so far...
                                </>
                            ) : (
                                <>
                                    <X className="w-3 h-3" />
                                    Passwords do not match
                                </>
                            )}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Create your Gadgets BD account"}
                </button>
            </form>

            <p className="text-xs text-gray-600 mt-4">
                By creating an account, you agree to Gadgets BD&apos;s Conditions of Use and Privacy Notice.
            </p>

            {/* Divider */}
            <div className="relative mt-5 mb-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
            </div>

            {/* Continue with Google */}
            <button
                type="button"
                onClick={() => {
                    document.cookie = `google_signup_userType=${userType};path=/;max-age=600`;
                    signIn("google", { callbackUrl: userType === 'shopOwner' ? '/shop-owner/profile' : '/' });
                }}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-400 rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-amazon-blue hover:text-amazon-orange hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}
