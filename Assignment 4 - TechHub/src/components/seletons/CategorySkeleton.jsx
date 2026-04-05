export default function CategorySkeleton({ items = 5 }) {
    return (
        <>
            {Array.from({ length: items }).map((_, index) => (
                <label
                    key={index}
                    className="flex items-center cursor-pointer mb-2.5"
                >
                    <span className="inline-block w-4 h-4 rounded bg-slate-200 animate-pulse"></span>
                    <span className="inline-block flex-1 h-4 bg-slate-200 rounded animate-pulse ml-3 "></span>
                </label>
            ))}
        </>
    );
}
