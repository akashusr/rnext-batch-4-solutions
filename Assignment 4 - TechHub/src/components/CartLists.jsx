import useCart from "../hooks/useCart";
import Cart from "./Cart";
import Message from "./Message";
import CartSkeleton from "./seletons/CartSkeleton";

export default function CartLists() {
    const { carts, loading, error } = useCart();

    return (
        <div className="lg:col-span-2">
            <div className="space-y-4">
                {loading && !error && <CartSkeleton items={4} />}
                {!loading && error && (
                    <Message variant="error">
                        {error.message || "Failed to load cart items."}
                    </Message>
                )}
                {!loading &&
                    !error &&
                    carts.length > 0 &&
                    carts.map((cart) => (
                        <Cart
                            key={cart.id}
                            cart={cart}
                        />
                    ))}
                {!loading && !error && carts.length === 0 && (
                    <Message variant="info">
                        Your cart is empty. Start adding some products!
                    </Message>
                )}
            </div>
        </div>
    );
}
