import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRegister = () => {
  const registerUser = async (payload) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; 
  };

  return useMutation({
    mutationFn: registerUser,
  });
};
