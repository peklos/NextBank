// front/src/api/axios.js
import axios from "axios";
import { store } from "../app/store";
import { fullLogout } from "../features/auth/logoutThunk";
import { logoutEmployee } from "../features/employee/employeeSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.135:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Флаги для предотвращения множественных редиректов
let isClientLogoutInProgress = false;
let isEmployeeLogoutInProgress = false;

// Interceptor для запросов - добавляет токен
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

// Interceptor для ответов - обрабатывает 401 ошибки
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Проверяем статус ошибки
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";

      console.log("❌ 401 Unauthorized обнаружен для:", url);

      // Определяем тип запроса - админский или клиентский
      const isAdminRequest =
        url.startsWith("/admin") ||
        url.startsWith("/employees") ||
        url.startsWith("/roles") ||
        url.startsWith("/branches");

      if (isAdminRequest) {
        // Логаут сотрудника
        if (!isEmployeeLogoutInProgress) {
          isEmployeeLogoutInProgress = true;
          console.log("🔓 Выполняется логаут сотрудника из-за 401");

          store.dispatch(logoutEmployee());
          localStorage.removeItem("employee_token");

          // Перенаправляем на страницу входа для сотрудников
          setTimeout(() => {
            if (window.location.pathname !== "/admin/login") {
              window.location.href = "/admin/login";
            }
            isEmployeeLogoutInProgress = false;
          }, 100);
        }
      } else {
        // Логаут клиента
        if (!isClientLogoutInProgress) {
          isClientLogoutInProgress = true;
          console.log("🔓 Выполняется логаут клиента из-за 401");

          store.dispatch(fullLogout());
          localStorage.removeItem("access_token");

          // Перенаправляем на страницу входа
          setTimeout(() => {
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
            isClientLogoutInProgress = false;
          }, 100);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;