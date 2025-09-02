import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/navigation/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Textarea } from "@/components/ui/form/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";
import UserAvatar from "@/components/common/UserAvatar";
import { Plus, X, Save, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export default function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name ?? "",
    bio: user?.bio ?? "",
    skills: (user?.skills as string[] | undefined) ?? [],
    socialLinks: {
      github: user?.socialLinks?.github ?? "",
      linkedin: user?.socialLinks?.linkedin ?? "",
      twitter: user?.socialLinks?.twitter ?? "",
      website: user?.socialLinks?.website ?? "",
    } as SocialLinks,
  });

  if (!user) return null;

  const handleInputChange = (field: "name" | "bio", value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (
    platform: keyof SocialLinks,
    value: string
  ) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !profileData.skills.includes(s)) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((x) => x !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          bio: profileData.bio,
          skills: profileData.skills,
          socialLinks: profileData.socialLinks,
          avatarUrl: user?.avatar,
        },
      });
      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Update your public profile information
          </p>
        </div>
        {user?.username && (
          <Button variant="outline" asChild>
            <Link to={`/u/${user.username}`} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Public Profile
            </Link>
          </Button>
        )}
      </div>

      {/* Current Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Your current profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{
                name: user?.name || user?.username || user?.email || "User",
                username: user?.username,
                avatar: user?.avatar,
              }}
              size="lg"
              className="h-20 w-20"
            />
            <div>
              <p className="font-medium">
                {user?.name || user?.username || user?.email || "User"}
              </p>
              {user?.username && (
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Profile pictures are currently managed by the system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell visitors about yourself..."
                rows={4}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills & Technologies</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {profileData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Add links to your social profiles and website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              placeholder="https://github.com/username"
              value={profileData.socialLinks.github ?? ""}
              onChange={(e) => handleSocialLinkChange("github", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={profileData.socialLinks.linkedin ?? ""}
              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/username"
              value={profileData.socialLinks.twitter ?? ""}
              onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={profileData.socialLinks.website ?? ""}
              onChange={(e) => handleSocialLinkChange("website", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
