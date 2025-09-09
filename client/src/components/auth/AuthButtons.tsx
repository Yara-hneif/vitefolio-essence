import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/navigation/button";

export default function AuthButtons() {
  const { authWithProvider } = useAuth();
  return (
    <div className="grid gap-2">
      <Button onClick={() => authWithProvider("oauth_google")}>Continue with Google</Button>
      <Button onClick={() => authWithProvider("oauth_github")}>Continue with GitHub</Button>
      <Button onClick={() => authWithProvider("oauth_facebook")}>Continue with Facebook</Button>
      <Button onClick={() => authWithProvider("oauth_linkedin_oidc")}>Continue with LinkedIn</Button>
    </div>
  );
}
