import { createContext } from "react";

export const JobContext = createContext({ jobs: [] });
export const CompanyJobContext = createContext({
  jobs: [],
  sort: "oldest",
});

export const AuthContext = createContext();
