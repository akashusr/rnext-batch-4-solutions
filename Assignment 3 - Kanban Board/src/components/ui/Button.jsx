export default function Button({
    variant = "primary",
    type = "button",
    className = "",
    children,
    ...props
}) {
    const style = {
        primary:
            "inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 cursor-pointer",
        outline:
            "inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer",
        danger: "inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-500 cursor-pointer",
        badge: "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer relative",
        list: "w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer",
    };
    return (
        <button
            type={type}
            className={`${style[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
