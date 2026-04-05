"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, CheckCircle, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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

    return (
        <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
            {/* Logo */}
            <div className="mb-4">
                <Link href="/" className="flex items-center">
                    <span className="text-3xl font-bold tracking-tighter text-black">
                        gadgets<span className="italic text-amazon-secondary">BD</span>
                    </span>
                </Link>
            </div>

            {/* Forgot Password Card */}
            <div className="w-full max-w-[350px] p-6 a-box mb-6">
                {success ? (
                    /* Success State */
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
                        <p className="text-sm text-gray-600 mb-4">
                            If an account exists with <strong>{email}</strong>, you will
                            receive a password reset link shortly.
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                            The link will expire in 1 hour. Don&apos;t forget to check your spam folder.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full py-1.5 a-button-primary text-sm font-medium rounded-sm text-center"
                        >
                            Back to Sign in
                        </Link>
                    </div>
                ) : (
                    /* Form State */
                    <>
                        <h1 className="text-2xl font-normal mb-2">Password assistance</h1>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the email address associated with your Gadgets BD account.
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
                                    htmlFor="email"
                                    className="block text-sm font-bold mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Continue"}
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
                )}
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
