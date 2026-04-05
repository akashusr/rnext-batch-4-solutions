import { AlertTriangle, XCircle } from "lucide-react";

interface StockBadgeProps {
    stock: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
    if (stock === 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                <XCircle className="w-3 h-3" />
                Out of Stock
            </span>
        );
    }

    if (stock <= 3) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Only {stock} left — order soon!
            </span>
        );
    }

    if (stock <= 10) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded">
                <AlertTriangle className="w-3 h-3" />
                Only {stock} left in stock
            </span>
        );
    }

    // In stock — no badge needed
    return null;
}
