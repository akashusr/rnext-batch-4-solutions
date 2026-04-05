import { useState } from "react";
import { SearchSortFilterContext } from "../contexts";
import { buildFilterQuery } from "../utils/buildFilterQuery";

export default function SearchSortFilterContextProvider({ children }) {
    const [search, setSearch] = useState("");

    const [query, setQuery] = useState(""); // To store the filter query string
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);

    const [sortBy, setSortBy] = useState("newest");

    const handleCategoryChange = (category, isChecked) => {
        if (search.length > 0) setSearch("");
        const updatedCategories = isChecked
            ? [...selectedCategories, category]
            : selectedCategories.filter((c) => c !== category);
        setSelectedCategories(updatedCategories);
        const query = buildFilterQuery(
            updatedCategories,
            selectedPrices,
            selectedRatings
        );
        setQuery(query);
    };

    const handlePriceChange = (priceRange, isChecked) => {
        if (search.length > 0) setSearch("");
        const updatedPrices = isChecked
            ? [...selectedPrices, priceRange]
            : selectedPrices.filter((p) => p !== priceRange);
        setSelectedPrices(updatedPrices);
        const query = buildFilterQuery(
            selectedCategories,
            updatedPrices,
            selectedRatings
        );
        setQuery(query);
    };

    const handleRatingChange = (rating, isChecked) => {
        if (search.length > 0) setSearch("");
        const updatedRatings = isChecked
            ? [...selectedRatings, rating]
            : selectedRatings.filter((r) => r !== rating);
        setSelectedRatings(updatedRatings);
        const query = buildFilterQuery(
            selectedCategories,
            selectedPrices,
            updatedRatings
        );
        setQuery(query);
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedPrices([]);
        setSelectedRatings([]);
        setQuery("");
    };

    return (
        <SearchSortFilterContext.Provider
            value={{
                search,
                setSearch,
                query,
                selectedCategories,
                selectedPrices,
                selectedRatings,
                handleCategoryChange,
                handlePriceChange,
                handleRatingChange,
                clearFilters,
                sortBy,
                setSortBy,
            }}
        >
            {children}
        </SearchSortFilterContext.Provider>
    );
}
