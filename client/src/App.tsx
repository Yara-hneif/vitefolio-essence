import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { initBuilder } from "@/components/builder";

// Auth & Admin
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/features/admin/hooks/useAdminMode"; 
import AdminUI from "@/components/sidebar/AdminUI";

// Routes
import AppRoutes from "@/routes/AppRoutes";

// Initialize Builder.io
initBuilder();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <AuthProvider>
          <AdminProvider>

            <AppRoutes />

            <AdminUI />

          </AdminProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
