import React, {Suspense} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";
import protibaLogo from "/new-protiba-logo.png";
import {useAuthStore} from "../store/authStore";
import {NAV_CSS} from "./nav/navStyles";
import Footer from "../pages/components/footer";
import LoadingSpinner from "../pages/components/spinner";
import PageSeo from "../seo/PageSeo";


export default function OnboardingLayout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <div className="ui-layout">
      <PageSeo privateRoute />
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
      <main className="ui-layout__main">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
