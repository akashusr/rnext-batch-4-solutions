import { Map } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <nav className="flex w-full items-center justify-between px-6 py-6 lg:px-12">
            <Link href={"/"} className="flex items-center gap-2 text-slate-900">
                <Map className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-medium tracking-tight">Wanderlust</span>
            </Link>
        </nav>
    );
}
