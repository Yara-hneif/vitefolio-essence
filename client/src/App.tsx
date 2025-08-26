import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

import { AdminProvider, useAdmin } from "@/features/admin/hooks/useAdminMode";
import AdminSidebar from "@/features/admin/components/sidebar/AdminSidebar";
import AdminFab from "@/features/admin/components/sidebar/AdminFab";
import AdminInboxPanel from "@/features/admin/components/inbox/AdminInboxPanel";
import AdminProjectsPanel from "@/features/admin/components/projects/AdminProjectsPanel";
import AdminSettingsPanel from "@/features/admin/components/settings/AdminSettingsPanel";

function AdminOverlays() {
  const { inboxOpen, closeInbox } = useAdmin();
  return <AdminInboxPanel open={inboxOpen} onClose={closeInbox} />;
}

// Simple guard for admin-only routes
function AdminRoute({ children }: { children: React.ReactElement }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        {/* AdminProvider must be inside BrowserRouter because it uses router hooks */}
        <AdminProvider>
          <Routes>
            {/* Public layout + pages */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Floating admin UI (only renders when isAdmin === true inside these components) */}
          <AdminSidebar />
          <AdminFab />
          <AdminProjectsPanel />
          <AdminSettingsPanel />
          <AdminOverlays />
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
