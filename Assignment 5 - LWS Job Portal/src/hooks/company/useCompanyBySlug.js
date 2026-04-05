import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCompanyBySlug = (companySlug) => {
  return useQuery({
    queryKey: ["company", companySlug],

    queryFn: async () => {
      if (!companySlug) return null;

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/companies/${companySlug}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return res.data;
    },

    enabled: !!companySlug, 
  });
};
