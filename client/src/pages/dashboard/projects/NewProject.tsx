import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/navigation/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Textarea } from "@/components/ui/form/textarea";
import { Badge } from "@/components/ui/data-display/badge";
import { Plus, X, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function NewProject() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryInput, setGalleryInput] = useState("");

  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const filePath = `projects/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      toast.error("Image upload failed");
      return null;
    }
  };

  // Add tag
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((a) => [...a, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags((a) => a.filter((x) => x !== t));

  // Add gallery image via URL
  const addGalleryImage = () => {
    const img = galleryInput.trim();
    if (img && !gallery.includes(img)) setGallery((a) => [...a, img]);
    setGalleryInput("");
  };
  const removeGalleryImage = (img: string) =>
    setGallery((a) => a.filter((x) => x !== img));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    if (!user?.id) {
      toast.error("You must be logged in to create a project");
      return;
    }

    try {
      let finalCover = coverImage || null;
      let finalGallery = [...gallery];

      // Upload cover file if provided
      if (coverFile) {
        const uploaded = await uploadImage(coverFile);
        if (uploaded) finalCover = uploaded;
      }

      // Upload gallery files
      for (const file of galleryFiles) {
        const uploaded = await uploadImage(file);
        if (uploaded) finalGallery.push(uploaded);
      }

      await createProject.mutateAsync({
        profile_id: user.id,
        title,
        slug: slugify(title),
        description: desc,
        status,
        repo_url: github || undefined,
        live_url: live || undefined,
        cover_image: finalCover,
        gallery: finalGallery.length ? finalGallery : undefined,
        tags: (tags ?? []).map((t) => ({
          id: t.toLowerCase().replace(/\s+/g, "-"),
          name: t,
        })),
      });

      toast.success("Project created successfully");
      navigate("/dashboard/projects");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create project");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <h1 className="text-2xl font-bold">New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <select
            className="border rounded w-full p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>GitHub URL</Label>
            <Input value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>
          <div>
            <Label>Live URL</Label>
            <Input value={live} onChange={(e) => setLive(e.target.value)} />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <Label>Cover Image</Label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Main cover image URL"
          />
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <Label>Gallery Images</Label>
          <div className="flex gap-2">
            <Input
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addGalleryImage())
              }
              placeholder="Add image URL…"
            />
            <Button type="button" onClick={addGalleryImage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {!!gallery.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {gallery.map((img) => (
                <Badge key={img} variant="secondary" className="gap-1">
                  {img}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeGalleryImage(img)}
                  />
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Label>Or upload multiple images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Technologies</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add technology…"
            />
            <Button type="button" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {!!tags.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(t)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
