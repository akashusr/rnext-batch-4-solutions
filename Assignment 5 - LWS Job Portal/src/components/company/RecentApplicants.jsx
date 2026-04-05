import { ChevronDown, Download, User } from "lucide-react";
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

const RecentApplicants = () => {
  const { data, isLoading } = useCompanyApplicants({
    limit: 6,
    sort: "oldest",
    status: "shortlisted",
  });
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();
  const [openId, setOpenId] = useState(null);

  if (isLoading)
    return <h1 className="text-center font-bold text-9xl">Loading...</h1>;

  const applicants = data?.data;

  return (
    <div className="card">
      <div className="p-6 border-b border-[hsl(var(--color-border))]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Shortlisted Applicants</h2>
          <a
            href="#"
            className="text-sm text-[hsl(var(--color-primary))] hover:underline"
          >
            View All
          </a>
        </div>
      </div>
      <div className="divide-y divide-[hsl(var(--color-border))]">
        {applicants.map((p) => (
          <div
            key={p.id}
            className="p-6 hover:bg-[hsl(var(--color-accent))] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-[hsl(var(--color-primary))]"></User>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold mb-1">{p.user.name}</h3>
                    <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                      Applied for{" "}
                      <span className="font-medium text-[hsl(var(--color-foreground))]">
                        {p.job.title}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-[hsl(var(--color-muted-foreground))]">
                    {formatDate(p.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setOpenId(openId === p.id ? null : p.id)}
                      className="btn btn-primary text-xs h-8 flex items-center gap-1"
                    >
                      {p.status}
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {openId === p.id && (
                      <div className="absolute left-0 mt-1 w-40 bg-white border rounded-md shadow z-10">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            disabled={status === p.status || isPending}
                            onClick={() => {
                              updateStatus({ id: p.id, status });
                              setOpenId(null);
                            }}
                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100
            ${status === p.status ? "opacity-50 cursor-not-allowed" : ""}
          `}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <a
                    href={`${import.meta.env.VITE_BASE_URL}${p.resumeUrl}`}
                    className="btn btn-outline text-xs h-8"
                  >
                    <Download className="h-3 w-3 mr-1"></Download>
                    Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplicants;
