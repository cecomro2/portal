"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";
import { inputClass } from "@/components/admin/ui";

export function PillsInput({
  value,
  onChange,
  suggestions = [],
  placeholder,
  type = "text",
}: {
  value: string[];
  onChange: (items: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  type?: "text" | "email";
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();

  function add() {
    const item = draft.trim();
    if (!item) return;
    setDraft("");
    if (value.includes(item)) return;
    onChange([...value, item]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-muted transition hover:text-accent-600"
                aria-label="Quitar"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type={type}
          list={suggestions.length ? listId : undefined}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-medium text-muted transition hover:border-primary-300 hover:text-primary-700"
        >
          <Plus size={15} />
          Agregar
        </button>
      </div>

      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
