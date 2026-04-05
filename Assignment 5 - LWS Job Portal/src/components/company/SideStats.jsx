import { Building2 } from "lucide-react";
import { useStats } from "../../hooks/company/useStats";
import { formatDate } from "../../utils";

const SideStats = ({ date }) => {
  const { data, isLoading } = useStats();
  if (isLoading)
    return <h1 className="text-center font-bold text-8xl">Loading...</h1>;

  const { activeJobs, pendingReviews, shortLists, totalApplicants } = data.data;

  return (
    <div className="card p-6 mt-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          <Building2 className="h-10 w-10 text-white"></Building2>
        </div>
        <h3 className="font-semibold mb-1">TechCorp Solutions</h3>
        <p className="text-xs text-[hsl(var(--color-muted-foreground))] mb-4">
          Premium Member
        </p>
        <div className="w-full space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[hsl(var(--color-muted-foreground))]">
              Active Jobs
            </span>
            <span className="font-medium">{activeJobs}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--color-muted-foreground))]">
              Total Applicants
            </span>
            <span className="font-medium">{totalApplicants}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--color-muted-foreground))]">
              Member Since
            </span>
            <span className="font-medium">{formatDate(date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideStats;
