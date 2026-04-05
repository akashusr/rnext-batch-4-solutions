import useProduct from "../hooks/useProduct";
import useSearchSortFilter from "../hooks/useSearchSortFilter";

export default function ProductSorting() {
    const { products } = useProduct();
    const { sortBy, setSortBy } = useSearchSortFilter();

    return (
        <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
                Showing {products.length || 0} products
            </p>
            <div className="flex items-center gap-2">
                <label
                    htmlFor="sort"
                    className="text-sm font-medium text-slate-700"
                >
                    Sort by:
                </label>
                <select
                    id="sort"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
}
