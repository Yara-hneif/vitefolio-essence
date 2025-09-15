import type { Database } from '@/types/database.types';

export type DbProject = Database['public']['Tables']['projects']['Row'];
export type DbProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

const FALLBACK_IMAGE = '/placeholder.svg';

/**
 * Frontend Project type:
 * - Normalizes collaborators (Json → number)
 * - Normalizes gallery with a fallback
 * - Adds tags[] joined from project_tags
 * - Expands with profile relation
 */
export interface Project extends Omit<DbProject, 'collaborators' | 'gallery'> {
  collaborators: number;
  cover_image: string | null;
  gallery: string[];
  tags: { id: string; name: string }[];

  profile_rel?: {
    id: string;
    name?: string | null;
    username: string;
    avatar?: string | null;
  };
}

export function mapDbProjectToProject(db: any): Project {
  return {
    ...db,
    collaborators: (db.collaborators as number) ?? 0,
    cover_image: db.cover_image,
    gallery: Array.isArray(db.gallery) ? db.gallery : db.gallery ? [db.gallery] : [FALLBACK_IMAGE],
    tags: Array.isArray(db.tags)
      ? db.tags.map((t: any) => ({
          id: t.id,
          name: t.name,
        }))
      : [],
  };
}
