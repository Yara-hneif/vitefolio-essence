import { supabase } from "@/lib/supabase";

/* DB row as it actually comes from Supabase */
export type DbProject = {
  id: string;
  user_id: string | null;
  clerk_user_id?: string | null;
  title: string;
  description?: string | null;
  status?: string | null;
  collaborators?: number | null;
  updated_at?: string | null;
  created_at?: string | null;

  /* fields used in UI */
  slug: string; // required in DB
  cover_image?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

/* DB insert shape: mirror table requirements (slug must be string) */
type DbProjectInsert = {
  title: string;
  slug: string;
  user_id?: string | null;
  clerk_user_id?: string | null;
  description?: string | null;
  status?: string | null;
  collaborators?: number | null;
  updated_at?: string | null;
  created_at?: string | null;
  cover_image?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

/* Frontend type used by the app */
export type Project = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status?: string;
  collaborators: number;
  updated_at: string;
  created_at?: string;
  slug: string;
  cover_image?: string;
  live_url?: string;
  repo_url?: string;
  category?: string;
  tags?: string[];
};

/* Small helpers */
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

/* Map DB row → frontend Project (fill safe fallbacks) */
function mapDbProjectToProject(db: DbProject): Project {
  return {
    id: db.id,
    user_id: db.user_id ?? "",
    title: db.title,
    description: db.description ?? undefined,
    status: db.status ?? "draft",
    collaborators: db.collaborators ?? 0,
    updated_at: db.updated_at ?? db.created_at ?? new Date().toISOString(),
    created_at: db.created_at ?? undefined,
    slug: db.slug,
    cover_image: db.cover_image ?? undefined,
    live_url: db.live_url ?? undefined,
    repo_url: db.repo_url ?? undefined,
    category: db.category ?? undefined,
    tags: Array.isArray(db.tags) ? db.tags : undefined,
  };
}

/* -------- Queries -------- */

export async function listProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as DbProject[] | null)?.map(mapDbProjectToProject) ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapDbProjectToProject(data as DbProject) : null;
}

export async function createProject(values: Partial<Project>) {
  // Ensure slug is a concrete string for DB insert
  const computedSlug =
    values.slug ??
    (values.title ? toSlug(values.title) : undefined);

  if (!computedSlug) {
    throw new Error("Slug or title is required to create a project.");
  }

  // Build a strictly-typed payload that satisfies the insert signature
  const payload: DbProjectInsert = {
    title: values.title ?? "Untitled Project",
    slug: computedSlug,
    user_id: values.user_id ?? null,
    description: values.description ?? null,
    status: values.status ?? "draft",
    collaborators: values.collaborators ?? 0,
    updated_at: values.updated_at ?? new Date().toISOString(),
    created_at: values.created_at ?? new Date().toISOString(),
    cover_image: values.cover_image ?? null,
    live_url: values.live_url ?? null,
    repo_url: values.repo_url ?? null,
    category: values.category ?? null,
    tags: values.tags ?? null,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(payload) // payload.slug is guaranteed (string), so overload matches
    .select()
    .single();

  if (error) throw error;
  return mapDbProjectToProject(data as DbProject);
}

export async function updateProject(id: string, values: Partial<Project>) {
  // Supabase update accepts partials of the insert shape; coerce to that shape
  const changes: Partial<DbProjectInsert> = {
    title: values.title,
    // slug can be updated; if provided ensure it's a string
    slug: values.slug,
    user_id: values.user_id,
    description: values.description,
    status: values.status,
    collaborators: values.collaborators,
    updated_at: values.updated_at ?? new Date().toISOString(),
    cover_image: values.cover_image,
    live_url: values.live_url,
    repo_url: values.repo_url,
    category: values.category,
    tags: values.tags,
  };

  const { data, error } = await supabase
    .from("projects")
    .update(changes)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapDbProjectToProject(data as DbProject);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
