export default function Label({ children, label, hasError = false }) {
    return (
        <label
            className={`flex flex-col gap-3 rounded-2xl border bg-neutral-900/60 p-5 text-sm transition  focus-within:bg-neutral-900 focus-within:shadow-lg ${
                hasError
                    ? "border-red-500 focus-within:border-red-500 focus-within:shadow-red-500/10"
                    : "border-neutral-800 focus-within:border-blue-500 focus-within:shadow-blue-500/10"
            }`}
        >
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {label}
            </span>
            {children}
        </label>
    );
}
