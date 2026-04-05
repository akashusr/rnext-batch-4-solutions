import { Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecommendedJobs } from "../../hooks/useRecommendedJobs";
import { formatNumber } from "../../utils";
import { useState } from "react";
import ApplyJobModal from "./ApplyJobModal";

const RecommendedJobs = () => {
  const { data, isLoading, isError } = useRecommendedJobs();
  const [open, setOpen] = useState(false);

  if (isLoading) return <div className="card p-6">Loading...</div>;
  if (isError)
    return <div className="card p-6">Failed to load recommendations.</div>;

  const jobs = (data || []).slice(0, 3);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recommended for You</h2>

        <Link
          to="/"
          className="text-sm text-[hsl(var(--color-primary))] hover:underline"
        >
          Browse All Jobs
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
            No recommendations available.
          </p>
        )}

        {jobs.map((job) => (
          <article
            key={job.id}
            className="border border-[hsl(var(--color-border))] rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-20 w-20 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                  <img src={job.company.logoUrl} className="h-10 w-10" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">
                  <Link to={`/jobs/${job.slug}`} className="hover:underline">
                    {job.title}
                  </Link>
                </h3>

                <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
                  {job.company?.name}
                </p>

                <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-3">
                  {(job.description || "").slice(0, 130)}...
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="badge badge-secondary">{job.type}</span>
                  <span className="badge badge-outline">{job.workMode}</span>
                  {job.skills?.slice(0, 3).map((skill) => (
                    <span key={skill} className="badge badge-outline">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[hsl(var(--color-muted-foreground))]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>

                    <span className="font-semibold text-[hsl(var(--color-primary))]">
                      ${formatNumber(job.salaryMin)} - $
                      {formatNumber(job.salaryMax)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/jobs/${job.slug}`}
                      className="btn btn-outline text-xs h-8"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => setOpen(true)}
                      className="btn btn-primary px-4 py-4 text-base cursor-pointer"
                    >
                      Apply Now
                    </button>

                    {open && (
                      <ApplyJobModal
                        jobId={job.id}
                        onClose={() => setOpen(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
