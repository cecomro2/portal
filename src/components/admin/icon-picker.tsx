"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TOPBAR_ICONS, TOPBAR_ICON_OPTIONS } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const labels = new Map(TOPBAR_ICON_OPTIONS.map((o) => [o.value, o.label]));
  const SelectedIcon = value ? TOPBAR_ICONS[value] : null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-sm transition hover:border-primary-300"
      >
        <span className="flex items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon size={18} className="text-primary-600" />
          ) : (
            <span className="text-xs text-muted">—</span>
          )}
          <span className="text-ink">
            {value ? (labels.get(value) ?? value) : "Sin icono"}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={cn("text-muted transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-6 gap-2 rounded-xl border border-line bg-white p-3 shadow-sm">
          {TOPBAR_ICON_OPTIONS.map((o) => {
            const Icon = TOPBAR_ICONS[o.value];
            const active = value === o.value;
            return (
              <button
                key={o.value || "none"}
                type="button"
                title={o.label}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg border transition",
                  active
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-line bg-white text-muted hover:border-primary-300 hover:text-primary-600",
                )}
              >
                {Icon ? (
                  <Icon size={20} />
                ) : (
                  <span className="text-[10px] font-semibold">Sin</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
