import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  MapPin,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyApplications } from "../../hooks/useMyApplications";
import { useWithdrawApplication } from "../../hooks/useWithdrawApplication";
import { formatDate, formatNumber, getStatusColor } from "../../utils";

const STATUS_MAP = {
  "Under Review": "New",
  Shortlisted: "Shortlisted",
  Rejected: "Rejected",
};

const DATE_MAP = {
  all: undefined,
  "7days": "last 7 days",
  "30days": "last 30 days",
  "3months": "last 3 months",
};

const AppliedJobsPage = () => {
  const [filters, setFilters] = useState({
    status: [],
    dateRange: "all",
    sort: "Newest First",
  });
  const { mutate: withdraw, isPending } = useWithdrawApplication();

  const [showSort, setShowSort] = useState(false);

  const { data, isLoading, isError } = useMyApplications({
    status: filters.status.map((s) => STATUS_MAP[s]).join(","),
    date: DATE_MAP[filters.dateRange],
    sort: filters.sort,
  });

  const toggleStatus = (value) => {
    setFilters((prev) => {
      const exists = prev.status.includes(value);
      return {
        ...prev,
        status: exists
          ? prev.status.filter((s) => s !== value)
          : [...prev.status, value],
      };
    });
  };

  const handleDateChange = (value) => {
    setFilters((prev) => ({ ...prev, dateRange: value }));
  };

  const handleSort = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setShowSort(false);
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      dateRange: "all",
      sort: "newest first",
    });
  };

  if (isLoading) return <div className="card p-6">Loading...</div>;
  if (isError) return <div className="card p-6">Failed to load.</div>;

  const apps = data || [];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/user-dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Applied Jobs</span>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Applied Jobs</h1>
          <span className="text-sm text-muted-foreground">
            {apps.length} applications
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-semibold mb-4">Filters</h2>

            {/* Status */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Status</h3>
              {["Under Review", "Shortlisted", "Rejected"].map((s) => (
                <label key={s} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(s)}
                    onChange={() => toggleStatus(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>

            {/* Date */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Application Date</h3>
              {[
                { label: "All Time", value: "all" },
                { label: "Last 7 Days", value: "7days" },
                { label: "Last 30 Days", value: "30days" },
                { label: "Last 3 Months", value: "3months" },
              ].map((d) => (
                <label key={d.value} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="date"
                    checked={filters.dateRange === d.value}
                    onChange={() => handleDateChange(d.value)}
                  />
                  <span className="text-sm">{d.label}</span>
                </label>
              ))}
            </div>

            <button onClick={resetFilters} className="btn btn-outline w-full">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Sort */}
          <div className="flex justify-end mb-4 relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="btn btn-outline h-9 flex items-center gap-2"
            >
              {filters.sort === "Newest First"
                ? "Newest First"
                : "Oldest First"}
              <ChevronDown className="h-4 w-4" />
            </button>

            {showSort && (
              <div className="absolute top-10 right-0 card p-2 w-40 z-10">
                <button
                  onClick={() => handleSort("Newest First")}
                  className="w-full text-left px-3 py-2 hover:bg-accent rounded"
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSort("Oldest First")}
                  className="w-full text-left px-3 py-2 hover:bg-accent rounded"
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="card p-6">
            {apps.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You have not applied to any jobs yet.
              </p>
            )}

            <div className="space-y-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 flex gap-6 border-gray-200"
                >
                  <Briefcase className="h-6 w-6 text-primary" />

                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <Link
                        to={`/job/${app.job?.id}`}
                        className="font-semibold hover:underline"
                      >
                        {app.job?.title}
                      </Link>
                      <span
                        className={`badge badge-${getStatusColor(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {app.job?.company?.name}
                    </p>

                    <div className="flex justify-between">
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.job?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(app.createdAt)}
                        </span>
                        <div className="flex justify-center items-center">
                          <span className="text-center">
                            ${formatNumber(app.job?.salaryMin)} - $
                            {formatNumber(app.job?.salaryMax)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <Link
                          to={`/jobs/${app?.job?.slug}`}
                          className="btn btn-outline text-sm h-9 cursor-pointer"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          View Job
                        </Link>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to withdraw this application?"
                              )
                            ) {
                              withdraw(app.id);
                            }
                          }}
                          disabled={isPending}
                          className="btn btn-outline text-sm h-9 cursor-pointer text-red-600 border-red-500 hover:bg-red-50"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AppliedJobsPage;
