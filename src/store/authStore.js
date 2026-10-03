import {create} from "zustand";
import {deriveStage} from "../routes/stage";

const API = () => import.meta.env.VITE_BACKEND_URL;

// NOTE: the backend route is still `/login/:school` and the param is unused.
// Once you change that route to plain `/login`, delete the suffix below.
const LOGIN_PATH = "/api/login/686939ac65244f797d3334b7";

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useAuthStore = create((set, get) => ({
  user: null, // safe user from the server: {_id, firstName, lastName, email, isVerified, school, institutionName, timetables[] …}
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true, // true until the first check-Auth answers → no flash of the wrong experience
  requiredData: null, // id of the first timetable (kept for existing pages)

  initialize: async () => {
    if (get().isAuthenticated) return;
    await get().checkAuth();
  },

  signUp: async (email, password, firstName, lastName) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API()}/api/create-account`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, firstName, lastName, password}),
        credentials: "include",
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "Signup failed !");

      // Signed in, but NOT verified. deriveStage() sends them to /verify.
      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.data || null,
        requiredData: null,
      });
      return data;
    } catch (error) {
      set({error: error.message, isLoading: false, isAuthenticated: false});
      throw error;
    }
  },

  logIn: async (email, password) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API()}${LOGIN_PATH}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
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
      set({isLoading: false, error: error.message, isAuthenticated: false});
      throw error;
    }
  },

  // Previously: never checked response.ok and set isAuthenticated:true for ANY
  // reply, so a wrong code still let the user into the app.
  verify: async (code) => {
    set({isLoading: true, error: null});
    try {
      const response = await fetch(`${API()}/api/verify`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({code}),
      });
      const data = await readJson(response);
      if (!response.ok) {
        const err = new Error(data.message || "Verification failed !");
        err.code = data.code;
        throw err;
      }
      set({isLoading: false, error: null, isAuthenticated: true, user: data.data || get().user});
      return data;
    } catch (error) {
      set({error: error.message, isLoading: false});
      throw error;
    }
  },

  resendCode: async () => {
    set({error: null});
    const response = await fetch(`${API()}/api/resend-verification`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
    });
    const data = await readJson(response);
    if (!response.ok) {
      const err = new Error(data.message || "Could not send a new code.");
      err.code = data.code;
      set({error: err.message});
      throw err;
    }
    return data;
  },

  /**
   * Finish school setup in ONE request: school + subjects + classes + teachers.
   * The server saves all of it or none of it, and answers with the updated user.
   * Putting that user in the store is what moves the person from /onboarding
   * into the product (deriveStage sees user.school) — no extra round-trip.
   *
   * Deliberately does not touch `isLoading`: the wizard shows its own
   * "submitting" state, and a global flag would replace the whole page.
   */
  completeOnboarding: async (payload) => {
    set({error: null});
    const response = await fetch(`${API()}/api/onboarding`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await readJson(response);

    if (!response.ok) {
      // The server says our picture of this user is out of date (unverified, or a
      // school already exists). Re-sync; the router then moves them correctly.
      if (data.code === "EMAIL_NOT_VERIFIED" || data.code === "SCHOOL_EXISTS") {
        await get().checkAuth({silent: true});
      }
      const err = new Error(data.message || "We couldn't set up your school. Please try again.");
      err.code = data.code;
      err.fields = data.errors;
      throw err;
    }

    const user = data.data?.user ?? null;
    set({user, isAuthenticated: Boolean(user), requiredData: user?.timetables?.[0] ?? null});
    return data.data;
  },

  /**
   * Ask the server who we are.
   *  - default: full check (used on app boot).
   *  - {silent:true}: refresh the user in place without flashing the spinner
   *    or clearing state (used after onboarding creates the school).
   */
  checkAuth: async ({silent = false} = {}) => {
    if (!silent) set({isCheckingAuth: true, error: null});
    try {
      const response = await fetch(`${API()}/api/check-Auth`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
      });
      const data = await readJson(response);

      if (!response.ok) {
        set({isCheckingAuth: false, error: null, isAuthenticated: false, user: null, requiredData: null});
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
      set({isCheckingAuth: false, error: null, isAuthenticated: false, user: null, requiredData: null});
      return false;
    }
  },

  // One logout for the whole app (nine pages used to each hand-roll this).
  // The session is cleared locally even if the server call fails.
  logout: async () => {
    try {
      await fetch(`${API()}/api/logout`, {method: "POST", credentials: "include"});
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      set({user: null, isAuthenticated: false, requiredData: null, error: null});
    }
  },
}));

export const selectStage = (s) => deriveStage(s);

useAuthStore.getState().initialize();
