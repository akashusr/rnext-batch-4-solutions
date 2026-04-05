import useRoute from "../hooks/useRoute";
import ArrowRightIcon from "./icons/ArrowRightIcon";

export default function CartHeader() {
    const { setRoute } = useRoute();

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                    Your bag
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                    Shopping Cart
                </h1>
            </div>
            <button
                onClick={() => setRoute("/")}
                className="text-sm font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
            >
                <span>Continue shopping</span>
                <ArrowRightIcon />
            </button>
        </div>
    );
}
