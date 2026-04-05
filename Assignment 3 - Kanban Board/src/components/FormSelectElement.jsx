export default function FormSelectElement({
    name,
    label = "Label",
    options = [],
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
            <select
                id={id}
                name={name}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                value={value}
                onChange={onChange}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        style={{ color: option.color }}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
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
