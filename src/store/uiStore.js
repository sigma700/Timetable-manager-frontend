import {create} from "zustand";
import {persist} from "zustand/middleware";

const useUiStore = create(
  persist(
    (set) => ({
      // ─────────────────────────────────────────────
      // DARK MODE
      // ─────────────────────────────────────────────
      isDark: true, // dark by default

      toggleDark: () =>
        set((state) => {
          const next = !state.isDark;
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return {isDark: next};
        }),

      initTheme: () =>
        set((state) => {
          if (state.isDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return {};
        }),

      // ─────────────────────────────────────────────
      // SIDEBAR
      // ─────────────────────────────────────────────
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({sidebarCollapsed: !state.sidebarCollapsed})),

      setSidebarCollapsed: (value) => set({sidebarCollapsed: value}),
    }),
    {
      name: "tm-ui", // localStorage key
      partialize: (state) => ({
        isDark: state.isDark,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

export default useUiStore;
