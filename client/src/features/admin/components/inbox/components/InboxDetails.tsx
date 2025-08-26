import { MailOpen, Mail, Star, Trash2 } from "lucide-react";
import { IconButton } from "./ui";
import { textScale } from "../utils";
import { ContactMessage } from "@/features/admin/hooks/useAdminMessages";
import ReplyForm from "./ReplyForm";
import { cn } from "@/lib/utils";

export default function InboxDetails({
  className,
  active,
  listWide,
  toggleRead,
  toggleStar,
  delMsg,
  onReplied,
}: {
  className?: string;
  active: ContactMessage;
  listWide: boolean;
  toggleRead: (m: ContactMessage) => void;
  toggleStar: (m: ContactMessage) => void;
  delMsg: (id: string) => void;
  onReplied: (subject: string, body: string) => Promise<void>;
}) {
  return (
    <div className={cn("min-h-0 flex flex-col", className)}>
      <div className="px-4 md:px-6 py-3.5 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={cn("leading-tight truncate", textScale.head)}>
              {active.subject || "(No subject)"}
            </div>
            <div
              className={cn(
                "mt-1 flex flex-wrap items-center gap-x-2 gap-y-1",
                textScale.sub
              )}
            >
              <span className="truncate">
                From: <b className="text-foreground">{active.name || "Unknown"}</b>{" "}
                &lt;{active.email}&gt;
              </span>
              <span>• {new Date(active.created_at).toLocaleString()}</span>
              {active.auto_reply_sent_at && <span>• Auto-replied</span>}
              {active.replied_at && <span>• Replied</span>}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <IconButton
              label={active.is_read ? "Mark as unread" : "Mark as read"}
              onClick={() => toggleRead(active)}
            >
              {active.is_read ? (
                <MailOpen className="w-5 h-5" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </IconButton>
            <IconButton
              label={active.is_starred ? "Unstar" : "Star"}
              onClick={() => toggleStar(active)}
            >
              <Star
                className={cn(
                  "w-5 h-5",
                  active.is_starred ? "text-amber-500" : "text-muted-foreground"
                )}
              />
            </IconButton>
            <IconButton label="Delete" onClick={() => delMsg(active.id)}>
              <Trash2 className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 md:px-6 py-4 space-y-4">
        <div className="rounded-2xl border p-4 md:p-5 bg-card leading-relaxed text-[clamp(13px,1.05vw,15px)]">
          {active.message}
        </div>

        <ReplyForm
          toEmail={active.email}
          defaultSubject={
            active.subject ? `Re: ${active.subject}` : "Your message"
          }
          onSend={onReplied}
        />
      </div>
    </div>
  );
}
