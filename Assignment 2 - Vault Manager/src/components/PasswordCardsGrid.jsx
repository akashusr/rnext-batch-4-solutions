import NotFoundMessage from "./NotFoundMessage";
import PasswordCard from "./PasswordCard";

export default function PasswordCardsGrid({ vaults = [], search }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {search && vaults.length === 0 && (
                <NotFoundMessage>
                    No results found by
                    <span className="italic inline-block ml-1">
                        &quot;{search}&quot;
                    </span>
                </NotFoundMessage>
            )}
            {!search && vaults.length === 0 && (
                <NotFoundMessage>No passwords stored yet.</NotFoundMessage>
            )}
            {vaults.length > 0 &&
                vaults.map((vault) => (
                    <PasswordCard
                        key={vault.id}
                        vault={vault}
                    />
                ))}
        </div>
    );
}
