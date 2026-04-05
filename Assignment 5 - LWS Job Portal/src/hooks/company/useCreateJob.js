import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";


export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobData) => {
      const { data } = await api.post("/jobs", jobData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["company-jobs"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create job";
      console.error(message, error);
    },
  });
};
