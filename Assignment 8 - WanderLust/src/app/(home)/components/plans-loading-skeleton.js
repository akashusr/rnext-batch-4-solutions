export default function PlansLoadingSkeleton() {
    return (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 md:aspect-[3/4]">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Top Badge Skeleton */}
                    <div className="absolute right-4 top-4 h-7 w-24 animate-pulse rounded-full bg-slate-200/50 backdrop-blur-md" />

                    {/* Bottom Content Skeleton */}
                    <div className="absolute bottom-0 left-0 w-full space-y-3 p-6">
                        {/* Title Skeleton */}
                        <div className="space-y-2">
                            <div className="h-7 w-3/4 animate-pulse rounded-lg bg-slate-200/70" />
                            <div className="h-7 w-1/2 animate-pulse rounded-lg bg-slate-200/70" />
                        </div>
                        {/* Description Skeleton */}
                        <div className="space-y-1.5">
                            <div className="h-4 w-full animate-pulse rounded bg-slate-200/50" />
                            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200/50" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
