import {useQuery} from "@tanstack/react-query";
import {
  fetchActivityFeed,
  fetchRecentActivity,
  fetchActivitySummary,
} from "../api/activity.js";

export const useActivityFeed = (params = {}) =>
  useQuery({
    queryKey: ["activity", "feed", params],
    queryFn: () => fetchActivityFeed(params).then((r) => r.data),
  });

export const useRecentActivity = (limit = 10) =>
  useQuery({
    queryKey: ["activity", "recent", limit],
    queryFn: () => fetchRecentActivity(limit).then((r) => r.data),
    refetchInterval: 1000 * 30, // refresh every 30 seconds
  });

export const useActivitySummary = (params = {}) =>
  useQuery({
    queryKey: ["activity", "summary", params],
    queryFn: () => fetchActivitySummary(params).then((r) => r.data),
  });
