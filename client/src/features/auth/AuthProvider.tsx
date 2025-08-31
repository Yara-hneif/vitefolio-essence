// English-only comments
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User as SbUser, AuthChangeEvent } from "@supabase/supabase-js";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  signInWithProvider: (p: "google" | "github" | "facebook" | "linkedin_oidc") => Promise<void>;
  getHandle: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSbUser(u: SbUser | null): User | null {
  if (!u) return null;
  const m = (u as any).user_metadata || {};
  const username =
    m.user_name || m.nickname || m.preferred_username || m.login || (u.email ? u.email.split("@")[0] : "");
  return {
    id: u.id,
    username: (username || "").toString().toLowerCase().replace(/[^a-z0-9-_.]/g, "-"),
    email: u.email || "",
    name: m.name || m.full_name || u.email?.split("@")[0] || "User",
    bio: m.bio || "",
    avatar: m.avatar_url || m.picture || undefined,
    skills: m.skills || [],
    socialLinks: {
      github: m.github,
      linkedin: m.linkedin,
      twitter: m.twitter,
      website: m.website,
    },
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sbUser, setSbUser] = useState<SbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // keep session synced
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSbUser(session?.user ?? null);
        setLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data }) => {
      setSbUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  // public API
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw new Error(error.message || "Login failed");
    }
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          name: userData.name,
        },
        // confirmation redirect handled by Landing (we also allow OAuth)
      },
    });
    if (error) {
      setLoading(false);
      throw new Error(error.message || "Registration failed");
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const signInWithProvider = async (
    provider: "google" | "github" | "facebook" | "linkedin_oidc"
  ) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };


  const getHandle = () => {
    const mapped = mapSbUser(sbUser);
    return mapped?.username || null;
  };

  const value: AuthContextType = useMemo(
    () => ({
      user: mapSbUser(sbUser),
      isAuthenticated: !!sbUser,
      loading,
      login,
      register,
      logout,
      signInWithProvider,
      getHandle,
    }),
    [sbUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
