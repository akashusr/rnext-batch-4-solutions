import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export const useSimilarJobs = (category) => {
  const fetchSimilarJobs = async () => {
    const response = await api.get("/jobs", {
      params: {
        category,
        limit: 3,
      },
    });

    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["similarJobs", category],
    queryFn: fetchSimilarJobs,
    enabled: !!category,
  });

  return { data, isLoading, isError };
};
