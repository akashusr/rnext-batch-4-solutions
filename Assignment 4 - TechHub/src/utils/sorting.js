export function sortProducts(products = [], sortBy = "newest") {
    const sortedProducts = [...products];
    switch (sortBy) {
        case "newest":
            sortedProducts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
        case "oldest":
            sortedProducts.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
        case "priceLowToHigh":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "priceHighToLow":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            sortedProducts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
    }
    return sortedProducts;
}
