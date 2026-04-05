import SearchPassword from "./SearchPassword";
import SortPassword from "./SortPassword";

export default function SearchSortFilter({
    vaults,
    search,
    setSearch,
    mutateVaults,
    setMutateVaults,
}) {
    return (
        <section className="rounded-3xl border border-neutral-800 bg-linear-to-br from-neutral-900/80 to-neutral-900/40 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <SearchPassword
                    search={search}
                    setSearch={setSearch}
                    vaults={vaults}
                    setMutateVaults={setMutateVaults}
                />
                <SortPassword
                    vaults={vaults}
                    mutateVaults={mutateVaults}
                    setMutateVaults={setMutateVaults}
                />
            </div>
        </section>
    );
}
