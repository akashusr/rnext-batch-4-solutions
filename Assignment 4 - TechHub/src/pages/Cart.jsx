import CartHeader from "../components/CartHeader";
import CartLists from "../components/CartLists";
import Container from "../components/Container";
import OrderSummary from "../components/OrderSummary";

export default function CartPage() {
    return (
        <Container className={"py-10! space-y-8"}>
            <CartHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <CartLists />
                <OrderSummary />
            </div>
        </Container>
    );
}
