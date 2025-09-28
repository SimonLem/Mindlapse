import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
  withCredentials: true,
  headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
});

export default api;
