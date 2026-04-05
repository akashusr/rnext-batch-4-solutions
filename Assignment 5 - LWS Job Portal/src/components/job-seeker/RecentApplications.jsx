import { Briefcase, Calendar, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyApplications } from "../../hooks/useMyApplications";
import { formatDate, formatNumber, getStatusColor } from "../../utils";
import { useWithdrawApplication } from "../../hooks/useWithdrawApplication";


const RecentApplications = () => {
  const { data, isLoading, isError } = useMyApplications({
    sort: "Newest First",
  });
  const { mutate: withdraw, isPending } = useWithdrawApplication();

  if (isLoading) return <div className="card p-6">Loading...</div>;
  if (isError) return <div className="card p-6">Failed to load.</div>;

  const recent = data?.slice(0, 3) || [];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Applications</h2>
        <Link
          to="/applied-jobs"
          className="text-sm text-[hsl(var(--color-primary))] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {recent.length === 0 && (
          <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
            No recent applications found.
          </p>
        )}

        {recent.map((app) => (
          <div
            key={app.id}
            className="border border-[hsl(var(--color-border))] rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-[hsl(var(--color-primary))]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold mb-1">
                      <Link
                        to={`/job/${app.job?.id}`}
                        className="hover:underline"
                      >
                        {app.job?.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                      {app.job.company?.name}
                    </p>
                  </div>

                  <span className={`badge badge-${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--color-muted-foreground))] mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3"></MapPin>
                    {app.job?.location}
                  </span>

                  <span>•</span>

                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3"></Calendar>
                    Applied on {formatDate(app.createdAt)}
                  </span>

                  <span>•</span>
                  <span className="flex items-center">
                    <i data-lucide="dollar-sign" className="h-3 w-3"></i>$
                    {formatNumber(app.job?.salaryMin)} - $
                    {formatNumber(app.job?.salaryMax)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${app.job?.slug}`}
                    className="btn btn-outline text-xs h-8"
                  >
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
  );
};

export default RecentApplications;
