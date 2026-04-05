import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    const token = auth?.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const imgApi = axios.create({
  baseURL: "http://localhost:9000/api",
});
export const resumeApi = axios.create({
  baseURL: "http://localhost:9000/api",
});
export const profileApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

imgApi.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    const token = auth?.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

resumeApi.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    const token = auth?.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

profileApi.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
