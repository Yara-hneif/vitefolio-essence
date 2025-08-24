import { Contact } from "@/types/Contact";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create a reusable Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== Projects API ==========

// Fetch all projects
export async function fetchProjects() {
  const { data } = await api.get("/api/projects");
  return data;
}

// Fetch project by slug
export async function fetchProjectBySlug(slug: string) {
  const { data } = await api.get(`/api/projects/${slug}`);
  return data;
}

// Create a new project
export async function createProject(projectData: any) {
  const { data } = await api.post("/api/projects", projectData);
  return data;
}

// Update a project by ID
export async function updateProject(id: string, updateData: any) {
  const { data } = await api.put(`/api/projects/${id}`, updateData);
  return data;
}

// Delete a project by ID
export async function deleteProject(id: string) {
  const { data } = await api.delete(`/api/projects/${id}`);
  return data;
}

// ========== Contact API ==========

// Send contact form message
export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data: responseData } = await api.post("/api/contact", data);
  return responseData;
}

// Get all contact messages
export async function getAllContacts(): Promise<Contact[]> {
  const { data } = await api.get<Contact[]>("/api/contact/all");
  return data;
}

// Delete a contact message by ID
export async function deleteContactMessage(id: string) {
  const { data } = await api.delete(`/api/contact/${id}`);
  return data;
}
