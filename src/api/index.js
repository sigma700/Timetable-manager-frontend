import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true, // sends HTTP-only cookie on every request
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Unwraps { success, message, data } envelope
// Redirects to /login on 401
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear session and redirect to login
      window.location.href = "/login";
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default api;
