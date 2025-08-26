import { X } from "lucide-react";

type Props = {
  unreadCount: number;
  onClose: () => void;
};

export default function InboxHeader({ unreadCount, onClose }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Bigger title */}
          <h2 className="text-[clamp(18px,1.6vw,22px)] font-bold tracking-tight">
            Inbox
          </h2>

          {/* Softer violet pill for unread */}
          <span className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-0.5 rounded-full bg-purple-600 text-white ring-1 ring-violet-600/20 shadow-sm dark:bg-violet-500">
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {unreadCount} unread
          </span>

          {/* If you prefer a stronger brand look, use this instead:
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
            {unreadCount} unread
          </span>
          */}
        </div>

        <button
          className="p-2 rounded-full hover:bg-black/5"
          onClick={onClose}
          aria-label="Close inbox"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
