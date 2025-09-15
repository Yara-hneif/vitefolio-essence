import { useAuth } from '@/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createProject, updateProject, getProject } from '@/api/project.api';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/card';
import { Textarea } from '@/components/ui/form/textarea';

export default function ProjectForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('planning');
  const [collaborators, setCollaborators] = useState(0);
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string>('');

  useEffect(() => {
    if (id) {
      (async () => {
        const project = await getProject(id);
        if (project) {
          setTitle(project.title);
          setDescription(project.description || '');
          setStatus(project.status ?? 'draft');
          setCollaborators(project.collaborators);
          setCoverImage(project.cover_image || '');
          setGallery(project.gallery?.join(', ') || '');
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const values = {
      profile_id: user.id,
      title,
      description,
      status,
      collaborators,
      cover_image: coverImage || null,
      gallery: gallery
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (id) {
      await updateProject(id, values);
    } else {
      await createProject(values);
    }
    navigate('/dashboard/projects');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Project' : 'New Project'}</CardTitle>
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
            <div>
              <Label>Cover Image (URL)</Label>
              <Input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div>
              <Label>Gallery (comma-separated URLs)</Label>
              <Textarea
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
                placeholder="https://img1.jpg, https://img2.png, ..."
              />
            </div>
            <Button type="submit">{id ? 'Update Project' : 'Create Project'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
