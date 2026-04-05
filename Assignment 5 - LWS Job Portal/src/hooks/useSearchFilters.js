import { useContext, useState } from "react";
import { JobContext } from "../context";

export const useSearchFilters = () => {
  const { filters, setFilters } = useContext(JobContext);

  const handleSortChange = (sortValue) => {
    console.log(sortValue)
    setFilters((prev) => ({
      ...prev,
      sort: sortValue,
      page: 1,
    }));
  };

  const isSalarySelected = (rangeLabel) => {
    const rangeMap = {
      "$0 - $50k": { min: 0, max: 50000 },
      "$50k - $100k": { min: 50000, max: 100000 },
      "$100k - $150k": { min: 100000, max: 150000 },
      "$150k+": { min: 150000, max: 9999999 },
    };

    const target = rangeMap[rangeLabel];
    return filters.minSalary === target.min && filters.maxSalary === target.max;
  };

  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, search: localSearch, page: 1 }));
  };
  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const currentValues = Array.isArray(prev[category]) ? prev[category] : [];

      const isExist = currentValues.includes(value);

      const newValues = isExist
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [category]: newValues,
        page: 1,
      };
    });
  };

  const toggleSalaryRange = (rangeLabel) => {
    const rangeMap = {
      "$0 - $50k": { min: 0, max: 50000 },
      "$50k - $100k": { min: 50000, max: 100000 },
      "$100k - $150k": { min: 100000, max: 150000 },
      "$150k+": { min: 150000, max: 9999999 },
    };

    const selectedRange = rangeMap[rangeLabel];
    if (!selectedRange) return;

    setFilters((prev) => ({
      ...prev,
      minSalary: selectedRange.min,
      maxSalary: selectedRange.max,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setLocalSearch("");
    setFilters({
      page: 1,
      limit: 6,
      search: "",
      type: [],
      experienceLevel: [],
      skills: [],
      minSalary: "",
      maxSalary: "",
    });
  };

  const isChecked = (category, value) => {
    return (
      Array.isArray(filters[category]) && filters[category].includes(value)
    );
  };

  return {
    localSearch,
    setLocalSearch,
    isSalarySelected,
    handleSearchSubmit,
    toggleFilter,
    toggleSalaryRange,
    clearFilters,
    isChecked,
    handleSortChange,
    currentSort: filters.sort || "recent",
    activeFilters: filters,
  };
};
