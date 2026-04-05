import useData from "../hooks/useData";
import useSearchSortFilter from "../hooks/useSearchSortFilter";
import Message from "./Message";
import CategorySkeleton from "./seletons/CategorySkeleton";

const priceOptions = [
    {
        value: "0-2000",
        name: "$0 - $2000",
    },
    {
        value: "2000-5000",
        name: "$2000 - $5000",
    },
    {
        value: "5000-plus",
        name: "$5000+",
    },
];

const ratingOptions = [
    {
        value: "4.5",
        name: "4.5 ⭐ & up",
    },
    {
        value: "4.0",
        name: "4.0 ⭐ & up",
    },
    {
        value: "3.5",
        name: "3.5 ⭐ & up",
    },
];

export default function ProductFilters() {
    const { data, loading, error } = useData("/categories");
    const categories = data?.data || [];
    const {
        selectedCategories,
        selectedPrices,
        selectedRatings,
        handleCategoryChange,
        handlePriceChange,
        handleRatingChange,
        clearFilters,
    } = useSearchSortFilter();

    return (
        <div className="md:col-span-1 space-y-4">
            <div className="soft-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Filters
                    </h3>
                    <button
                        className="text-xs text-rose-500 font-semibold cursor-pointer"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>
                </div>
                {/* Category Filter */}
                <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-slate-700">
                        Category
                    </h4>
                    <div className="space-y-2">
                        {loading && !error && <CategorySkeleton items={7} />}
                        {!loading && error && (
                            <Message variant="error">
                                {error.message || "Failed to load categories."}
                            </Message>
                        )}
                        {!loading && !error && categories.length === 0 ? (
                            <Message variant="info">
                                No categories found.
                            </Message>
                        ) : (
                            categories?.map((category) => (
                                <CheckBoxLabel
                                    key={category.id}
                                    option={category}
                                    isChecked={selectedCategories.includes(
                                        category.name
                                    )}
                                    onChange={(isChecked) => {
                                        handleCategoryChange(
                                            category.name,
                                            isChecked
                                        );
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
                {/* Price Filter */}
                <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-slate-700">
                        Price Range
                    </h4>
                    <div className="space-y-2">
                        {priceOptions.map((price) => (
                            <CheckBoxLabel
                                key={price.value}
                                option={price}
                                isChecked={selectedPrices.includes(price.value)}
                                onChange={(isChecked) => {
                                    handlePriceChange(price.value, isChecked);
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* Rating Filter */}
                <div>
                    <h4 className="font-medium text-sm mb-3 text-slate-700">
                        Rating
                    </h4>
                    <div className="space-y-2">
                        {ratingOptions.map((rating) => (
                            <CheckBoxLabel
                                key={rating.value}
                                option={rating}
                                isChecked={selectedRatings.includes(
                                    rating.value
                                )}
                                onChange={(isChecked) => {
                                    handleRatingChange(rating.value, isChecked);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckBoxLabel({ option, isChecked = false, onChange }) {
    const handleChange = (e) => {
        if (onChange) onChange(e.target.checked);
    };

    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                className="w-4 h-4 text-rose-500 rounded border-slate-300"
            />
            <span className="ml-3 text-sm text-slate-700">{option.name}</span>
        </label>
    );
}
