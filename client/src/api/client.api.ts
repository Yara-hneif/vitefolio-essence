import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * Base URL strategy:
 * - If VITE_API_URL is set → requests go there.
 * - Otherwise fallback to render server.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'https://vitefolio-server.onrender.com';

/** Single shared axios instance */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------------------------------------------------------------
   Admin secret header (x-admin-secret)
---------------------------------------------------------------- */
const ADMIN_SECRET_KEY = 'admin_secret';
const ADMIN_HEADER = import.meta.env.VITE_ADMIN_HEADER || 'x-admin-secret';
const ADMIN_SECRET_ENV = import.meta.env.VITE_ADMIN_SECRET as string | undefined;

export function setAdminSecret(secret?: string) {
  if (typeof window === 'undefined') return;
  if (secret) {
    localStorage.setItem(ADMIN_SECRET_KEY, secret);
    api.defaults.headers.common[ADMIN_HEADER] = secret;
  } else {
    localStorage.removeItem(ADMIN_SECRET_KEY);
    delete api.defaults.headers.common[ADMIN_HEADER];
  }
}

// initialize admin header from storage/env at boot (browser only)
if (typeof window !== 'undefined') {
  const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY);
  const secret = fromStorage || ADMIN_SECRET_ENV;
  if (secret) api.defaults.headers.common[ADMIN_HEADER] = secret;
}

/* ---------------------------------------------------------------
   Interceptors
---------------------------------------------------------------- */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const fromStorage = localStorage.getItem(ADMIN_SECRET_KEY) || ADMIN_SECRET_ENV;
      if (fromStorage) {
        config.headers = config.headers ?? {};
        (config.headers as any)[ADMIN_HEADER] = fromStorage;
      }
    } else if (ADMIN_SECRET_ENV) {
      config.headers = config.headers ?? {};
      (config.headers as any)[ADMIN_HEADER] = ADMIN_SECRET_ENV;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // handle unauthorized globally if needed
    }
    return Promise.reject(err);
  }
);
