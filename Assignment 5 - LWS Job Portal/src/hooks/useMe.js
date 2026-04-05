import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import axios from "axios";

export const useMe = () => {
  const { auth } = useAuth();

  const fetchMe = async () => {
    if (!auth?.user.token) return null;

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${auth?.user.token}`,
      },
    });

    return res.data.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me", auth?.user.token],
    queryFn: fetchMe,
    enabled: !!auth?.user.token, 
    staleTime: 1000 * 60 * 5,   
  });

  return { data, isLoading, isError };
};
