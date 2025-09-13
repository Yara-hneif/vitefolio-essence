import { Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";

const AdminSidebar = lazy(() => import("@/features/admin/components/sidebar/AdminSidebar"));
const AdminFab = lazy(() => import("@/features/admin/components/sidebar/AdminFab"));
const AdminProjectsPanel = lazy(() => import("@/features/admin/components/projects/AdminProjectsPanel"));
const AdminSettingsPanel = lazy(() => import("@/features/admin/components/settings/AdminSettingsPanel"));
const AdminInboxPanel = lazy(() => import("@/features/admin/components/inbox/AdminInboxPanel"));

export default function AdminUI() {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { isAdmin, inboxOpen, closeInbox } = useAdmin();

  const userIsAdmin =
    user?.role === "owner" ||
    user?.role === "super_admin" ||
    user?.role === "site_owner" ||
    user?.role === "site_admin";

  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  
  if (!isAuthenticated || !(isAdmin || userIsAdmin)) return null;


  return (
    <>
      <AdminSidebar />
      <AdminFab />

      {onAdmin && (
        <>
          <AdminProjectsPanel />
          <AdminSettingsPanel />
          <AdminInboxPanel open={inboxOpen} onClose={closeInbox} />
        </>
      )}
    </>
  );
}
