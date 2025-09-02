import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/feedback/tooltip";
import { Toaster } from "@/components/ui/feedback/toaster";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import { initBuilder } from "@/features/builder";

// Auth & Admin
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/features/admin/hooks/useAdminMode"; 
import AdminUI from "@/components/layout/partials/AdminUI";

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
