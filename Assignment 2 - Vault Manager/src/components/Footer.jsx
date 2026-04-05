const footerLinks = [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Features", href: "#" },
    { name: "Help & Feedback", href: "#" },
];

export default function Footer() {
    return (
        <footer className="border-t border-neutral-800 mt-12 py-8 px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-4 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-6">
                    {footerLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-white transition"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
                    © Learn with Sumit — All rights reserved
                </p>
            </div>
        </footer>
    );
}
