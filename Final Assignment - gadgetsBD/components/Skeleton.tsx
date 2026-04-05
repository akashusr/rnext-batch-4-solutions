export function SkeletonBox({ className = "" }: { className?: string }) {
    return <div className={`animate-skeleton rounded ${className}`} />;
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="animate-skeleton rounded h-3"
                    style={{ width: i === lines - 1 ? "60%" : "100%" }}
                />
            ))}
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex gap-4 p-4 border rounded bg-white">
            <SkeletonBox className="w-48 h-48 shrink-0" />
            <div className="flex-1 space-y-3 py-2">
                <SkeletonBox className="h-5 w-3/4" />
                <SkeletonBox className="h-4 w-1/4" />
                <SkeletonBox className="h-7 w-1/3" />
                <SkeletonBox className="h-4 w-1/2" />
                <SkeletonText lines={2} />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function WishlistCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <SkeletonBox className="w-full h-48" />
            <div className="p-4 space-y-2">
                <SkeletonBox className="h-4 w-3/4" />
                <SkeletonBox className="h-5 w-1/3" />
                <SkeletonBox className="h-9 w-full mt-3" />
            </div>
        </div>
    );
}

export function OrderRowSkeleton() {
    return (
        <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between mb-3">
                <SkeletonBox className="h-4 w-1/4" />
                <SkeletonBox className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-3">
                <SkeletonBox className="w-16 h-16 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                    <SkeletonBox className="h-4 w-2/3" />
                    <SkeletonBox className="h-3 w-1/4" />
                </div>
            </div>
        </div>
    );
}
