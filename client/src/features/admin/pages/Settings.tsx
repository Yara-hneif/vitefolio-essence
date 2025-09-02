import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Button } from "@/components/ui/navigation/button";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [profileName, setProfileName] = useState<string>(import.meta.env.VITE_PROFILE_NAME || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(import.meta.env.VITE_PROFILE_AVATAR || "");

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="space-y-4 rounded-xl border p-4">
        <div className="grid gap-2">
          <Label htmlFor="profileName">Profile Name</Label>
          <Input
            id="profileName"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="e.g., Yara Hneif"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="/icons/avatar.png"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => {/* persist to server/db */}}>Save</Button>
          <Button variant="outline" onClick={() => { setProfileName(""); setAvatarUrl(""); }}>
            Reset
          </Button>
        </div>
      </div>

      {/* You can add more sections here: theme, edit-mode defaults, admin secret, etc. */}
    </div>
  );
}
