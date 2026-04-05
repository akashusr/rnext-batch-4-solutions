import { useEffect, useState } from "react";
import { JobContext } from "../context";
import { useJobs } from "../hooks/useJobs";

export const JobProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: "",
    type: [],
    experienceLevel: [],
    skills: [],
    minSalary: "",
    maxSalary: "",
    sort: "recent",
  });
  const [jobs, setJobs] = useState([]);
  const { data, isError, isLoading } = useJobs(filters);

  useEffect(() => {
    if (data) {
      setJobs(data.data);
    }
  }, [data]);

  const totalItemsCount = data?.count || 0;

  return (
    <JobContext.Provider
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
    </JobContext.Provider>
  );
};
