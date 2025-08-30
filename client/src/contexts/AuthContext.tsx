import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};
type AuthUser = {
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

  // hydrate session on boot + listen to changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sUser = data.session?.user;
      if (mounted) {
        setUser(sUser ? {
          id: sUser.id,
          email: sUser.email ?? undefined,
          name: (sUser.user_metadata as any)?.name,
          username: (sUser.user_metadata as any)?.username,
        } : null);
        setLoading(false);
      }
    };
    init();

    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user;
      setUser(sUser ? {
        id: sUser.id,
        email: sUser.email ?? undefined,
        name: (sUser.user_metadata as any)?.name,
        username: (sUser.user_metadata as any)?.username,
      } : null);
    });

    return () => { mounted = false; sub.data.subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw new Error(error.message);
    const sUser = data.user;
    setUser(sUser ? {
      id: sUser.id,
      email: sUser.email ?? undefined,
      name: (sUser.user_metadata as any)?.name,
      username: (sUser.user_metadata as any)?.username,
    } : null);
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

    const sUser = data.user;
    setUser(sUser ? {
      id: sUser.id,
      email: sUser.email ?? undefined,
      name: (sUser.user_metadata as any)?.name,
      username: (sUser.user_metadata as any)?.username,
    } : null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
