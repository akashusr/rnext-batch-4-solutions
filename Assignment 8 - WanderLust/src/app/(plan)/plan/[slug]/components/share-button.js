"use client";

import { Share2 } from "lucide-react";

export default function ShareButton() {
    const handleShare = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    };

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-50">
                <Share2 className="h-4 w-4" />
                Share
            </button>
        </div>
    );
}
