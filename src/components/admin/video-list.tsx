"use client";

import { Plus, Trash2, Video } from "lucide-react";
import { inputClass } from "@/components/admin/ui";

export interface VideoItem {
  title: string | null;
  video_url: string;
}

export function VideoList({
  value,
  onChange,
}: {
  value: VideoItem[];
  onChange: (videos: VideoItem[]) => void;
}) {
  function add() {
    onChange([...value, { title: "", video_url: "" }]);
  }

  function update(index: number, patch: Partial<VideoItem>) {
    onChange(value.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 space-y-2">
          {value.map((v, i) => (
            <li
              key={i}
              className="rounded-lg border border-line bg-surface p-3"
            >
              <div className="flex items-center gap-2">
                <Video size={16} className="shrink-0 text-accent-500" />
                <span className="text-xs font-semibold text-muted">
                  Video {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-accent-50 hover:text-accent-600"
                  aria-label="Quitar video"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_2fr]">
                <input
                  placeholder="Título (opcional)"
                  value={v.title ?? ""}
                  onChange={(e) => update(i, { title: e.target.value })}
                  className={inputClass}
                />
                <input
                  placeholder="URL de YouTube (watch, youtu.be, embed…)"
                  value={v.video_url}
                  onChange={(e) => update(i, { video_url: e.target.value })}
                  className={inputClass}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-600"
      >
        <Plus size={16} />
        Agregar video
      </button>
    </div>
  );
}
