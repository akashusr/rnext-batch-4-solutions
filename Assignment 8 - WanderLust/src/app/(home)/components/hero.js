import { Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <div className="animate-fade-in-up mx-auto mb-10 max-w-2xl space-y-4 text-center">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Sparkles className="h-3 w-3" />
                <span>AI-Powered Itineraries</span>
            </div>
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Where do you want to <br />
                go next?
            </h1>
            <p className="text-lg font-normal text-slate-500">
                Describe your dream trip. We&apos;ll handle the logistics, hotels, and hidden gems.
            </p>
        </div>
    );
}
