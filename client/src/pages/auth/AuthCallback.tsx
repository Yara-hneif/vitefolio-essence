import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AppLoader from '@/components/common/AppLoader';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('❌ Exchange code error:', error.message);
            navigate('/login', { replace: true });
            return;
          }

          if (data?.session) {
            navigate('/dashboard', { replace: true });
            return;
          }
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('❌ Auth callback error:', err);
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [navigate]);

  return <AppLoader />;
}
