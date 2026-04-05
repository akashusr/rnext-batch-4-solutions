import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  const withdrawApplication = async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  };

  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-applications"]);
    },
  });
};
