import {create} from "zustand";
import {persist} from "zustand/middleware";

const useUiStore = create(
  persist(
    (set) => {
      let systemThemeQuery = null;
      let systemThemeChangeHandler = null;

      const applyTheme = (theme) => {
        const isDark =
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
            : theme === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        return isDark;
      };

      const syncSystemThemeListener = (theme) => {
        if (systemThemeQuery && systemThemeChangeHandler) {
          systemThemeQuery.removeEventListener("change", systemThemeChangeHandler);
        }
        systemThemeQuery = null;
        systemThemeChangeHandler = null;

        if (theme === "system") {
          systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
          systemThemeChangeHandler = (event) => {
            document.documentElement.classList.toggle("dark", event.matches);
            set({isDark: event.matches});
          };
          systemThemeQuery.addEventListener("change", systemThemeChangeHandler);
        }
      };

      return {
        // ─────────────────────────────────────────────
        // THEME
        // ─────────────────────────────────────────────
        isDark: false,
        theme: "light",

        toggleDark: () =>
          set((state) => {
            const next = !state.isDark;
            const theme = next ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next);
            syncSystemThemeListener(theme);
            return {isDark: next, theme};
          }),

        setTheme: (theme) =>
          set(() => {
            if (!["light", "dark", "system"].includes(theme)) {
              throw new Error(`Unsupported theme: ${theme}`);
            }
            const isDark = applyTheme(theme);
            syncSystemThemeListener(theme);
            return {theme, isDark};
          }),

        initTheme: () =>
          set((state) => {
            const theme = state.theme || (state.isDark ? "dark" : "light");
            const isDark = applyTheme(theme);
            syncSystemThemeListener(theme);
            return {theme, isDark};
          }),

        // ─────────────────────────────────────────────
        // SIDEBAR
        // ─────────────────────────────────────────────
        sidebarCollapsed: false,

        toggleSidebar: () =>
          set((state) => ({sidebarCollapsed: !state.sidebarCollapsed})),

        setSidebarCollapsed: (value) => set({sidebarCollapsed: value}),
      };
    },
    {
      name: "tm-ui", // localStorage key
      partialize: (state) => ({
        isDark: state.isDark,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        theme:
          persistedState?.theme ??
          (persistedState?.isDark ? "dark" : "light"),
      }),
    },
  ),
);

export default useUiStore;
