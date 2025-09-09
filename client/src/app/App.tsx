import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/feedback/tooltip";
import { Toaster } from "@/components/ui/feedback/toaster";
import { Toaster as Sonner } from "@/components/ui/feedback/sonner";
import { initBuilder } from "@/features/builder";
import { useGlobalStructuredData } from "@/lib/globalStructuredData";

// Auth & Admin
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/features/admin/hooks/useAdminMode";

// Lazy loaded components
const AdminUI = lazy(() => import("@/components/layout/partials/AdminUI"));
const AppRoutes = lazy(() => import("@/routes/AppRoutes"));

// Initialize Builder.io SDK
initBuilder();

// React Query client instance
const queryClient = new QueryClient();

export default function App() {
  // Inject global structured data (Organization + WebSite JSON-LD)
  useGlobalStructuredData();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global notifications */}
        <Toaster />
        <Sonner />

        <AuthProvider>
          <AdminProvider>
            {/* Lazy-loaded routes and admin UI */}
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              }
            >
              <AppRoutes />
              <AdminUI />
            </Suspense>
          </AdminProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
