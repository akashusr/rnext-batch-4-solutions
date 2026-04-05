"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        },
        [onDismiss]
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [onKeyDown]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onDismiss}
            />
            {/* Modal Content */}
            <div className="relative z-10 bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-[400px] mx-4">
                <button
                    onClick={onDismiss}
                    className="absolute top-3 right-3 z-20 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
