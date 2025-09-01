import React, { createContext, useContext, useMemo, useState } from "react";
import { useSignIn, useSignUp, useUser, useClerk } from "@clerk/clerk-react";
import { SignInResource, SignUpResource } from "@clerk/types";
import { UserResource } from "@clerk/types";
import { syncUserToSupabase } from "@/lib/authService";

type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  avatar?: string;
};

type RegisterPayload = { username?: string; name?: string; email: string; password: string };

type AuthCtx = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
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
      // login
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
      // register
      const res = await signUp.create({
        emailAddress: email,
        password,
      });
      if (res.status === "complete") {
        if (clerkUser) {
          await syncUserToSupabase(clerkUser, { username, full_name: name });
        }
      } else {
        throw new Error("Registration not completed");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const value = useMemo(
    () => ({
      user: mappedUser,
      isAuthenticated: !!mappedUser,
      loading: loading || !isLoaded,
      login,
      register,
      logout,
    }),
    [mappedUser, loading, isLoaded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
