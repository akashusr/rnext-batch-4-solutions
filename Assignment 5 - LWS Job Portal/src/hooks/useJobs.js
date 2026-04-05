import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export const useJobs = (filters) => {
  const getJobs = async (params) => {
    const formattedParams = {
      ...params,
      type: Array.isArray(params.type) ? params.type.join(",") : params.type,
      experienceLevel: Array.isArray(params.experienceLevel)
        ? params.experienceLevel.join(",")
        : params.experienceLevel,
      skills: Array.isArray(params.skills)
        ? params.skills.join(",")
        : params.skills,
    };

    Object.keys(formattedParams).forEach((key) => {
      if (
        formattedParams[key] === "" ||
        formattedParams[key] == null ||
        formattedParams[key]?.length === 0
      ) {
        delete formattedParams[key];
      }
    });

    const response = await api.get("/jobs", { params: formattedParams });
    return response.data;
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
    placeholderData: (previousData) => previousData,
  });

  return {
    data,
    isError,
    isLoading,
  };
};
