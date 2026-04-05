"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <div className="p-2 pt-3">
            <button
                type="submit"
                className="rounded-xl bg-slate-900 p-3.5 text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg group-focus-within:bg-emerald-600"
                disabled={pending}>
                {pending ? (
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                ) : (
                    <ArrowRight className="h-6 w-6" />
                )}
            </button>
        </div>
    );
}
