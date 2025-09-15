import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User as SbUser, AuthChangeEvent } from '@supabase/supabase-js';

/* ---------------------------
   Types
--------------------------- */
interface SocialLinks {
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  google?: string;
  website?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role?: string;
  skills?: string[];
  social_links?: SocialLinks;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

type OAuthProvider = 'google' | 'github' | 'facebook';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ status: string; error?: string }>;
  register: (userData: RegisterData) => Promise<{ status: string; error?: string }>;
  authWithProvider: (provider: OAuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<{ status: string; error?: string }>;
  getHandle: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------------------
   Map Supabase user → UserProfile
--------------------------- */
function mapSbUser(u: SbUser | null): Partial<UserProfile> | null {
  if (!u) return null;
  const m = (u as any).user_metadata || {};

  const username =
    m.user_name ||
    m.nickname ||
    m.preferred_username ||
    m.login ||
    (u.email ? u.email.split('@')[0] : '');

  return {
    id: u.id,
    email: u.email || '',
    username: (username || '')
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9-_.]/g, '-'),
    name: m.name || m.full_name || u.email?.split('@')[0] || 'User',
    bio: m.bio || '',
    avatar: m.avatar || m.picture || m.avatar_url || '/placeholder.svg',
    skills: (m.skills as string[]) || [],
    social_links: {
      github: m.github,
      linkedin: m.linkedin,
      facebook: m.facebook,
      youtube: m.youtube,
      google: m.google,
      website: m.website,
    },
  };
}

/* ---------------------------
   Provider
--------------------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استعادة الجلسة من التخزين
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        const fallback = mapSbUser(u);
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: fallback?.name,
          username: fallback?.username,
          avatar: fallback?.avatar ?? '/placeholder.svg',
          bio: fallback?.bio,
          role: 'user',
          skills: fallback?.skills ?? [],
          social_links: fallback?.social_links ?? {},
        });
      }
      setLoading(false);
    });

    // مراقبة تغييرات الجلسة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const u = session.user;

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, name, username, avatar, bio, role, skills, social_links')
            .eq('id', u.id)
            .maybeSingle();

          const fallback = mapSbUser(u);

          setUser({
            id: u.id,
            email: u.email ?? '',
            name: profile?.name ?? fallback?.name,
            username: profile?.username ?? fallback?.username,
            avatar: profile?.avatar ?? fallback?.avatar ?? '/placeholder.svg',
            bio: profile?.bio ?? fallback?.bio,
            role: profile?.role ?? 'user',
            skills: (profile?.skills as string[]) ?? fallback?.skills ?? [],
            social_links: (profile?.social_links as SocialLinks) ?? fallback?.social_links ?? {},
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ---------------------------
     Auth Actions
  --------------------------- */
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { status: 'error', error: error.message };
    if (data.session) return { status: 'complete' };
    return { status: 'error', error: 'Login failed' };
  };

  const register = async (data: RegisterData) => {
    const { data: res, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard',
        data: { name: data.name, username: data.username },
      },
    });
    if (error) return { status: 'error', error: error.message };

    if (res.user) {
      await supabase.from('profiles').upsert({
        id: res.user.id,
        email: data.email,
        name: data.name,
        username: data.username,
        role: 'user',
      });
    }

    return { status: 'complete' };
  };

  const authWithProvider = async (provider: OAuthProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user) return { status: 'error', error: 'No user logged in' };

    const confirmDelete = window.confirm(
      '⚠️ This will permanently delete your account and all related data. Are you sure?'
    );
    if (!confirmDelete) return { status: 'error', error: 'Cancelled' };

    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const msg = await res.text();
        return { status: 'error', error: msg };
      }

      await supabase.auth.signOut();
      setUser(null);
      return { status: 'complete' };
    } catch (err) {
      return { status: 'error', error: (err as Error).message };
    }
  };

  const getHandle = () => user?.username || null;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      authWithProvider,
      logout,
      deleteAccount,
      getHandle,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ---------------------------
   Hook
--------------------------- */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
