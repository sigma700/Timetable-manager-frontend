import api from "./index.js";

/**
 * GET /api/activity
 * Returns paginated, filterable activity feed.
 *
 * @param {Object} params - page, limit, event, eventCategory, startDate, endDate
 */
export const fetchActivityFeed = (params = {}) =>
  api.get("/activity", {params});

/**
 * GET /api/activity/recent
 * Returns the most recent N activity entries.
 *
 * @param {number} limit
 */
export const fetchRecentActivity = (limit = 10) =>
  api.get("/activity/recent", {params: {limit}});

/**
 * GET /api/activity/summary
 * Returns activity counts grouped by event type.
 *
 * @param {Object} params - eventCategory, startDate, endDate
 */
export const fetchActivitySummary = (params = {}) =>
  api.get("/activity/summary", {params});
