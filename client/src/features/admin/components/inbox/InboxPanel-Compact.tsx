import { useEffect, useMemo, useState, useCallback } from "react";
import { useAdmin } from "@/features/admin/hooks/useAdminMode";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  X,
  Mail,
  MailOpen,
  Reply,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/navigation/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Badge } from "@/components/ui/data-display/badge";
import { Separator } from "@/components/ui/data-display/separator";
import { ScrollArea } from "@/components/ui/layout/scroll-area";
import { Textarea } from "@/components/ui/form/textarea";
import { Switch } from "@/components/ui/effects/switch";

type Message = {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  body?: string;
  created_at?: string;
  is_read?: boolean;
};

type MessagesApiResponse = {
  items: Message[];
  total: number;
  page: number;
  pageSize: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const DEFAULT_PAGE_SIZE = 12;

export default function AdminInboxPanel({ open, onClose }: Props) {
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [rows, setRows] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const [selected, setSelected] = useState<Message | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const load = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const resp = await api.get<MessagesApiResponse>("/api/admin/messages", {
        params: { page, pageSize },
      });
      const items = Array.isArray(resp.data?.items) ? resp.data.items : [];
      setRows(items);
      setTotal(Number(resp.data?.total ?? items.length));
    } catch (e: any) {
      if (e?.response?.status !== 404) toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, page, pageSize]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const listFiltered = useMemo(() => {
    const src = Array.isArray(rows) ? rows : [];
    const query = q.trim().toLowerCase();
    const filtered = src.filter((m) => {
      if (onlyUnread && m.is_read) return false;
      if (!query) return true;
      const fields = [m.name, m.email, m.subject, m.body].filter(Boolean) as string[];
      return fields.some((f) => f.toLowerCase().includes(query));
    });
    return filtered;
  }, [rows, q, onlyUnread]);

  const markRead = async (msg: Message, isRead: boolean) => {
    try {
      setMarking(msg.id);
      await api.put(`/api/admin/messages/${msg.id}/read`, { is_read: isRead });
      setRows((r) => r.map((m) => (m.id === msg.id ? { ...m, is_read: isRead } : m)));
      if (selected?.id === msg.id) setSelected({ ...msg, is_read: isRead });
    } catch {
      toast.error("Failed to update message");
    } finally {
      setMarking(null);
    }
  };

  const remove = async (msg: Message) => {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;
    try {
      setRemoving(msg.id);
      await api.delete(`/api/admin/messages/${msg.id}`);
      setRows((r) => r.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setRemoving(null);
    }
  };

  const replyTo = (msg: Message) => {
    if (!msg.email) return;
    const subject = encodeURIComponent(`Re: ${msg.subject ?? "Message"}`);
    const body = encodeURIComponent(
      `Hi ${msg.name ?? ""},\n\n` +
      `Thanks for reaching out.\n\n` +
      `--- Original message ---\n${msg.body ?? ""}\n`
    );
    window.open(`mailto:${msg.email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[75] h-full w-full md:w-[880px] 
        bg-white/90 dark:bg-zinc-900/90 border-l shadow-2xl backdrop-blur-md
        transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Inbox panel"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 backdrop-blur p-4">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight">Inbox</h2>
            <p className="text-xs text-muted-foreground">Review messages sent from the site.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <button
              className="p-2 rounded-full hover:bg-black/5"
              onClick={onClose}
              aria-label="Close inbox panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-5">
          {/* List */}
          <div className="md:col-span-2 border-r">
            <div className="p-3 flex items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search inbox…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 px-2">
                <Switch id="onlyUnread" checked={onlyUnread} onCheckedChange={(v) => setOnlyUnread(Boolean(v))} />
                <Label htmlFor="onlyUnread" className="text-xs text-muted-foreground">
                  Unread only
                </Label>
              </div>
            </div>

            <Separator />

            <ScrollArea className="h-[calc(100vh-64px-72px)]">
              <div className="p-2 space-y-2">
                {listFiltered.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      No messages found.
                    </CardContent>
                  </Card>
                ) : (
                  listFiltered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className={`w-full text-left rounded-lg border p-3 hover:bg-muted/40 transition ${
                        selected?.id === m.id ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">
                          {m.subject || "(no subject)"}
                        </div>
                        <Badge variant={m.is_read ? "secondary" : "default"}>
                          {m.is_read ? "Read" : "New"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {m.name ? `${m.name} • ` : ""}
                        {m.email || "unknown"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Pagination */}
            <div className="p-3 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Page {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Viewer */}
          <div className="md:col-span-3">
            {!selected ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Select a message to preview
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-64px)]">
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {selected.is_read ? (
                          <MailOpen className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        <h3 className="text-lg font-semibold truncate">
                          {selected.subject || "(no subject)"}
                        </h3>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        From: {selected.name ? `${selected.name} — ` : ""}
                        <a className="underline" href={`mailto:${selected.email}`}>{selected.email}</a>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markRead(selected, !Boolean(selected.is_read))}
                        disabled={marking === selected.id}
                      >
                        {selected.is_read ? "Mark unread" : "Mark read"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void remove(selected)}
                        disabled={removing === selected.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm">
                        {selected.body || "(empty message)"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Quick reply</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder={`Reply to ${selected.email ?? "sender"}…`}
                        rows={5}
                        defaultValue={
                          `Hi ${selected.name ?? ""},\n\nThanks for reaching out.\n\nBest,\n${import.meta.env.VITE_PROFILE_NAME || "Admin"}`
                        }
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => replyTo(selected)}>
                          <Reply className="h-4 w-4 mr-1" />
                          Open mail app
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
