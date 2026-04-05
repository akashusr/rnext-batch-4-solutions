import { X } from "lucide-react";
import { useState } from "react";
import { useApplyJob } from "../../hooks/useApplyJob";

const ApplyJobModal = ({ jobId, onClose }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const { mutate, isPending, isError, error } = useApplyJob();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { jobId, coverLetter },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="card w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Apply for this job</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cover Letter
            </label>
            <textarea
              required
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter explaining why you are a good fit..."
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isError && (
            <p className="text-sm text-red-500">
              {error?.response?.data?.message || "Failed to apply"}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline h-9"
            >
              Cancel
            </button>

            <button type="submit" disabled={isPending} className="btn h-9 p-3 bg-gray-200 cursor-pointer hover:bg-gray-300 transition">
              {isPending ? "Applying..." : "Apply Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
