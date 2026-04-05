import Footer from "./components/Footer";
import Header from "./components/Header";
import useRoute from "./hooks/useRoute";
import CartPage from "./pages/Cart";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import CartContextProvider from "./providers/CartContextProvider";
import ProductContextProvider from "./providers/ProductContextProvider";
import SearchSortFilterContextProvider from "./providers/SearchSortFilterContextProvider";

export default function App() {
    const { route } = useRoute();

    return (
        <SearchSortFilterContextProvider>
            <ProductContextProvider>
                <CartContextProvider>
                    <Header />
                    <main>
                        {route === "/" && <HomePage />}
                        {route === "/cart" && <CartPage />}
                        {route !== "/" && route !== "/cart" && <NotFoundPage />}
                    </main>
                    <Footer />
                </CartContextProvider>
            </ProductContextProvider>
        </SearchSortFilterContextProvider>
    );
}
