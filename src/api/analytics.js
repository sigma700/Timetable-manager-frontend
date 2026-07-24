import api from "./index.js";

/**
 * GET /api/analytics/overview
 * Returns total teachers, subjects, classes, timetables for a school.
 */
export const fetchAnalyticsOverview = () => api.get("/analytics/overview");

/**
 * GET /api/analytics/teachers
 * Returns teacher workload analytics for a school.
 */
export const fetchTeacherWorkload = () => api.get("/analytics/teachers");

/**
 * GET /api/analytics/subjects
 * Returns subject distribution analytics for a school.
 */
export const fetchSubjectDistribution = () => api.get("/analytics/subjects");

/**
 * GET /api/analytics/health
 * Returns timetable health score for a school.
 */
export const fetchTimetableHealth = () => api.get("/analytics/health");
