import { getPlans } from "@/utils/get-plans";
import PlanCard from "./plan-card";

export default async function RecentPlans() {
    try {
        const { data: plans } = await getPlans(3);

        if (Array.isArray(plans) && plans.length === 0) {
            return <p className="text-center text-sm text-gray-500">No recent plans available.</p>;
        }

        return (
            <div className="grid w-full animate-[fadeIn_0.8s_ease-out_0.5s_forwards] grid-cols-1 gap-6 opacity-0 md:grid-cols-3">
                {Array.isArray(plans) &&
                    plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
            </div>
        );
    } catch (error) {
        return (
            <div className="text-center">
                <p className="text-sm text-red-500">Failed to load recent plans.</p>
                <p className="text-xs text-gray-400">Please try again later.</p>
            </div>
        );
    }
}
