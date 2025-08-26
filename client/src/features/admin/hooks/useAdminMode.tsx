import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { SidebarClose } from "lucide-react";

// ===== Types =====
type AdminCtx = {
  isAdmin: boolean;
  isEditMode: boolean;
  open: boolean; // sidebar open
  unread: number;

  // Sidebar
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  closeAllPanels: () => void;

  // Edit mode
  toggleEditMode: () => void;

  // Inbox
  inboxOpen: boolean;
  openInbox: () => void;
  closeInbox: () => void;
  toggleInbox: () => void;

  // Projects panel
  projectsOpen: boolean;
  openProjects: () => void;
  closeProjects: () => void;

  // Settings panel  <-- NEW
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  // Session
  logout: () => void;
};

type AdminMessagesResponse = {
  items: Array<{ is_read: boolean }>;
  total: number;
  page: number;
  pageSize: number;
};

// ===== Context =====
const Ctx = createContext<AdminCtx | null>(null);

const SESSION_KEY = "admin.session.v1";
const TTL_MIN = 480;

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const [inboxOpen, setInboxOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Restore session
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const { secret, expiresAt } = JSON.parse(raw);
      if (secret && (!expiresAt || Date.now() < expiresAt)) {
        setIsAdmin(true);
        api.defaults.headers.common["x-admin-secret"] = secret;
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // noop
    }
  }, []);

  // Read ?key= and activate admin
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const key = sp.get("key");
    if (!key) return;

    const expected = import.meta.env.VITE_ADMIN_SECRET;
    if (expected && key === expected) {
      setIsAdmin(true);
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ secret: key, expiresAt: Date.now() + TTL_MIN * 60 * 1000 })
      );
      api.defaults.headers.common["x-admin-secret"] = key;

      // clean URL + open sidebar
      sp.delete("key");
      const next = location.pathname + (sp.toString() ? `?${sp}` : "");
      navigate(next, { replace: true });
      setOpen(true);
    } else {
      setIsAdmin(false);
      sessionStorage.removeItem(SESSION_KEY);
      delete api.defaults.headers.common["x-admin-secret"];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Poll unread count
  const POLL_MS = Number(import.meta.env.VITE_ADMIN_POLL_INTERVAL_MS ?? 15000);
  useEffect(() => {
    let t: number | undefined;
    let stop = false;
    async function poll() {
      try {
        if (!isAdmin || stop) return;
        const resp = await api.get<AdminMessagesResponse>("/api/admin/messages", {
          params: { page: 1, pageSize: 50 },
        });
        const items = Array.isArray(resp.data?.items) ? resp.data.items : [];
        const cnt = items.filter((i) => !i.is_read).length;
        setUnread(cnt);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          stop = true; // API not ready → stop polling
          // eslint-disable-next-line no-console
          console.warn("[ADMIN] messages API not found, stopping poll");
        }
      } finally {
        if (!stop && POLL_MS > 0) t = window.setTimeout(poll, POLL_MS);
      }
    }
    poll();
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isAdmin, POLL_MS]);

  // Actions
  const openSidebar = useCallback(() => {
    setOpen(true);
    closePanelsOnly();
  }, []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => {
    setOpen((v) => !v);
    closePanelsOnly();
  }, []);

  const toggleInbox = useCallback(() => setInboxOpen((v) => !v), []);
  const toggleEditMode = useCallback(() => setIsEditMode((v) => !v), []);

  const closePanelsOnly = useCallback(() => {
    setInboxOpen(false);
    setProjectsOpen(false);
    setSettingsOpen(false);
  }, []);
  
  const closeInbox = useCallback(() => setInboxOpen(false), []);
  const openInbox = useCallback(() => {
    closePanelsOnly();
    setInboxOpen(true);
  }, [closePanelsOnly]);

  const openProjects = useCallback(() => {
    closePanelsOnly();
    setProjectsOpen(true);
  }, [closePanelsOnly]);
  const closeProjects = useCallback(() => setProjectsOpen(false), []);


  const openSettings = useCallback(() => {
    closePanelsOnly();
    setSettingsOpen(true);
  }, [closePanelsOnly]);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);


  const closeAllPanels = useCallback(() => {
    closePanelsOnly();
    setInboxOpen(false);
    setProjectsOpen(false);
    setSettingsOpen(false);
    setOpen(false); closePanelsOnly
  }, [closePanelsOnly]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setIsEditMode(false);
    closeAllPanels();
    sessionStorage.removeItem(SESSION_KEY);
    delete api.defaults.headers.common["x-admin-secret"];
  }, [closeAllPanels]);



  const value = useMemo<AdminCtx>(
    () => ({
      isAdmin,
      isEditMode,
      open,
      unread,

      openSidebar,
      closeSidebar,
      toggleSidebar,
      closeAllPanels, // ensure exposed

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
    }),
    [
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
    ]
  );


  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
