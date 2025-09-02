import ClerkGuard from "@/features/admin/guards/ClerkGuard";
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin";

export default function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  return (
    <ClerkGuard>
      <ProtectedAdmin>{children}</ProtectedAdmin>
    </ClerkGuard>
  );
}
