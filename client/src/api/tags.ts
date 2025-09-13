import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

export type DbTag = Database["public"]["Tables"]["tags"]["Row"];
export type DbTagInsert = Database["public"]["Tables"]["tags"]["Insert"];
export type DbTagUpdate = Database["public"]["Tables"]["tags"]["Update"];

export type Tag = DbTag;

/* -----------------------
   Tag Queries
----------------------- */

/** List all tags */
export async function listTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

/** Get a single tag by ID */
export async function getTag(id: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

/** Create a new tag */
export async function createTag(name: string): Promise<Tag> {
  const payload: DbTagInsert = { name };

  const { data, error } = await supabase
    .from("tags")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

/** Update an existing tag */
export async function updateTag(id: string, name: string): Promise<Tag> {
  const payload: DbTagUpdate = { name };

  const { data, error } = await supabase
    .from("tags")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

/** Delete a tag */
export async function deleteTag(id: string) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
}
