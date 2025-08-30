import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Users, Eye, TrendingUp } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

export default function Dashboard() {
  const { projects = [], isLoading } = useProjects();

  const stats = useMemo(() => {
    const total = projects.length;
    return {
      total,
      collaborations: 0,  
      profileViews: "—",
      growth: "—",
    };
  }, [projects]);

  const recent = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return tb - ta;
    });
    return sorted.slice(0, 3);
  }, [projects]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "…" : stats.total}</div>
            <p className="text-xs text-muted-foreground">Across your work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collaborations}</div>
            <p className="text-xs text-muted-foreground">Shared projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.growth}</div>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Link to="/dashboard/projects">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="text-muted-foreground">No projects yet.</div>
            ) : recent.map(p => (
              <div key={p.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    {p.description && (
                      <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        {new Date(p.updatedAt || p.createdAt || 0).toLocaleDateString()}
                      </Badge>
                      {(p.tags || []).slice(0, 3).map(t => (
                        <Badge key={t} variant="secondary">#{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <Link to="/dashboard/projects">
                    <Button variant="ghost" size="sm">Open</Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard/projects/new">
              <Button className="w-full" variant="outline">Create New Project</Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button className="w-full" variant="outline">Update Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
