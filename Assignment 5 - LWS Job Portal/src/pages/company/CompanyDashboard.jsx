import { Lightbulb, List, Plus, Settings, Users } from "lucide-react";
import RecentApplicants from "../../components/company/RecentApplicants";
import RecentJobs from "../../components/company/RecentJobs";
import StatsGrid from "../../components/company/StatsGrid";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* <!-- Welcome Section --> */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, TechCorp! 👋</h1>
        <p className="text-[hsl(var(--color-muted-foreground))]">
          Here's what's happening with your job postings today
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!-- Main Content Column --> */}
        <div className="lg:col-span-2 space-y-6">
          <RecentJobs />
          <RecentApplicants />
        </div>

        {/* <!-- Sidebar Column --> */}
        <div className="lg:col-span-1 space-y-6">
          {/* <!-- Quick Actions --> */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/create-job" className="btn btn-primary w-full justify-start">
                <Plus className="h-4 w-4 mr-2"></Plus>
                Post New Job
              </Link>
              <Link to="/manage-jobs" className="btn btn-outline w-full justify-start">
                <List className="h-4 w-4 mr-2"></List>
                Manage Jobs
              </Link>
              <Link to="/applicants" className="btn btn-outline w-full justify-start">
                <Users className="h-4 w-4 mr-2"></Users>
                View Applicants
              </Link>
              <Link to="/company-settings" className="btn btn-outline w-full justify-start">
                <Settings className="h-4 w-4 mr-2"></Settings>
                Company Settings
              </Link>
            </div>
          </div>

          {/* <!-- Tips Card --> */}
          <div className="card p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-900">Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Jobs with detailed descriptions get 40% more quality
                  applicants. Keep your postings updated!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompanyDashboard;
