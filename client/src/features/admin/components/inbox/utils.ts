import { ContactMessage } from "@/features/admin/hooks/useAdminMessages";

export function getInitials(nameOrEmail: string) {
  const base = nameOrEmail?.trim() || "";
  if (!base) return "?";
  const parts = base.replace(/<.*?>/g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return (parts[0][0] || "?").toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function formatDate(d: string | number | Date) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "";
  }
}

// Export selected messages to CSV (client-side)
export function exportSelectedCSV(all: ContactMessage[], ids: string[]) {
  const header = [
    "id","name","email","subject","message","created_at","is_read","is_starred"
  ];
  const rows = ids
    .map((id) => all.find((m) => m.id === id))
    .filter(Boolean) as ContactMessage[];

  const esc = (v: any) =>
    `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;

  const csv = [header.join(",")]
    .concat(
      rows.map((r) =>
        [
          r.id,
          r.name || "Unknown",
          r.email,
          r.subject || "",
          r.message || "",
          new Date(r.created_at).toISOString(),
          r.is_read ? "1" : "0",
          r.is_starred ? "1" : "0",
        ].map(esc).join(",")
      )
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inbox_export_${new Date().toISOString().slice(0,19)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Dynamic typography (responsive)
export const textScale = {
  base:  "text-[clamp(13px,1.05vw,15px)]", 
  sub:   "text-[clamp(12px,1.0vw,14px)] text-muted-foreground", 
  title: "text-[clamp(14px,1.12vw,16px)] font-medium", 
  head:  "text-[clamp(15px,1.2vw,18px)] font-semibold", 
};

// Density → paddings
export const densityMap = {
  comfortable: { padY: "py-4",   line: "min-h-[84px]" },
  cozy:        { padY: "py-3.5", line: "min-h-[76px]" },
  compact:     { padY: "py-3",   line: "min-h-[68px]" },
} as const;
