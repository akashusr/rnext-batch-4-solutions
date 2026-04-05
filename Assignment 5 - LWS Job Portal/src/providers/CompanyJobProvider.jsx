import { useEffect, useState } from "react";
import { CompanyJobContext } from "../context";
import { useCompanyJobs } from "../hooks/company/useCompanyJobs";

export const CompanyJobProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: "",
    type: [],
    experienceLevel: [],
    skills: [],
    minSalary: "",
    maxSalary: "",
    sort: "newest",
  });
  const [jobs, setJobs] = useState([]);
  const { data, isError, isLoading } = useCompanyJobs(filters);

  useEffect(() => {
    if (data) {
      setJobs(data.data);
    }
  }, [data]);

  const totalItemsCount = data?.count || 0;

  return (
    <CompanyJobContext.Provider
      value={{
        jobs,
        filters,
        setJobs,
        setFilters,
        isError,
        isLoading,
        totalItemsCount,
      }}
    >
      {children}
    </CompanyJobContext.Provider>
  );
};
