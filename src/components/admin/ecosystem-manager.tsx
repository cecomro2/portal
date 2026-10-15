"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEcosystem } from "@/lib/actions/ecosystem";
import type { EcosystemItem } from "@/lib/ecosystem";
import { AdminPageHeader, Card, Field, inputClass } from "@/components/admin/ui";

export function EcosystemManager({ initial }: { initial: EcosystemItem[] }) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  function change(index: number, patch: Partial<EcosystemItem>) { setItems(items.map((item, i) => i === index ? { ...item, ...patch } : item)); }
  function move(index: number, offset: number) {
    const copy = [...items]; const target = index + offset;
    if (target < 0 || target >= copy.length) return;
    [copy[index], copy[target]] = [copy[target], copy[index]]; setItems(copy);
  }
  async function save() {
    setSaving(true); setMessage("");
    try { const result = await saveEcosystem(items); setMessage(result.ok ? "Guardado. Inicio y menú actualizados." : result.error ?? "Error al guardar."); if(result.ok) router.refresh(); }
    catch { setMessage("No se pudo guardar. Intenta nuevamente."); }
    finally { setSaving(false); }
  }
  return <div><AdminPageHeader title="Ecosistema" subtitle="Una sola lista para el inicio y Nuestro Trabajo → Ecosistema. Guarda al terminar los cambios." />
    <fieldset disabled={saving} className="space-y-4">
      {items.map((item, index) => <Card key={item.id}><div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre"><input className={inputClass} value={item.name} onChange={(e) => change(index, { name: e.target.value })} /></Field>
        <Field label="Enlace"><input type="url" className={inputClass} value={item.url} placeholder="https://" onChange={(e) => change(index, { url: e.target.value })} /></Field>
        <Field label="Nombre completo / descripción"><textarea className={inputClass} value={item.description} onChange={(e) => change(index, { description: e.target.value })} /></Field>
        <div className="flex flex-wrap items-center gap-3"><label><input type="checkbox" checked={item.active} onChange={(e) => change(index, { active: e.target.checked })} /> Visible</label>
          <button type="button" onClick={() => move(index, -1)} disabled={!index}>Subir</button><button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>Bajar</button>
          <button type="button" className="text-red-600" onClick={() => { if(window.confirm(`¿Quitar ${item.name || "este elemento"}?`)) setItems(items.filter((_, i) => i !== index)); }}>Quitar</button>
        </div></div></Card>)}
      <button type="button" className="rounded-lg border border-line px-4 py-2" onClick={() => setItems([...items, { id: crypto.randomUUID(), name: "", description: "", url: "", active: false }])}>Agregar organización</button>
      <button type="button" onClick={save} className="ml-3 rounded-lg bg-primary-600 px-5 py-2 text-white">{saving ? "Guardando…" : "Guardar cambios"}</button>
    </fieldset><p role="status" className="mt-4 text-sm">{message}</p></div>;
}
