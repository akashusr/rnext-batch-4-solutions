"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }) {
    const router = useRouter();

    return (
        <div className="flex h-screen w-full items-center justify-center py-12">
            <div className="w-full max-w-md">
                {/* Error Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-red-100 p-4">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-center text-2xl font-bold text-slate-900">
                        Oops! Something went wrong
                    </h1>

                    {/* Error Message */}
                    <p className="mb-6 text-center text-slate-600">
                        {error.message || "We encountered an unexpected error. Please try again."}
                    </p>

                    {/* Retry Button */}
                    <button
                        onClick={reset}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95">
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </button>

                    {/* Home Link */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => router.back()}
                            className="text-sm text-emerald-600 transition-colors hover:text-emerald-700 hover:underline">
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Additional Help Text */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    If the problem persists, please refresh the page or contact support.
                </p>
            </div>
        </div>
    );
}
