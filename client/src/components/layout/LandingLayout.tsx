import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
const Header = lazy(() => import("@/components/layout/partials/Header"));
const Footer = lazy(() => import("@/components/layout/partials/Footer"));
const AdminUI = lazy(() => import("@/components/layout/partials/AdminUI"));

export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <AdminUI />
      <Footer />
    </div>
  );
}
