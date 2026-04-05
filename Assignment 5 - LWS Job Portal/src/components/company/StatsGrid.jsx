import { Briefcase, Clock, Star, Users } from "lucide-react";
import { useStats } from "../../hooks/company/useStats";

const StatsGrid = () => {
  const { data, isLoading } = useStats();
  if (isLoading)
    return <h1 className="text-center font-bold text-8xl">Loading...</h1>;

  const {
    activeJobs,
    pendingReviews,
    shortLists,
    totalApplicants
  } = data.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* <!-- Stat Card 1 --> */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{activeJobs}</h3>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
          Active Jobs
        </p>
      </div>

      {/* <!-- Stat Card 2 --> */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{totalApplicants}</h3>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
          Total Applicants
        </p>
      </div>

      {/* <!-- Stat Card 3 --> */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Clock className="h-6 w-6 text-yellow-600"></Clock>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{pendingReviews}</h3>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
          Pending Reviews
        </p>
      </div>

      {/* <!-- Stat Card 4 --> */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Star className="h-6 w-6 text-purple-600"></Star>
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-1">{shortLists}</h3>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
          Shortlisted
        </p>
      </div>
    </div>
  );
};

export default StatsGrid;
