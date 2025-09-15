import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProjects, deleteProject, updateProject } from '@/api/project.api';
import type { Project } from '@/types/models/Project';
import { Button } from '@/components/ui/navigation/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/data-display/badge';
import { Trash2, Edit, Plus, Users, Calendar, CheckCircle, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const data = await listProjects(user.id);
      setProjects(data);
    })();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted');
    }
  };

  const togglePublish = async (p: Project) => {
    try {
      const newStatus = p.status === 'published' ? 'draft' : 'published';
      await updateProject(p.id, { status: newStatus });
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === p.id ? { ...proj, status: newStatus } : proj
        )
      );
      toast.success(
        `Project "${p.title}" is now ${newStatus === 'published' ? 'Published' : 'Draft'}`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update project status');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link to="/dashboard/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No projects yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const cover =
              p.cover_image && p.cover_image.trim() !== ''
                ? p.cover_image
                : p.gallery?.[0] || '/placeholder.svg';

            return (
              <Card key={p.id} className="overflow-hidden hover-lift">
                {cover && <img src={cover} alt={p.title} className="w-full h-40 object-cover" />}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {p.title}
                    <Badge
                      variant={p.status === 'published' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {p.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge>{p.status}</Badge>
                    {p.updated_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.updated_at).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {p.collaborators}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/dashboard/projects/${p.id}/edit`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={p.status === 'published' ? 'secondary' : 'default'}
                      onClick={() => togglePublish(p)}
                      className="gap-1"
                    >
                      {p.status === 'published' ? (
                        <>
                          <EyeOff className="h-4 w-4" /> Unpublish
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" /> Publish
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
