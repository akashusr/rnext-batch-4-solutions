import useCart from "../hooks/useCart";

export default function OrderSummary() {
    const { carts } = useCart();

    const subTotal = carts.reduce(
        (total, cart) => total + cart.product.price * cart.quantity,
        0
    );

    return (
        <div className="lg:col-span-1">
            <div className="soft-card p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                {/* Summary */}
                <div className="space-y-3 border-slate-200">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span className="text-emerald-600 font-semibold">
                            Free
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 text-slate-900">
                        <span>Total</span>
                        <span>${subTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
