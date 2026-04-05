import { useState } from "react";
import useCart from "../hooks/useCart";
import CrossIcon from "./icons/CrossIcon";

export default function Cart({ cart = {} }) {
    const { handleUpdateCart, handleDeleteCart } = useCart();

    const product = cart.product || {};
    const [quantity, setQuantity] = useState(cart.quantity || 1);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1 || newQuantity > product.stock) return;

        handleUpdateCart(cart.id, product.id, newQuantity, setQuantity);
    };

    return (
        <div className="soft-card p-4 flex gap-4">
            <img
                src={`${import.meta.env.VITE_API_URL}/${product.image}`}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-lg bg-slate-100"
            />
            <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="font-semibold text-lg text-slate-900">
                            {product.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            SKU: APP-MP-001 · {product.category}
                        </p>
                    </div>
                    <button
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        aria-label="Remove"
                        onClick={() => handleDeleteCart(cart.id)}
                    >
                        <CrossIcon />
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-rose-300 cursor-pointer disabled:cursor-not-allowed"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity === 1}
                        >
                            −
                        </button>
                        <span className="text-sm font-semibold">
                            {quantity}
                        </span>
                        <button
                            className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-rose-300 cursor-pointer disabled:cursor-not-allowed"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity === product.stock}
                        >
                            +
                        </button>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">
                        ${(product.price * quantity).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
