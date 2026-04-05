export default function Loading() {
    return (
        <>
            {/* Hero Skeleton */}
            <header className="relative h-[85vh] min-h-[600px] w-full animate-pulse overflow-hidden bg-slate-300">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 via-slate-600/30 to-slate-700/40" />
                <div className="absolute bottom-0 left-0 flex w-full max-w-4xl flex-col items-start gap-6 p-8 lg:p-16">
                    <div className="h-8 w-28 rounded-full bg-white/30 shadow-lg backdrop-blur-sm"></div>
                    <div className="w-full max-w-2xl space-y-4">
                        <div className="h-12 w-3/4 rounded-lg bg-white/40 shadow-lg"></div>
                        <div className="h-12 w-2/3 rounded-lg bg-emerald-400/50 shadow-lg"></div>
                    </div>
                    <div className="w-full max-w-2xl space-y-3">
                        <div className="h-4 w-full rounded bg-white/30 shadow"></div>
                        <div className="h-4 w-5/6 rounded bg-white/30 shadow"></div>
                    </div>
                </div>
            </header>

            {/* Highlights Section Skeleton */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16 lg:py-32">
                <div className="mb-20 flex flex-col items-start justify-between gap-12 lg:flex-row">
                    <div className="max-w-2xl animate-pulse space-y-4">
                        <div className="h-3 w-40 rounded bg-slate-200"></div>
                        <div className="h-10 w-96 rounded-lg bg-slate-200"></div>
                        <div className="h-10 w-80 rounded-lg bg-slate-200"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-slate-200"></div>
                            <div className="h-4 w-5/6 rounded bg-slate-200"></div>
                        </div>
                    </div>
                </div>

                {/* Grid Features Skeleton */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="mb-6 h-12 w-12 rounded-2xl bg-slate-200"></div>
                            <div className="mb-3 flex items-center justify-between">
                                <div className="h-6 w-32 rounded bg-slate-200"></div>
                                <div className="h-6 w-12 rounded bg-slate-200"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-slate-200"></div>
                                <div className="h-4 w-full rounded bg-slate-200"></div>
                                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Itinerary Section Skeleton */}
            <section className="overflow-hidden bg-emerald-950 px-6 py-24 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                        <div className="animate-pulse space-y-4">
                            <div className="h-3 w-32 rounded bg-emerald-800"></div>
                            <div className="h-10 w-64 rounded-lg bg-emerald-800"></div>
                            <div className="h-10 w-56 rounded-lg bg-emerald-800"></div>
                        </div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-3xl border border-emerald-800/50 bg-emerald-900/50">
                                <div className="aspect-[16/9] w-full animate-pulse bg-emerald-800/50"></div>
                                <div className="animate-pulse space-y-4 p-8">
                                    <div className="h-7 w-48 rounded bg-emerald-800/50"></div>
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, j) => (
                                            <div key={j} className="flex gap-4">
                                                <div className="h-4 w-16 rounded bg-emerald-800/50"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 w-3/4 rounded bg-emerald-800/50"></div>
                                                    <div className="h-3 w-1/2 rounded bg-emerald-800/50"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
