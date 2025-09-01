import { supabase } from "../config/supabase.js";

async function getUserIdFromRequest(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new Error("❌ Missing Authorization token");

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error("❌ Invalid or expired token");

  return user.id;
}

// Get all projects
export const getAllProjectsFromDB = async (req) => {
  const userId = await getUserIdFromRequest(req);
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Get project by ID
export const getProjectById = async (req, id) => {
  const userId = await getUserIdFromRequest(req);
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
};

// Get project by slug
export const getProjectBySlugFromDB = async (req, slug) => {
  const userId = await getUserIdFromRequest(req);
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
};

// Create project
export const createProjectInDB = async (req, project) => {
  const userId = await getUserIdFromRequest(req);
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project, user_id: userId, status: project.status || "draft" }])
    .single();
  if (error) throw error;
  return data;
};

// Update project
export const updateProjectInDB = async (req, id, updates) => {
  const userId = await getUserIdFromRequest(req);
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
};

// Delete project
export const deleteProjectFromDB = async (req, id) => {
  const userId = await getUserIdFromRequest(req);
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
  return true;
};
