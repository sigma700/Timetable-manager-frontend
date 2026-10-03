// routes/Gate.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { deriveStage, homeForStage } from "./stage";
import LoadingSpinner from "../pages/components/spinner";

export default function Gate({ allow }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isCheckingAuth  = useAuthStore((s) => s.isCheckingAuth);
  const user            = useAuthStore((s) => s.user);
  const location        = useLocation();

  if (isCheckingAuth) return <LoadingSpinner />;

  const stage = deriveStage({ isAuthenticated, user });
  if (allow.includes(stage)) return <Outlet />;

  const target = homeForStage(stage);

  // ✅ Safety net: never Navigate to the path we're already on.
  if (target === location.pathname) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={target}
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}