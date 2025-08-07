
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProjectDetails from "@/pages/ProjectDetails";
import Login from "./pages/auth/Login";
import AuthGuard from "./components/auth/AuthGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import NewProject from "./pages/dashboard/NewProject";
import Profile from "./pages/dashboard/Profile";
import PublicProfile from "./pages/PublicProfile";
import DashboardProjects from "./pages/dashboard/Projects";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            
            {/* Public routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public profile */}
            <Route path="/u/:username" element={<PublicProfile />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<DashboardProjects />} />
              <Route path="projects/new" element={<NewProject />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
