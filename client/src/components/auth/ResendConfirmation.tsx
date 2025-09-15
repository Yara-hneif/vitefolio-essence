import { useState } from 'react';
import { Button } from '@/components/ui/navigation/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ResendProps {
  email: string;
}

export default function ResendConfirmation({ email }: ResendProps) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Confirmation email resent successfully. Please check your inbox.');
    } catch (err: any) {
      toast.error('Error resending email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleResend} disabled={loading}>
      {loading ? 'Sending...' : 'Resend Confirmation Email'}
    </Button>
  );
}
