export default function ProductSkeleton({ items = 5 }) {
    return (
        <>
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    className="soft-card overflow-hidden"
                >
                    <div className="aspect-square bg-slate-100 animate-pulse" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                        <button
                            className="w-full bg-slate-200 text-white py-2 rounded-lg font-medium mt-2 animate-pulse"
                            disabled=""
                        />
                    </div>
                </div>
            ))}
        </>
    );
}
