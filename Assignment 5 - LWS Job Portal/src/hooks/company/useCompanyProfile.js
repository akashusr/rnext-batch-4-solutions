import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const fetchCompanyProfile = async () => {
  const res = await api.get("/companies/profile");
  return res.data;
};

export const useCompanyProfile = () => {
  return useQuery({
    queryKey: ["companyProfile"],
    queryFn: fetchCompanyProfile,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
