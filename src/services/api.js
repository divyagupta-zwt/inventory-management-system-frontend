import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-management-system-backend-production-1d53.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    console.error(`[API Error] ${message}`, error);

    const transformedError = {
      message,
      status: error.response?.status,
      original: error,
    };
    return Promise.reject(transformedError);
  },
);

export default api;
