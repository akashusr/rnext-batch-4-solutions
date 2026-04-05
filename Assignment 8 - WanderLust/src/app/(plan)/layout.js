import Footer from "./plan/[slug]/components/footer";
import Header from "./plan/[slug]/components/header";

export default function PlanGroupLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
