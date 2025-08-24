const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Get all projects
export const fetchProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects‼️");
  return response.json();
};

// ✅ Get one project by slug
export const fetchProjectBySlug = async (slug: string) => {
  const response = await fetch(`${API_BASE_URL}/projects/${slug}`);
  if (!response.ok) throw new Error("Project not found‼️");
  return response.json();
};

// ✅ Create a new project
export const createProject = async (newProject: any) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProject),
  });
  if (!response.ok) throw new Error("Failed to create project‼️");
  return response.json();
};

// ✅ Update a project by ID
export const updateProject = async (id: string, updates: any) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update project‼️");
  return response.json();
};

// ✅ Delete a project by ID
export const deleteProject = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete project‼️");
  return response.json();
};
