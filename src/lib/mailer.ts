import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY ?? "";
const from =
  process.env.RESEND_FROM ??
  process.env.SMTP_FROM ??
  "CECOM-RO <info@cecomro.com>";

export const isMailerConfigured = Boolean(apiKey);

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
  data?: unknown;
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  if (!isMailerConfigured) {
    console.warn("Resend no configurado (RESEND_API_KEY): email no enviado.");
    return { ok: false, error: "not_configured" };
  }
  try {
    const { data, error } = await getResend().emails.send({
      from,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
