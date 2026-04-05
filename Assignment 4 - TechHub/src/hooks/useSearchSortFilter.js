import { useContext } from "react";
import { SearchSortFilterContext } from "../contexts";

export default function useSearchSortFilter() {
    const context = useContext(SearchSortFilterContext);
    if (!context) {
        throw new Error(
            "useFilterAndSearch must be used within a SearchSortFilterContextProvider"
        );
    }
    return context;
}
