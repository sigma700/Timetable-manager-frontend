import React, {useEffect} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

// ─── Existing pages ───────────────────────────────────────────────────────────
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Verif from "./pages/Verif";
import MainPg from "./pages/MainPg";
import {useAuthStore} from "./store/authStore";
import LoadingSpinner from "./pages/components/spinner";
import Create from "./pages/Create";
import Generation from "./pages/Generation";
import Timetables from "./pages/Timetables";
import Login from "./pages/Login";
import Terms from "./pages/Terms";
import UserManual from "./pages/Manual";
import Demo from "./pages/Demo";
import Invite from "./pages/Invite";
import Contacts from "./pages/Contacts";
import Footer from "./pages/components/footer";
import Story from "./pages/Story";
import AccountSettings from "./pages/Acc-Settings";

// ─── New dashboard pages ──────────────────────────────────────────────────────
// import Shell from "./components/layout/Shell";
import Analytics from "./pages/Analytics";
import Shell from "./pages/components/layout/Shell";

// ─────────────────────────────────────────────
// LAYOUT — wraps existing pages with footer
// ─────────────────────────────────────────────
const Layout = ({children}) => (
  <div className="flex flex-col min-h-screen">
    <div className="flex-grow">{children}</div>
    <Footer />
  </div>
);

// ─────────────────────────────────────────────
// DASHBOARD LAYOUT — wraps new dashboard pages
// with Shell (sidebar + topbar)
// ─────────────────────────────────────────────
const DashboardLayout = ({children}) => {
  const {user, isCheckingAuth} = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      useAuthStore.getState().logout();
      window.location.href = "/";
    }
  };

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Shell user={user} onLogout={handleLogout}>
      {children}
    </Shell>
  );
};

// ─────────────────────────────────────────────
// ROUTE GUARDS
// ─────────────────────────────────────────────
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, isCheckingAuth} = useAuthStore();
  if (isCheckingAuth) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const PublicOnlyRoute = ({children}) => {
  const {isAuthenticated, isCheckingAuth} = useAuthStore();
  if (isCheckingAuth) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
};

const RouteWrapper = ({
  children,
  isProtected = false,
  isPublicOnly = false,
}) => {
  if (isProtected) {
    return (
      <ProtectedRoute>
        <Layout>{children}</Layout>
      </ProtectedRoute>
    );
  }
  if (isPublicOnly) {
    return (
      <PublicOnlyRoute>
        <Layout>{children}</Layout>
      </PublicOnlyRoute>
    );
  }
  return <Layout>{children}</Layout>;
};

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Existing routes ──────────────────────────
  {
    path: "/settings/account",
    element: (
      <RouteWrapper isProtected>
        <AccountSettings />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/gentable",
    element: (
      <RouteWrapper isProtected>
        <Generation />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/timetables",
    element: (
      <RouteWrapper isProtected>
        <Timetables />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/manual",
    element: (
      <RouteWrapper isProtected>
        <UserManual />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/demo",
    element: (
      <RouteWrapper isProtected>
        <Demo />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/invite",
    element: (
      <RouteWrapper isProtected>
        <Invite />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/story",
    element: (
      <RouteWrapper>
        <Story />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/create-table",
    element: (
      <RouteWrapper isProtected>
        <Create />
      </RouteWrapper>
    ),
  },
  {
    path: "/home/contacts",
    element: (
      <RouteWrapper isProtected>
        <Contacts />
      </RouteWrapper>
    ),
  },
  {
    path: "/logIn",
    element: (
      <RouteWrapper isPublicOnly>
        <Login />
      </RouteWrapper>
    ),
  },
  {
    path: "/terms",
    element: (
      <RouteWrapper isPublicOnly>
        <Terms />
      </RouteWrapper>
    ),
  },
  {
    path: "/signUp",
    element: (
      <RouteWrapper isPublicOnly>
        <SignUp />
      </RouteWrapper>
    ),
  },
  {
    path: "/",
    element: (
      <RouteWrapper isPublicOnly>
        <Home />
      </RouteWrapper>
    ),
  },
  {
    path: "/home",
    element: (
      <RouteWrapper isProtected>
        <MainPg />
      </RouteWrapper>
    ),
  },

  // ── Dashboard routes ─────────────────────────
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
const App = () => {
  const {checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
};

export default App;
