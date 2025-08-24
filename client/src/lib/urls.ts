const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function resolveImageUrl(raw?: string | null): string | null {
  if (!raw) return null;

  if (
    raw.startsWith("http://") &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:"
  ) {
    try {
      const u = new URL(raw);
      return `https://${u.host}${u.pathname}${u.search}${u.hash}`;
    } catch {
    }
  }
  if (/^https?:\/\//i.test(raw)) return raw;

  const rel = raw.startsWith("/") ? raw : `/${raw}`;
  return `${API_BASE}${rel}`;
}
