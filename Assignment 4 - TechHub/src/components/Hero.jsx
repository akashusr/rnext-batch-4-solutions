export default function Hero() {
    return (
        <section className="soft-card px-6 sm:px-8 py-10 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
                <span className="pill">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Curated tech for 2025
                </span>
                <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-slate-900">
                    Build a setup that feels handcrafted for you.
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                    Premium desktops, laptops, and workstations tuned for
                    creators, engineers, and gamers. Thoughtful thermals, quiet
                    builds, and concierge support.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button className="button-primary px-4 py-3">
                        Shop flagship rigs
                    </button>
                    <button className="button-ghost px-4 py-3">
                        Talk to a build specialist
                    </button>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-semibold">
                            4.9
                        </span>
                        <span>Average customer rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                            24h
                        </span>
                        <span>Rapid build &amp; dispatch</span>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-80">
                <div className="soft-card p-6 h-full">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Trending collections
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                                Creator Pro rigs
                            </span>
                            <span className="text-rose-500 font-semibold">
                                +38%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                                RTX 4090 builds
                            </span>
                            <span className="text-rose-500 font-semibold">
                                Popular
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                                Ultra-light laptops
                            </span>
                            <span className="text-rose-500 font-semibold">
                                Editor pick
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 p-3 rounded-xl bg-rose-50 text-rose-700">
                        Concierge support included on every purchase.
                    </div>
                </div>
            </div>
        </section>
    );
}
