import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";


export const useMyApplications = (params = {}) => {
  const { auth } = useAuth();

  const fetchApplications = async () => {
    if (!auth?.user?.token) return [];

    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/applications/my-applications`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user.token}`,
        },
        params,
      }
    );

    return res.data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myApplications", auth?.user?.token, params],
    queryFn: fetchApplications,
    enabled: !!auth?.user?.token, 
    keepPreviousData: true,
  });

  return { data, isLoading, isError };
};
