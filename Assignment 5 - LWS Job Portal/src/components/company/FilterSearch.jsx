import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFilterSearch } from "../../hooks/company/useFilterSearch";

const FilterSearch = () => {
  const {
    localSearch,
    setLocalSearch,
    handleSearchSubmit,
    handleSortChange,
    currentSort,
  } = useFilterSearch();

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSortSelect = (sortValue) => {
    handleSortChange(sortValue);
    setSortDropdownOpen(false);
  };

  const getSortLabel = () => {
    const sortLabels = {
      newest: "Newest First",
      oldest: "Oldest First",
    };
    return sortLabels[currentSort] || "Sort";
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--color-muted-foreground))] cursor-pointer" 
            onClick={() => handleSearchSubmit()}
            />
            <input
              type="search"
              placeholder="Search jobs by title and Press Enter"
              className="input pl-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              className="btn btn-outline"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {getSortLabel()}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {sortDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 card p-2 shadow-lg z-10">
                <button
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[hsl(var(--color-accent))] ${
                    currentSort === "newest"
                      ? "bg-[hsl(var(--color-accent))] font-medium"
                      : ""
                  }`}
                  onClick={() => handleSortSelect("newest")}
                >
                  Newest First
                </button>
                <button
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[hsl(var(--color-accent))] ${
                    currentSort === "oldest"
                      ? "bg-[hsl(var(--color-accent))] font-medium"
                      : ""
                  }`}
                  onClick={() => handleSortSelect("oldest")}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSearch;
