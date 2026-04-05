import { ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import FilterSearch from "../../components/company/FilterSearch";
import JobsTable from "../../components/company/JobsTable";

const ManageJobs = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* <!-- Page Header --> */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
          <Link
            to="/company-dashboard"
            className="hover:text-[hsl(var(--color-primary))]"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4"></ChevronRight>
          <span className="text-[hsl(var(--color-foreground))]">
            Manage Jobs
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              View and manage all your job postings
            </p>
          </div>
          <Link to="/create-job" className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2"></Plus>
            Create New Job
          </Link>
        </div>
      </div>

      {/* <!-- Filters and Search --> */}
      <FilterSearch />

      {/* <!-- Jobs Table --> */}
      <JobsTable />
    </main>
  );
};

export default ManageJobs;
