import { useContext } from "react";
import { CartContext } from "../contexts";

export default function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartContextProvider");
    }
    return context;
}
