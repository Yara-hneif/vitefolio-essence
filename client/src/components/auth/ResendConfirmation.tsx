import { useState } from "react";
import { Button } from "@/components/ui/navigation/button"; 
import { toast } from "sonner"; 

interface ResendProps {
  email: string;
}

export default function ResendConfirmation({ email }: ResendProps) {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/resend`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "signup",
            email,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error_description || err.message);
      }

      toast.success("Confirmation email resent successfully. Please check your inbox.");
    } catch (err: any) {
      toast.error("Error resending email: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleResend} disabled={loading}>
      {loading ? "Sending..." : "Resend Confirmation Email"}
    </Button>
  );
}
