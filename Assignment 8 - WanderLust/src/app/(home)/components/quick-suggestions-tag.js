export default function QuickSuggestionsTag() {
    return (
        <div className="mt-4 flex justify-center gap-3 text-xs font-medium text-slate-500">
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
                ✨ 3 Days in Tokyo
            </span>
            <span className="mt-2 h-1 w-1 rounded-full bg-slate-300" />
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
                🍷 Wine tasting in Tuscany
            </span>
            <span className="mt-2 h-1 w-1 rounded-full bg-slate-300" />
            <span className="cursor-pointer transition-colors hover:text-emerald-600">
                🏔️ Hiking in Patagonia
            </span>
        </div>
    );
}
