import { ChevronDown } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { JobCard } from "../components/JobCard";
import Pagination from "../components/Pagination";
import { SearchSection } from "../components/SearchSection";
import { JobContext } from "../context";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useMyApplications } from "../hooks/useMyApplications";

const Home = () => {
  const { jobs, isLoading, filters, setFilters, totalItemsCount } =
    useContext(JobContext);
  const { data: myApplications = [] } = useMyApplications();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { handleSortChange, activeFilters } = useSearchFilters();
  const dropdownRef = useRef(null);
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="text-9xl font-bold text-center">Loading...</div>;
  }

  const jobLength = jobs.length

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* <!-- Hero Section --> */}
        <section className="mb-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Dream Job
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover thousands of job opportunities from top companies. Your
              next career move starts here.
            </p>
          </div>
        </section>

        {/* <!-- Search and Filters --> */}
        <SearchSection />

        {/* <!-- Results Header --> */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Available Jobs</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {jobLength} results
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>

            <div ref={dropdownRef} className="dropdown relative">
              <button
                className="btn btn-outline text-sm h-9 cursor-pointer flex items-center capitalize"
                onClick={() => toggleDropdown("sort")}
              >
                {/* Match the values with underscores as defined in your buttons below */}
                {activeFilters.sort === "salary_high"
                  ? "Salary (High to Low)"
                  : activeFilters.sort === "salary_low"
                  ? "Salary (Low to High)"
                  : "Most Recent"}
                <ChevronDown className="ml-2 h-3 w-3" />
              </button>

              <div
                className={`dropdown-content card p-2 absolute z-50 bg-white shadow-xl border ${
                  openDropdown === "sort" ? "block" : "hidden"
                }`}
              >
                <button
                  onClick={() => {
                    handleSortChange("recent");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-accent cursor-pointer ${
                    activeFilters.sort === "recent" ? "bg-accent font-bold" : ""
                  }`}
                >
                  Most Recent
                </button>

                <button
                  onClick={() => {
                    handleSortChange("salary_high");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-accent cursor-pointer ${
                    activeFilters.sort === "salary_high"
                      ? "bg-accent font-bold"
                      : ""
                  }`}
                >
                  Salary (High to Low)
                </button>

                <button
                  onClick={() => {
                    handleSortChange("salary_low");
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left text-sm p-2 rounded hover:bg-accent cursor-pointer ${
                    activeFilters.sort === "salary_low"
                      ? "bg-accent font-bold"
                      : ""
                  }`}
                >
                  Salary (Low to High)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Job Cards Grid --> */}
        <div className="grid gap-4 md:gap-6">
          {/* <!-- Job Card 1 --> */}
          {jobs?.map((job) => (
            <JobCard key={job.id} myApplications={myApplications} job={job} />
          ))}

          {/* <!-- Loading State Example (Hidden by default, shown during loading) --> */}
          <article className="card p-6 hidden" id="loading-skeleton">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="shrink-0">
                <div className="h-16 w-16 skeleton"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <div className="h-6 skeleton w-2/3"></div>
                  <div className="h-4 skeleton w-1/2"></div>
                </div>
                <div className="h-4 skeleton w-full"></div>
                <div className="flex gap-2">
                  <div className="h-6 skeleton w-20"></div>
                  <div className="h-6 skeleton w-20"></div>
                  <div className="h-6 skeleton w-20"></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 skeleton w-32"></div>
                  <div className="flex gap-2">
                    <div className="h-10 skeleton w-28"></div>
                    <div className="h-10 skeleton w-28"></div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* <!-- Load More / Pagination --> */}
        <Pagination
          totalItems={totalItemsCount}
          itemsPerPage={filters.limit}
          currentPage={filters.page}
          onPageChange={(newPage) =>
            setFilters((prev) => ({ ...prev, page: newPage }))
          }
        />

        {/* <!-- Error State Example (Hidden by default, shown on error) --> */}
        <div className="card p-12 text-center hidden" id="error-state">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn't load the jobs. Please try again.
          </p>
          <button className="btn btn-primary">Retry</button>
        </div>

        {/* <!-- Empty State Example (Hidden by default, shown when no results) --> */}
        <div className="card p-12 text-center hidden" id="empty-state">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your filters or search terms to find more
            opportunities.
          </p>
          <button className="btn btn-outline">Clear Filters</button>
        </div>
      </main>
    </>
  );
};

export default Home;
