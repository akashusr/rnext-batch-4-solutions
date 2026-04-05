import Container from "../components/Container";
import Hero from "../components/Hero";
import ProductFilters from "../components/ProductFilters";
import ProductLists from "../components/ProductLists";
import ProductSorting from "../components/ProductSorting";

export default function HomePage() {
    return (
        <Container className={"py-12! space-y-10"}>
            <Hero />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ProductFilters />
                <div className={"md:col-span-3"}>
                    <ProductSorting />
                    <ProductLists />
                </div>
            </div>
        </Container>
    );
}
