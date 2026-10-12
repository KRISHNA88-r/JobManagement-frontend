import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if the token is rejected, log out and go to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    if (
      err.response?.status === 401 &&
      localStorage.getItem("token") &&
      !url.includes("/users/login") &&
      !url.includes("/users/me")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export function errMsg(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response) return `Request failed (${err.response.status}).`;
  return "Cannot reach the server. If it was idle, wait a minute for it to wake up, then try again.";
}

export default api;