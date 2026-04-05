import { ProductContext } from "../contexts";
import useData from "../hooks/useData";
import useDebounce from "../hooks/useDebounce";
import useSearchSortFilter from "../hooks/useSearchSortFilter";
import { sortProducts } from "../utils/sorting";

export default function ProductContextProvider({ children }) {
    const { query, search, sortBy } = useSearchSortFilter();
    const debouncedSearch = useDebounce(search, 300);
    // derive endpoint based on query and search
    let endpoint = "/products";
    if (debouncedSearch) {
        endpoint += `/search?q=${encodeURIComponent(debouncedSearch)}`;
    } else if (query) {
        endpoint += `/filter?${query}`;
    }

    const { data, loading, error } = useData(endpoint);

    const products = sortProducts(data?.data, sortBy);

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}
