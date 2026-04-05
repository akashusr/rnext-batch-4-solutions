import { Link, Links } from "react-router-dom";
import { formatNumber, scrollToTop } from "../utils";

export const SimilarJobCard = ({ job }) => {

  return (
    <article className="border-b border-[hsl(var(--color-border))] pb-4 last:border-0 last:pb-0">
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="h-12 w-12 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
            <img src={job.company.logoUrl} alt="logo" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">
            <Link to="job-details.html" className="hover:underline">
              {job.title}
            </Link>
          </h3>
          <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-2">
            {job.company.name} • {job.company.location} • {job.workMode}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[hsl(var(--color-primary))]">
              ${formatNumber(job.salaryMin)} - ${formatNumber(job.salaryMax)}
            </span>
            <Link
              to={`/jobs/${job.slug}`}
              onClick={scrollToTop()}
              className="text-sm text-[hsl(var(--color-primary))] hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
