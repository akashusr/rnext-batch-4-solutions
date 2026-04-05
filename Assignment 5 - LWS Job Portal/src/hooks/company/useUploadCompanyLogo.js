import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";

export const useUploadCompanyLogo = () => {
  const queryClient = useQueryClient();

  const uploadLogo = async (file) => {
    if (!file) throw new Error("No file provided");

    const formData = new FormData();
    formData.append("logo", file);

    const res = await api.post("/companies/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  };

  return useMutation({
    mutationFn: uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyProfile"]);
      console.log("Company logo uploaded successfully");
    },
    onError: (error) => {
      console.error("Logo upload failed:", error);
    },
  });
};
