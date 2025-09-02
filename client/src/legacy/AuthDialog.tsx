import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";
import { Chrome, Github, Linkedin, Facebook } from "lucide-react";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function AuthDialog({ open, onOpenChange }: Props) {
  const { signInWithProvider } = useAuth();
  const [loading, setLoading] = useState<"google"|"github"|"facebook"|"linkedin_oidc" | null>(null);

  async function handle(p: "google"|"github"|"facebook"|"linkedin_oidc") {
    try {
      setLoading(p);
      await signInWithProvider(p);
      // Supabase will redirect; dialog can stay open until redirect completes.
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in or create your account</DialogTitle>
          <DialogDescription>Use your favorite provider to get started in seconds.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Button disabled={!!loading} onClick={() => handle("google")} className="justify-start gap-2">
            <Chrome className="h-4 w-4" /> Continue with Google
          </Button>
          <Button disabled={!!loading} onClick={() => handle("github")} variant="secondary" className="justify-start gap-2">
            <Github className="h-4 w-4" /> Continue with GitHub
          </Button>
          <Button disabled={!!loading} onClick={() => handle("facebook")} variant="secondary" className="justify-start gap-2">
            <Facebook className="h-4 w-4" /> Continue with Facebook
          </Button>
          <Button disabled={!!loading} onClick={() => handle("linkedin_oidc")} variant="secondary" className="justify-start gap-2">
            <Linkedin className="h-4 w-4" /> Continue with LinkedIn
          </Button>
        </div>

        <DialogFooter className="text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
