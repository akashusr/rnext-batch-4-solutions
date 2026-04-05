import {
  Briefcase,
  Calendar,
  ChevronRight,
  File,
  Loader,
  Mail,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useCompanyApplicants } from "../../hooks/company/useCompanyApplicants";
import { useUpdateApplicationStatus } from "../../hooks/company/useUpdateApplicationStatus";
import { formatDate } from "../../utils";

const STATUS_OPTIONS = [
  "New",
  "Shortlisted",
  "Interviewed",
  "Rejected",
  "Hired",
];

const Applicants = () => {
  // ---------------- FILTER STATE ----------------
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [date, setDate] = useState("last 7 days");
  const [sort, setSort] = useState("newest");
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [activeCoverLetter, setActiveCoverLetter] = useState("");

  // ---------------- DATA ----------------
  const { data, isLoading } = useCompanyApplicants({
    page,
    limit: 6,
    date,
    sort,
    status: status.length ? status.join(",") : undefined,
    experienceLevel: experienceLevel.length
      ? experienceLevel.join(",")
      : undefined,
  });

  const { mutate: updateStatus } = useUpdateApplicationStatus();

  const applicants = data?.data || [];

  // ---------------- HANDLERS ----------------
  const toggleStatus = (value) => {
    setPage(1);
    setStatus((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const toggleExperience = (value) => {
    setPage(1);
    setExperienceLevel((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    );
  };

  const resetFilters = () => {
    setStatus([]);
    setExperienceLevel([]);
    setDate("last 7 days");
    setSort("newest");
    setPage(1);
  };

  // ---------------- UI ----------------
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Applicants</span>
        </div>
        <h1 className="text-3xl font-bold">Job Applicants</h1>
        <p className="text-muted">Review and manage applicants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ---------------- FILTERS ---------------- */}
        <aside className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-red-500 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Application Status</h4>
              {["New", "Shortlisted", "Interviewed", "Rejected"].map((s) => (
                <label key={s} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={status.includes(s)}
                    onChange={() => toggleStatus(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>

            {/* Experience */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Experience</h4>
              {[
                { label: "Entry (0-2 years)", value: "entry" },
                { label: "Mid (3-5 years)", value: "mid" },
                { label: "Senior (5+ years)", value: "senior" },
              ].map((e) => (
                <label key={e.value} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={experienceLevel.includes(e.value)}
                    onChange={() => toggleExperience(e.value)}
                  />
                  <span className="text-sm">{e.label}</span>
                </label>
              ))}
            </div>

            {/* Date */}
            <div>
              <h4 className="text-sm font-medium mb-3">Applied Date</h4>
              {["last 24 hours", "last 7 days", "last 30 days", "all"].map(
                (d) => (
                  <label key={d} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="date"
                      checked={date === d}
                      onChange={() => {
                        setPage(1);
                        setDate(d);
                      }}
                    />
                    <span className="text-sm">{d}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </aside>

        {/* ---------------- LIST ---------------- */}
        <section className="lg:col-span-3 space-y-4">
          {isLoading && (
            <p className="text-center py-10 text-muted">Loading...</p>
          )}

          {!isLoading && applicants.length === 0 && (
            <p className="text-center py-10 text-muted">No applicants found</p>
          )}

          {applicants.map((a) => (
            <div key={a.id} className="card p-6">
              <div className="flex gap-6">
                <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${
                      a.user.profilePictureUrl
                    }`}
                    alt="pic"
                    className="rounded-full"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="font-semibold mb-2">{a.user.name}</h3>
                      <div className="flex gap-3 text-sm text-muted">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Mail className="h-3 w-3" />
                          {a.user.email}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Briefcase className="h-3 w-3" />
                          {a.user.experienceLevel}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(a.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-info">{a.status}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`${import.meta.env.VITE_BASE_URL}${a.resumeUrl}`}
                      className="btn btn-outline text-sm"
                    >
                      <File className="h-3 w-3 mr-1" />
                      Resume
                    </a>

                    <button
                      className="btn btn-outline text-sm bg-gray-200"
                      onClick={() => {
                        setActiveCoverLetter(
                          a.coverLetter || "No cover letter provided."
                        );
                        setIsCoverModalOpen(true);
                      }}
                    >
                      Cover Letter
                    </button>

                    {isCoverModalOpen && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                          {/* Close Button */}
                          <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
                            onClick={() => setIsCoverModalOpen(false)}
                          >
                            ✕
                          </button>

                          <h2 className="text-xl font-semibold mb-4">
                            Cover Letter
                          </h2>

                          <div className="max-h-[400px] overflow-y-auto text-sm text-gray-700 whitespace-pre-line w-full h-full bg-gray-200 p-3 rounded-lg">
                            {activeCoverLetter}
                          </div>

                          <div className="mt-6 text-right">
                            <button
                              className="btn btn-primary cursor-pointer"
                              onClick={() => setIsCoverModalOpen(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {a.status !== "Shortlisted" && (
                      <button
                        className="btn btn-primary text-sm"
                        onClick={
                          () =>
                            updateStatus({ id: a.id, status: "Shortlisted" }) // ✅ FIX
                        }
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Shortlist
                      </button>
                    )}

                    <button
                      className="btn btn-outline text-sm text-red-500"
                      onClick={() => {
                        updateStatus({
                          id: a.id,
                          status: "Rejected",
                        });
                      }}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {data?.pagination?.hasMore && (
            <div className="text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline"
              >
                <Loader className="h-4 w-4 mr-2" />
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Applicants;
