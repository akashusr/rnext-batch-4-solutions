import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    weights: ["300", "400", "500", "600"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
    metadataBase: new URL("https://wanderlust-sage-eight.vercel.app"),
    title: "Wanderlust - AI Trip Planner",
    description: "Discover your next adventure with Wanderlust.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`relative bg-white text-slate-600 antialiased selection:bg-emerald-100 selection:text-emerald-900 ${inter.className}`}>
                {/* Background Decoration (Subtle Mesh) */}
                <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#ecfdf5_100%)]"></div>
                {children}
            </body>
        </html>
    );
}
