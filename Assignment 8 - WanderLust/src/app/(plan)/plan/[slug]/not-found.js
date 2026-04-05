import { MapPinOff } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-500 to-emerald-500/30 px-6">
            <div className="text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="rounded-full bg-emerald-100 p-6">
                        <MapPinOff className="h-16 w-16 text-emerald-600" />
                    </div>
                </div>

                {/* Error Code */}
                <h1 className="mb-4 text-7xl font-bold text-slate-900">404</h1>

                {/* Title */}
                <h2 className="mb-4 text-3xl font-medium tracking-tight text-slate-900">
                    Travel Plan Not Found
                </h2>

                {/* Description */}
                <p className="mb-8 max-w-md text-lg text-slate-600">
                    Sorry, we couldn&apos;t find the travel plan you&apos;re looking for. It might
                    have been removed or the link is incorrect.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl">
                        <span>Create New Plan</span>
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50">
                        <span>Go Home</span>
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-300"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 delay-75"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 delay-150"></div>
                </div>
            </div>
        </div>
    );
}
