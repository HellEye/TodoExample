import { authManagerStore } from "@/app/auth/authManager";
import axios, { isAxiosError } from "axios";
export const py = axios.create({
  // Normally this would likely come from .env
  // This time I used nextjs redirect, helps with CORS
  // see next.config.mjs
  baseURL: "http://home.helleye.net:8000/",
});

py.interceptors.request.use((config) => {
  const token = authManagerStore.getState().access_token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});
py.interceptors.response.use(
  (res) => res,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      console.log("Log out");
      authManagerStore.getState().logout();
    }
    throw error;
  }
);
