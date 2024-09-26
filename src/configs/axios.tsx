import axios from "axios";
// Import the removeUser action
import { store } from "../redux/store"; // Import the Redux store
import { logout } from "../redux/features/userSlice";

const baseUrl = "http://localhost:4000/api/";
const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

const handleError = (error) => {
  console.log(error);

  // Check if the response status is 401 (Unauthorized)
  if (error.response && error.response.status === 401) {
    if (!window.location.pathname.includes("/login")) {
      localStorage.removeItem("token"); 

      store.dispatch(logout());

      window.location.href = "/login";
    }
  }

  return Promise.reject(error); 
};

// Add request and response interceptors
api.interceptors.request.use(handleBefore, handleError);
api.interceptors.response.use(
  (response) => response,
  handleError
);

export default api;