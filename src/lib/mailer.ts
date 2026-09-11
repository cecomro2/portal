import nodemailer, { type Transporter } from "nodemailer";

const smtpHost = process.env.SMTP_HOST ?? "mail.cecomro.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 465);
const smtpUser = process.env.SMTP_USER ?? "info@cecomro.com";
const smtpPass = process.env.SMTP_PASS ?? "";
const smtpFrom = process.env.SMTP_FROM ?? "CECOM-RO <info@cecomro.com>";

export const isMailerConfigured = Boolean(smtpHost && smtpUser && smtpPass);

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return transporter;
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
    console.warn("SMTP no configurado: email no enviado.");
    return { ok: false, error: "not_configured" };
  }
  try {
    const info = await getTransporter().sendMail({
      from: smtpFrom,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { ok: true, data: info };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
