import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";
const fetchCompanyApplicants = async (params) => {
  const { data } = await api.get("/companies/applicants", {
    params: {
      page: params?.page,
      limit: params?.limit,
      status: params?.status, // "new,shortlisted"
      experienceLevel: params?.experienceLevel, // "mid,senior"
      search: params?.search,
      date: params?.date, // "last 7 days"
      sort: params?.sort, // "newest" | "oldest"
    },
  });

  return data;
};

export const useCompanyApplicants = (params = {}) => {
  return useQuery({
    queryKey: ["company-applicants", params],
    queryFn: () => fetchCompanyApplicants(params),
    keepPreviousData: true, 
  });
};
