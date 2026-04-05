import { Map } from "lucide-react";
import Link from "next/link";
import ShareButton from "./share-button";

export default function Header() {
    return (
        <nav className="absolute left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 text-white lg:px-12">
            <Link href="/">
                <div className="flex items-center gap-2">
                    <Map className="h-6 w-6" />
                    <span className="text-lg font-medium tracking-tight">Wanderlust</span>
                </div>
            </Link>
            <ShareButton />
        </nav>
    );
}
