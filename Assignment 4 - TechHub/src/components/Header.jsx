import useCart from "../hooks/useCart";
import useRoute from "../hooks/useRoute";
import useSearchSortFilter from "../hooks/useSearchSortFilter";
import Container from "./Container";
import CartIcon from "./icons/CartIcon";
import SearchIcon from "./icons/SearchIcon";

const navItems = [
    { name: "Products", href: "/" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
];

export default function Header() {
    const { setRoute } = useRoute();
    const { carts } = useCart();
    const { search, setSearch, clearFilters } = useSearchSortFilter();

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
            <Container className="flex items-center justify-between">
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setRoute("/")}
                >
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white font-bold">
                        TH
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-semibold text-slate-900 tracking-tight">
                            TechHub
                        </span>
                        <span className="text-xs text-slate-500">
                            Gear for builders &amp; dreamers
                        </span>
                    </div>
                </div>
                <nav>
                    <ul className="hidden md:flex items-center gap-6 text-sm">
                        {navItems.map((item) => (
                            <li
                                key={item.name}
                                className="text-slate-700 hover:text-slate-900 cursor-pointer"
                                onClick={() => setRoute(item.href)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-sm">
                            <SearchIcon />
                            <input
                                type="search"
                                placeholder="Search laptops, GPUs, desktops..."
                                className="bg-transparent text-sm placeholder:text-slate-400 focus:outline-none w-64"
                                value={search}
                                onChange={(e) => {
                                    clearFilters();
                                    setSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setRoute("/cart")}
                        className="relative flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:border-rose-300 cursor-pointer"
                    >
                        <CartIcon />
                        <span className="text-sm font-semibold text-slate-900">
                            Cart
                        </span>
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow">
                            {carts?.length || 0}
                        </span>
                    </button>
                </div>
            </Container>
        </header>
    );
}
