import {useQuery} from "@tanstack/react-query";
import {
  fetchAnalyticsOverview,
  fetchTeacherWorkload,
  fetchSubjectDistribution,
  fetchTimetableHealth,
} from "../api/analytics.js";

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => fetchAnalyticsOverview().then((r) => r.data),
  });

export const useTeacherWorkload = () =>
  useQuery({
    queryKey: ["analytics", "teachers"],
    queryFn: () => fetchTeacherWorkload().then((r) => r.data),
  });

export const useSubjectDistribution = () =>
  useQuery({
    queryKey: ["analytics", "subjects"],
    queryFn: () => fetchSubjectDistribution().then((r) => r.data),
  });

export const useTimetableHealth = () =>
  useQuery({
    queryKey: ["analytics", "health"],
    queryFn: () => fetchTimetableHealth().then((r) => r.data),
  });
