-- ============================================================
-- CECOM-RO · Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- Perfiles de administradores
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Enlaces del top header
-- ------------------------------------------------------------
create table if not exists public.topbar_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  kind text not null default 'link' check (kind in ('link', 'search', 'social')),
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_external boolean not null default false
);

alter table public.topbar_links enable row level security;
create policy "topbar_select" on public.topbar_links for select using (true);

-- ------------------------------------------------------------
-- Banners (slides del hero)
-- ------------------------------------------------------------
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text,
  cta_label text,
  cta_href text,
  image_url text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.banners enable row level security;
create policy "banners_select" on public.banners for select using (true);

-- ------------------------------------------------------------
-- Vacantes y Portal de Compras (postings)
-- ------------------------------------------------------------
create table if not exists public.postings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('vacancy', 'procurement')),
  title text not null,
  slug text not null unique,
  description text not null default '',
  apply_info text,
  closing_date date,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.postings enable row level security;
create policy "postings_select" on public.postings for select using (true);

create table if not exists public.posting_files (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid not null references public.postings(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  mime_type text,
  sort_order int not null default 0
);

alter table public.posting_files enable row level security;
create policy "posting_files_select" on public.posting_files for select using (true);

-- ------------------------------------------------------------
-- Junta Directiva y Equipo Ejecutivo
-- ------------------------------------------------------------
create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null default '',
  photo_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.board_members enable row level security;
create policy "board_select" on public.board_members for select using (true);

create table if not exists public.executive_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null default '',
  photo_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.executive_team enable row level security;
create policy "team_select" on public.executive_team for select using (true);

-- ------------------------------------------------------------
-- Comisiones de trabajo (organigrama)
-- ------------------------------------------------------------
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  parent_id uuid references public.commissions(id) on delete cascade,
  sort_order int not null default 0
);

alter table public.commissions enable row level security;
create policy "commissions_select" on public.commissions for select using (true);

-- ------------------------------------------------------------
-- Galería de medios
-- ------------------------------------------------------------
create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  kind text not null default 'image' check (kind in ('image', 'document', 'video')),
  file_url text not null,
  thumbnail_url text,
  file_name text not null default '',
  mime_type text,
  size_bytes bigint not null default 0,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.media_items enable row level security;
create policy "media_select" on public.media_items for select using (true);

-- ------------------------------------------------------------
-- Noticias (blog) y categorías
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

alter table public.categories enable row level security;
create policy "categories_select" on public.categories for select using (true);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;
create policy "posts_select" on public.posts for select using (true);

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);
alter table public.post_images enable row level security;
create policy "post_images_select" on public.post_images for select using (true);

-- ------------------------------------------------------------
-- Asociados y Aliados
-- ------------------------------------------------------------
create table if not exists public.associates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  type text not null default 'asociado' check (type in ('asociado', 'aliado')),
  website_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.associates enable row level security;
create policy "associates_select" on public.associates for select using (true);

-- ------------------------------------------------------------
-- Red de consultores
-- ------------------------------------------------------------
create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  photo_url text,
  bio text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

alter table public.consultants enable row level security;
create policy "consultants_select" on public.consultants for select using (true);

-- ------------------------------------------------------------
-- Páginas editables (contenido de texto)
-- ------------------------------------------------------------
create table if not exists public.site_pages (
  slug text primary key,
  title text not null default '',
  content text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_pages enable row level security;
create policy "site_pages_select" on public.site_pages for select using (true);

-- ------------------------------------------------------------
-- Cifras del home (stats editables)
-- ------------------------------------------------------------
create table if not exists public.home_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null default '',
  label text not null default '',
  sort_order int not null default 0
);
alter table public.home_stats enable row level security;
create policy "home_stats_select" on public.home_stats for select using (true);

-- ------------------------------------------------------------
-- Configuraciones del sitio (clave-valor)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);
alter table public.site_settings enable row level security;
create policy "site_settings_select" on public.site_settings for select using (true);

-- ------------------------------------------------------------
-- Visiones (Visión País)
-- ------------------------------------------------------------
create table if not exists public.visions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sort_order int not null default 0
);
alter table public.visions enable row level security;
create policy "visions_select" on public.visions for select using (true);

create table if not exists public.vision_documents (
  id uuid primary key default gen_random_uuid(),
  vision_id uuid not null references public.visions(id) on delete cascade,
  label text not null,
  file_url text not null,
  sort_order int not null default 0
);
alter table public.vision_documents enable row level security;
create policy "vision_documents_select" on public.vision_documents for select using (true);

-- ============================================================
-- NOTA: Para otorgar acceso de administrador al primer usuario,
-- ejecutar después de registrarse:
--   update public.profiles set is_admin = true where email = 'TU_CORREO';
-- ============================================================
