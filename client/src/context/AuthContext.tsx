// src/context/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { useSignIn, useSignUp, useUser, useClerk } from "@clerk/clerk-react";
import { syncUserToSupabase } from "@/lib/authService";

type OAuthProvider =
  | "google"
  | "github"
  | "facebook"
  | "discord"
  | "microsoft"
  | "apple"
  | "linkedin";

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
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);

  const mappedUser: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? undefined,
        name: clerkUser.fullName ?? undefined,
        avatar: clerkUser.imageUrl ?? undefined,
      }
    : null;

  const login = async (email: string, password: string) => {
    if (!signIn) return;
    setLoading(true);
    try {
      const res = await signIn.create({
        strategy: "password",
        identifier: email,
        password,
      });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        if (clerkUser) {
          await syncUserToSupabase(clerkUser);
        }
      } else {
        throw new Error("Login not completed");
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, name, email, password }: RegisterPayload) => {
    if (!signUp) return;
    setLoading(true);
    try {
      const res = await signUp.create({
        emailAddress: email,
        password,
      });
      if (res.status !== "complete") {
        throw new Error("Registration not completed (verification may be required)");
      }
      // await setActive({ session: res.createdSessionId! });
      // if (clerkUser) await syncUserToSupabase(clerkUser, { username, full_name: name });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  // OAuth (Google/GitHub/…)
  const loginWithProvider = async (provider: OAuthProvider) => {
    if (!signIn) return;
    await signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: window.location.origin,         
      redirectUrlComplete: window.location.origin,  
    });
  };

  const value = useMemo(
    () => ({
      user: mappedUser,
      isAuthenticated: !!mappedUser,
      loading: loading || !isLoaded,
      login,
      register,
      logout,
      loginWithProvider,
    }),
    [mappedUser, loading, isLoaded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
