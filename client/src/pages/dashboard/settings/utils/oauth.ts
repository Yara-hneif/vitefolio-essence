import { supabase } from '@/lib/supabase';

export const signInWithOAuth = async (provider: 'github' | 'linkedin') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin + '/dashboard' },
  });

  if (error) {
    alert('OAuth error: ' + error.message);
  }
};
