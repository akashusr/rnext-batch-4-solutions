import { Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import { formatNumber, getCompanyLogoUrl, getDayFromISO } from "../utils";
import ApplyJobModal from "./job-seeker/ApplyJobModal";

export const JobCard = ({ job, myApplications }) => {
  const { mutate: withdraw, isPending } = useWithdrawApplication();
  const { auth } = useAuth();

  const {
    title,
    company,
    createdAt,
    description,
    location,
    salaryMin,
    salaryMax,
    applicants,
    skills,
  } = job;
  const postDate = getDayFromISO(createdAt);
  const [open, setOpen] = useState(false);
  const appliedApplication = myApplications.find(
    (app) => app.job?.id === job.id
  );

  const src = getCompanyLogoUrl(company?.logoUrl);
  const hasApplied = !!appliedApplication;


  return (
    <article className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* <!-- Company Logo --> */}
        <div className="shrink-0">
          <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
            <img src={src} alt="logo" />
          </div>
        </div>

        {/* <!-- Job Details --> */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                <Link to={`/jobs/${job.slug}`} className="hover:underline">
                  {title}
                </Link>
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary font-medium">
                  {company.name}
                </Link>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {postDate} days ago
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="badge badge-secondary">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-primary">
                ${formatNumber(salaryMin)} - ${formatNumber(salaryMax)}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                {applicants} applicants
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/jobs/${job.slug}`}
                className="btn btn-outline text-sm"
              >
                View Details
              </Link>

              {!hasApplied ? (
                <button
                  onClick={() => setOpen(true)}
                  className="btn btn-primary text-sm cursor-pointer"
                  disabled={auth?.user?.data.role !== "USER"}
                >
                  {!auth?.user ? "Sign In to Apply" : "Apply Job"}
                </button>
              ) : (
                <button
                  disabled={isPending}
                  onClick={() => {
                    if (confirm("Withdraw your application?")) {
                      withdraw(appliedApplication.id);
                    }
                  }}
                  className="btn btn-outline text-sm text-red-600 border-red-500 hover:bg-red-50 cursor-pointer"
                >
                  Withdraw
                </button>
              )}

              {open && (
                <ApplyJobModal jobId={job.id} onClose={() => setOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
