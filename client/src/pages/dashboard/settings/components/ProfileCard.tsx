import { useState, useRef } from 'react';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Textarea } from '@/components/ui/form/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/navigation/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/overlay/dialog';
import { Github, Linkedin, Globe, Eye, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { signInWithOAuth } from '../utils/oauth';

export default function ProfileCard({ profile, setProfile, handleAvatarChange }: any) {
  const [isEditing, setEditing] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        username: profile.username,
        phone: profile.phone,
        bio: profile.bio,
        github: profile.github,
        linkedin: profile.linkedin,
        website: profile.website,
      })
      .eq('id', profile.id);
    if (!error) {
      setEditing(false);
      alert('Profile updated ✅');
    }
  };

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-300 hover:ring-indigo-500">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    No Avatar
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                <Eye className="w-4 h-4 mr-2" /> View Avatar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Upload New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              {profile.avatar && (
                <img src={profile.avatar} alt="Large" className="max-h-[80vh] rounded-xl" />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Name</Label>
            <Input
              value={profile.name || ''}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={profile.username || ''}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={profile.email || ''} disabled />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={profile.phone || ''}
              disabled={!isEditing}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea
            value={profile.bio || ''}
            disabled={!isEditing}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        {/* Social */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Social Connections</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              <Input
                value={profile.github || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="GitHub URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <Input
                value={profile.linkedin || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="LinkedIn URL"
              />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <Input
                value={profile.website || ''}
                disabled={!isEditing}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="Website"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => signInWithOAuth('github')}>
              <Github className="w-4 h-4 mr-2" />{' '}
              {profile.github ? 'Reconnect GitHub' : 'Connect GitHub'}
            </Button>
            <Button variant="outline" onClick={() => signInWithOAuth('linkedin')}>
              <Linkedin className="w-4 h-4 mr-2" />{' '}
              {profile.linkedin ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
