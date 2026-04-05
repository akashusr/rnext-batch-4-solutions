import Container from "./Container";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-12">
            <Container className="py-12!">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 className="font-semibold mb-3 text-slate-900">
                            About TechHub
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Your trusted source for premium tech products and
                            cutting-edge electronics.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-slate-900">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Products
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Deals
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-slate-900">
                            Customer Service
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    Returns
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-slate-900"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 text-slate-900">
                            Follow Us
                        </h4>
                        <div className="flex gap-4 text-slate-600">
                            <a
                                href="#"
                                className="hover:text-slate-900"
                            >
                                Twitter
                            </a>
                            <a
                                href="#"
                                className="hover:text-slate-900"
                            >
                                Facebook
                            </a>
                            <a
                                href="#"
                                className="hover:text-slate-900"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-200 pt-8 text-center text-slate-600 text-sm">
                    <p>© 2025 Learn with sumit. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
}
