"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-[9998] w-11 h-11 bg-amazon-light text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amazon transition-colors animate-fade-in-up cursor-pointer"
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
