import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Project } from "@/types/models/Project";
import { Button } from "@/components/ui/navigation/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/overlay/dialog";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";

type ProjectFormValues = {
  id?: string;
  title: string;
  category?: string;
  slug?: string;
  status?: Project["status"];
  description?: string;
  cover_image?: string;
  gallery?: string[];
  live_url?: string;
  repo_url?: string;
  tags?: string[];
};

const emptyToUndefined = (v?: string) => {
  const s = v?.trim();
  return s ? s : undefined;
};

const defaultsFromInitial = (initial?: Partial<Project>): ProjectFormValues => {
  return {
    id: initial?.id,
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    slug: initial?.slug ?? "",
    status: (initial?.status as Project["status"]) ?? "draft",
    description: initial?.description ?? "",
    cover_image: initial?.cover_image ?? "",
    gallery: Array.isArray(initial?.gallery) ? initial?.gallery : [],
    live_url: initial?.live_url ?? "",
    repo_url: initial?.repo_url ?? "",
    tags: Array.isArray(initial?.tags) ? initial?.tags.map(t => t.name) : [],
  };
};

export type ProjectFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Project>;
  mode: "create" | "edit";
  submitting?: boolean;
  onSubmit: (payload: Partial<Project>) => Promise<void> | void;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onOpenChange,
  initial,
  mode,
  submitting = false,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<ProjectFormValues>({
    defaultValues: defaultsFromInitial(initial),
    values: defaultsFromInitial(initial),
  });


  const tagsArray = watch("tags") ?? [];
  const tagsText = useMemo(
    () => (tagsArray.length ? tagsArray.join(", ") : ""),
    [tagsArray]
  );

  const galleryArray = watch("gallery") ?? [];
  const galleryText = useMemo(
    () => (galleryArray.length ? galleryArray.join(", ") : ""),
    [galleryArray]
  );

  const submitHandler = async (data: ProjectFormValues) => {
    const payload: Partial<Project> = {
      id: data.id,
      title: data.title.trim(),
      category: emptyToUndefined(data.category),
      slug: emptyToUndefined(data.slug),
      status: data.status,
      description: emptyToUndefined(data.description),
      cover_image: emptyToUndefined(data.cover_image),
      gallery: (data.gallery ?? []).filter(Boolean),
      live_url: emptyToUndefined(data.live_url),
      repo_url: emptyToUndefined(data.repo_url),
      tags: (data.tags ?? []).map(t => ({
        id: t.toLowerCase().replace(/\s+/g, "-"),
        name: t,
      })),
    };
    await onSubmit(payload);
    reset(defaultsFromInitial(undefined));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset(defaultsFromInitial(undefined));
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Project" : "Add Project"}</DialogTitle>
          <DialogDescription className="sr-only">
            {mode === "edit"
              ? "Edit the selected project's details."
              : "Create a new project by filling out the fields below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: true })} />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status") ?? "draft"}
                onValueChange={(val) =>
                  setValue("status", val as Project["status"], { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="cover_image">Cover Image (URL)</Label>
              <Input id="cover_image" {...register("cover_image")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="gallery">Gallery (comma separated URLs)</Label>
              <Input
                id="gallery"
                value={galleryText}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setValue("gallery", arr, { shouldDirty: true });
                }}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input id="live_url" {...register("live_url")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="repo_url">Repo URL</Label>
              <Input id="repo_url" {...register("repo_url")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagsText}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setValue("tags", arr, { shouldDirty: true });
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={submitting || (mode === "create" && !isDirty)}
            >
              {submitting
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
                : mode === "edit"
                  ? "Save"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;