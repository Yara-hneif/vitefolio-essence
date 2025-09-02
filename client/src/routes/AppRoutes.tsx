import { Routes, Route , Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLoader from "@/components/common/AppLoader";
import MainLayout from "@/components/layout/MainLayout";

// Public pages
const Home = lazy(() => import("@/pages/demo/Home"));
const Projects = lazy(() => import("@/pages/demo/Projects"));
const ProjectDetails = lazy(() => import("@/pages/demo/ProjectDetails"));
const Contact = lazy(() => import("@/pages/demo/Contact"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Landing = lazy(() => import("@/pages/Landing"));

// User profile & public sites
const UserPortfolioPage = lazy(() => import("@/pages/profolio/UserPortfolioPage"));
const PublicProfile = lazy(() => import("@/pages/profolio/PublicProfile"));
const PublicSite = lazy(() => import("@/pages/profolio/PublicSite"));

// Admin
const Admin = lazy(() => import("@/features/admin/pages/Admin"));
const AdminMessages = lazy(() => import("@/features/admin/pages/AdminMessages"));
const ProtectedAdmin  = lazy(() => import("@/features/admin/guards/ProtectedAdmin"));
const About  = lazy(() => import( "@/pages/demo/About"));

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
        <Route index element={<Landing />} />

        <Route element={<MainLayout />}>
          {/* Demo */}
          <Route path="/demo" element={<Home />} />
          <Route path="/demo/projects" element={<Projects />} />
          <Route path="/demo/projects/:slug" element={<ProjectDetails />} />
          <Route path="/demo/contact" element={<Contact />} />
          <Route path="/demo/about" element={<About />} />
        </Route>

    
          {/* Public profiles and sites */}
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/u/:username" element={<UserPortfolioPage />} />
          <Route path="/u/:username/:pageSlug" element={<PublicSite />} />


        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Dashboard */}
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
