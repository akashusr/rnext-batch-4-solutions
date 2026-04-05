import { useMutation } from "@tanstack/react-query";
import { imgApi } from "../api/api";

const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await imgApi.post("/users/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: uploadProfilePicture,
  });
};
