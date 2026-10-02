"use server";

import { sendEmail } from "@/lib/mailer";

const TURNSTILE_SECRET =
  process.env.TURNSTILE_SECRET_KEY ||
  "0x4AAAAAAFMERoMchRv9kaUZHwVCDeP4HFE";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams();
    body.append("secret", TURNSTILE_SECRET);
    body.append("response", token);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Anti-spam: honeypot (los bots rellenan el campo oculto) + tiempo mínimo de envío.
  const honeypot = String(formData.get("website") ?? "").trim();
  const ts = Number(formData.get("ts") ?? "0");
  const elapsed = Number.isFinite(ts) && ts > 0 ? Date.now() - ts : null;
  if (honeypot || (elapsed !== null && elapsed < 3000)) {
    // Silencio: simulamos éxito para no dar señales al bot.
    return { ok: true };
  }

  const turnstileToken = String(
    formData.get("cf-turnstile-response") ?? "",
  ).trim();
  if (!turnstileToken) {
    return { ok: false, error: "Por favor completa la verificación de seguridad." };
  }
  const verified = await verifyTurnstile(turnstileToken);
  if (!verified) {
    return { ok: false, error: "La verificación de seguridad falló. Inténtalo de nuevo." };
  }

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
    to: "direccionejecutiva@cecomro.page",
    cc: [
      "cecomro@gmail.com",
      "mgsr.sandoya@gmail.com",
      "info@cecomro.com",
      "cecomro2@gmail.com",
    ],
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
