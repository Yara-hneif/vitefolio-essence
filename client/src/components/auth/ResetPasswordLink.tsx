import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ResetPasswordLinkProps {
  email: string;
}

export default function ResetPasswordLink({ email }: ResetPasswordLinkProps) {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/callback',
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Password reset email sent successfully. Please check your inbox.');
    } catch (err: any) {
      toast.error('Error sending reset email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="text-primary hover:underline text-sm disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Sending...' : 'Forgot your password?'}
    </button>
  );
}
