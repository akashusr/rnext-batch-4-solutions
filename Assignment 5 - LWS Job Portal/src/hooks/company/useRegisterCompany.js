import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRegisterCompany = () => {
  return useMutation({
    mutationFn: async (companyData) => {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        {
          role: "COMPANY",
          ...companyData,
        }
      );

      return res.data;
    },
  });
};
