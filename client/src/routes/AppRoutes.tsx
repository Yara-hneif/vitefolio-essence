import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Contact from "@/pages/Contact";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";

// Special pages
import UserPortfolioPage from "@/pages/UserPortfolioPage"; 

// Admin
import Admin from "@/features/admin/pages/Admin";
import AdminMessages from "@/features/admin/pages/AdminMessages";
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin"; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User portfolio: /@:handle */}
      <Route path="/@:handle" element={<UserPortfolioPage />} />

      {/* Admin (single source of truth) */}
      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <Admin />
          </ProtectedAdmin>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedAdmin>
            <AdminMessages />
          </ProtectedAdmin>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
