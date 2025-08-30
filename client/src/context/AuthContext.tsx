import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser, AuthChangeEvent } from "@supabase/supabase-js";

type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  avatarUrl?: string;
};

type RegisterPayload = { username: string; name: string; email: string; password: string };

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);


  const mapSupabaseUser = (sUser: SupabaseUser): AuthUser => {
    const meta = (sUser.user_metadata || {}) as Record<string, any>;
    return {
      id: sUser.id,
      email: sUser.email ?? undefined,
      name: meta.name ?? meta.full_name,
      username: meta.username,
      bio: meta.bio,
      skills: meta.skills,
      socialLinks: {
        github: meta.github,
        linkedin: meta.linkedin,
        twitter: meta.twitter,
        website: meta.website,
      },
      avatarUrl: meta.avatar_url ?? meta.picture,
    };
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sUser = data.session?.user;
      if (mounted) {
        setUser(sUser ? mapSupabaseUser(sUser) : null);
        setLoading(false);
      }
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        const sUser = session?.user;
        setUser(sUser ? mapSupabaseUser(sUser) : null);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw new Error(error.message);
    setUser(data.user ? mapSupabaseUser(data.user) : null);
  };

  const register = async ({ username, name, email, password }: RegisterPayload) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, name } },
    });
    setLoading(false);
    if (error) throw new Error(error.message);
    setUser(data.user ? mapSupabaseUser(data.user) : null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
