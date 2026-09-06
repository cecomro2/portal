"use client";

import { useState } from "react";
import { BannerManager } from "@/components/admin/banner-manager";
import { CifrasManager } from "@/components/admin/cifras-manager";
import { cn } from "@/lib/utils";

export default function EdicionInicioPage() {
  const [tab, setTab] = useState<"banner" | "cifras">("banner");

  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-line">
        {(
          [
            { key: "banner", label: "Banner (Slides)" },
            { key: "cifras", label: "Cifras" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition",
              tab === t.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-muted hover:text-primary-700",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "banner" ? <BannerManager /> : <CifrasManager />}
    </div>
  );
}
