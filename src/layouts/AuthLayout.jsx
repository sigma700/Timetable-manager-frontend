import React from "react";
import {Outlet} from "react-router-dom";
import MarketingNav from "./nav/MarketingNav";

/**
 * Login, sign-up and verification. Logo and a way back to the public site,
 * nothing else — no footer, no feature links competing with the form.
 */
export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav minimal />
      <main className="flex-grow"><Outlet /></main>
    </div>
  );
}
