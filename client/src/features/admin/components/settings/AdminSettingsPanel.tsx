import { useEffect, useState } from "react";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import { toast } from "sonner";
import { X, UserRound, Paintbrush, ShieldCheck, Save, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/navigation/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/form/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Separator } from "@/components/ui/data-display/separator";
import { ScrollArea } from "@/components/ui/layout/scroll-area";
import { Switch } from "@/components/ui/effects/switch";
import { api } from "@/lib/api";

type SettingsState = {
  profileName: string;
  avatarUrl: string;
  theme: "system" | "light" | "dark";
  enableAnimations: boolean;
};

const LS_KEY = "admin.settings.v1";

const AdminSettingsPanel = () => {
  const { isAdmin, settingsOpen, closeSettings } = useAdmin();
  const hidden = !isAdmin;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState<string>(import.meta.env.VITE_PROFILE_NAME || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(import.meta.env.VITE_PROFILE_AVATAR || "");

  const [st, setSt] = useState<SettingsState>({
    profileName: import.meta.env.VITE_PROFILE_NAME || "Admin",
    avatarUrl: import.meta.env.VITE_PROFILE_AVATAR || "/icons/avatar.png",
    theme: (localStorage.getItem("theme") as SettingsState["theme"]) || "system",
    enableAnimations: true,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setSt((prev) => ({ ...prev, ...(JSON.parse(raw) as Partial<SettingsState>) }));
      }
      // optional server load:
      // const resp = await api.get("/api/admin/settings");
      // setSt((prev) => ({ ...prev, ...(resp.data || {}) }));
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settingsOpen) void loadSettings();
  }, [settingsOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const current = st.theme;
    if (current === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      root.setAttribute("data-theme", current);
      localStorage.setItem("theme", current);
    }
  }, [st.theme]);

  const save = async () => {
    try {
      setSaving(true);
      localStorage.setItem(LS_KEY, JSON.stringify(st));
      try {
        await api.post("/api/admin/settings", st);
      } catch {
        // ignore if server endpoint is not available
      }
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* -------------------- Backdrop -------------------- */}
      <div
        className={`fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm transition-opacity ${settingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeSettings}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[75] h-full w-full sm:w-[520px] lg:w-[640px]
        bg-white/90 dark:bg-zinc-900/90 border-l shadow-2xl backdrop-blur-md
        transition-transform ${settingsOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={hidden}
        role="dialog"
        aria-label="Settings panel"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 backdrop-blur p-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight">Settings</h2>
            <p className="text-xs text-muted-foreground">
              Customize profile and appearance for admin mode.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadSettings()} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <button
              className="p-2 rounded-full hover:bg-black/5"
              onClick={closeSettings}
              aria-label="Close settings panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-6">

            {/* Profile */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="profileName">Profile Name</Label>
                  <Input
                    id="profileName"
                    value={st.profileName}
                    onChange={(e) => setSt((s) => ({ ...s, profileName: e.target.value }))}
                    placeholder="e.g., Yara Hneif"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={st.avatarUrl}
                    onChange={(e) => setSt((s) => ({ ...s, avatarUrl: e.target.value }))}
                    placeholder="/icons/avatar.png"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Theme</Label>
                  <Select
                    value={st.theme}
                    onValueChange={(val: "system" | "light" | "dark") =>
                      setSt((s) => ({ ...s, theme: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="animations">Animations</Label>
                  <div className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm text-muted-foreground">Enable subtle animations</span>
                    <Switch
                      id="animations"
                      checked={st.enableAnimations}
                      onCheckedChange={(v) => setSt((s) => ({ ...s, enableAnimations: Boolean(v) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin & Security (placeholder) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Admin & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  You can manage server-side admin options here in the future (JWT, secrets rotation, rate limits).
                </p>
                <p className="text-xs">
                  Tip: avoid storing secrets in localStorage. Use secure server-side storage.
                </p>
              </CardContent>
            </Card>

            <Separator />
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default AdminSettingsPanel;
