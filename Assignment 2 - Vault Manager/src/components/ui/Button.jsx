export default function Button({
    children,
    onBtnClick,
    type = "button",
    style = "primary",
}) {
    const btnStyles = {
        primary:
            "border border-neutral-700 text-neutral-200 hover:border-neutral-500 hover:text-white",
        secondary: "bg-blue-600 text-white hover:bg-blue-500",
        tertiary:
            "inline-flex items-center gap-2 rounded-2xl border border-neutral-800/80 bg-neutral-900/80 px-4! py-2! text-xs! font-semibold uppercase tracking-wide text-neutral-300 transition hover:border-blue-500 hover:text-white",
    };
    return (
        <button
            type={type}
            className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition md:w-auto cursor-pointer ${btnStyles[style]}`}
            onClick={onBtnClick}
        >
            {children}
        </button>
    );
}
