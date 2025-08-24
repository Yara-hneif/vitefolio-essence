import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/features/admin/pages/Admin";
import NotFound from "@/pages/NotFound";
import { ADMIN_SECRET } from "@/lib/config";
import { useEffect, useState } from "react";
const queryClient = new QueryClient();

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState<null | boolean>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const key = params.get("key");

    if (key === ADMIN_SECRET) {
      localStorage.setItem("admin_access", "granted");
      setIsAllowed(true);

      params.delete("key");
      const cleanUrl = `${location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", cleanUrl);
    } else if (localStorage.getItem("admin_access") === "granted") {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, [location]);

    if (isAllowed === null) return null;
    return isAllowed ? <>{children}</> : <Navigate to="/" />;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={ 
              <ProtectedAdmin>
                <Admin/>
              </ProtectedAdmin>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
