import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import { Mail, Edit3, LogOut, X, Settings, FolderCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const {
    isAdmin,
    isEditMode,
    open,
    unread,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    closeAllPanels,
    toggleEditMode,
    inboxOpen,
    openInbox,
    closeInbox,
    toggleInbox,
    projectsOpen,
    openProjects,
    closeProjects,
    settingsOpen,
    openSettings,
    closeSettings,
    logout,
  } = useAdmin();
  // Close sidebar on route change (optional polish if your app re-renders on navigation)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeSidebar]);
  if (!isAdmin) return null;
  const name = import.meta.env.VITE_PROFILE_NAME || "Admin";
  const avatar = import.meta.env.VITE_PROFILE_AVATAR || "/icons/avatar.png";

  return (
    <>
      {/* -------------------- Admin sidebar backdrop -------------------- */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeSidebar}
        aria-hidden
      />

      {/* -------------------- Admin sidebar -------------------- */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[320px] bg-white/90 dark:bg-zinc-900/90 shadow-2xl border-l backdrop-blur-md transition-transform ${open ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-label="Admin sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-xs text-muted-foreground">Admin Mode</div>
            </div>
          </div>
          <button
            className="p-2 rounded-full hover:bg-black/5 overflow-hidden focus:outline-none"
            onClick={() => {
              closeAllPanels();  
              toggleSidebar();
            }}
            aria-label="Profile"
          //aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">

          {/* -------------------- Inbox -------------------- */}
          <button
            className="w-full flex items-center justify-between rounded-xl border p-3 hover:bg-black/5"
            title="Inbox"
            onClick={() => {
              closeAllPanels();
              closeSidebar();
              toggleInbox();
            }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>Inbox</span>
            </div>
            {!!unread && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white">
                {unread}
              </span>
            )}
          </button>

          {/* -------------------- Projects Manager-------------------- */}
          <button
            className="w-full flex items-center gap-3 rounded-xl border p-3 hover:bg-black/5"
            title="Projects"
            onClick={() => {
              openProjects();
              closeSidebar();
            }}
          >
            <FolderCog className="w-5 h-5" />
            <span>Projects</span>
          </button>

          {/* -------------------- Edit Mode -------------------- */}
          <button
            className={`w-full flex items-center gap-3 rounded-xl border p-3 hover:bg-black/5 ${isEditMode ? "bg-purple-50 border-purple-200" : ""
              }`}
            onClick={toggleEditMode}
            title="Toggle Edit Mode"
          >
            <Edit3 className="w-5 h-5" />
            <span>{isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}</span>
          </button>

          {/* -------------------- Settings -------------------- */}
          <button
            className="w-full flex items-center gap-3 rounded-xl border p-3 hover:bg-black/5"
            title="Settings"
            onClick={() => {
              openSettings();
              closeSidebar();
            }}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          {/*------------------- Logout ---------------------*/}
          <button
            className="w-full flex items-center gap-3 rounded-xl border p-3 hover:bg-black/5"
            onClick={logout}
            title="Logout from Admin Mode"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
