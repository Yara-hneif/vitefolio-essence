import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLoader from "@/components/common/AppLoader";

// Public pages
const Home = lazy(() => import("@/pages/Home"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Special pages
const UserPortfolioPage = lazy(() => import("@/pages/UserPortfolioPage"));

// Admin
const Admin = lazy(() => import("@/features/admin/pages/Admin"));
const AdminMessages = lazy(() => import("@/features/admin/pages/AdminMessages"));
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin";

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User portfolio */}
        <Route path="/@:handle" element={<UserPortfolioPage />} />

        {/* Admin */}
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
    </Suspense>
  );
}
