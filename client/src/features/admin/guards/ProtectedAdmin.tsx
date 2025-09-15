import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/data-display/avatar';
import { ADMIN_SECRET } from '@/lib/config';
import { setAdminSecret as applyAdminHeader } from '@/api/client.api';

const STORAGE_KEYS = ['ADMIN_SECRET', 'admin_secret'];

function getStoredSecret(): string | null {
  for (const k of STORAGE_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

function storeSecret(secret: string) {
  for (const k of STORAGE_KEYS) localStorage.setItem(k, secret);
  try {
    applyAdminHeader?.(secret);
  } catch {}
}

interface ProtectedAdminProps {
  children: React.ReactNode;
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get('admin');
    if (fromQuery) storeSecret(fromQuery);
  }, [location.search]);

  const authorized = useMemo(() => {
    if (!ADMIN_SECRET) return false;
    return getStoredSecret() === ADMIN_SECRET;
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_SECRET) {
      storeSecret(password);
      setPassword('');
      setAvatarUrl(`https://api.dicebear.com/7.x/identicon/svg?seed=${Date.now()}`);
      navigate(location.pathname, { replace: true });
    } else {
      alert('❌ Wrong password');
    }
  };

  const handleLogout = () => {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    setAvatarUrl(null);
    navigate('/', { replace: true });
  };

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-6 shadow">
          <h2 className="text-center text-lg font-semibold">🔒 Admin Access</h2>
          <Input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Admin Avatar" />
            ) : (
              <AvatarFallback>AD</AvatarFallback>
            )}
          </Avatar>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
