import { Suspense } from "react";
import Hero from "./components/hero";
import PlansLoadingSkeleton from "./components/plans-loading-skeleton";
import PromptField from "./components/prompt-field";
import RecentPlans from "./components/recent-plans";

export const metadata = {
    title: "Wanderlust - AI Travel Itinerary Planner",
    description:
        "Generate personalized travel itineraries with Wanderlust, your AI-powered trip planning assistant. Create detailed plans for any destination in minutes!",
    metadataBase: new URL("https://wanderlust-sage-eight.vercel.app"),
    openGraph: {
        title: "Wanderlust - AI Travel Itinerary Planner",
        description:
            "Generate personalized travel itineraries with Wanderlust, your AI-powered trip planning assistant. Create detailed plans for any destination in minutes!",
        url: "/",
        siteName: "Wanderlust",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Wanderlust - AI Travel Itinerary Planner",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export default function Home() {
    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 pb-12 pt-20">
            {/* Hero Text */}
            <Hero />
            {/* AI Prompt Field */}
            <PromptField />
            {/* Featured/Recent Cards */}
            <Suspense fallback={<PlansLoadingSkeleton />}>
                <RecentPlans />
            </Suspense>
        </main>
    );
}
