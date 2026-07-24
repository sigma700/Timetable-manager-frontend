import api from "./index.js";

// ─────────────────────────────────────────────
// SCHOOL ADMIN
// ─────────────────────────────────────────────

export const fetchSchoolOverview = () => api.get("/admin/school/overview");

export const fetchSchoolUsers = (params = {}) =>
  api.get("/admin/school/users", {params});

export const fetchSchoolTeachers = () => api.get("/admin/school/teachers");

export const fetchSchoolActivity = (params = {}) =>
  api.get("/admin/school/activity", {params});

export const fetchSchoolHealth = () => api.get("/admin/school/health");

// ─────────────────────────────────────────────
// PLATFORM ADMIN (super admin only)
// ─────────────────────────────────────────────

export const fetchPlatformOverview = () => api.get("/admin/platform/overview");

export const fetchPlatformSchools = (params = {}) =>
  api.get("/admin/platform/schools", {params});

export const fetchPlatformSchoolDetail = (schoolId) =>
  api.get(`/admin/platform/schools/${schoolId}`);

export const fetchPlatformUsers = (params = {}) =>
  api.get("/admin/platform/users", {params});

export const fetchPlatformActivity = (params = {}) =>
  api.get("/admin/platform/activity", {params});

export const fetchPlatformHealth = () => api.get("/admin/platform/health");
