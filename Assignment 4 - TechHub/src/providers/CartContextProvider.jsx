import { CartContext } from "../contexts";
import useData from "../hooks/useData";
import fetchApi from "../utils/fetchApi";

export default function CartContextProvider({ children }) {
    const { data, setData: setCarts, loading, error } = useData("/cart");
    const carts = data?.data || [];

    const handleAddToCart = async (productId, quantity) => {
        const response = await fetchApi.post("/cart", {
            productId,
            quantity,
        });
        if (response.success) {
            setCarts({ ...data, data: [...carts, response.data] });
        }
    };

    const handleUpdateCart = async (
        cartId,
        productId,
        newQuantity,
        setQuantity
    ) => {
        const response = await fetchApi.put(`/cart/${cartId}`, {
            productId: productId,
            quantity: newQuantity,
        });

        if (response.success) {
            const nextCarts = carts.map((cart) =>
                cart.id === cartId ? response.data : cart
            );
            if (setQuantity) setQuantity(newQuantity);
            setCarts({ ...data, data: nextCarts });
        }
    };

    const handleDeleteCart = async (cartId) => {
        const nextCarts = carts.filter((cart) => cart.id !== cartId);
        const response = await fetchApi.delete(`/cart/${cartId}`);
        if (response.success) {
            setCarts({ ...data, data: nextCarts });
        }
    };

    return (
        <CartContext.Provider
            value={{
                carts,
                handleAddToCart,
                handleUpdateCart,
                handleDeleteCart,
                loading,
                error,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
