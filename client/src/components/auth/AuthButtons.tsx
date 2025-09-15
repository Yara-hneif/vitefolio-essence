import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/navigation/button';

export default function AuthButtons() {
  const { authWithProvider } = useAuth();

  return (
    <div className="grid gap-2">
      <Button onClick={() => authWithProvider('google')}>Continue with Google</Button>
      <Button onClick={() => authWithProvider('github')}>Continue with GitHub</Button>
      <Button onClick={() => authWithProvider('facebook')}>Continue with Facebook</Button>
    </div>
  );
}
