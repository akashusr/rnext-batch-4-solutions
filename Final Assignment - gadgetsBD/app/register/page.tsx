"use client";

import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            {/* Logo */}
            <Link href="/" className="mb-6">
                <span className="text-3xl font-bold tracking-tighter text-amazon">
                    gadgets<span className="italic text-amazon-secondary">BD</span>
                </span>
            </Link>

            {/* Registration Form */}
            <div className="w-full max-w-[350px] p-6 a-box mb-6">
                <RegisterForm isModal={false} />
            </div>
        </div>
    );
}
