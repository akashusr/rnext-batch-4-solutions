import { Briefcase, Clock, Edit, Eye, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCompanyJobs } from "../../hooks/company/useCompanyJobs";
import { getDayFromISO } from "../../utils";
import UpdateJobModal from "./UpdateJobModal";

const RecentJobs = () => {
  const { data, isLoading } = useCompanyJobs({ limit: 5 });
  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  if (isLoading)
    return <h1 className="font-bold text-9xl text-center">Loading...</h1>;

  const jobs = data.data;

  return (
    <div className="card">
      <div className="p-6 border-b border-[hsl(var(--color-border))]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Job Posts</h2>
          <Link
            to="/manage-jobs"
            className="text-sm text-[hsl(var(--color-primary))] hover:underline"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="divide-y divide-[hsl(var(--color-border))]">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 hover:bg-[hsl(var(--color-accent))] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  <Link
                    to="#"
                    className="hover:text-[hsl(var(--color-primary))]"
                  >
                    {job.title}
                  </Link>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--color-muted-foreground))]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3"></MapPin>
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3"></Briefcase>
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3"></Clock>
                    Posted {getDayFromISO(job.createdAt)} days ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[hsl(var(--color-muted-foreground))]">
                  <span className="font-semibold text-[hsl(var(--color-foreground))]">
                    {job.applicants}{" "}
                  </span>
                  applicants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/jobs/${job.slug}`}
                  className="btn btn-outline text-xs h-8"
                >
                  <Eye className="h-3 w-3 mr-1"></Eye>
                  View
                </Link>

                <button
                  className="btn btn-outline text-xs h-8"
                  onClick={() => {
                    setSelectedJob(job);
                    setOpenModal(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1"></Edit>
                  Edit
                </button>

                {openModal && (
                  <UpdateJobModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    job={selectedJob}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentJobs;
