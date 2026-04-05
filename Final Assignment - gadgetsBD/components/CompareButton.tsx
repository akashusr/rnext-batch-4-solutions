"use client";

import { useState, useEffect } from "react";
import { GitCompareArrows } from "lucide-react";
import { useToast } from "@/components/Toast";

const MAX_COMPARE = 3;
const STORAGE_KEY = "gadgets_bd_compare";

function getCompareList(): string[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function setCompareList(ids: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Dispatch event so other CompareButton instances update
    window.dispatchEvent(new Event("compare-updated"));
}

export default function CompareButton({ productId }: { productId: string }) {
    const [isInList, setIsInList] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const update = () => setIsInList(getCompareList().includes(productId));
        update();
        window.addEventListener("compare-updated", update);
        return () => window.removeEventListener("compare-updated", update);
    }, [productId]);

    const toggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent parent <Link> navigation
        e.stopPropagation();
        const list = getCompareList();
        if (list.includes(productId)) {
            setCompareList(list.filter((id) => id !== productId));
        } else {
            if (list.length >= MAX_COMPARE) {
                toast.info(`You can compare up to ${MAX_COMPARE} products at a time.`);
                return;
            }
            setCompareList([...list, productId]);
        }
    };

    return (
        <button
            onClick={toggle}
            title={isInList ? "Remove from compare" : "Add to compare"}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${isInList
                ? "bg-amazon-blue text-white border-amazon-blue"
                : "bg-white text-gray-600 border-gray-300 hover:border-amazon-blue hover:text-amazon-blue"
                }`}
        >
            <GitCompareArrows className="w-3 h-3" />
            {isInList ? "Comparing" : "Compare"}
        </button>
    );
}
