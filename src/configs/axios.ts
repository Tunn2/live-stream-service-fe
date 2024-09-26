import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseUrl = "http://localhost:4000/api/";
const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  const skipValidation = localStorage.getItem("skipValidation");
  if (skipValidation) {
    return config;
  }
  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("persist:root");
    window.location.href = "/login";
  }

  if (token) {
    try {
      const { exp } = jwtDecode(token);
      const expiredToken = new Date(exp * 1000);
      const currentTime = new Date();

      if (currentTime > expiredToken || !exp) {
        localStorage.removeItem("token");
        localStorage.removeItem("persist:root");
        window.location.href = "/login";
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");
      window.location.href = "/login";
    }
  }
  return config;
};

const handleError = (error) => {};

api.interceptors.request.use(handleBefore, handleError);

export default api;
