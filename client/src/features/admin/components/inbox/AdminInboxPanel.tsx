import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";

import {
  useAdminMessages,
  useAdminUpdateMessage,
  useAdminDeleteMessage,
  useAdminBulkDelete,
  useAdminReply,
  ContactMessage,
} from "@/features/admin/hooks/useAdminMessages";
import { cn } from "@/lib/utils";

const InboxHeader = lazy(() => import("@/features/admin/components/inbox/components/InboxHeader"));
const InboxToolbar = lazy(() => import("@/features/admin/components/inbox/components/InboxToolbar"));
const InboxList = lazy(() => import("@/features/admin/components/inbox/components/InboxList"));
const InboxDetails = lazy(() => import("@/features/admin/components/inbox/components/InboxDetails"));

import { exportSelectedCSV, densityMap } from "@/features/admin/components/inbox/utils";
import { Density, FilterMode } from "@/features/admin/components/inbox/types";

function PanelSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-40 rounded bg-muted" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <div className="h-10 rounded bg-muted" />
          <div className="h-72 rounded bg-muted" />
        </div>
        <div className="lg:col-span-2 space-y-3">
          <div className="h-10 rounded bg-muted" />
          <div className="h-96 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

type AdminInboxPanelProps = {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
};

export default function AdminInboxPanel({ open, onClose, triggerRef }: AdminInboxPanelProps) {
  // ------------------- State & Hooks -------------------
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<ContactMessage | null>(null);
  const [mode, setMode] = useState<FilterMode>("all");
  const [density, setDensity] = useState<Density>("cozy");
  const [listWide, setListWide] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [splitPct, setSplitPct] = useState<number>(() => {
    try {
      const v = localStorage.getItem("admin_inbox_split");
      if (v) {
        const num = parseFloat(v);
        if (!Number.isNaN(num)) return Math.min(0.75, Math.max(0.3, num));
      }
    } catch {}
    return 0.45;
  });

  const gridRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const { data, isLoading } = useAdminMessages({
    q,
    page: 1,
    pageSize,
    sort: "created_at:desc",
  });
  const items = data?.items ?? [];

  const updateMsg = useAdminUpdateMessage();
  const delMsg = useAdminDeleteMessage();
  const bulkDelete = useAdminBulkDelete();
  const replyMut = useAdminReply();

  // ------------------- Derived Values -------------------
  const filtered = useMemo(() => {
    switch (mode) {
      case "unread":
        return items.filter((m) => !m.is_read);
      case "starred":
        return items.filter((m) => m.is_starred);
      default:
        return items;
    }
  }, [items, mode]);

  const unreadCount = useMemo(
    () => items.reduce((acc, i) => acc + (i.is_read ? 0 : 1), 0),
    [items]
  );

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );
  const allSelectableIds = useMemo(() => filtered.map((m) => m.id), [filtered]);
  const allSelected =
    allSelectableIds.length > 0 && allSelectableIds.every((id) => selected[id]);
  const canBulk = selectedIds.length > 0;

  const d = densityMap[density];
  const canLoadMore = items.length >= pageSize;

  // ------------------- Helpers -------------------
  const handleClose = () => {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl) activeEl.blur();
    onClose();
    requestAnimationFrame(() => {
      triggerRef?.current?.focus({ preventScroll: true });
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      const c = { ...selected };
      allSelectableIds.forEach((id) => delete c[id]);
      setSelected(c);
    } else {
      const c = { ...selected };
      allSelectableIds.forEach((id) => (c[id] = true));
      setSelected(c);
    }
  };

  const toggleRead = (m: ContactMessage) => {
    updateMsg.mutate({ id: m.id, patch: { is_read: !m.is_read } });
    if (active?.id === m.id) setActive({ ...m, is_read: !m.is_read });
  };

  const toggleStar = (m: ContactMessage) => {
    updateMsg.mutate({ id: m.id, patch: { is_starred: !m.is_starred } });
    if (active?.id === m.id) setActive({ ...m, is_starred: !m.is_starred });
  };

  const bulkMark = (read: boolean) =>
    selectedIds.forEach((id) => updateMsg.mutate({ id, patch: { is_read: read } }));
  const bulkStarAct = (star: boolean) =>
    selectedIds.forEach((id) => updateMsg.mutate({ id, patch: { is_starred: star } }));
  const onExport = () => exportSelectedCSV(items, selectedIds);

  // ------------------- Effects (تركتها كما هي) -------------------
  // ... جميع الـ useEffect التي عندك تبقى كما هي (ESC close, trap, focus, navigation, auto read ...)

  // ------------------- Render -------------------
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-[69] bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={handleClose}
        />

        <aside
          ref={panelRef}
          role="dialog"
          aria-modal={open ? true : undefined}
          className={cn(
            "fixed right-0 top-0 z-[70] h-screen w-full sm:w-[720px] md:w-[980px] lg:w-[1160px] bg-white dark:bg-zinc-950 border-l shadow-2xl",
            "transition-transform",
            open ? "translate-x-0" : "translate-x-full",
            "flex flex-col"
          )}
          aria-hidden={!open}
        >
          <InboxHeader unreadCount={unreadCount} onClose={handleClose} />

          <InboxToolbar
            q={q}
            setQ={setQ}
            selectedCount={selectedIds.length}
            canBulk={canBulk}
            onBulkRead={() => bulkMark(true)}
            onBulkUnread={() => bulkMark(false)}
            onBulkStar={() => bulkStarAct(true)}
            onBulkUnstar={() => bulkStarAct(false)}
            onBulkDelete={() => bulkDelete.mutate(selectedIds)}
            onExport={onExport}
            mode={mode}
            setMode={setMode}
            toggleSelectAll={toggleSelectAll}
            allSelected={allSelected}
            density={density}
            setDensity={setDensity}
            listWide={listWide}
            setListWide={setListWide}
          />

          {/* Desktop / tablet */}
          <div
            ref={gridRef}
            className="flex-1 hidden sm:grid min-h-0"
            style={{
              gridTemplateColumns: `minmax(260px, ${Math.round(
                splitPct * 100
              )}%) 8px minmax(340px, 1fr)`,
            }}
          >
            <InboxList
              className="min-h-0 overflow-auto border-t sm:border-t-0 sm:border-r"
              items={items}
              filtered={filtered}
              active={active}
              setActive={setActive}
              selected={selected}
              setSelected={setSelected}
              listWide={listWide}
              density={density}
              toggleRead={toggleRead}
              toggleStar={toggleStar}
              delMsg={(id) => delMsg.mutate(id)}
              isLoading={isLoading}
              onLoadMore={() => setPageSize((s) => s + 30)}
              canLoadMore={canLoadMore}
            />

            {/* Drag handle */}
            <div className="relative hidden sm:block select-none">
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize panels"
                className="absolute inset-0 cursor-col-resize"
                style={{ paddingLeft: 2, paddingRight: 2 }}
              >
                <div className="h-full w-[2px] mx-auto bg-border rounded" />
              </div>
            </div>

            {active ? (
              <InboxDetails
                className="min-h-0 overflow-auto"
                listWide={listWide}
                active={active}
                toggleRead={toggleRead}
                toggleStar={toggleStar}
                delMsg={(id) => {
                  delMsg.mutate(id);
                  setActive(null);
                }}
                onReplied={async (subject, body) => {
                  await replyMut.mutateAsync({ id: active.id, subject, body });
                }}
              />
            ) : (
              <div className="min-h-0 overflow-auto flex items-center justify-center text-sm text-muted-foreground">
                Select a message to view details
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="flex-1 sm:hidden min-h-0 overflow-auto">
            <InboxList
              className="min-h-0 overflow-auto border-t"
              items={items}
              filtered={filtered}
              active={active}
              setActive={setActive}
              selected={selected}
              setSelected={setSelected}
              listWide={listWide}
              density={density}
              toggleRead={toggleRead}
              toggleStar={toggleStar}
              delMsg={(id) => delMsg.mutate(id)}
              isLoading={isLoading}
              onLoadMore={() => setPageSize((s) => s + 30)}
              canLoadMore={canLoadMore}
            />
            {active && (
              <InboxDetails
                className="min-h-0 overflow-auto"
                listWide={listWide}
                active={active}
                toggleRead={toggleRead}
                toggleStar={toggleStar}
                delMsg={(id) => {
                  delMsg.mutate(id);
                  setActive(null);
                }}
                onReplied={async (subject, body) => {
                  await replyMut.mutateAsync({ id: active.id, subject, body });
                }}
              />
            )}
          </div>
        </aside>
      </>
    </Suspense>
  );
}
