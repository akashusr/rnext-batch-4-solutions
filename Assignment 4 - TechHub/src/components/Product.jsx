import useCart from "../hooks/useCart";

export default function Product({ product = {} }) {
    const {
        title,
        price,
        description,
        image,
        rating_rate,
        rating_count,
        stock,
        createdAt,
    } = product;

    const { carts, handleAddToCart, handleDeleteCart } = useCart();

    const cartItem = carts.find((cart) => cart.product.id === product.id);

    return (
        <div className="soft-card overflow-hidden hover:-translate-y-1 transition-all">
            <div className="aspect-square bg-linear-to-br from-slate-100 via-white to-rose-50 flex items-center justify-center">
                <img
                    src={`${import.meta.env.VITE_API_URL}/${image}`}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-500">⭐ {rating_rate}</span>
                    <span className="text-slate-500">
                        ({rating_count} reviews)
                    </span>
                </div>
                {/* create date */}
                <p className="text-slate-500 text-sm">
                    Upload on:{" "}
                    <span className="font-semibold">
                        {new Date(createdAt)
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            .replace(",", "")}
                    </span>
                </p>
                <p className="text-slate-600 text-sm line-clamp-2">
                    {description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">
                        ${price}
                    </span>
                    <span className="text-sm text-emerald-600 font-medium">
                        In Stock ({stock})
                    </span>
                </div>
                {cartItem ? (
                    <button
                        onClick={() => handleDeleteCart(cartItem.id)}
                        className="w-full button-ghost py-2.5 rounded-lg font-semibold cursor-pointer"
                    >
                        Remove from Cart
                    </button>
                ) : (
                    <button
                        onClick={() => handleAddToCart(product.id, 1)}
                        className="w-full button-primary py-2.5 rounded-lg font-semibold cursor-pointer"
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}
