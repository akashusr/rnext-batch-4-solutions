
import { Lightbulb } from "lucide-react";
import QuickActions from "../../components/job-seeker/QuickActions.jsx";
import RecentApplications from "../../components/job-seeker/RecentApplications";
import RecommendedJobs from "../../components/job-seeker/RecommendedJobs";

const UserDashboard = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-[hsl(var(--color-muted-foreground))]">
          Here's what's happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!-- Main Content Column --> */}

        <div className="lg:col-span-2 space-y-6">
          {/* <!-- Recent Applications --> */}
          <RecentApplications />

          {/* <!-- Recommended Jobs --> */}
          <RecommendedJobs />
        </div>

        {/* <!-- Sidebar Column --> */}

        <div className="lg:col-span-1 space-y-6">
          {/* <!-- Quick Actions --> */}
          <QuickActions />
          {/* <!-- Tips --> */}
          <div className="card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb
                className="h-5 w-5 text-blue-600 shrink-0"
              ></Lightbulb>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Pro Tip
                </h3>
                <p className="text-xs text-blue-700">
                  Applications submitted within 24 hours of posting have a 3x
                  higher response rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;
