import axios from "axios";
import { Contact } from "@/types/Contact";

/**
 * Base URL strategy:
 * - If VITE_API_BASE_URL is set (e.g. "http://localhost:5000"), requests go there.
 * - Otherwise baseURL is "" and paths like "/api/..." will go through Vite proxy.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""; // empty = use relative /api

/** Single shared axios instance */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // harmless here; useful if you later switch to cookies
  headers: { "Content-Type": "application/json" },
});

const ADMIN_SECRET_KEY = "admin_secret";

// Header name and value (env or localStorage)
const ADMIN_HEADER = import.meta.env.VITE_ADMIN_HEADER || "x-admin-secret";
const ADMIN_SECRET_ENV = import.meta.env.VITE_ADMIN_SECRET as string | undefined;


/** Token helpers */
const TOKEN_KEY = "auth_token";

/** Set or clear Authorization token at runtime */
export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

/** Initialize Authorization from storage or env on boot */
(function initAuthHeader() {
  const fromStorage = localStorage.getItem(TOKEN_KEY);
  const fromEnv = import.meta.env.VITE_ADMIN_TOKEN as string | undefined;
  const token = fromStorage || fromEnv;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
})();

/** Attach Authorization on each request (in case it changes at runtime) */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) || (import.meta.env.VITE_ADMIN_TOKEN as string | undefined);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Optional 401 handling */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Optionally clear token and let the app redirect to login page
      // setAuthToken(undefined);
      // e.g., window.dispatchEvent(new Event("unauthorized"));
      // For now just throw the error to be handled by callers
    }
    throw err;
  }
);

/* =========================================================
   Projects API
   ========================================================= */

/** Fetch all projects */
export async function fetchProjects() {
  const { data } = await api.get("/api/projects");
  return data;
}

/** Fetch a project by slug */
export async function fetchProjectBySlug(slug: string) {
  const { data } = await api.get(`/api/projects/${slug}`);
  return data;
}

/** Create a new project */
export async function createProject(projectData: any) {
  const { data } = await api.post("/api/projects", projectData);
  return data;
}

/** Update a project by ID */
export async function updateProject(id: string, updateData: any) {
  const { data } = await api.put(`/api/projects/${id}`, updateData);
  return data;
}

/** Delete a project by ID */
export async function deleteProject(id: string) {
  const { data } = await api.delete(`/api/projects/${id}`);
  return data;
}

/* =========================================================
   Contact API
   ========================================================= */

/** Send contact form message */
export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data } = await api.post("/api/contact", payload);
  return data;
}

/** Get all contact messages (admin) */
export async function getAllContacts(): Promise<Contact[]> {
  const { data } = await api.get<Contact[]>("/api/contact/all");
  return data;
}

/** Delete a contact message by ID (admin) */
export async function deleteContactMessage(id: string) {
  const { data } = await api.delete(`/api/contact/${id}`);
  return data;
}



// Helper to set/clear at runtime
export function setAdminSecret(secret?: string) {
  if (secret) {
    localStorage.setItem(ADMIN_SECRET_KEY, secret);
    api.defaults.headers.common[ADMIN_HEADER] = secret;
  } else {
    localStorage.removeItem(ADMIN_SECRET_KEY);
    delete api.defaults.headers.common[ADMIN_HEADER];
  }
}

// Initialize from storage or env
(function initAdminHeader() {
  const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY);
  const secret = fromStorage || ADMIN_SECRET_ENV;
  if (secret) api.defaults.headers.common[ADMIN_HEADER] = secret;
})();

api.interceptors.request.use((cfg) => {
  // keep header in sync if it changes at runtime
  const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY) || ADMIN_SECRET_ENV;
  if (fromStorage) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any)[ADMIN_HEADER] = fromStorage;
  }
  return cfg;
});
