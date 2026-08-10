import {useQuery} from "@tanstack/react-query";
import {
  fetchAnalyticsOverview,
  fetchTeacherWorkload,
  fetchSubjectDistribution,
  fetchTimetableHealth,
} from "../api/analytics.js";

// Helper to extract data safely from API responses
const extractData = (response) => {
  // Handle different response structures
  if (response?.data?.data) return response.data.data;
  if (response?.data) return response.data;
  return response;
};

// Shared query configuration for analytics
const analyticsConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes before data is stale
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  retry: 1, // Only retry once on failure
  refetchOnWindowFocus: false, // Don't refetch when tab regains focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  // This is key - don't throw errors, just return empty data
  useErrorBoundary: false,
  // Provide fallback data when query fails
  onError: (error) => {
    console.warn("Analytics query failed:", error?.message || error);
    // Don't redirect to login from analytics page
    // The error will be handled by the component
  },
};

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      try {
        const response = await fetchAnalyticsOverview();
        return extractData(response);
      } catch (error) {
        // If it's an auth error, don't throw - return null
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          console.warn("Authentication required for analytics overview");
          return null;
        }
        // For other errors, still return null instead of crashing
        console.warn("Failed to fetch analytics overview:", error.message);
        return null;
      }
    },
    ...analyticsConfig,
    // Return null so the UI can show appropriate state
    placeholderData: null,
  });

export const useTeacherWorkload = () =>
  useQuery({
    queryKey: ["analytics", "teachers"],
    queryFn: async () => {
      try {
        const response = await fetchTeacherWorkload();
        return extractData(response);
      } catch (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          console.warn("Authentication required for teacher workload");
          return null;
        }
        console.warn("Failed to fetch teacher workload:", error.message);
        return null;
      }
    },
    ...analyticsConfig,
    placeholderData: null,
  });

export const useSubjectDistribution = () =>
  useQuery({
    queryKey: ["analytics", "subjects"],
    queryFn: async () => {
      try {
        const response = await fetchSubjectDistribution();
        return extractData(response);
      } catch (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          console.warn("Authentication required for subject distribution");
          return null;
        }
        console.warn("Failed to fetch subject distribution:", error.message);
        return null;
      }
    },
    ...analyticsConfig,
    placeholderData: null,
  });

export const useTimetableHealth = () =>
  useQuery({
    queryKey: ["analytics", "health"],
    queryFn: async () => {
      try {
        const response = await fetchTimetableHealth();
        return extractData(response);
      } catch (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          console.warn("Authentication required for timetable health");
          return null;
        }
        console.warn("Failed to fetch timetable health:", error.message);
        return null;
      }
    },
    ...analyticsConfig,
    placeholderData: null,
  });
