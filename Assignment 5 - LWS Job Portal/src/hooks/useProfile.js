import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/api";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const updateProfile = async (data) => {
    const response = await profileApi.put("/users/profile", data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("Success");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
