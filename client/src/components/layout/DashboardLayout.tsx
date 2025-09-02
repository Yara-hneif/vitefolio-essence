import { Suspense, lazy } from "react";
const Outlet = lazy(() =>
  import("react-router-dom").then((m) => ({ default: m.Outlet }))
);
const SidebarProvider = lazy(() =>
  import("@/components/ui/navigation/sidebar").then((m) => ({ default: m.SidebarProvider }))
);
const SidebarTrigger = lazy(() =>
  import("@/components/ui/navigation/sidebar").then((m) => ({ default: m.SidebarTrigger }))
);
const AppSidebar = lazy(() => import("@/components/layout/partials/sidebar/AppSidebar"));
const AdminUI = lazy(() => import("@/components/layout/partials/AdminUI"));


const DashboardLayout = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center h-full px-4 gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Dashboard</span>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
            <AdminUI />

          </div>
        </div>
      </SidebarProvider>
    </Suspense>
  );
};

export default DashboardLayout;
