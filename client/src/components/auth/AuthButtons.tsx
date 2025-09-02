import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/navigation/button";

export default function AuthButtons() {
  const { loginWithProvider } = useAuth();
  return (
    <div className="grid gap-2">
      <Button onClick={() => loginWithProvider("google")}>Continue with Google</Button>
      <Button onClick={() => loginWithProvider("github")}>Continue with GitHub</Button>
      <Button onClick={() => loginWithProvider("facebook")}>Continue with Facebook</Button>
      <Button onClick={() => loginWithProvider("linkedin")}>Continue with LinkedIn</Button>
    </div>
  );
}
