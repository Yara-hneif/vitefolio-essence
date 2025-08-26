import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import { Mail } from "lucide-react";

export default function AdminFab() {
  const { isAdmin, toggleSidebar, unread, openInbox } = useAdmin(); 
  if (!isAdmin) return null;

  const avatar = import.meta.env.VITE_PROFILE_AVATAR || "/icons/avatar.png";

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2">
      <button
        type="button"
        onClick={openInbox}                 
        title="Inbox"
        className="rounded-full shadow-lg border bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md h-12 w-12 flex items-center justify-center"
        aria-label="Open Inbox"
      >
        <div className="relative">
          <Mail className="w-5 h-5" />
          {!!unread && (
            <span className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600 text-white">
              {unread}
            </span>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={toggleSidebar}
        title="Admin Sidebar"
        className="rounded-full shadow-lg border bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2"
        aria-label="Toggle Admin Sidebar"
      >
        <img className="w-8 h-8 rounded-full object-cover" src={avatar} alt="avatar" />
      </button>
    </div>
  );
}
