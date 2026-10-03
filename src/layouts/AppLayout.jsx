import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import AppNav from "./nav/AppNav";
import LoadingSpinner from "../pages/components/spinner";


export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNav />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
