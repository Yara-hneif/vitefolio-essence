import { MailOpen, Mail, Star, Trash2 } from "lucide-react";
import { IconButton } from "./ui";
import { textScale, densityMap, formatDate, getInitials } from "../utils";
import { ContactMessage } from "@/features/admin/hooks/useAdminMessages";
import { Density } from "../types";
import { cn } from "@/lib/utils";

export default function InboxList({
  className,
  items,
  filtered,
  active,
  setActive,
  selected,
  setSelected,
  listWide,
  density,
  toggleRead,
  toggleStar,
  delMsg,
  isLoading,
  onLoadMore,
  canLoadMore,
}: {
  className?: string;
  items: ContactMessage[];
  filtered: ContactMessage[];
  active: ContactMessage | null;
  setActive: (m: ContactMessage) => void;
  selected: Record<string, boolean>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  listWide: boolean;
  density: Density;
  toggleRead: (m: ContactMessage) => void;
  toggleStar: (m: ContactMessage) => void;
  delMsg: (id: string) => void;
  isLoading: boolean;
  onLoadMore: () => void;
  canLoadMore: boolean;
}) {
  const d = densityMap[density];

  return (
    <div className={cn("border-r-0", className)}>
      {isLoading ? (
        <div className="p-6 text-[13px] text-muted-foreground">Loading…</div>
      ) : filtered.length ? (
        <ul className="divide-y">
          {filtered.map((m) => {
            const checked = !!selected[m.id];
            const isActive = active?.id === m.id;
            const isRead = isActive ? true : m.is_read;

            // Stronger visual separation
            const rowBg = isActive
              ? "bg-muted/60"
              : isRead
              ? "bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900/80"
              : "bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/45";

            const dimText = isRead && !isActive ? "text-foreground/70" : "text-foreground";
            const dimIcon = isRead && !isActive ? "opacity-55" : "opacity-100";
            const subjectWeight = !isRead && !isActive ? "font-semibold" : "font-medium";

            return (
              <li
                key={m.id}
                className={cn(
                  "relative px-3 md:px-4 cursor-pointer transition-colors",
                  d.padY,
                  d.line,
                  rowBg
                )}
                onClick={() => setActive(m)}
                aria-selected={isActive}
                aria-label={isRead ? "Read message" : "Unread message"}
              >
                {/* Left accent for UNREAD */}
                {!isRead && !isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-violet-500 rounded-r" />
                )}

                <div className="flex items-start gap-3">
                  <input
                    aria-label="Select message"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [m.id]: e.target.checked }))
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 shrink-0"
                  />

                  <div className="mt-0.5 h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[12px] font-semibold text-violet-700 dark:text-violet-300 shrink-0">
                    {getInitials(m.name || m.email)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("truncate max-w-[42%]", textScale.base, dimText)}>
                        {m.name || "Unknown"}
                      </span>
                      <span className={cn("truncate max-w-[38%]", textScale.sub)}>
                        {m.email}
                      </span>
                      <span className={cn(textScale.sub, "ml-auto shrink-0")}>
                        {formatDate(m.created_at)}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      <div className={cn(textScale.title, subjectWeight, "truncate", dimText)}>
                        {m.subject || "(No subject)"}
                      </div>
                      {!isRead && (
                        <span className="text-[10px] bg-violet-200 text-violet-800 px-1.5 py-0.5 rounded-full shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "leading-relaxed line-clamp-1",
                        textScale.sub,
                        isRead && "text-foreground/70"
                      )}
                    >
                      {m.message}
                    </div>
                  </div>

                  <div
                    className="flex shrink-0 items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      label={isRead ? "Mark as unread" : "Mark as read"}
                      onClick={() => toggleRead(m)}
                    >
                      {isRead ? (
                        <MailOpen className={cn("w-4 h-4", dimIcon)} />
                      ) : (
                        <Mail className={cn("w-4 h-4", dimIcon)} />
                      )}
                    </IconButton>

                    <IconButton
                      label={m.is_starred ? "Unstar" : "Star"}
                      onClick={() => toggleStar(m)}
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          m.is_starred ? "text-amber-500" : "text-muted-foreground",
                          dimIcon
                        )}
                      />
                    </IconButton>

                    <IconButton label="Delete" onClick={() => delMsg(m.id)}>
                      <Trash2 className={cn("w-4 h-4", dimIcon)} />
                    </IconButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="p-6 text-[13px] text-muted-foreground">No messages found.</div>
      )}

      {canLoadMore && (
        <div className="p-3 border-t flex justify-center">
          <button
            className="h-8 px-3 rounded-lg border hover:bg-black/5 text-[13px]"
            onClick={onLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
