import {create} from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null, // full user object — not just firstName
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  requiredData: null,

  initialize: async () => {
    if (get().isAuthenticated) return;
    set({isCheckingAuth: true});
    try {
      await get().checkAuth();
    } finally {
      set({isCheckingAuth: false});
    }
  },

  signUp: async (email, password, firstName, lastName) => {
    set({isLoading: true, error: null, isAuthenticated: false});
    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${url}/api/create-account`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, firstName, lastName, password}),
        credentials: "include",
      });

      const fetchedData = await response.json();

      if (!response.ok) {
        throw new Error(fetchedData.message || "Signup failed !");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: fetchedData.data || null,
        requiredData: null,
      });

      return fetchedData;
    } catch (error) {
      console.log(error);
      set({error: error.message, isLoading: false, isAuthenticated: false});
      return Promise.reject(error);
    }
  },

  logIn: async (email, password) => {
    set({isLoading: true, error: null, isAuthenticated: false});

    try {
      const link = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${link}/api/login/686939ac65244f797d3334b7`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email, password}),
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "LOGIN FAILED !");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.data || null, // full user object
        requiredData: null,
      });

      return data;
    } catch (error) {
      console.log(error);
      set({isLoading: false, error: error.message, isAuthenticated: false});
      throw error;
    }
  },

  verify: async (code) => {
    set({isLoading: true, isAuthenticated: false, error: null});

    try {
      const fetchurl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${fetchurl}/api/verify`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({code}),
      });

      const data = await response.json();
      console.log("data", data);

      set({isLoading: false, isAuthenticated: true, error: null});

      return data;
    } catch (error) {
      set({error: error.message, isLoading: false});
      console.log(error);
      throw new Error(error.message);
    }
  },

  checkAuth: async () => {
    set({
      isCheckingAuth: true,
      isAuthenticated: false,
      error: null,
      user: null,
      requiredData: null,
    });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-Auth`,
        {
          method: "GET",
          headers: {"Content-Type": "application/json"},
          credentials: "include",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Authentication check failed !");
      }

      const userData = data.data || null;
      const timetablesArray = userData?.timetables;
      const firstTimetableId =
        timetablesArray?.length > 0 ? timetablesArray[0] : null;

      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: true,
        user: userData, // full user object
        requiredData: firstTimetableId,
      });

      return true;
    } catch (error) {
      set({
        isCheckingAuth: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
        requiredData: null,
      });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      requiredData: null,
      error: null,
    });
  },
}));

useAuthStore.getState().initialize();
