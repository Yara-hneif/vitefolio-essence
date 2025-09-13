import React from "react";
import ProtectedAdmin from "@/features/admin/guards/ProtectedAdmin";

interface AdminAccessGuardProps {
  children: React.ReactNode;
}

export default function AdminAccessGuard({ children }: AdminAccessGuardProps) {
  return <ProtectedAdmin>{children}</ProtectedAdmin>;
}
