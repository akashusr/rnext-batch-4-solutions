"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Info, CheckCircle, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // No token provided
    if (!token) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Info className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                <h1 className="text-xl font-semibold mb-2">Invalid Link</h1>
                <p className="text-sm text-gray-600 mb-4">
                    This password reset link is invalid or has expired.
                </p>
                <Link
                    href="/forgot-password"
                    className="block w-full py-1.5 a-button-primary text-sm font-medium rounded-sm text-center"
                >
                    Request a new reset link
                </Link>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <h1 className="text-xl font-semibold mb-2">Password Reset!</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Your password has been reset successfully. You can now sign in
                    with your new password.
                </p>
                <Link
                    href="/login"
                    className="block w-full py-1.5 a-button-primary text-sm font-medium rounded-sm text-center"
                >
                    Sign in
                </Link>
            </div>
        );
    }

    // Form state
    return (
        <>
            <h1 className="text-2xl font-normal mb-2">Create new password</h1>
            <p className="text-sm text-gray-600 mb-4">
                Enter your new password below.
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-sm text-sm text-red-700">
                    <Info className="w-4 h-4 inline mr-1" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-bold mb-1"
                    >
                        New password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="At least 6 characters"
                            className="w-full px-2 py-1.5 pr-10 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        <Info className="w-3 h-3 inline mr-1" />
                        Passwords must be at least 6 characters.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-bold mb-1"
                    >
                        Re-enter new password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-sm">
                    <Link
                        href="/login"
                        className="text-amazon-blue hover:text-amazon-orange hover:underline"
                    >
                        ← Back to Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
            {/* Logo */}
            <div className="mb-4">
                <Link href="/" className="flex items-center">
                    <span className="text-3xl font-bold tracking-tighter text-black">
                        gadgets
                        <span className="italic text-amazon-secondary">BD</span>
                    </span>
                </Link>
            </div>

            {/* Reset Password Card */}
            <div className="w-full max-w-[350px] p-6 a-box mb-6">
                <Suspense
                    fallback={
                        <div className="text-center py-8 text-sm text-gray-500">
                            Loading...
                        </div>
                    }
                >
                    <ResetPasswordForm />
                </Suspense>
            </div>

            {/* Footer */}
            <footer className="mt-auto w-full border-t border-gray-300 bg-gray-50">
                <div className="max-w-[1000px] mx-auto py-6 px-4 text-center text-xs text-gray-600">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="#" className="text-amazon-blue hover:underline">
                            Conditions of Use
                        </Link>
                        <Link href="#" className="text-amazon-blue hover:underline">
                            Privacy Notice
                        </Link>
                        <Link href="#" className="text-amazon-blue hover:underline">
                            Help
                        </Link>
                    </div>
                    <p className="text-gray-500">
                        &copy; 2026 Gadgets BD - Premium Tech Marketplace. All rights
                        reserved by LWS.
                    </p>
                </div>
            </footer>
        </div>
    );
}
