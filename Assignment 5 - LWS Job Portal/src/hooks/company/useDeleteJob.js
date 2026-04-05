import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/jobs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]);
    },
  });
};
