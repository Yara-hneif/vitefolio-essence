import { supabase } from "../config/supabase.js";

// Get all projects
export async function getAllProjects(userId = null) {
  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get project by ID
export async function getProjectById(id, userId = null) {
  let query = supabase.from("projects").select("*").eq("id", id).single();
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get project by Slug
export async function getProjectBySlug(slug, userId = null) {
  let query = supabase.from("projects").select("*").eq("slug", slug).single();
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Create project
export async function createProject(project, userId) {
  const payload = { ...project, user_id: userId, status: project.status || "draft" };
  const { data, error } = await supabase.from("projects").insert([payload]).single();
  if (error) throw error;
  return data;
}

// Update project
export async function updateProject(id, updates, userId = null, isSuper = false) {
  let query = supabase.from("projects").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
  if (!isSuper && userId) query = query.eq("user_id", userId);
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

// Delete project
export async function deleteProject(id, userId = null, isSuper = false) {
  let query = supabase.from("projects").delete().eq("id", id);
  if (!isSuper && userId) query = query.eq("user_id", userId);
  const { error } = await query;
  if (error) throw error;
  return true;
}
