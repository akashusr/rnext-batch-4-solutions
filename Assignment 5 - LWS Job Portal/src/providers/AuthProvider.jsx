import { useEffect, useState } from "react";
import { AuthContext } from "../context";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
