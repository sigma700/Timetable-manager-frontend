import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import MarketingNav from "./nav/MarketingNav";
import Footer from "../pages/components/footer";
import LoadingSpinner from "../pages/components/spinner";

/**
 * Login, sign-up and verification with the shared public navigation and footer.
 */
export default function AuthLayout() {
  return (
    <div className="ui-layout">
      <MarketingNav minimal />
      <main className="ui-layout__main">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
