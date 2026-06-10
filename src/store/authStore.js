// import { isCSSRequest } from 'vite';
import {create} from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  value: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  requiredData: null,

  initialize: async () => {
    if (get().isAuthenticated) return;

    set({isCheckingAuth: true});
    try {
      await get().checkAuth(); // Reuse your existing checkAuth function
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

      const userFirstName = fetchedData.data?.firstName || firstName || "User";

      set({
        isLoading: false,
        isAuthenticated: true,
        user: userFirstName,
        requiredData: null,
      });

      return fetchedData;
    } catch (error) {
      console.log(error);
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
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

      // ✅ Extract user first name from data.data
      const userFirstName = data.data?.firstName || "User";
      // No timetables array in this response → requiredData stays null
      // (the home page will show "No timetables yet")

      set({
        isLoading: false,
        isAuthenticated: true,
        user: userFirstName,
        requiredData: null, // will be fetched later if needed
      });

      return data;
    } catch (error) {
      console.log(error);
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
      throw error; // re-throw so the caller can handle it
    }
  },
  //action for email verification
  verify: async (code) => {
    set({isLoading: true, isAuthenticated: false, error: null});

    try {
      const fetchurl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${fetchurl}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({code}),
      });

      const data = await response.json();
      console.log("data", data);

      set({
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
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
      // ✅ Safe extraction
      const userFirstName = data.data?.firstName || null;
      const timetablesArray = data.data?.timetables;
      const firstTimetableId =
        timetablesArray?.length > 0 ? timetablesArray[0] : null;

      set({
        isCheckingAuth: false,
        error: null,
        isAuthenticated: true,
        user: userFirstName,
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
}));

useAuthStore.getState().initialize();
