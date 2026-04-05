import {
  BarChart,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApplyJobModal from "../components/job-seeker/ApplyJobModal";
import { ShareSection } from "../components/ShareSection";
import { SimilarJobCard } from "../components/SimilarJobCard";
import { useAuth } from "../hooks/useAuth";
import { useJobDetails } from "../hooks/useJobDetails";
import { useMyApplications } from "../hooks/useMyApplications";
import { useSimilarJobs } from "../hooks/useSimilarJobs";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import {
  formatDate,
  formatNumber,
  formatTextList,
  getCompanyLogoUrl,
  getDayFromISO,
} from "../utils";

export const JobDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useJobDetails(id);
  const { mutate: withdraw, isPending } = useWithdrawApplication();
  const { data: myApplications = [] } = useMyApplications();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);

  const category = data?.data?.category;
  const { data: similar, isLoading: simLoading } = useSimilarJobs(category);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading job</div>;
  const job = data.data;

  const postDate = getDayFromISO(job.createdAt);
  const requirements = formatTextList(job.requirements);
  const benefits = formatTextList(job.benefits);
  const appliedApplication = myApplications.find(
    (app) => app.job?.id === job.id
  );
  const hasApplied = !!appliedApplication;
  const src = getCompanyLogoUrl(job?.company?.logoUrl);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* <!-- Breadcrumb --> */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))]">
        <Link to="/" className="hover:text-[hsl(var(--color-foreground))]">
          Jobs
        </Link>
        <i data-lucide="chevron-right" className="h-4 w-4"></i>
        <Link to="#" className="hover:text-[hsl(var(--color-foreground))]">
          {job.category}
        </Link>
        <i data-lucide="chevron-right" className="h-4 w-4"></i>
        <span className="text-[hsl(var(--color-foreground))]">{job.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <!-- Main Content Column --> */}
        <div className="lg:col-span-2 space-y-6">
          {/* <!-- Job Header --> */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-20 w-20 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center">
                  <img
                    src={src}
                    className="h-28 w-28 text-[hsl(var(--color-primary))]"
                  ></img>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-[hsl(var(--color-muted-foreground))]">
                      <Link
                        to="company-profile.html"
                        className="text-lg font-medium hover:text-[hsl(var(--color-primary))]"
                      >
                        {job.company.name}
                      </Link>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4"></MapPin>
                        {job.company.city}, {job.company.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4"></Clock>
                        Posted {postDate} days ago
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-ghost p-2 flex-shrink-0"
                    title="Save job"
                  >
                    <i data-lucide="bookmark" className="h-6 w-6"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="badge badge-secondary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Job Overview --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-5 w-5 text-[hsl(var(--color-primary))]"></Briefcase>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Job Type
                  </p>
                  <p className="font-medium">{job.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[hsl(var(--color-primary))]"></MapPin>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Location
                  </p>
                  <p className="font-medium">
                    {job.location} ({job.workMode})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-[hsl(var(--color-primary))]"></DollarSign>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Salary
                  </p>
                  <p className="font-medium">
                    ${formatNumber(job.salaryMin)} - $
                    {formatNumber(job.salaryMax)} / year
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center flex-shrink-0">
                  <BarChart className="h-5 w-5 text-[hsl(var(--color-primary))]"></BarChart>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Experience
                  </p>
                  <p className="font-medium">{job.experienceLevel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-[hsl(var(--color-primary))]"></Calendar>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Application Deadline
                  </p>
                  <p className="font-medium">{formatDate(job?.deadline)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-[hsl(var(--color-primary))]"></Users>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    Applicants
                  </p>
                  <p className="font-medium">{job.applicants} applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Job Description --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose prose-sm max-w-none space-y-4 text-[hsl(var(--color-foreground))]">
              <p>{job.description}</p>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Required Qualifications
              </h3>
              <ul className="list-disc list-inside space-y-2 text-[hsl(var(--color-muted-foreground))]">
                {requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">What We Offer</h3>
              <ul className="list-disc list-inside space-y-2 text-[hsl(var(--color-muted-foreground))]">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* <!-- Required Skills --> */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="badge badge-secondary">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* <!-- Similar Jobs --> */}
          <div className="space-y-4">
            {simLoading && <div>Loading similar jobs...</div>}

            {similar?.data?.length === 0 && (
              <p className="text-sm text-gray-500">No similar jobs found.</p>
            )}

            {similar?.data?.map((item) => (
              <SimilarJobCard key={item.id} job={item} />
            ))}
          </div>
        </div>

        {/* <!-- Sidebar Column --> */}
        <div className="lg:col-span-1 space-y-6">
          {/* <!-- Apply Section (Sticky) --> */}
          <div className="card p-6 lg:sticky lg:top-24">
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-[hsl(var(--color-border))]">
                <p className="text-2xl font-bold text-[hsl(var(--color-primary))] mb-1">
                  ${formatNumber(job.salaryMin)} - $
                  {formatNumber(job.salaryMax)}
                </p>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  {job.salaryPeriod}
                </p>
              </div>

              {!hasApplied ? (
                <button
                  onClick={() => setOpen(true)}
                  className="btn btn-primary w-full text-base cursor-pointer"
                  disabled={auth?.user?.data.role !== "USER"}
                >
                  <Send className="h-4 w-4 mr-2"></Send>{" "}
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
                  className="btn btn-outline w-full cursor-pointer text-sm text-red-600 border-red-500 hover:bg-red-100 "
                >
                  Withdraw
                </button>
              )}

              {open && (
                <ApplyJobModal jobId={job.id} onClose={() => setOpen(false)} />
              )}

              {open && (
                <ApplyJobModal jobId={job.id} onClose={() => setOpen(false)} />
              )}

              <div className="pt-4 border-t border-[hsl(var(--color-border))] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--color-muted-foreground))]">
                    Applicants
                  </span>
                  <span className="font-medium">{job.applicants}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--color-muted-foreground))]">
                    Posted
                  </span>
                  <span className="font-medium">{postDate} days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Company Info --> */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">About Company</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-[hsl(var(--color-secondary))] flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-8 w-8 text-[hsl(var(--color-primary))]"></Building2>
                </div>
                <div>
                  <h4 className="font-semibold">{job.company.name}</h4>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                    {job.company.industry}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                {job.company.description}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]"></Globe>
                  <Link
                    to={job.company.websiteUrl}
                    className="text-[hsl(var(--color-primary))] hover:underline"
                  >
                    {job.company.websiteUrl}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]"></MapPin>
                  <span className="text-[hsl(var(--color-muted-foreground))]">
                    {job.company.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]"></Users>
                  <span className="text-[hsl(var(--color-muted-foreground))]">
                    {job.company.employeeCount}+ employees
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]"></Calendar>
                  <span className="text-[hsl(var(--color-muted-foreground))]">
                    Founded in {job.company.foundedYear}
                  </span>
                </div>
              </div>

              <Link to="#" className="btn btn-outline w-full mt-4">
                View Company Profile
              </Link>
            </div>
          </div>

          {/* <!-- Share Job --> */}
          <ShareSection socialLinks={job?.company?.socialLinks} />

          {/* <!-- Report Job --> */}
          <button className="w-full text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] flex items-center justify-center gap-2">
            <i data-lucide="flag" className="h-4 w-4"></i>
            Report this job
          </button>
        </div>
      </div>
    </main>
  );
};
