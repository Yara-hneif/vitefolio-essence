import { useLocation } from "react-router-dom";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import AdminSidebar from "@/features/admin/components/sidebar/AdminSidebar";
import AdminFab from "@/features/admin/components/sidebar/AdminFab";
import AdminProjectsPanel from "@/features/admin/components/projects/AdminProjectsPanel";
import AdminSettingsPanel from "@/features/admin/components/settings/AdminSettingsPanel";
import AdminInboxPanel from "@/features/admin/components/inbox/AdminInboxPanel";

export default function AdminUI() {
  const { pathname } = useLocation();
  const { inboxOpen, closeInbox } = useAdmin();

  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!onAdmin) return null;

  return (
    <>
      <AdminSidebar />
      <AdminFab />
      <AdminProjectsPanel />
      <AdminSettingsPanel />
      <AdminInboxPanel open={inboxOpen} onClose={closeInbox} />
    </>
  );
}
