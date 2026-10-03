import React, {useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom";
import MarketingNav from "./nav/MarketingNav";
import Footer from "../pages/components/footer";

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
    <div className="flex flex-col min-h-screen">
      <ScrollToHash />
      <MarketingNav />
      <main className="flex-grow"><Outlet /></main>
      <Footer />
    </div>
  );
}
