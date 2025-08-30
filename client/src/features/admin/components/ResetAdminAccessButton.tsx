import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { setAdminSecret as applyAdminHeader } from "@/lib/api";

const ADMIN_KEYS = ["ADMIN_SECRET", "admin_secret", "admin_token"];

export default function ResetAdminAccessButton({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const navigate = useNavigate();

  const handleReset = useCallback(() => {
    const ok = window.confirm(
      "Reset admin access? You'll need the admin link/password again."
    );
    if (!ok) return;

    try {
      // Drop admin header from axios
      applyAdminHeader?.(undefined as any);
    } catch {
      // ignore
    }

    // Clear local storage secrets
    ADMIN_KEYS.forEach((k) => localStorage.removeItem(k));

    // Navigate away from admin pages
    navigate(redirectTo, { replace: true });
    // Optional hard refresh to fully flush state (uncomment if desired)
    // window.location.assign(redirectTo);
  }, [navigate, redirectTo]);

  return (
    <Button variant="destructive" size="sm" onClick={handleReset} className="gap-2">
      <LogOut className="h-4 w-4" />
      Reset Admin Access
    </Button>
  );
}
