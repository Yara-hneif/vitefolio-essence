import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Textarea } from '@/components/ui/form/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/data-display/badge';
import UserAvatar from '@/components/common/UserAvatar';
import { Plus, X, Save, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

/* -----------------------
   Types
----------------------- */
type SocialLinks = {
  google?: string;
  youtube?: string;
  github?: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
};

export default function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    skills: (user?.skills as string[] | undefined) ?? [],
    social_links: {
      google: user?.social_links?.google ?? '',
      youtube: user?.social_links?.youtube ?? '',
      github: user?.social_links?.github ?? '',
      facebook: user?.social_links?.facebook ?? '',
      linkedin: user?.social_links?.linkedin ?? '',
      website: user?.social_links?.website ?? '',
    } as SocialLinks,
  });

  if (!user) return null;

  /* -----------------------
     Handlers
  ----------------------- */
  const handleInputChange = (field: 'name' | 'bio', value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value },
    }));
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !profileData.skills.includes(s)) {
      setProfileData((prev) => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
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
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          bio: profileData.bio,
          skills: profileData.skills,
          social_links: profileData.social_links,
          avatar: user?.avatar,
        })
        .eq('id', user?.id);
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------
     JSX
  ----------------------- */
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Update your public profile information</p>
        </div>
        {user?.username && (
          <Button variant="outline" asChild>
            <Link to={`/${user.username}`} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Public Profile
            </Link>
          </Button>
        )}
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Your current profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{
                name: user?.name || user?.username || user?.email || 'User',
                username: user?.username,
                avatar: user?.avatar,
              }}
              size="lg"
              className="h-20 w-20"
            />
            <div>
              <p className="font-medium">{user?.name || user?.username || user?.email || 'User'}</p>
              {user?.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
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
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
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
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                'Saving...'
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
          <CardDescription>Add links to your social profiles and website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['google', 'youtube', 'github', 'facebook', 'linkedin', 'website'].map((platform) => (
            <div className="space-y-2" key={platform}>
              <Label htmlFor={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Label>
              <Input
                id={platform}
                placeholder={`https://${platform}.com/username`}
                value={(profileData.social_links as any)[platform] ?? ''}
                onChange={(e) =>
                  handleSocialLinkChange(platform as keyof SocialLinks, e.target.value)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
