import { Link } from "react-router-dom";
import { useOpenPositions } from "../../hooks/company/useOpenPositions";
import { Clock, MapPin, Users } from "lucide-react";
import { formatNumber, getDayFromISO } from "../../utils";

const OpenPositions = () => {
  const { data, isLoading } = useOpenPositions();
  if (isLoading)
    return <h1 className="font-bold text-8xl text-center">Loading...</h1>;

  const positions = data?.data;
  console.log(positions)

  return (
    <div className="card p-6" id="jobs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Open Positions</h2>
        <span className="text-sm text-[hsl(var(--color-muted-foreground))]">
          15 jobs available
        </span>
      </div>
      <div className="space-y-4">
        {/* <!-- Job Card 1 --> */}
        {positions.map((job) => (
          <article
            key={job.it}
            class="border border-[hsl(var(--color-border))] rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 class="text-lg font-semibold mb-1">
                  <a href="job-details.html" class="hover:underline">
                    {job.title}
                  </a>
                </h3>
                <div class="flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))]">
                  <span class="flex items-center gap-1">
                    <MapPin class="h-4 w-4"></MapPin>
                    {job.location}
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <Clock class="h-4 w-4"></Clock>
                    Posted {getDayFromISO(job.createdAt) } days ago
                  </span>
                  <span>•</span>
                  <span class="flex items-center gap-1">
                    <Users class="h-4 w-4"></Users>
                    {job.applicants} applicants
                  </span>
                </div>
              </div>
              <button class="btn-ghost p-2 shrink-0" title="Save job">
                <i data-lucide="bookmark" class="h-5 w-5"></i>
              </button>
            </div>

            <p class="text-sm text-[hsl(var(--color-muted-foreground))] mb-3">
              We're looking for an experienced Full Stack Developer to join our
              dynamic team. You'll be working on cutting-edge web applications
              using React, Node.js, and cloud technologies.
            </p>

            <div class="flex flex-wrap gap-2 mb-3">
              <span class="badge badge-secondary">Full-time</span>
              <span class="badge badge-outline">Remote</span>
              <span class="badge badge-outline">React</span>
              <span class="badge badge-outline">Node.js</span>
              <span class="badge badge-outline">TypeScript</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-[hsl(var(--color-border))]">
              <span class="text-sm font-semibold text-[hsl(var(--color-primary))]">
                $120k - $180k
              </span>
              <div class="flex gap-2">
                <a href="job-details.html" class="btn btn-outline text-sm">
                  View Details
                </a>
                <button class="btn btn-primary text-sm">Apply Now</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* <!-- View All Jobs --> */}
      <div className="mt-6 text-center">
        <Link to="/" className="btn btn-outline">
          View All Open Positions
          <i data-lucide="arrow-right" className="h-4 w-4 ml-2"></i>
        </Link>
      </div>
    </div>
  );
};

export default OpenPositions;
