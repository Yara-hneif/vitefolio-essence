import React from "react";
import { cn } from "@/lib/utils";

export function IconButton({
  children, onClick, label,
}: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-black/5"
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function ToolbarSm({
  children, onClick, title, disabled,
}: {
  children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 px-3 rounded-lg border hover:bg-black/5 inline-flex items-center gap-2 text-[13px] disabled:opacity-50",
        disabled && "pointer-events-none"
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function FilterButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-8 px-3 rounded-full text-[13px] border",
        active
          ? "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200 dark:border-violet-800"
          : "hover:bg-black/5"
      )}
    >
      {children}
    </button>
  );
}

export function SegmentedSm<T extends string>({
  options, value, onChange,
}: {
  options: { key: string; label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border overflow-hidden">
      {options.map((o, i) => (
        <button
          key={o.key}
          type="button"
          className={cn(
            "h-8 px-3 text-[13px]",
            o.value === value ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5",
            i !== options.length - 1 && "border-r"
          )}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
