import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const fetchDashboardStats = async () => {
  const res = await api.get("/companies/dashboard/stats");
  return res.data;
};

export const useStats = () => {
  return useQuery({
    queryKey: ["companyDashboardStats"],
    queryFn: fetchDashboardStats,
  });
};
