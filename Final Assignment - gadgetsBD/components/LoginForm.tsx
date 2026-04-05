"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info, ChevronRight, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
    isModal?: boolean;
}

export default function LoginForm({ isModal = false }: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                if (isModal) {
                    router.back();
                    router.refresh();
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-normal mb-4">Sign in</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-sm text-sm text-red-700">
                    <Info className="w-4 h-4 inline mr-1" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-1">
                        Email or mobile phone number
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

                <div>
                    <div className="flex justify-between mb-1">
                        <label htmlFor="password" className="text-sm font-bold">
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-2 py-1.5 pr-9 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
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
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-1.5 a-button-primary text-sm font-medium rounded-sm cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className="mt-4 text-xs">
                <p>
                    By continuing, you agree to Gadgets BD&apos;s{" "}
                    <Link href="#" className="text-amazon-blue hover:underline">
                        Conditions of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-amazon-blue hover:underline">
                        Privacy Notice
                    </Link>
                    .
                </p>
            </div>

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
                onClick={() => signIn("google", { callbackUrl: "/" })}
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

            {!isModal && (
                <div className="mt-4">
                    <Link
                        href="#"
                        className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline flex items-center gap-1"
                    >
                        <ChevronRight className="w-3 h-3" />
                        Need help?
                    </Link>
                </div>
            )}

            <div className={`${isModal ? "mt-4 pt-4" : "mt-4 pt-4"} border-t border-gray-300`}>
                <p className="text-sm">
                    New to Gadgets BD?{" "}
                    <Link href="/register" className="text-amazon-blue hover:text-amazon-orange hover:underline">
                        Create your account
                    </Link>
                </p>
            </div>
        </>
    );
}
