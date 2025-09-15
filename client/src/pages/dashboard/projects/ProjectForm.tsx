import { useAuth } from '@/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createProject, updateProject, getProject } from '@/api/project.api';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/data-display/card';
import { Textarea } from '@/components/ui/form/textarea';
import { Upload } from 'lucide-react';

export default function ProjectForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [collaborators, setCollaborators] = useState(0);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      (async () => {
        const project = await getProject(id);
        if (project) {
          setTitle(project.title);
          setDescription(project.description || '');
          setStatus((project.status as 'draft' | 'published') ?? 'draft');
          setCollaborators(project.collaborators || 0);
          if (project.cover_image) setCoverPreview(project.cover_image);
          if (project.gallery?.length) setGalleryPreviews(project.gallery);
        }
      })();
    }
  }, [id]);

  const uploadFile = async (file: File, folder: string) => {
    if (!user?.id) return null;

    const filePath = `${folder}/${user.id}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('media').upload(filePath, file, {
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("❌ No user found");
      return;
    }

    console.log("📌 handleSubmit fired!");

    try {
      let coverUrl = coverPreview;
      if (coverFile) {
        const uploaded = await uploadFile(coverFile, 'covers');
        console.log("📤 Cover uploaded:", uploaded);
        if (uploaded) coverUrl = uploaded;
      }

      const galleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const uploaded = await uploadFile(file, 'gallery');
          console.log("📤 Gallery uploaded:", uploaded);
          if (uploaded) galleryUrls.push(uploaded);
        }
      }

      const values = {
        profile_id: user.id,
        title,
        description,
        status,
        collaborators,
        cover_image: coverUrl || null,
        gallery: galleryUrls,
        published: status === 'published',
        is_public: status === 'published',
      };

      console.log("📦 Sending values to DB:", values);

      if (id) {
        const updated = await updateProject(id, values);
        console.log("✅ Project updated:", updated);
        navigate(`/dashboard/projects/${id}/edit`);
      } else {
        const newProject = await createProject(values);
        console.log("✅ Project created:", newProject);
        if (newProject?.id) {
          navigate(`/dashboard/projects/${newProject.id}/edit`);
        } else {
          console.warn("⚠️ Project creation returned null, fallback redirect");
          navigate('/dashboard/projects');
        }
      }
    } catch (err) {
      console.error('❌ Error saving project:', err);
    }
  };




  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Project' : 'New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <select
                className="border rounded w-full p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Collaborators */}
            <div>
              <Label>Collaborators</Label>
              <Input
                type="number"
                value={collaborators}
                onChange={(e) => setCollaborators(Number(e.target.value))}
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label>Cover Image</Label>
              <label className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-500" />
                <span>{coverFile ? coverFile.name : 'Choose cover image...'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCoverFile(file);
                    if (file) setCoverPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              {coverPreview && (
                <div className="mt-2">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="h-32 rounded object-cover"
                  />
                </div>
              )}
            </div>

            {/* Gallery Upload */}
            <div>
              <Label>Gallery Images</Label>
              <label className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-500" />
                <span>
                  {galleryFiles.length > 0
                    ? `${galleryFiles.length} file(s) selected`
                    : 'Choose gallery images...'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setGalleryFiles(files);
                    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  }}
                />
              </label>
              {galleryPreviews.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {galleryFiles.map((file, i) => (
                    <li key={i}>📷 {file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <Button type="submit">{id ? 'Update Project' : 'Create Project'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
