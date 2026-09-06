export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "youtube"
  | "instagram"
  | "linkedin";

/** Enlaces del top header (editables en admin). */
export interface TopbarLink {
  id: string;
  label: string;
  href: string;
  kind: "link" | "search" | "social";
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  is_external: boolean;
}

/** Slide del hero/banner de inicio. */
export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type PostingType = "vacancy" | "procurement";

/** Vacante AECID o ítem del Portal de Compras AECID. */
export interface Posting {
  id: string;
  type: PostingType;
  title: string;
  slug: string;
  description: string;
  apply_info: string | null;
  closing_date: string | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostingFile {
  id: string;
  posting_id: string;
  file_name: string;
  file_url: string;
  mime_type: string | null;
  sort_order: number;
}

/** Miembro de Junta Directiva o Equipo Ejecutivo. */
export interface Person {
  id: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
  is_active: boolean;
}

/** Nodo del organigrama de Comisiones de Trabajo. */
export interface Commission {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
}

export type MediaKind = "image" | "document" | "video";

export interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  kind: MediaKind;
  file_url: string;
  thumbnail_url: string | null;
  file_name: string;
  mime_type: string | null;
  size_bytes: number;
  published_at: string;
  created_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  published_at: string;
  is_published: boolean;
  author: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
}

export interface Associate {
  id: string;
  name: string;
  logo_url: string | null;
  type: "asociado" | "aliado";
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  specialty: string | null;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SitePage {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

/** Cifra del home (stats editable). */
export interface HomeStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

/** Visión (Visión País). */
export interface Vision {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
}

/** Documento PDF de una visión. */
export interface VisionDocument {
  id: string;
  vision_id: string;
  label: string;
  file_url: string;
  sort_order: number;
}

/** Perfil de administrador. */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}
