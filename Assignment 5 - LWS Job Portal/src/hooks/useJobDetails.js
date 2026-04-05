import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export const useJobDetails = (id) => {
  const fetchJob = async () => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  };

  return useQuery({
    queryKey: ["jobDetails", id],
    queryFn: fetchJob,
  });
};
