export const buildFilterQuery = (categories, prices, ratings) => {
    const params = new URLSearchParams();

    // Add categories
    categories.forEach((category) => {
        params.append("category", category);
    });

    // Add price range
    if (prices.length > 0) {
        const priceRanges = prices.map((priceStr) => {
            if (priceStr === "5000-plus") {
                return { min: 5000, max: Infinity };
            }
            const [min, max] = priceStr.split("-").map((i) => Number(i));
            return { min, max };
        }); // [{min:0, max:499}, {min:500, max:999}, ...]

        const minPrice = Math.min(...priceRanges.map((r) => r.min));
        const maxPrice = Math.max(...priceRanges.map((r) => r.max));

        params.append("minPrice", minPrice);
        if (maxPrice !== Infinity) {
            params.append("maxPrice", maxPrice);
        }
    }

    // Add minimum rating (lowest value if multiple selected)
    if (ratings.length > 0) {
        const minRating = Math.min(...ratings.map((i) => Number(i)));
        params.append("minRating", minRating);
    }

    return params.toString();
};
