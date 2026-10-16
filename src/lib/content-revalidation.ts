import { revalidatePath } from "next/cache";

/** Invalida solo las vistas que dependen de noticias; conserva ISR. */
export function revalidateNews(slug?: string, categoriesChanged = false) {
  revalidatePath("/");
  revalidatePath("/noticias");
  revalidatePath("/(site)/noticias/categoria/[slug]", "page");
  revalidatePath("/busqueda");
  if (slug) revalidatePath(`/${slug}`);
  if (!slug || categoriesChanged) revalidatePath("/(site)/[slug]", "page");
}

export function revalidateVisionDocuments() {
  revalidatePath("/vision-pais");
  revalidatePath("/(site)/vision-pais/[slug]", "page");
}
