import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor - THE KEY FIX
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    // Don't automatically redirect on 401 for analytics endpoints
    const isAnalyticsEndpoint = error.config?.url?.includes("/analytics");

    if (error.response?.status === 401 && !isAnalyticsEndpoint) {
      // Only redirect for non-analytics pages
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/analytics") &&
        !currentPath.includes("/login")
      ) {
        // Store a message so login page can show it
        sessionStorage.setItem(
          "auth_message",
          error.response?.data?.message ||
            "Your session has expired. Please log in again.",
        );

        // Redirect to login
        window.location.href = "/login";
      }
    }

    // For analytics endpoints, just reject the error
    // The hooks will handle it gracefully
    return Promise.reject(error);
  },
);

export default api;
