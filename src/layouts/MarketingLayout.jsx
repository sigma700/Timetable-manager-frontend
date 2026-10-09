import React, {Suspense, useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import MarketingNav from "./nav/MarketingNav";
import Footer from "../pages/components/footer";
import LoadingSpinner from "../pages/components/spinner";
import PageSeo from "../seo/PageSeo";

// "/#features" style links: react-router changes the URL but does not scroll.
function ScrollToHash() {
  const {pathname, hash} = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
  }, [pathname, hash]);
  return null;
}

/** Public website: navbar + content + footer. */
export default function MarketingLayout() {
  return (
    <div className="ui-layout">
      <PageSeo />
      <ScrollToHash />
      <MarketingNav />
      <main className="ui-layout__main">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
