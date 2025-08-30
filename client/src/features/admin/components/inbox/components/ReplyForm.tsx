import { useEffect, useState } from "react";
import { ChevronDown, Reply } from "lucide-react";

export default function ReplyForm({
  toEmail, defaultSubject, onSend,
}: {
  toEmail: string;
  defaultSubject: string;
  onSend: (subject: string, body: string) => Promise<void>;
}) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setSubject(defaultSubject), [defaultSubject]);

  const insertTemplate = (t: string) => {
    setBody((prev) => (prev ? prev + "\n\n" + t : t));
    setMenuOpen(false);
  };

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!body.trim()) return;
        await onSend(subject, body);
        setBody("");
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 h-10 px-3 rounded-xl border bg-background text-[clamp(13px,1.05vw,15px)]"
          placeholder="Subject…"
        />
        <div className="relative">
          <button
            type="button"
            className="h-10 inline-flex items-center gap-2 px-3 rounded-xl border hover:bg-black/5 text-[14px]"
            onClick={() => setMenuOpen((v) => !v)}
            title="Quick replies"
          >
            Quick replies <ChevronDown className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-64 rounded-xl border bg-popover shadow-md p-1 z-50">
              <QuickItem onClick={() => insertTemplate("Thanks for reaching out! I’ll get back to you shortly.")} />
              <QuickItem onClick={() => insertTemplate("Appreciate your message. Noted, and I will follow up with details soon.")} text="Appreciate your message…" />
              <QuickItem onClick={() => insertTemplate("Received, thank you. I’ll review and respond with next steps.")} text="Received, thank you…" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="h-10 inline-flex items-center gap-2 px-3 rounded-xl border hover:bg-black/5 text-[14px]"
          title="Send reply"
        >
          <Reply className="w-4 h-4" />
          Send reply
        </button>
      </div>

      <div className="rounded-2xl border bg-background">
        <div className="px-3 pt-2 text-[12px] text-muted-foreground">
          To: {toEmail}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[160px] px-3 pb-3 pt-1 rounded-2xl outline-none bg-transparent text-[clamp(13px,1.05vw,15px)] leading-relaxed"
          placeholder="Write your reply here…"
        />
      </div>
    </form>
  );
}

function QuickItem({ onClick, text }: { onClick: () => void; text?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 text-[14px]"
    >
      {text ?? "Thanks for reaching out…"}
    </button>
  );
}
