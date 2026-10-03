import React, {lazy} from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import {STAGE} from "./stage";
import Gate from "./Gate";
import MarketingLayout from "../layouts/MarketingLayout";
import AuthLayout from "../layouts/AuthLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import AppLayout from "../layouts/AppLayout";

// Marketing + auth are small and needed immediately → eager.
import Home from "../pages/Home";
import Story from "../pages/Story";
import Contacts from "../pages/Contacts";
import Demo from "../pages/Demo";
import UserManual from "../pages/Manual";
import Terms from "../pages/Terms";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Verif from "../pages/Verif";
import Create from "../pages/Create"; // the onboarding wizard
import NotFound from "../pages/NotFound";

// Product pages are heavy → lazy, so public visitors never download them.
const MainPg = lazy(() => import("../pages/MainPg"));
const Timetables = lazy(() => import("../pages/Timetables"));
const Generation = lazy(() => import("../pages/Generation"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Invite = lazy(() => import("../pages/Invite"));
const AccountSettings = lazy(() => import("../pages/Acc-Settings"));
const Settings = lazy(() => import("../pages/Settings"));

const to = (path) => <Navigate to={path} replace />;

/**
 * ROUTE DOMAINS
 *   marketing   open to everyone, any stage
 *   auth        signed-out only
 *   verify      signed in, email not yet verified
 *   onboarding  verified, no school yet
 *   app         verified + school  (the product)
 *
 * Case: React Router matches paths case-insensitively, so the old /logIn and
 * /signUp URLs keep working at /login and /signup.
 */


export const router = createBrowserRouter([
  // ── Marketing ─────────────────────────────────
  {
    element: <MarketingLayout />,
    children: [
      {path: "/", element: <Home />},
      {path: "/our-story", element: <Story />},
      {path: "/resources", element: <UserManual />},
      {path: "/contact", element: <Contacts />},
      {path: "/demo", element: <Demo />},
      {path: "/terms", element: <Terms />},
      {path: "/how-it-works", element: to("/#how-it-works")},
      {path: "/features", element: to("/#features")},
    ],
  },

  // ── Authentication ────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      {
        element: <Gate allow={[STAGE.SIGNED_OUT]} />,
        children: [
          {path: "/login", element: <Login />},
          {path: "/signup", element: <SignUp />},
        ],
      },
      {
        element: <Gate allow={[STAGE.UNVERIFIED]} />,
        children: [{path: "/verify", element: <Verif />}],
      },
    ],
  },

  // ── Onboarding ────────────────────────────────
  {
    element: <Gate allow={[STAGE.NEEDS_SCHOOL]} />,
    children: [
      {
        element: <OnboardingLayout />,
        children: [{path: "/onboarding", element: <Create />}],
      },
    ],
  },

  // ── Product ───────────────────────────────────
  {
    element: <Gate allow={[STAGE.READY]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {path: "/app", element: <MainPg />},
          {path: "/app/timetables", element: <Timetables />},
          {path: "/app/create", element: <Generation />},
          {path: "/app/reports", element: <div style={{paddingTop: 64}}><Analytics /></div>},
          {path: "/app/invite", element: <Invite />},
          {path: "/app/settings/account", element: <AccountSettings />},
          {path: "/app/settings/preferences", element: <Settings />},
        ],
      },
    ],
  },

  // ── Backward-compatible URLs (old → new) ──────
  {path: "/home", element: to("/app")},
  {path: "/home/timetables", element: to("/app/timetables")},
  {path: "/home/gentable", element: to("/app/create")},
  {path: "/home/create-table", element: to("/onboarding")},
  {path: "/home/invite", element: to("/app/invite")},
  {path: "/home/manual", element: to("/resources")},
  {path: "/home/story", element: to("/our-story")},
  {path: "/home/contacts", element: to("/contact")},
  {path: "/home/demo", element: to("/demo")},
  {path: "/analytics", element: to("/app/reports")},
  {path: "/settings/account", element: to("/app/settings/account")},
  {path: "/settings/preferences", element: to("/app/settings/preferences")},

  {path: "*", element: <NotFound />},
]);
