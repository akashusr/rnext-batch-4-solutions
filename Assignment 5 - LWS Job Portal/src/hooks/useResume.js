import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "../api/api";

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await resumeApi.post("/users/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  return useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
      console.log("SUccess", data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
