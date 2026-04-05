export default function Input({
    value,
    onInputChange,
    name,
    placeholder,
    type = "text",
    inputClass,
    ...props
}) {
    return (
        <input
            value={value}
            onChange={onInputChange}
            name={name}
            placeholder={placeholder}
            type={type}
            className={`w-full bg-transparent text-base text-white placeholder:text-neutral-500 focus:outline-none ${inputClass}`}
            {...props}
        />
    );
}
