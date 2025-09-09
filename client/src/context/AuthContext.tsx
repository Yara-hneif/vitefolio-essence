import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import type { Database, TablesInsert } from "@/utils/types/database.types";

// ---------- Types ----------
interface UserProfile {
  id: string;
  clerkId: string;
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

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

type OAuthProvider = "oauth_google" | "oauth_github" | "oauth_facebook" | "oauth_linkedin_oidc";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ status: string; error?: string }>;
  register: (userData: RegisterData) => Promise<{ status: string; error?: string }>;
  authWithProvider: (provider: OAuthProvider) => Promise<void>;
  getHandle: () => string | null;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// ---------- Context ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Helpers ----------
const safeUsername = (raw?: string) =>
  (raw || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, "-")
    .slice(0, 50);

// Sync Clerk user -> Supabase profiles
async function syncUserToSupabase(clerkUser: any): Promise<UserProfile | null> {
  if (!clerkUser) return null;

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const imageUrl: string | undefined = clerkUser?.imageUrl ?? undefined;
  const pm = (clerkUser?.publicMetadata ?? {}) as Record<string, any>;
  const um = (clerkUser?.unsafeMetadata ?? {}) as Record<string, any>;
  const meta = { ...pm, ...um };

  const baseUsername =
    clerkUser?.username ||
    meta.user_name ||
    meta.nickname ||
    meta.preferred_username ||
    (email ? email.split("@")[0] : `user_${clerkUser?.id?.slice?.(0, 8)}`);

  const userData: TablesInsert<"profiles"> = {
    id: clerkUser.id,
    clerk_id: clerkUser.id,
    email,
    name:
      pm.name ||
      pm.full_name ||
      `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
      (email ? email.split("@")[0] : "User"),
    username: safeUsername(baseUsername),
    avatar: imageUrl ?? null,
    bio: (pm.bio as string) ?? null,
    social_links: (pm.socialLinks as Record<string, string>) ?? null,
    skills: (pm.skills as string[]) ?? null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(userData, { onConflict: "clerk_id" })
    .select("*")
    .single();

  if (error) {
    console.error("Error syncing user to Supabase:", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    clerkId: data.clerk_id!,
    username: data.username,
    email: data.email ?? "",
    name: data.name ?? "",
    bio: data.bio ?? "",
    avatar: data.avatar ?? imageUrl ?? "",
    skills: (data.skills as string[] | null) ?? [],
    socialLinks:
      (data.social_links as {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
      }) ?? {},
  };
}

// ---------- Provider ----------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        if (!isLoaded) return;
        if (!clerkUser) {
          if (!cancelled) setUser(null);
          if (!cancelled) setLoading(false);
          return;
        }
        const profile = await syncUserToSupabase(clerkUser);
        if (!cancelled) setUser(profile);
      } catch (e) {
        console.error("Error setting up Supabase auth:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [clerkUser, isLoaded]);

  // ---- API ----
  const login = async (email: string, password: string) => {
    if (!signIn) return { status: "error", error: "Sign in not available" };
    try {
      setLoading(true);
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") return { status: "complete" };
      if (result.status === "needs_first_factor") return { status: "needs_verification" };
      return { status: "error", error: "Login failed" };
    } catch (err: any) {
      return { status: "error", error: err?.errors?.[0]?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    if (!signUp) return { status: "error", error: "Sign up not available" };
    try {
      setLoading(true);
      const res = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" "),
        username: data.username,
      });
      if (res.status === "complete") return { status: "complete" };
      else if (res.status === "missing_requirements") {
        // Send verification email
        await signUp.prepareEmailAddressVerification();
        return { status: "needs_verification" };
      }else{
      return { status: "error", error: "Registration failed" };
      }
    } catch (err: any) {
      return { status: "error", error: err?.errors?.[0]?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const authWithProvider = async (provider: OAuthProvider) => {
    if (!signIn) throw new Error("Sign in not available");

     try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard'
      });
    } catch (error: any) {
      throw new Error(error.errors?.[0]?.message || 'Social login failed');
    }

  };

  const logout = async () => {
    try {
      await signOut(); // Clerk only
      setUser(null);
      navigate("/");
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  const deleteAccount = async () => {
    try {
      if (user?.clerkId) {
        await supabase.from("profiles").delete().eq("clerk_id", user.clerkId);
      }
      await (clerkUser as any)?.delete?.();
      setUser(null);
      await signOut();
      navigate("/");
    } catch (e) {
      console.error("Error deleting account:", e);
      throw e;
    }
  };

  const getHandle = () => user?.username ?? null;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!clerkUser,
      loading: loading || !isLoaded,
      login,
      register,
      authWithProvider,
      logout,
      deleteAccount,
      getHandle,
    }),
    [user, clerkUser, loading, isLoaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
