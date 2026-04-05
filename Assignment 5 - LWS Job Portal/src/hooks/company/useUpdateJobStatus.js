import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.patch(`/jobs/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]);
    },
  });
};