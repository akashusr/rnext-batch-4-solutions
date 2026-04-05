import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const fetchCompanyJobs = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sort = "newest",
}) => {
  const params = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const res = await api.get("/companies/jobs", { params });
  return res.data;
};

export const useOpenPositions = (filters = {}) => {
  return useQuery({
    queryKey: ["companyJobs", filters],
    queryFn: () => fetchCompanyJobs(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
