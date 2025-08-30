// client/src/features/admin/guards/ProtectedAdmin.tsx
import { useEffect, useMemo } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { setAdminSecret as applyAdminHeader } from "@/lib/api";

const ENV_SECRET = import.meta.env.VITE_ADMIN_SECRET || "CHANGE_ME";
const STORAGE_KEYS = ["ADMIN_SECRET", "admin_secret"];

function getStoredSecret(): string | null {
  for (const k of STORAGE_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

function storeSecret(secret: string) {
  for (const k of STORAGE_KEYS) localStorage.setItem(k, secret);
  try { applyAdminHeader?.(secret); } catch {}
}

export default function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("admin");
    if (fromQuery) storeSecret(fromQuery);
  }, [location.search]);

  const authorized = useMemo(() => getStoredSecret() === ENV_SECRET, []);

  if (!authorized) return <Navigate to="/" replace />;
  return <>{children}</>;
}
