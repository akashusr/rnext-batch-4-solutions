import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();

  const updateCompanyProfile = async (data) => {
    const res = await api.put("/companies/profile", data);
    return res.data;
  };

  return useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: () => {
      // 🔁 refresh company data everywhere
      queryClient.invalidateQueries(["company"]);
    },
    onError: (error) => {
      console.error("Company update failed:", error);
    },
  });
};
