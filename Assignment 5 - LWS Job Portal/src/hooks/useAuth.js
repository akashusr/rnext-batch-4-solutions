import { useContext, useDebugValue } from "react";
import { AuthContext } from "../context";

export const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) =>
    auth?.user ? "User Logged in" : "User Logged out"
  );
  return useContext(AuthContext);
};
