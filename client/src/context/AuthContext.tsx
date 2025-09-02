import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSignIn, useSignUp, useUser, useClerk } from "@clerk/clerk-react";
import { syncUserToSupabase, deleteUserFromSupabase } from "@/lib/authService";

type OAuthProvider =
  | "google"
  | "github"
  | "facebook"
  | "discord"
  | "microsoft"
  | "apple"
  | "linkedin";

export type SocialLinks = {
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
  avatar?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
};

type RegisterPayload = { username?: string; name?: string; email: string; password: string };

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loginWithProvider: (provider: OAuthProvider) => Promise<void>;
  deleteAccount: () => Promise<void>;
  getHandle: () => string | null;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);

  const lastSyncedRef = useRef<string | null>(null);

  const mappedUser: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? undefined,
        name: clerkUser.fullName ?? undefined,
        username:
          clerkUser.username ??
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ??
          undefined,
        avatar: clerkUser.imageUrl ?? undefined,
        bio: (clerkUser.publicMetadata as any)?.bio ?? undefined,
        skills: (clerkUser.publicMetadata as any)?.skills ?? [],
        socialLinks: {
          github: (clerkUser.publicMetadata as any)?.github,
          linkedin: (clerkUser.publicMetadata as any)?.linkedin,
          twitter: (clerkUser.publicMetadata as any)?.twitter,
          website: (clerkUser.publicMetadata as any)?.website,
        },
      }
    : null;

  const login = async (email: string, password: string) => {
    if (!signIn || !setActive) return;
    setLoading(true);
    try {
      const res = await signIn.create({
        strategy: "password",
        identifier: email,
        password,
      });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
      } else {
        throw new Error("Login not completed");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password }: RegisterPayload) => {
    if (!signUp || !setActive) return;
    setLoading(true);
    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
      });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
      } else {
        throw new Error("Registration not completed (verification may be required)");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    lastSyncedRef.current = null;
  };

  const loginWithProvider = async (provider: OAuthProvider) => {
    if (!signIn) return;
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      });
    } catch (err) {
      console.error("❌ Social login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!clerkUser) throw new Error("No user logged in");
    setLoading(true);
    try {
      await deleteUserFromSupabase(clerkUser.id);
      await clerkUser.delete();
    } catch (err) {
      console.error("❌ Failed to delete account:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) return;

    // مزامنة مرّة واحدة لكل مستخدم
    if (lastSyncedRef.current === clerkUser.id) return;

    syncUserToSupabase(clerkUser)
      .catch((err) => console.error("❌ syncUserToSupabase failed:", err))
      .finally(() => {
        lastSyncedRef.current = clerkUser.id;
      });
  }, [isLoaded, clerkUser]);

  const getHandle = () => mappedUser?.username || null;

  const value: AuthCtx = useMemo(
    () => ({
      user: mappedUser,
      isAuthenticated: !!mappedUser,
      loading: loading || !isLoaded,
      login,
      register,
      logout,
      loginWithProvider,
      deleteAccount,
      getHandle,
    }),
    [mappedUser, loading, isLoaded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
