import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { Contact } from "@/types/Contact";
import { Project } from "@/types/Project";

/**
 * Base URL strategy:
 * - If VITE_API_BASE_URL is set (e.g. "http://localhost:5000"), requests go there.
 * - Otherwise baseURL is "" and paths like "/api/..." will go through Vite proxy.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/** Single shared axios instance */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ---------------------------------------------------------------
   Admin secret header (x-admin-secret)
---------------------------------------------------------------- */
const ADMIN_SECRET_KEY = "admin_secret";
const ADMIN_HEADER = import.meta.env.VITE_ADMIN_HEADER || "x-admin-secret";
const ADMIN_SECRET_ENV = import.meta.env.VITE_ADMIN_SECRET as string | undefined;

export function setAdminSecret(secret?: string) {
  if (typeof window === "undefined") return;
  if (secret) {
    localStorage.setItem(ADMIN_SECRET_KEY, secret);
    api.defaults.headers.common[ADMIN_HEADER] = secret;
  } else {
    localStorage.removeItem(ADMIN_SECRET_KEY);
    delete api.defaults.headers.common[ADMIN_HEADER];
  }
}

// initialize admin header from storage/env at boot (browser only)
if (typeof window !== "undefined") {
  const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY);
  const secret = fromStorage || ADMIN_SECRET_ENV;
  if (secret) api.defaults.headers.common[ADMIN_HEADER] = secret;
}

/* ---------------------------------------------------------------
   Clerk token (primary) with legacy fallback
---------------------------------------------------------------- */
declare global {
  interface Window {
    Clerk?: {
      session?: { getToken: (opt?: { template?: string }) => Promise<string | null> };
      loaded?: boolean;
      load?: () => Promise<void>;
    };
  }
}

const TOKEN_KEY = "auth_token"; // legacy fallback
const LEGACY_ENV_TOKEN = import.meta.env.VITE_ADMIN_TOKEN as string | undefined;

export function setAuthToken(token?: string) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

/**
 * SINGLE source of truth for Authorization:
 * 1) Try Clerk -> fresh JWT per request
 * 2) Else fallback to legacy token from localStorage/env
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Admin header sync
    if (typeof window !== "undefined") {
      const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY) || ADMIN_SECRET_ENV;
      if (fromStorage) {
        config.headers = config.headers ?? {};
        (config.headers as any)[ADMIN_HEADER] = fromStorage;
      }
    }

    // Try Clerk first
    try {
      if (typeof window !== "undefined" && window.Clerk) {
        if (!window.Clerk.loaded && typeof window.Clerk.load === "function") {
          await window.Clerk.load();
        }
        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers = config.headers ?? {};
          (config.headers as any).Authorization = `Bearer ${token}`;
          return config;
        }
      }
    } catch {
      // ignore and fallback
    }

    // Fallback legacy token
    if (typeof window !== "undefined") {
      const legacy = localStorage.getItem(TOKEN_KEY) || LEGACY_ENV_TOKEN;
      if (legacy) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${legacy}`;
      }
    } else if (LEGACY_ENV_TOKEN) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${LEGACY_ENV_TOKEN}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------------------------------------
   Optional 401 handling
---------------------------------------------------------------- */
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // setAuthToken(undefined);
      // window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(err);
  }
);

/* ---------------------------------------------------------------
   Utilities
---------------------------------------------------------------- */
function normalizeProject(p: any): Project {
  if (!p || typeof p !== "object") return p;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    slug: p.slug,
    category: p.category,
    tags: p.tags,
    // ✅ دعم snake_case من السيرفر
    imageUrl: p.imageUrl ?? p.image_url,
    repoUrl: p.repoUrl ?? p.repo_url,
    liveUrl: p.liveUrl ?? p.live_url,
    status: p.status,
    createdAt: p.createdAt ?? p.created_at,
  };
}

/* ---------------------------------------------------------------
   Projects API
---------------------------------------------------------------- */
export async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get("/api/projects");
  const arr = Array.isArray(data) ? data : [];
  return arr.map((p) => normalizeProject(p));
}

/** Prefer server route: GET /api/projects/slug/:slug */
export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const { data } = await api.get(`/api/projects/slug/${slug}`);
  return normalizeProject(data);
}

export async function createProject(projectData: Partial<Project>) {
  const { data } = await api.post("/api/projects", projectData);
  return normalizeProject(data);
}

export async function updateProject(id: string, updateData: Partial<Project>) {
  const { data } = await api.put(`/api/projects/${id}`, updateData);
  return normalizeProject(data);
}

export async function deleteProject(id: string) {
  const { data } = await api.delete(`/api/projects/${id}`);
  return data;
}

/* ---------------------------------------------------------------
   Contact API
---------------------------------------------------------------- */
export async function getAllContacts(): Promise<Contact[]> {
  const { data } = await api.get<Contact[]>("/api/contact/all");
  return data;
}

export async function deleteContactMessage(id: string) {
  const { data } = await api.delete(`/api/contact/${id}`);
  return data;
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data } = await api.post("/api/contact", payload);
  return data;
}
