export default function FormInputElement({
    name,
    label = "Label",
    type = "text",
    id,
    placeholder = "",
    value,
    onChange,
    error,
    ...props
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
                {...props}
            />
            <p
                className={`mt-1 text-sm text-red-600 transition-all duration-200 overflow-hidden ${
                    error
                        ? "max-h-10 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                }`}
            >
                {error}
            </p>
        </div>
    );
}
