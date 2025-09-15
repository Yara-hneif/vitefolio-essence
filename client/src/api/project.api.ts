import { supabase } from '@/lib/supabase';
import type { Project, DbProject, DbProjectInsert, DbProjectUpdate } from '@/types/models/Project';

const FALLBACK_IMAGE = '/placeholder.svg';

/* -----------------------
   Types for relation tables
----------------------- */
export type DbProjectTag = {
  project_id: string;
  tag_id: string;
};

/* -----------------------
   Helpers
----------------------- */

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

/** Fetch tags linked to a project */
async function fetchProjectTags(projectId: string): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase
    .from('project_tags')
    .select('tags ( id, name )')
    .eq('project_id', projectId);

  if (error) {
    console.error('Failed to fetch tags', error);
    return [];
  }

  return (data ?? []).map((row: any) => row.tags).filter(Boolean) as { id: string; name: string }[];
}

/** Map DB row → frontend Project */
async function mapDbProjectToProject(db: DbProject): Promise<Project> {
  const tags = await fetchProjectTags(db.id);

  return {
    ...db,
    description: db.description ?? null,
    status: db.status ?? 'draft',
    collaborators: typeof db.collaborators === 'number' ? db.collaborators : 0,
    updated_at: db.updated_at ?? db.created_at ?? new Date().toISOString(),
    created_at: db.created_at ?? null,

    cover_image: db.cover_image,
    gallery: Array.isArray(db.gallery) ? db.gallery : db.gallery ? [db.gallery] : [FALLBACK_IMAGE],

    live_url: db.live_url ?? null,
    repo_url: db.repo_url ?? null,
    category: db.category ?? null,
    tags,
  };
}

/* -----------------------
   Project Queries
----------------------- */

export async function listProjects(profileId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', profileId)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return await Promise.all((data ?? []).map((row) => mapDbProjectToProject(row as DbProject)));
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();

  if (error) throw error;
  return data ? await mapDbProjectToProject(data as DbProject) : null;
}

export async function createProject(values: Partial<Project>) {
  const computedSlug = values.slug ?? (values.title ? toSlug(values.title) : undefined);

  if (!computedSlug) {
    throw new Error('Slug or title is required to create a project.');
  }

  const payload: DbProjectInsert = {
    title: values.title ?? 'Untitled Project',
    slug: computedSlug,
    profile_id: values.profile_id ?? null,
    description: values.description ?? null,
    status: values.status ?? 'draft',
    collaborators: values.collaborators ?? 0,
    updated_at: values.updated_at ?? new Date().toISOString(),
    created_at: values.created_at ?? new Date().toISOString(),

    cover_image: values.cover_image ?? null,
    gallery: values.gallery ?? [],

    live_url: values.live_url ?? null,
    repo_url: values.repo_url ?? null,
    category: values.category ?? null,
    is_public: values.is_public ?? null,
    published: values.published ?? false,
  };

  const { data, error } = await supabase.from('projects').insert(payload).select().single();

  if (error) throw error;
  return await mapDbProjectToProject(data as DbProject);
}

export async function updateProject(id: string, values: Partial<Project>) {
  const changes: DbProjectUpdate = {
    title: values.title,
    slug: values.slug,
    profile_id: values.profile_id,
    description: values.description,
    status: values.status,
    collaborators: values.collaborators,
    updated_at: values.updated_at ?? new Date().toISOString(),

    cover_image: values.cover_image,
    gallery: values.gallery,

    live_url: values.live_url,
    repo_url: values.repo_url,
    category: values.category,
    is_public: values.is_public,
    published: values.published,
  };

  const { data, error } = await supabase
    .from('projects')
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return await mapDbProjectToProject(data as DbProject);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

/* -----------------------
   Project Tags (link/unlink)
----------------------- */

export async function addTagToProject(projectId: string, tagId: string) {
  const { error } = await supabase
    .from('project_tags')
    .insert({ project_id: projectId, tag_id: tagId });

  if (error) throw error;
}

export async function removeTagFromProject(projectId: string, tagId: string) {
  const { error } = await supabase
    .from('project_tags')
    .delete()
    .eq('project_id', projectId)
    .eq('tag_id', tagId);

  if (error) throw error;
}
