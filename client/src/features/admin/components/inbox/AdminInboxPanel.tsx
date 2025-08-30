import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAdminMessages,
  useAdminUpdateMessage,
  useAdminDeleteMessage,
  useAdminBulkDelete,
  useAdminReply,
  ContactMessage,
} from "@/features/admin/hooks/useAdminMessages";
import { cn } from "@/lib/utils";
import InboxHeader from "./components/InboxHeader";
import InboxToolbar from "./components/InboxToolbar";
import InboxList from "./components/InboxList";
import InboxDetails from "./components/InboxDetails";
import { exportSelectedCSV, densityMap } from "./utils";
import { Density, FilterMode } from "./types";

export default function AdminInboxPanel({
  open,
  onClose,
  triggerRef, // optional: pass opener button ref to restore focus on close
}: {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}) {
  // UI state
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<ContactMessage | null>(null);
  const [mode, setMode] = useState<FilterMode>("all");
  const [density, setDensity] = useState<Density>("cozy"); // medium by default
  const [listWide, setListWide] = useState(false);
  const [pageSize, setPageSize] = useState(30);

  // Split percentage for list width (0.3 - 0.75)
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

  // Data
  const { data, isLoading } = useAdminMessages({
    q,
    page: 1,
    pageSize,
    sort: "created_at:desc",
  });
  const items = data?.items ?? [];

  // Mutations
  const updateMsg = useAdminUpdateMessage();
  const delMsg = useAdminDeleteMessage();
  const bulkDelete = useAdminBulkDelete();
  const replyMut = useAdminReply();

  // Derived
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
    allSelectableIds.length > 0 &&
    allSelectableIds.every((id) => selected[id]);
  const canBulk = selectedIds.length > 0;

  // Close helper: blur focused node, restore focus to trigger if provided
  const handleClose = () => {
    const activeEl = document.activeElement as HTMLElement | null;
    if (activeEl) activeEl.blur();
    onClose();
    // restore focus on next frame to avoid focusing inside aria-hidden subtree
    requestAnimationFrame(() => {
      triggerRef?.current?.focus({ preventScroll: true });
    });
  };

  // Reset + ESC close
  useEffect(() => {
    if (!open) {
      setSelected({});
      setActive(null);
      setQ("");
      setMode("all");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Manage inert + initial focus + simple focus trap
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (open) {
      el.removeAttribute("inert");
      // focus first focusable inside the panel
      const selector =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      requestAnimationFrame(() => {
        const focusables = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(
          (n) => n.offsetParent !== null
        );
        focusables[0]?.focus({ preventScroll: true });
      });
    } else {
      el.setAttribute("inert", "");
      // if focus is still inside the panel, move it out
      if (el.contains(document.activeElement)) {
        triggerRef?.current?.focus({ preventScroll: true });
      }
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;

    const selector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(
        (n) => n.offsetParent !== null
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (activeEl === first || !el.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !el.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  // Auto mark as read on open
  useEffect(() => {
    if (!active || active.is_read) return;
    setActive((p) => (p ? { ...p, is_read: true } : p));
    updateMsg.mutate({ id: active.id, patch: { is_read: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const isTyping = (el: EventTarget | null) =>
      !!el && (el as HTMLElement).closest("input, textarea, [contenteditable=true]");
    const handler = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (!filtered.length) return;

      const idx = active ? filtered.findIndex((m) => m.id === active.id) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nx = filtered[Math.min(idx + 1, filtered.length - 1)];
        if (nx) setActive(nx);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const pv = filtered[Math.max(idx - 1, 0)];
        if (pv) setActive(pv);
      } else if (e.key.toLowerCase() === "s" && active) {
        e.preventDefault();
        toggleStar(active);
      } else if (e.key.toLowerCase() === "u" && active) {
        e.preventDefault();
        toggleRead(active);
      } else if ((e.key === "Delete" || e.key === "Backspace") && active) {
        e.preventDefault();
        delMsg.mutate(active.id);
        setActive(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, active, filtered, delMsg]);

  // Keep toolbar toggle in sync with split percentage
  useEffect(() => {
    setSplitPct((prev) => {
      const next = listWide ? Math.max(prev, 0.55) : Math.min(prev, 0.45);
      try {
        localStorage.setItem("admin_inbox_split", String(next));
      } catch {}
      return next;
    });
  }, [listWide]);

  // Actions
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const c = { ...prev };
        allSelectableIds.forEach((id) => delete c[id]);
        return c;
      });
    } else {
      setSelected((prev) => {
        const c = { ...prev };
        allSelectableIds.forEach((id) => (c[id] = true));
        return c;
      });
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

  // Drag handle logic (with requestAnimationFrame to reduce reflow)
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();

    const getX = (ev: any) =>
      "touches" in ev ? ev.touches[0].clientX : ev.clientX;

    let raf = 0;
    let next = splitPct;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = getX(ev);
        const pct = (x - rect.left) / rect.width;
        next = Math.min(0.75, Math.max(0.3, pct));
        setSplitPct(next);
        document.body.style.cursor = "col-resize";
        document.body.classList.add("select-none");
        raf = 0;
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove as any);
      document.removeEventListener("touchmove", onMove as any);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      document.body.style.cursor = "";
      document.body.classList.remove("select-none");
      try {
        localStorage.setItem("admin_inbox_split", String(next));
      } catch {}
      setListWide(next >= 0.52);
    };

    document.addEventListener("mousemove", onMove as any);
    document.addEventListener("touchmove", onMove as any, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
  };

  const d = densityMap[density];
  const canLoadMore = items.length >= pageSize;

  return (
    <>
      {/* Backdrop (closes when clicking outside) */}
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

        {/* Desktop / tablet (resizable split) */}
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
            setActive={(m) => setActive(m)}
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
              onMouseDown={onDragStart}
              onTouchStart={onDragStart}
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
            <div className="min-h-0 overflow-auto flex items-center justify-center text-[clamp(12px,1.02vw,14px)] text-muted-foreground">
              Select a message to view details
            </div>
          )}
        </div>

        {/* Mobile (stacked, no resizer) */}
        <div className="flex-1 sm:hidden min-h-0 overflow-auto">
          <div className="grid grid-cols-1 min-h-0">
            <InboxList
              className="min-h-0 overflow-auto border-t"
              items={items}
              filtered={filtered}
              active={active}
              setActive={(m) => setActive(m)}
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
        </div>
      </aside>
    </>
  );
}