import React from "react";
import Filter from "../assets/Filter";
import { getWebsiteName } from "../utils";
import Button from "./ui/Button";

const sortOptions = [
    { label: "Date - Ascending", value: "date-asc" },
    { label: "Date - Descending", value: "date-desc" },
    { label: "Username - A to Z", value: "name-asc" },
    { label: "Username - Z to A", value: "name-desc" },
    {
        label: "Category - A to Z",
        value: "category-asc",
    },
    {
        label: "Category - Z to A",
        value: "category-desc",
    },
    {
        label: "Domain Name - A to Z",
        value: "dname-asc",
    },
    {
        label: "Domain Name - Z to A",
        value: "dname-desc",
    },
];

export default function SortPassword({
    vaults = [],
    mutateVaults,
    setMutateVaults,
}) {
    const [isSortMenuOpen, setIsSortMenuOpen] = React.useState(false);

    function handleSort(sortType) {
        let sortedVaults;
        if (mutateVaults !== null) {
            sortedVaults = structuredClone(mutateVaults);
        } else {
            sortedVaults = structuredClone(vaults);
        }
        switch (sortType) {
            case "date-asc":
                sortedVaults.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                break;
            case "date-desc":
                sortedVaults.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            case "category-asc":
                sortedVaults.sort((a, b) => {
                    const categoryA = a.category.toLowerCase();
                    const categoryB = b.category.toLowerCase();
                    return categoryA.localeCompare(categoryB);
                });
                break;
            case "category-desc":
                sortedVaults.sort((a, b) => {
                    const categoryA = a.category.toLowerCase();
                    const categoryB = b.category.toLowerCase();
                    return categoryB.localeCompare(categoryA);
                });
                break;
            case "name-asc":
                sortedVaults.sort((a, b) => {
                    const nameA = a.username.toLowerCase();
                    const nameB = b.username.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
            case "name-desc":
                sortedVaults.sort((a, b) => {
                    const nameA = a.username.toLowerCase();
                    const nameB = b.username.toLowerCase();
                    return nameB.localeCompare(nameA);
                });
                break;
            case "dname-asc":
                sortedVaults.sort((a, b) => {
                    const domainA = getWebsiteName(a.url).toLowerCase();
                    const domainB = getWebsiteName(b.url).toLowerCase();
                    return domainA.localeCompare(domainB);
                });
                break;
            case "dname-desc":
                sortedVaults.sort((a, b) => {
                    const domainA = getWebsiteName(a.url).toLowerCase();
                    const domainB = getWebsiteName(b.url).toLowerCase();
                    return domainB.localeCompare(domainA);
                });
                break;
            default:
                break;
        }
        setMutateVaults(sortedVaults);
        setIsSortMenuOpen(false);
    }

    return (
        <div className="relative flex flex-wrap gap-2">
            <Button
                style="tertiary"
                onBtnClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
                <Filter />
                Sort by
            </Button>
            <div
                className={`min-w-48 rounded-2xl border border-neutral-800 bg-neutral-950 backdrop-blur-2xl p-3 text-white transition focus:bg-neutral-950 flex flex-col gap-2 items-start absolute top-11 right-0 origin-top ${
                    isSortMenuOpen
                        ? "h-auto scale-y-100"
                        : "h-0 scale-y-0 overflow-hidden"
                }`}
            >
                {sortOptions?.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => handleSort(value)}
                        className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
