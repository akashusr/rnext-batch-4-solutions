export default function Select({
    name,
    value,
    onSelectChange,
    options = [],
    placeholder = "",
}) {
    return (
        <select
            name={name}
            className="w-full bg-transparent text-base text-white outline-none"
            value={value}
            onChange={onSelectChange}
        >
            {placeholder && (
                <option
                    value={""}
                    className="bg-neutral-900 text-white"
                >
                    {placeholder}
                </option>
            )}
            {options?.map((option) => (
                <option
                    key={option.value}
                    className="bg-neutral-900 text-white"
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}
