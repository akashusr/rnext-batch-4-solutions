import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";

export const useRecommendedJobs = () => {
  const { auth } = useAuth();
  const token = auth?.user?.token;

  const fetchRecommended = async () => {
    if (!token) return [];

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/jobs/recommendations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  return useQuery({
    queryKey: ["recommendedJobs", token],
    queryFn: fetchRecommended,
    enabled: !!token,
    keepPreviousData: true,
  });
};
