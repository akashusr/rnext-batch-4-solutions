import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  const applyForJob = async ({ jobId, coverLetter }) => {
    const res = await api.post(`/applications/jobs/${jobId}/apply`, {
      coverLetter,
    });
    return res.data;
  };

  return useMutation({
    mutationFn: applyForJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-applications"]);
      queryClient.invalidateQueries(["job"]);
    },
    onError: (err) => {
        console.log(err)
    }
  });
};
