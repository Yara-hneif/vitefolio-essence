import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface LoginMagicLinkProps {
  email: string;
}

export default function LoginMagicLink({ email }: LoginMagicLinkProps) {
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // لا ينشئ مستخدم جديد إذا الإيميل غير موجود
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('One-time login link sent to your email.');
    } catch (err: any) {
      toast.error('Error sending magic link: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleMagicLink}
      className="text-primary hover:underline text-sm disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Sending...' : 'Send me a one-time login link'}
    </button>
  );
}
