import axios from "axios";
import { useEffect } from "react";
import { api } from "../api";
import { useAuth } from "./useAuth";

export const useAxios = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        const authToken = auth?.authToken;
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = api.interceptors.response.use(
      (res) => res,

      async (err) => {
        const originalReq = err.config;
        if (!originalReq._retry && err.response.status === 401) {
          originalReq._retry = true;
          const refreshToken = auth?.refreshToken;
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          const { token } = res.data;
          setAuth({ ...auth, authToken: token });
          originalReq.headers.Authorization = `Bearer ${token}`;
          return axios(originalReq);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth.authToken]);

  return { api };
};
