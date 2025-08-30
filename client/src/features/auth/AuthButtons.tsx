import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { signInWithProvider } = useAuth();
  return (
    <div className="grid gap-2">
      <Button onClick={() => signInWithProvider("google")}>Continue with Google</Button>
      <Button onClick={() => signInWithProvider("github")}>Continue with GitHub</Button>
      <Button onClick={() => signInWithProvider("facebook")}>Continue with Facebook</Button>
      <Button onClick={() => signInWithProvider("linkedin_oidc")}>Continue with LinkedIn</Button>
    </div>
  );
}
