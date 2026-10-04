// store/authStore.js
import { create } from "zustand";
import { deriveStage } from "../routes/stage";

const API = () => import.meta.env.VITE_BACKEND_URL;
const LOGIN_PATH = "/api/login/686939ac65244f797d3334b7";
const CHECK_AUTH_TIMEOUT_MS = 8000;

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  requiredData: null,

  signUp: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API()}/api/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, password }),
        credentials: "include",
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "Signup failed !");

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.data || null,
        requiredData: null,
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API()}${LOGIN_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "LOGIN FAILED !");

      const user = data.data || null;
      set({
        isLoading: false,
        isAuthenticated: true,
        user,
        requiredData: user?.timetables?.[0] ?? null,
      });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message, isAuthenticated: false });
      throw error;
    }
  },

  verify: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API()}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await readJson(response);
      if (!response.ok) {
        const err = new Error(data.message || "Verification failed !");
        err.code = data.code;
        throw err;
      }
      set({
        isLoading: false,
        error: null,
        isAuthenticated: true,
        user: data.data || get().user,
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resendCode: async () => {
    set({ error: null });
    const response = await fetch(`${API()}/api/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await readJson(response);
    if (!response.ok) {
      const err = new Error(data.message || "Could not send a new code.");
      err.code = data.code;
      set({ error: err.message });
      throw err;
    }
    return data;
  },

  completeOnboarding: async (payload, { beforeSessionUpdate } = {}) => {
    set({ error: null });
    const response = await fetch(`${API()}/api/onboarding`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await readJson(response);

    if (!response.ok) {
      if (data.code === "EMAIL_NOT_VERIFIED" || data.code === "SCHOOL_EXISTS") {
        await get().checkAuth({ silent: true });
      }
      const err = new Error(
        data.message || "We couldn't set up your school. Please try again."
      );
      err.code = data.code;
      err.fields = data.errors;
      throw err;
    }

    const user = data.data?.user ?? null;
    if (beforeSessionUpdate) await beforeSessionUpdate();
    set({
      user,
      isAuthenticated: Boolean(user),
      requiredData: user?.timetables?.[0] ?? null,
    });
    return data.data;
  },

  // checkAuth is now *guaranteed* to clear `isCheckingAuth`, even if the
  // network hangs or throws. The AbortController enforces a hard ceiling.
  checkAuth: async ({ silent = false } = {}) => {
    if (!silent) set({ isCheckingAuth: true, error: null });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CHECK_AUTH_TIMEOUT_MS);

    try {
      const response = await fetch(`${API()}/api/check-Auth`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
      });
      const data = await readJson(response);

      if (!response.ok) {
        set({
          isCheckingAuth: false,
          error: null,
          isAuthenticated: false,
          user: null,
          requiredData: null,
        });
        return false;
      }

      const user = data.data || null;
      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: Boolean(user),
        user,
        requiredData: user?.timetables?.[0] ?? null,
      });
      return true;
    } catch {
      // Network error, CORS, abort, JSON failure — all land here.
      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: false,
        user: null,
        requiredData: null,
      });
      return false;
    } finally {
      clearTimeout(timer);
    }
  },

  logout: async () => {
    try {
      await fetch(`${API()}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        requiredData: null,
        error: null,
      });
    }
  },
}));

export const selectStage = (s) => deriveStage(s)?.stage ?? null;

// ─── Module-level bootstrap ────────────────────────────────────────────────
// Fires the moment this file is first imported (i.e. the first route that
// touches authStore). Promise-guarded so StrictMode/HMR/multi-import can
// never trigger a second checkAuth. Any error path still flips the flag off,
// so no route can ever be stuck on the spinner.
let _bootPromise = null;

export function bootstrapAuth() {
  if (_bootPromise) return _bootPromise;

  _bootPromise = (async () => {
    try {
      await useAuthStore.getState().checkAuth();
    } catch (err) {
      console.error("[auth] bootstrap failed", err);
    } finally {
      // Belt-and-braces: even if checkAuth somehow leaked the flag, kill it.
      if (useAuthStore.getState().isCheckingAuth) {
        useAuthStore.setState({ isCheckingAuth: false });
      }
    }
  })();

  return _bootPromise;
}

// Auto-run on import. This is the key line: no route can import authStore
// without triggering auth bootstrap. No component effect required.
bootstrapAuth();