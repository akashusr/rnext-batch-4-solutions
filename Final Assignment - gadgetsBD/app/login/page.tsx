"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
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

            {/* Login Card */}
            <div className="w-full max-w-[350px] p-6 a-box mb-6">
                <LoginForm isModal={false} />
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
