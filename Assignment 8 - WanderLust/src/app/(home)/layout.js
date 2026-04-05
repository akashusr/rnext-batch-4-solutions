import Footer from "./components/footer";
import Header from "./components/header";

export default function HomeLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
