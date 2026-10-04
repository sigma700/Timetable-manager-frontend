import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import AppNav from "./nav/AppNav";
import LoadingSpinner from "../pages/components/spinner";
import Footer from "../pages/components/footer";


export default function AppLayout() {
  return (
    <div className="ui-layout">
      <AppNav />
      <main className="ui-layout__main">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
