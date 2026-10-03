import React from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";
import protibaLogo from "/new-protiba-logo.png";
import {useAuthStore} from "../store/authStore";
import {NAV_CSS} from "./nav/navStyles";

/**
 * School setup. A signed-in, verified user who has no school yet. The only
 * exits are "keep going" and "sign out" — no product navigation, because there
 * is no product to navigate until the school exists.
 */
export default function OnboardingLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pn">
        <style>{NAV_CSS}</style>
        <div className="pn__inner">
          <Link to="/onboarding" className="pn__logo" aria-label="Protiba">
            <img src={protibaLogo} alt="Protiba" />
          </Link>
          <div className="pn__actions">
            <button type="button" className="pn__btn pn__btn--ghost"
              onClick={async () => { await logout(); navigate("/", {replace: true}); }}>
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow"><Outlet /></main>
    </div>
  );
}
