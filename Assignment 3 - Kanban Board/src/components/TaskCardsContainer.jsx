export default function TaskCardsContainer({ children }) {
    return (
        <div className="space-y-4 flex-1 overflow-visible lg:overflow-y-auto">
            {children}
        </div>
    );
}
