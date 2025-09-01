import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLoader from "@/components/common/AppLoader";

// Public pages
const Home = lazy(() => import("@/pages/profolio/Home"));
const Projects = lazy(() => import("@/pages/profolio/Projects"));
const ProjectDetails = lazy(() => import("@/pages/profolio/ProjectDetails"));
const Contact = lazy(() => import("@/pages/profolio/Contact"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Landing = lazy(() => import("@/pages/main/Landing"));

// User profile & public sites
const UserPortfolioPage = lazy(() => import("@/pages/profolio/UserPortfolioPage"));
const PublicProfile = lazy(() => import("@/pages/profolio/PublicProfile"));
const PublicSite = lazy(() => import("@/pages/main/PublicSite"));

// Admin
const Admin = lazy(() => import("@/features/admin/pages/Admin"));
const AdminMessages = lazy(() => import("@/features/admin/pages/AdminMessages"));
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin";

// Dashboard
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Sites = lazy(() => import("@/pages/dashboard/Sites"));
const NewSite = lazy(() => import("@/pages/dashboard/NewSite"));
const ProjectsList = lazy(() => import("@/pages/dashboard/ProjectsList"));
const ProjectForm = lazy(() => import("@/pages/dashboard/ProjectForm"));
const Editor = lazy(() => import("@/pages/dashboard/Editor"));
const DashboardTemplates = lazy(() => import("@/pages/dashboard/DashboardTemplates"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/DashboardAnalytics"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/DashboardSettings"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* User profile */}
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/u/:username" element={<UserPortfolioPage />} />
        <Route path="/u/:username/:pageSlug" element={<PublicSite />} />

        {/* Dashboard (protected via higher-order component in App.tsx) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<Sites />} />
          <Route path="sites/new" element={<NewSite />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="editor/:pageId" element={<Editor />} />
          <Route path="templates" element={<DashboardTemplates />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

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
