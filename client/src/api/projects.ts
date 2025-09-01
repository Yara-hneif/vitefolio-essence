import { supabase } from "@/lib/supabase";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  collaborators: number;
  updated_at: string;
};

export async function listProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Project | null;
}

export async function createProject(values: Partial<Project>) {
  const { data, error } = await supabase.from("projects").insert(values).select().single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, values: Partial<Project>) {
  const { data, error } = await supabase.from("projects").update(values).eq("id", id).select().single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
