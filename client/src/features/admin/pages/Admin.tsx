import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs";
const AdminProjects = lazy(() => import("@/features/admin/pages/AdminProjects")); 

const Admin = () => {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your portfolio content and settings.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="projects" className="max-w-5xl mx-auto">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              {/* Renders the Projects admin including the GitHub Sync (Server) card with the Enable switch */}
              <AdminProjects />
            </TabsContent>

            <TabsContent value="profile">
              <p className="text-muted-foreground">Profile settings coming soon...</p>
            </TabsContent>

            <TabsContent value="settings">
              <p className="text-muted-foreground">Account settings coming soon...</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;
