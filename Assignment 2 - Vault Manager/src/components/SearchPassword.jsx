import Search from "../assets/Search";
import Input from "./ui/Input";

export default function SearchPassword({
    search,
    setSearch,
    vaults,
    setMutateVaults,
}) {
    function handleSearch(value) {
        setSearch(value);
        const filteredVaults = vaults.filter((vault) => {
            const { url, username, category } = vault;
            const searchValue = value.toLowerCase();
            return (
                (url && url.toLowerCase().includes(searchValue)) ||
                (username && username.toLowerCase().includes(searchValue)) ||
                (category && category.toLowerCase().includes(searchValue))
            );
        });
        if (value.length > 0) {
            setMutateVaults(filteredVaults);
        } else {
            setMutateVaults(null);
        }
    }

    return (
        <>
            <label className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Search />
                </span>
                <Input
                    value={search}
                    onInputChange={(e) => handleSearch(e.target.value)}
                    type="text"
                    placeholder="Search saved credentials"
                    inputClass="w-full rounded-2xl border border-neutral-800 bg-neutral-950/60! py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 transition focus:border-blue-500 focus:bg-neutral-950 focus:outline-none"
                />
            </label>
        </>
    );
}
