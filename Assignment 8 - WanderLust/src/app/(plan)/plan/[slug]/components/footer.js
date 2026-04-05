import { Facebook, Instagram, Map, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white px-6 pb-12 pt-24 lg:px-16">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 md:flex-row">
                <div className="max-w-sm">
                    <div className="mb-6 flex items-center gap-2 text-slate-900">
                        <Map className="h-6 w-6" />
                        <span className="text-lg font-medium tracking-tight">Wanderlust</span>
                    </div>
                    <p className="mb-8 text-lg text-slate-500">
                        Curating the world&apos;s best quick escapes. Plan less, live more.
                    </p>
                    <div className="flex gap-4">
                        <Instagram className="h-6 w-6 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" />
                        <Twitter className="h-6 w-6 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" />
                        <Facebook className="h-6 w-6 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-16">
                    <div>
                        <h4 className="mb-4 font-medium text-slate-900">Company</h4>
                        <ul className="space-y-3 text-lg text-slate-500">
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Press
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-medium text-slate-900">Resources</h4>
                        <ul className="space-y-3 text-lg text-slate-500">
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Destinations
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Travel Guides
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-medium text-slate-900">Legal</h4>
                        <ul className="space-y-3 text-lg text-slate-500">
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="transition-colors hover:text-emerald-600">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-16 flex max-w-7xl justify-between border-t border-slate-100 pt-8 text-sm text-slate-400">
                <p>© 2024 Wanderlust Inc. All rights reserved.</p>
            </div>
        </footer>
    );
}
