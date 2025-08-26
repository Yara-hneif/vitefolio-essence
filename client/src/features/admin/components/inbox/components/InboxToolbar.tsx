import { MailOpen, Mail, Star, Trash2, Upload, Filter, Search, LayoutList, Columns2, CheckSquare, Square } from "lucide-react";
import { ToolbarSm, FilterButton, SegmentedSm } from "./ui";
import { Density, FilterMode } from "../types";

export default function InboxToolbar({
  q, setQ,
  selectedCount, canBulk,
  onBulkRead, onBulkUnread, onBulkStar, onBulkUnstar, onBulkDelete, onExport,
  mode, setMode,
  toggleSelectAll, allSelected,
  density, setDensity,
  listWide, setListWide,
}: {
  q: string; setQ: (v: string) => void;
  selectedCount: number; canBulk: boolean;
  onBulkRead: () => void; onBulkUnread: () => void;
  onBulkStar: () => void; onBulkUnstar: () => void;
  onBulkDelete: () => void; onExport: () => void;
  mode: FilterMode; setMode: (m: FilterMode) => void;
  toggleSelectAll: () => void; allSelected: boolean;
  density: Density; setDensity: (d: Density) => void;
  listWide: boolean; setListWide: (v: boolean) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;

}) {
  return (
    <div className="px-4 md:px-6 pb-3 flex flex-col gap-2 border-b">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name / email / subject / message…"
            className="w-full pl-9 pr-3 h-10 rounded-xl border bg-background outline-none text-[clamp(13px,1.05vw,15px)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <ToolbarSm disabled={!canBulk} onClick={onBulkRead}  title="Mark selected as read">
            <MailOpen className="w-4 h-4" /><span className="hidden md:inline">Read</span>
          </ToolbarSm>
          <ToolbarSm disabled={!canBulk} onClick={onBulkUnread} title="Mark selected as unread">
            <Mail className="w-4 h-4" /><span className="hidden md:inline">Unread</span>
          </ToolbarSm>
          <ToolbarSm disabled={!canBulk} onClick={onBulkStar} title="Star selected">
            <Star className="w-4 h-4" /><span className="hidden md:inline">Star</span>
          </ToolbarSm>
          <ToolbarSm disabled={!canBulk} onClick={onBulkUnstar} title="Unstar selected">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="hidden md:inline">Unstar</span>
          </ToolbarSm>
          <ToolbarSm disabled={!canBulk} onClick={onBulkDelete} title="Delete selected">
            <Trash2 className="w-4 h-4" /><span className="hidden md:inline">Delete</span>
          </ToolbarSm>
          <ToolbarSm disabled={!canBulk} onClick={onExport} title="Export selected to CSV">
            <Upload className="w-4 h-4" /><span className="hidden md:inline">Export</span>
          </ToolbarSm>
          {selectedCount > 0 && (
            <span className="ml-0.5 text-[11px] px-1.5 py-0.5 rounded-full bg-rose-600/10 text-rose-700 dark:text-rose-300">
              {selectedCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground mr-1" />
          <FilterButton active={mode === "all"}     onClick={() => setMode("all")}>All</FilterButton>
          <FilterButton active={mode === "unread"}  onClick={() => setMode("unread")}>Unread</FilterButton>
          <FilterButton active={mode === "starred"} onClick={() => setMode("starred")}>Starred</FilterButton>

          <button
            className="ml-1.5 h-8 px-3 rounded-lg border hover:bg-black/5 inline-flex items-center gap-2"
            onClick={toggleSelectAll}
            title={allSelected ? "Clear selection" : "Select all (visible)"}
            aria-pressed={allSelected}
          >
            {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            <span className="text-[13px] hidden md:inline">{allSelected ? "Clear" : "Select all"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SegmentedSm
            options={[
              { key: "comfortable", label: "Comfort", value: "comfortable" as Density },
              { key: "cozy",        label: "Cozy",    value: "cozy" as Density },
              { key: "compact",     label: "Compact", value: "compact" as Density },
            ]}
            value={density}
            onChange={(v) => setDensity(v as Density)}
          />
          <button
            className="h-8 px-3 rounded-lg border hover:bg-black/5 inline-flex items-center gap-2"
            onClick={() => setListWide(!listWide)}
            title={listWide ? "Balanced view" : "List-wide view"}
          >
            {listWide ? <Columns2 className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
            <span className="text-[13px] hidden md:inline">{listWide ? "Balanced" : "List-wide"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
