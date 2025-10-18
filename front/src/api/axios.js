import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://172.18.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Для админ-запросов используем employee_token
    if (
      config.url.startsWith("/admin") ||
      config.url.startsWith("/employees") ||
      config.url.startsWith("/roles") ||
      config.url.startsWith("/branches")
    ) {
      const token = localStorage.getItem("employee_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Для клиентских запросов используем access_token
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
