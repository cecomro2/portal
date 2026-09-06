import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Almacenamiento de archivos.
 * - Cloudflare R2 como backend principal (recomendado en producción).
 * - Fallback local en `public/uploads` para desarrollo sin credenciales.
 */

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_BUCKET &&
    R2_PUBLIC_URL,
);

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return r2Client;
}

function sanitizeName(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() || "file"
  );
}

function buildKey(originalName: string): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
  return `uploads/${stamp}/${randomUUID()}-${sanitizeName(originalName)}`;
}

export interface StoredFile {
  url: string;
  key: string;
  backend: "r2" | "local";
}

export async function storeFile(
  body: Buffer,
  originalName: string,
  contentType: string,
): Promise<StoredFile> {
  const key = buildKey(originalName);

  if (isR2Configured) {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return {
      url: `${R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`,
      key,
      backend: "r2",
    };
  }

  // Fallback local (desarrollo)
  const localPath = path.join(process.cwd(), "public", key);
  await mkdir(path.dirname(localPath), { recursive: true });
  await writeFile(localPath, body);
  return { url: `/${key}`, key, backend: "local" };
}

export async function deleteStoredFile(
  url: string,
  key?: string,
): Promise<void> {
  try {
    if (isR2Configured && (key || url.startsWith(R2_PUBLIC_URL!))) {
      const k =
        key ?? url.replace(`${R2_PUBLIC_URL!.replace(/\/$/, "")}/`, "");
      await getR2Client().send(
        new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: k }),
      );
      return;
    }
    if (url.startsWith("/")) {
      const localPath = path.join(process.cwd(), "public", url.slice(1));
      await unlink(localPath);
    }
  } catch (err) {
    console.error("No se pudo eliminar el archivo:", err);
  }
}
