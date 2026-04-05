export default function CartSkeleton({ items = 3 }) {
    return (
        <>
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    className="soft-card p-4 flex gap-4"
                >
                    <div className="w-24 h-24 animate-pulse rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="animate-pulse bg-slate-200 rounded-lg h-5 w-60 mb-1.5"></h3>
                                <p className="animate-pulse bg-slate-200 rounded-lg h-3.5 w-40"></p>
                            </div>
                            <p className="animate-pulse bg-slate-200 rounded-full h-5.5 w-5.5"></p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center animate-pulse"></button>
                                <span className="w-2 h-1 bg-slate-200 animate-pulse"></span>
                                <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center animate-pulse"></button>
                            </div>
                            <span className="inline-block animate-pulse bg-slate-200 rounded-lg h-9 w-20"></span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
