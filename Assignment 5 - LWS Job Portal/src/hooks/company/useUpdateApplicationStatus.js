import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

const updateApplicationStatus = async ({ id, status }) => {
  const res = await api.patch(`/applications/${id}/status`, {
    status,
  });
  return res.data;
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyApplicants"]);
    },
  });
};
