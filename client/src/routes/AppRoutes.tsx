import { Routes, Route } from "react-router-dom";

// Pages
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Contact from "@/pages/Contact";
import Admin from "@/features/admin/pages/Admin";
import AdminMessages from "@/features/admin/pages/AdminMessages";
import NotFound from "@/pages/NotFound";

// Protected Route Wrapper (based on localStorage key)
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <Admin />
          </ProtectedAdmin>
        }
      />

      {/* Optional: Sub-routes for admin messages */}
      <Route
        path="/admin/messages"
        element={
          <ProtectedAdmin>
            <AdminMessages />
          </ProtectedAdmin>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
