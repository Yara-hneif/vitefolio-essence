import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Button } from "@/components/ui/navigation/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function DashboardSettings() {
  const [profileName, setProfileName] = useState<string>(import.meta.env.VITE_PROFILE_NAME || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(import.meta.env.VITE_PROFILE_AVATAR || "");
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteAccount();
      toast.success("Your account and all related data have been deleted.");
    } catch (err) {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-muted-foreground">
        Manage your account, preferences, and app settings here.
      </p>

      {/* Profile Settings */}
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
          <Button
            variant="outline"
            onClick={() => {
              setProfileName("");
              setAvatarUrl("");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 rounded-xl border border-red-300 p-4 bg-red-50 dark:bg-red-900/20">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          Deleting your account will permanently remove all your data, including
          projects, contacts, and profile information. This action cannot be undone.
        </p>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
