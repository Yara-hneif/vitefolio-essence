import {Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext"; 
import { useLocation } from "react-router-dom";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";
const AdminSidebar  = lazy(() => import("@/features/admin/components/sidebar/AdminSidebar"));
const AdminFab  = lazy(() => import("@/features/admin/components/sidebar/AdminFab"));
const AdminProjectsPanel  = lazy(() => import("@/features/admin/components/projects/AdminProjectsPanel"));
const AdminSettingsPanel  = lazy(() => import("@/features/admin/components/settings/AdminSettingsPanel"));
const AdminInboxPanel  = lazy(() => import("@/features/admin/components/inbox/AdminInboxPanel"));

export default function AdminUI() {
  const { pathname } = useLocation();
  const { inboxOpen, closeInbox } = useAdmin();
  const { isAuthenticated } = useAuth();

  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  
  if (!isAuthenticated) return null;

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
