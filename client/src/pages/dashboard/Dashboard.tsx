import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/navigation/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";
import { FolderOpen, Plus, Users, Eye, BarChart3, TrendingUp } from "lucide-react";

import { listSites, listPages, Site, SitePage } from "@/api/sites";
import { listProjects, Project } from "@/api/projects";

export default function Dashboard() {
  const { user } = useUser();
  const [sites, setSites] = useState<Site[]>([]);
  const [pages, setPages] = useState<SitePage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const username =
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "user";
  const siteSlug = username;

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);

      // Sites
      const mySites = await listSites(user.id);
      setSites(mySites);

      // Pages (for first site)
      if (mySites.length) {
        const sitePages = await listPages(mySites[0].id);
        setPages(sitePages);
      }

      // Projects
      const myProjects = await listProjects(user.id);
      setProjects(myProjects);

      setLoading(false);
    })();
  }, [user?.id]);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio and sites: /u/{siteSlug}
          </p>
        </div>
        <Link to="/dashboard/sites/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Site
          </Button>
        </Link>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>My Pages</CardTitle>
          <CardDescription>
            Manage your site pages and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : pages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No pages found. Create your first page to get started.
              </p>
              <Link to="/dashboard/sites/new">
                <Button variant="outline">Create First Page</Button>
              </Link>
            </div>
          ) : (
            pages.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    /u/{siteSlug}/{p.is_home ? "" : p.slug}
                    {p.is_home ? " (home)" : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/editor/${p.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <a
                    href={`/site/${siteSlug}/${p.is_home ? "" : p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </a>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+23 this week</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">Profile engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Projects
            <Link to="/dashboard/projects">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Your latest project activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground">No projects yet.</p>
          ) : (
            projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {project.collaborators} collaborator
                      {project.collaborators !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link to={`/dashboard/projects/${project.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/dashboard/projects/new" className="block">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </Link>
          <Link to="/dashboard/profile" className="block">
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </Link>
          <Link to={`/u/${username}`} className="block">
            <Button className="w-full justify-start" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
