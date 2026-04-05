import { getPlanBySlug } from "@/utils/get-plan-by-slug";
import { Clock, Croissant, Frame, Lightbulb, Wallet } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
    const slug = (await params).slug;
    const { data: plan } = await getPlanBySlug(slug);

    if (!plan) {
        return {};
    }

    return {
        title: plan.title,
        description: plan.description,
        metadataBase: new URL("https://wanderlust-sage-eight.vercel.app"),
        alternates: {
            canonical: `/plan/${slug}`,
        },
        openGraph: {
            title: plan.title,
            description: plan.description,
            url: `/plan/${slug}`,
            siteName: "Wanderlust",
            locale: "en_US",
            type: "article",
            images: [
                {
                    url: plan.backgroundImage,
                    width: 1200,
                    height: 630,
                    alt: `${plan.title} - Travel Plan`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: plan.title,
            description: plan.description,
            images: [plan.backgroundImage],
        },
    };
};

export default async function Plan({ params: { slug } }) {
    const { data: plan } = await getPlanBySlug(slug);

    if (!plan) return notFound();

    return (
        <>
            {/* Hero Section */}
            <header className="group relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                    src={plan.backgroundImage}
                    alt={`${plan.destination} Landscape`}
                    className="absolute inset-0 h-full w-full scale-105 transform object-cover duration-700 ease-in-out group-hover:scale-100"
                    width={1920}
                    height={1080}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-black/30" />
                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 flex w-full max-w-4xl flex-col items-start gap-6 p-8 lg:p-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white drop-shadow-lg backdrop-blur-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{plan.days} Days</span>
                    </div>
                    <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
                        {/* {plan.destination}: The Ultimate <br /> */}
                        <span className="text-emerald-400">{plan.title}</span>
                    </h1>
                    <p className="max-w-2xl text-lg font-normal leading-relaxed text-gray-50 drop-shadow-lg">
                        {plan.description}
                    </p>
                </div>
            </header>
            {/* Introduction / Highlights & Tips */}
            <section className="mx-auto max-w-7xl px-6 py-20 lg:px-16 lg:py-32">
                <div className="mb-20 flex flex-col items-start justify-between gap-12 lg:flex-row">
                    <div className="max-w-2xl">
                        <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Destination Highlights
                        </span>
                        <h2 className="mb-6 text-4xl font-medium tracking-tight text-slate-900 lg:text-5xl">
                            Essentials for your <br />
                            {plan.destination} Journey
                        </h2>
                        <p className="text-xl leading-relaxed text-slate-500">
                            {plan.destination_highlights_description}
                        </p>
                    </div>
                </div>
                {/* Grid Features (Mapped from Attractions, Tips, Food) */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1,2,3: hightlight Attraction */}
                    {plan.highlights_places.map((highlightPlace) => (
                        <div key={highlightPlace._id} className="group">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 transition-colors group-hover:bg-orange-100">
                                <Frame className="h-6 w-6 text-orange-500" />
                            </div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-xl font-medium tracking-tight text-slate-900">
                                    {highlightPlace.place}
                                </h3>
                                <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                                    {highlightPlace.rating} ★
                                </span>
                            </div>
                            <p className="text-lg leading-relaxed text-slate-500">
                                {highlightPlace.description}
                            </p>
                        </div>
                    ))}
                    {/* Feature 4: Food Experience */}
                    <div className="group">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 transition-colors group-hover:bg-purple-100">
                            <Croissant className="h-6 w-6 text-purple-500" />
                        </div>
                        <h3 className="mb-3 text-xl font-medium tracking-tight text-slate-900">
                            Gastronomy
                        </h3>
                        <p className="text-lg leading-relaxed text-slate-500">{plan.gastronomy}</p>
                    </div>
                    {/* Feature 5: Travel Tips */}
                    <div className="group">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 transition-colors group-hover:bg-yellow-100">
                            <Lightbulb className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-medium tracking-tight text-slate-900">
                            Smart Travel
                        </h3>
                        <p className="text-lg leading-relaxed text-slate-500">
                            {plan.smart_travel}
                        </p>
                    </div>
                    {/* Feature 6: Budget */}
                    <div className="group">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 transition-colors group-hover:bg-rose-100">
                            <Wallet className="h-6 w-6 text-rose-500" />
                        </div>
                        <h3 className="mb-3 text-xl font-medium tracking-tight text-slate-900">
                            Budget Estimate
                        </h3>
                        <p className="text-lg leading-relaxed text-slate-500">
                            {plan.budget_estimate}
                        </p>
                    </div>
                </div>
            </section>
            {/* Dark Section: Itinerary Highlights */}
            <section className="overflow-hidden bg-emerald-950 px-6 py-24 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                        <div>
                            <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-emerald-400">
                                Travel Plan
                            </span>
                            <h2 className="text-4xl font-medium tracking-tight text-white lg:text-5xl">
                                Your {plan.days}-Day <br />
                                {plan.destination} Itinerary
                            </h2>
                        </div>
                    </div>
                    {/* Cards Container (2x2 Grid for 4 Days) */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Day Card */}
                        {plan.travel_plan.map((day) => (
                            <div
                                key={day._id}
                                className="group relative overflow-hidden rounded-3xl border border-emerald-800/50 bg-emerald-900/50 transition-all duration-300 hover:border-emerald-700">
                                <div className="aspect-[16/9] w-full overflow-hidden">
                                    <Image
                                        src={day.place_image}
                                        alt={day.place}
                                        className="h-full w-full object-cover opacity-90 duration-700 group-hover:scale-105"
                                        width={1080}
                                        height={720}
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="mb-4 text-2xl font-medium tracking-tight text-white">
                                        {day.day}: {day.place}
                                    </h3>
                                    {/* Timeline */}
                                    <div className="mb-6 space-y-4">
                                        {day.time_budget.map((activity) => (
                                            <div key={activity._id} className="flex gap-4">
                                                <span className="w-16 whitespace-nowrap pt-0.5 font-mono text-sm text-emerald-400">
                                                    {activity.date}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">
                                                        {activity.activity}
                                                    </p>
                                                    {activity?.note && (
                                                        <p className="text-xs text-emerald-200/60">
                                                            {activity.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
