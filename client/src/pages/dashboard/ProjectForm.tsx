import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createProject, updateProject, getProject } from "@/api/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectForm() {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [collaborators, setCollaborators] = useState(0);

  useEffect(() => {
    if (id) {
      (async () => {
        const project = await getProject(id);
        if (project) {
          setTitle(project.title);
          setDescription(project.description || "");
          setStatus(project.status);
          setCollaborators(project.collaborators);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const values = {
      user_id: user.id,
      title,
      description,
      status,
      collaborators,
    };

    if (id) {
      await updateProject(id, values);
    } else {
      await createProject(values);
    }
    navigate("/dashboard/projects");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Project" : "New Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="border rounded w-full p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <Label>Collaborators</Label>
              <Input
                type="number"
                value={collaborators}
                onChange={(e) => setCollaborators(Number(e.target.value))}
              />
            </div>
            <Button type="submit">{id ? "Update Project" : "Create Project"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
