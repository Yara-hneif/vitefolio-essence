import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      const file = e.target.files[0];
      const { data: uploadData, error } = await supabase.storage
        .from('avatars')
        .upload(`${profile.id}/${file.name}`, file, { upsert: true });
      if (!error && uploadData) {
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${profile.id}/${file.name}`);
        if (publicUrl.publicUrl) {
          await supabase
            .from('profiles')
            .update({ avatar: publicUrl.publicUrl })
            .eq('id', profile.id);
          setProfile({ ...profile, avatar: publicUrl.publicUrl });
        }
      }
    }
  };

  return { profile, setProfile, loading, handleAvatarChange };
}
