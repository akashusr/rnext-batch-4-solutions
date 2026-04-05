export default function Message({ children }) {
    return (
        <p className="text-sm text-gray-500 italic text-center border bg-white rounded-lg border-gray-200 p-4 hover:shadow-md transition-shadow relative">
            {children}
        </p>
    );
}
