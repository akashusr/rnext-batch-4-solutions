import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const SearchSection = () => {
  const {
    localSearch,
    setLocalSearch,
    handleSearchSubmit,
    toggleFilter,
    toggleSalaryRange,
    clearFilters,
    isChecked,
    isSalarySelected,
  } = useSearchFilters();
  const [openDropdown, setOpenDropdown] = useState(null);
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

  return (
    <section className="mb-8 border-gray-200">
      <div className="card p-6 ">
        <div className="space-y-4 ">
          {/* <!-- Search Bar --> */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 ring ring-transparent focus-within:ring-primary rounded-md place-content-center transition-all border-gray-200">
              <div className="relative border-gray-200">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs by title, skill..."
                  className="input pl-10 w-full outline-none border-none border-gray-200"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
              </div>
            </div>

            <button
              className="btn btn-primary flex gap-2 cursor-pointer"
              onClick={handleSearchSubmit}
            >
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </button>
          </div>

          {/* <!-- Filters --> */}
          <div
            ref={dropdownRef}
            className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200"
          >
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Filters:
            </span>

            {/* <!-- Job Type Dropdown --> */}
            <div className="dropdown relative">
              <button
                className="btn btn-outline text-xs h-8 px-3 flex items-center cursor-pointer"
                onClick={() => toggleDropdown("jobType")}
              >
                Job Type
                <ChevronDown className="ml-2 h-3 w-3" />
              </button>
              <div
                id="jobTypeDropdown"
                className={`dropdown-content card p-2 ${
                  openDropdown === "jobType" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-1">
                  {["Full-time", "Part-time", "Contract", "Internship"].map(
                    (type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={isChecked("type", type)}
                          onChange={() => toggleFilter("type", type)}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* <!-- Experience Level Dropdown --> */}
            <div className="dropdown relative">
              <button
                className="btn btn-outline text-xs h-8 px-3 flex items-center cursor-pointer"
                onClick={() => toggleDropdown("experience")}
              >
                Experience Level
                <ChevronDown className="ml-2 h-3 w-3" />
              </button>
              <div
                id="experienceDropdown"
                className={`dropdown-content card p-2 ${
                  openDropdown === "experience" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-1">
                  {["Entry", "Mid", "Senior", "Lead"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={isChecked("experienceLevel", level)}
                        onChange={() => toggleFilter("experienceLevel", level)}
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* <!-- Salary Range Dropdown --> */}
            <div className="dropdown relative">
              <button
                className="btn btn-outline text-xs h-8 px-3 flex items-center cursor-pointer"
                onClick={() => toggleDropdown("salary")}
              >
                Salary Range
                <ChevronDown className="ml-2 h-3 w-3" />
              </button>
              <div
                id="salaryDropdown"
                className={`dropdown-content card p-2 ${
                  openDropdown === "salary" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-1">
                  {["$0 - $50k", "$50k - $100k", "$100k - $150k", "$150k+"].map(
                    (range) => (
                      <label
                        key={range}
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="salary"
                          className="rounded border-input"
                          checked={isSalarySelected(range)}
                          onChange={() => toggleSalaryRange(range)}
                        />
                        <span className="text-sm">{range}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* <!-- Skills Dropdown --> */}
            <div className="dropdown relative">
              <button
                className="btn btn-outline text-xs h-8 px-3 flex items-center cursor-pointer"
                onClick={() => toggleDropdown("skills")}
              >
                Skills
                <ChevronDown className="ml-2 h-3 w-3" />
              </button>
              <div
                id="skillsDropdown"
                className={`dropdown-content card p-2 ${
                  openDropdown === "skills" ? "block" : "hidden"
                }`}
              >
                <div className="space-y-1">
                  {["React", "Node.js", "Python", "TypeScript", "SQL"].map(
                    (skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={isChecked("skills", skill)}
                          onChange={() => toggleFilter("skills", skill)}
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              className="btn btn-ghost text-xs h-8 px-3 text-muted-foreground hover:text-foreground bg-red-500 text-white cursor-pointer"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
