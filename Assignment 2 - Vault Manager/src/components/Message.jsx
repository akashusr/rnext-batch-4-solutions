export default function Message({ message, hasError }) {
    return (
        <span
            className={`text-xs ${
                hasError ? "text-red-500" : "text-neutral-500"
            }`}
        >
            {message}
        </span>
    );
}
