import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const fetchCompanyJobs = async (params = {}) => {
  const res = await api.get("/companies/jobs", {
    params,
  });
  return res.data;
};

export const useCompanyJobs = (params = {}) => {
  return useQuery({
    queryKey: ["companyJobs", params],
    queryFn: () => fetchCompanyJobs(params),
    keepPreviousData: true,
  });
};
