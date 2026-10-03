import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuthStore} from "../store/authStore";
import {deriveStage, homeForStage} from "./stage";
import LoadingSpinner from "../pages/components/spinner";

/**
 * Route guard. Wrap a group of routes as a layout route:
 *
 *   { element: <Gate allow={[STAGE.READY]} />, children: [...] }
 *
 * If the person's stage is not allowed here they are sent to where they DO
 * belong (login → verify → onboarding → app). This replaces ProtectedRoute and
 * PublicOnlyRoute with one rule.
 *
 * This is a UX guard only. The backend independently enforces verification and
 * school ownership (see requireVerified / getUserSchoolId).
 */
export default function Gate({allow}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (isCheckingAuth) return <LoadingSpinner />;

  const stage = deriveStage({isAuthenticated, user});
  if (allow.includes(stage)) return <Outlet />;

  return (
    <Navigate
      to={homeForStage(stage)}
      replace
      state={{from: location.pathname + location.search}}
    />
  );
}
