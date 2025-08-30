import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
}

export default function NewProject() {
  const navigate = useNavigate();
  const { createProject } = useProjects();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((a) => [...a, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags((a) => a.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await createProject.mutateAsync({
        title,
        slug: slugify(title),
        description: desc,
        repoUrl: github || undefined,
        url: live || undefined,         // أو liveUrl لو API عندك تستخدمه
        coverImage: image || undefined, // أو imageUrl
        tags,
      });
      toast.success("Project created");
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
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
        <div>
          <Label>Image URL</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <div>
          <Label>Technologies</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add technology…"
            />
            <Button type="button" onClick={addTag}><Plus className="h-4 w-4" /></Button>
          </div>
          {!!tags.length && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(t)} />
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
