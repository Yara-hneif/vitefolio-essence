import { useAuth } from '@/contexts/AuthContext';
import { PropsWithChildren } from "react";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AuthGuard({ children }: PropsWithChildren) {
  const { pathname, search } = useLocation();
  const redirectUrl = `${pathname}${search || ""}`;

  return (
<>
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn redirectUrl={redirectUrl} />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}