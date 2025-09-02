import { Suspense, lazy } from "react";

import { Outlet } from "react-router-dom";
const Header = lazy(() => import("@/components/layout/partials/Header"));
const Footer = lazy(() => import("@/components/layout/partials/Footer"));
const AdminUI = lazy(() => import("@/components/layout/partials/AdminUI"));

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <AdminUI />
      <Footer />
    </div>
  );
}
