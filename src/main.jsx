import React from "react";
import ReactDOM from "react-dom/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import App from "./App.jsx";
import "./index.css";
import useUiStore from "./store/uiStore.js";

// ─────────────────────────────────────────────
// REACT QUERY CLIENT (updated)
// ─────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 30000, // 30 seconds
    },
  },
});

// ─────────────────────────────────────────────
// THEME INIT — apply before first paint
// ─────────────────────────────────────────────
const {isDark} = useUiStore.getState();
if (isDark) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
