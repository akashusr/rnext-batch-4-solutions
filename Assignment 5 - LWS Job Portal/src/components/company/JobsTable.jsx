import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CompanyJobContext } from "../../context";
import { useCompanyJobs } from "../../hooks/company/useCompanyJobs";
import { useDeleteJob } from "../../hooks/company/useDeleteJob";
import { useUpdateJobStatus } from "../../hooks/company/useUpdateJobStatus";
import { formatDate } from "../../utils";
import UpdateJobModal from "./UpdateJobModal";

const JobsTable = () => {
  const { filters, setFilters } = useContext(CompanyJobContext);
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data, isLoading } = useCompanyJobs(filters);
  const deleteJob = useDeleteJob();
  const updateJobStatus = useUpdateJobStatus();

  const jobs = data?.data || [];
  const total = data?.count || 0;
  const currentPage = filters.page || 1;
  const limit = data?.limit || 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setSelected([]);
  }, [data]);

  const setPage = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const toggleSelect = (jobId) => {
    setSelected((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleDelete = (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!ok) return;

    deleteJob.mutate(id);
  };

  const toggleSelectAll = () => {
    if (selected.length === jobs.length) setSelected([]);
    else setSelected(jobs.map((j) => j.id));
  };

  const handleBulkAction = async (actionType) => {
    if (selected.length === 0) return;

    if (actionType === "delete") {
      const ok = window.confirm(
        `Are you sure you want to delete ${selected.length} job${
          selected.length > 1 ? "s" : ""
        }? This action cannot be undone.`
      );
      if (!ok) return;

      try {
        for (const id of selected) {
          await deleteJob.mutateAsync(id);
        }
        setSelected([]);
      } catch (error) {
        console.error("Bulk delete failed", error);
      }
    } else if (actionType === "activate" || actionType === "deactivate") {
      const status = actionType === "activate" ? "ACTIVE" : "INACTIVE";
      const ok = window.confirm(
        `Are you sure you want to ${actionType} ${selected.length} job${
          selected.length > 1 ? "s" : ""
        }?`
      );
      if (!ok) return;

      try {
        for (const id of selected) {
          await updateJobStatus.mutateAsync({ id, status });
        }
        setSelected([]);
      } catch (error) {
        console.error("Bulk status update failed", error);
      }
    }
  };

  if (isLoading)
    return <p className="p-5 text-center">Loading company jobs...</p>;

  return (
    <div className="card overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[hsl(var(--color-muted))] border-b border-[hsl(var(--color-border))]">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={selected.length === jobs.length && jobs.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-[hsl(var(--color-input))]"
                />
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium">
                Job Title
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium">
                Applicants
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium">
                Posted Date
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium">
                Expires
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[hsl(var(--color-border))]">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-[hsl(var(--color-accent))] transition-colors"
              >
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selected.includes(job.id)}
                    onChange={() => toggleSelect(job.id)}
                    className="rounded border-[hsl(var(--color-input))]"
                  />
                </td>

                {/* Job Title */}
                <td className="py-4 px-6">
                  <div>
                    <Link
                      to={`/job-details/${job.id}`}
                      className="font-medium hover:text-[hsl(var(--color-primary))]"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(var(--color-muted-foreground))]">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <span
                    className={`badge ${
                      job.status === "ACTIVE"
                        ? "badge-success"
                        : "badge-secondary"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>

                {/* Applicants */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{job.applicants}</span>
                  </div>
                </td>

                {/* Posted Date */}
                <td className="py-4 px-6 text-sm text-[hsl(var(--color-muted-foreground))]">
                  {formatDate(job.createdAt)}
                </td>

                {/* Expires */}
                <td className="py-4 px-6 text-sm text-[hsl(var(--color-muted-foreground))]">
                  {job.deadline && formatDate(job.deadline)}
                  {!job.deadline && ('No Deadline')}
                </td>

                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="btn-ghost p-2 cursor-pointer"
                      title="Edit"
                      onClick={() => {
                        setSelectedJob(job);
                        setOpenModal(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      className="btn-ghost cursor-pointer p-2 text-red-600"
                      title="Delete"
                      onClick={() => handleDelete(job.id)}
                      disabled={deleteJob.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {jobs.length === 0 && (
              <tr>
                <td colSpan="7" className="py-6 text-center text-sm">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="p-4 bg-[hsl(var(--color-accent))] border-t border-[hsl(var(--color-border))] sticky bottom-0 z-10 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selected.length} {selected.length === 1 ? "job" : "jobs"}{" "}
              selected
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="btn btn-outline bg-white text-sm h-9"
                disabled={deleteJob.isPending || updateJobStatus.isPending}
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("activate")}
                className="btn btn-outline bg-white text-sm h-9"
                disabled={deleteJob.isPending || updateJobStatus.isPending}
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="btn btn-outline text-sm h-9 text-red-600 hover:bg-red-50"
                disabled={deleteJob.isPending || updateJobStatus.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="p-4 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[hsl(var(--color-muted-foreground))]">
            {total > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-[hsl(var(--color-foreground))]">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-[hsl(var(--color-foreground))]">
                  {Math.min(currentPage * limit, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[hsl(var(--color-foreground))]">
                  {total}
                </span>{" "}
                jobs
              </>
            ) : (
              "No jobs to display"
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline h-9 px-3 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Render limited page buttons if totalPages is high */}
              {[...Array(totalPages)].map((_, idx) => {
                const pageNumber = idx + 1;
                // Logic to only show current, first, last, and surrounding pages
                if (
                  totalPages <= 5 ||
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={idx}
                      className={`btn h-9 min-w-[36px] px-3 transition-colors ${
                        currentPage === pageNumber
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return (
                    <span key={idx} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                className="btn btn-outline h-9 px-3 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Update Job Modal */}
      {openModal && (
        <UpdateJobModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          job={selectedJob}
        />
      )}
    </div>
  );
};

export default JobsTable;
