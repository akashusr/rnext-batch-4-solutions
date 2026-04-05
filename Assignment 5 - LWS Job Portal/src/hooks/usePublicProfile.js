import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "./useAuth";

export const usePublicProfile = (userId) => {
  const { auth } = useAuth();
  const token = auth?.authToken;

  const fetchPublicProfile = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.data;
  };

  return useQuery({
    queryKey: ["public-profile", userId],
    queryFn: fetchPublicProfile,
    enabled: !!userId, 
  });
};