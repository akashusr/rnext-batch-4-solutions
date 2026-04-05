import { useContext, useState } from "react";
import { CompanyJobContext } from "../../context";

export const useFilterSearch = () => {
  const { filters, setFilters } = useContext(CompanyJobContext);

  const handleSortChange = (sortValue) => {
    console.log(sortValue);
    setFilters((prev) => ({
      ...prev,
      sort: sortValue,
      page: 1,
    }));
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

  const clearFilters = () => {
    setLocalSearch("");
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      sort: "newest",
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
    handleSearchSubmit,
    toggleFilter,
    clearFilters,
    isChecked,
    handleSortChange,
    currentSort: filters.sort || "newest",
    activeFilters: filters,
  };
};
