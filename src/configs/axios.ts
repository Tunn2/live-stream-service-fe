import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/", // define server backend url
});

export default api;
