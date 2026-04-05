import useProduct from "../hooks/useProduct";
import Product from "./Product";
import ProductSkeleton from "./seletons/ProductSkeleton";

export default function ProductLists() {
    const { products, loading, error } = useProduct();

    let content;

    if (loading) {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductSkeleton items={3} />
            </div>
        );
    } else if (error) {
        content = (
            <div className="grid grid-cols-1 gap-6">
                <p className="text-red-500 text-center">{error.message}</p>
            </div>
        );
    } else if (products && products.length > 0) {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Product
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-1 gap-6">
                <p className="text-center">No products available.</p>
            </div>
        );
    }

    return content;
}
