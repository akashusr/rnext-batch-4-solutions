import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

const updateJob = async ({ jobId, payload }) => {
  const res = await api.put(`/jobs/${jobId}`, payload);
  return res.data;
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs"]); 
    },
  });
};
