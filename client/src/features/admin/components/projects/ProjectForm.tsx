// src/features/admin/components/ProjectForm.tsx
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Project } from "@/types/Project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectFormValues = {
  id?: string;
  title: string;
  category?: string;
  slug?: string;
  status?: Project["status"];
  description?: string;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
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
    imageUrl: initial?.imageUrl ?? "",
    liveUrl: initial?.liveUrl ?? "",
    repoUrl: initial?.repoUrl ?? "",
    tags: Array.isArray(initial?.tags) ? initial?.tags : [],
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

  const submitHandler = async (data: ProjectFormValues) => {
    const payload: Partial<Project> = {
      id: data.id,
      title: data.title.trim(),
      category: emptyToUndefined(data.category),
      slug: emptyToUndefined(data.slug),
      status: data.status,
      description: emptyToUndefined(data.description),
      imageUrl: emptyToUndefined(data.imageUrl),
      liveUrl: emptyToUndefined(data.liveUrl),
      repoUrl: emptyToUndefined(data.repoUrl),
      tags: (data.tags ?? []).filter(Boolean),
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
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input id="liveUrl" {...register("liveUrl")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input id="repoUrl" {...register("repoUrl")} />
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
