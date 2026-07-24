import api from "./index.js";

/**
 * GET /api/audit
 * Returns paginated, filterable audit log feed.
 *
 * @param {Object} params - page, limit, action, actionCategory, startDate, endDate
 */
export const fetchAuditFeed = (params = {}) => api.get("/audit", {params});

/**
 * GET /api/audit/recent
 * Returns the most recent N audit entries.
 *
 * @param {number} limit
 */
export const fetchRecentAudit = (limit = 10) =>
  api.get("/audit/recent", {params: {limit}});

/**
 * GET /api/audit/user/:userId
 * Returns all audit entries by a specific user.
 *
 * @param {string} userId
 * @param {Object} params - page, limit
 */
export const fetchAuditByUser = (userId, params = {}) =>
  api.get(`/audit/user/${userId}`, {params});

/**
 * GET /api/audit/school/:schoolId
 * Returns all audit entries scoped to a school.
 *
 * @param {string} schoolId
 * @param {Object} params - page, limit
 */
export const fetchAuditBySchool = (schoolId, params = {}) =>
  api.get(`/audit/school/${schoolId}`, {params});
