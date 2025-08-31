import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { initBuilder } from "@/components/builder";

// Layouts & pages
import MainLayout from "@/components/layout/MainLayout";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import ProjectDetails from "@/pages/ProjectDetails";

// Dashboard
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import DashboardProjects from "@/pages/dashboard/Projects";
import NewProject from "@/pages/dashboard/NewProject";
import Profile from "@/pages/dashboard/Profile";
import Editor from "@/pages/dashboard/Editor";

// Public profile
import PublicProfile from "@/pages/PublicProfile";
import PublicSite from "./pages/PublicSite";

// Admin
import { AdminProvider, useAdmin } from "@/features/admin/hooks/useAdminMode";
import AdminSidebar from "@/features/admin/components/sidebar/AdminSidebar";
import AdminFab from "@/features/admin/components/sidebar/AdminFab";
import AdminInboxPanel from "@/features/admin/components/inbox/AdminInboxPanel";
import AdminProjectsPanel from "@/features/admin/components/projects/AdminProjectsPanel";
import AdminSettingsPanel from "@/features/admin/components/settings/AdminSettingsPanel";
import Admin from "@/features/admin/pages/Admin";
import AdminMessages from "@/features/admin/pages/AdminMessages";
import AdminAccessGuard from "@/features/admin/guards/AdminAccessGuard";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Auth
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

initBuilder();

const queryClient = new QueryClient();

function AdminOverlays() {
  const { inboxOpen, closeInbox } = useAdmin();
  return <AdminInboxPanel open={inboxOpen} onClose={closeInbox} />;
}

function AdminUI() {
  const { pathname } = useLocation();
  const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!onAdmin) return null;
  return (
    <>
      <AdminSidebar />
      <AdminFab />
      <AdminProjectsPanel />
      <AdminSettingsPanel />
      <AdminOverlays />
    </>
  );
}

// Supabase-based guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AdminProvider>
          <AuthProvider>
            <Routes>
              {/* Public marketing/normal routes */}
              <Route path="/" element={<Landing />} />

              <Route path="/demo" element={<MainLayout />}>
                <Route index element={<Home />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Builder.io powered public sites */}
              <Route path="/u/:username" element={<PublicSite />} />
              <Route path="/u/:username/:pageSlug" element={<PublicSite />} />

              {/* Public profile */}
              <Route path="/profile/:username" element={<PublicProfile />} />
              <Route path="/:handle" element={<PublicProfile />} />

              {/* Protected dashboard */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<DashboardProjects />} />
                <Route path="projects/new" element={<NewProject />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Protected editor */}
              <Route
                path="/editor/:pageId"
                element={
                  <RequireAuth>
                    <Editor />
                  </RequireAuth>
                }
              />

              {/* Admin routes (protected via AdminAccessGuard) */}
              <Route
                path="/admin"
                element={
                  <AdminAccessGuard>
                    <Admin />
                  </AdminAccessGuard>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminAccessGuard>
                    <AdminMessages />
                  </AdminAccessGuard>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Admin floating UI that appears only on /admin* */}
            <AdminUI />
          </AuthProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
