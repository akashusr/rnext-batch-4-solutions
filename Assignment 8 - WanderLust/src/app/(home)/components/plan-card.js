import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PlanCard({ plan }) {
    return (
        <Link
            href={`/plan/${plan.slug}`}
            className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-3xl md:aspect-[3/4]">
            <Image
                src={plan.backgroundImage}
                alt={plan.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                width={700}
                height={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {plan.days} Days
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="mb-1 text-2xl font-medium leading-tight tracking-tight text-white transition-colors group-hover:text-emerald-200">
                    {plan.title}
                </h3>
                <p className="line-clamp-2 text-sm text-white/70">{plan.description}</p>
            </div>
        </Link>
    );
}
