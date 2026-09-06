"use server";

import { sendEmail } from "@/lib/resend";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Por favor completa los campos obligatorios." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un correo electrónico válido." };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2430; line-height: 1.6;">
      <h2 style="color: #2f358a;">Nuevo mensaje de contacto — CECOM-RO</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Asunto:</strong> ${escapeHtml(subject || "—")}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  const result = await sendEmail({
    to: process.env.CONTACT_EMAIL ?? "info@cecomro.com",
    subject: `[Contacto] ${subject || "Nuevo mensaje"}`,
    html,
    replyTo: email,
  });

  return result.ok
    ? { ok: true }
    : {
        ok: false,
        error:
          result.error === "not_configured"
            ? "El servicio de correo no está configurado."
            : "No se pudo enviar el mensaje. Inténtalo nuevamente.",
      };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
