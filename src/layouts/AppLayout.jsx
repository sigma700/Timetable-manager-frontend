import React, {Suspense} from "react";
import {Outlet} from "react-router-dom";
import AppNav from "./nav/AppNav";
import LoadingSpinner from "../pages/components/spinner";
import Footer from "../pages/components/footer";
import PageSeo from "../seo/PageSeo";


export default function AppLayout() {
  return (
    <div className="ui-layout">
      <PageSeo privateRoute />
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
