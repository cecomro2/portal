-- ============================================================
-- CECOM-RO · Configuración completa (esquema + datos + admin)
-- Pegar TODO este archivo en el SQL Editor de Supabase y ejecutar.
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

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

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
  title text,
  href text not null,
  kind text not null default 'link' check (kind in ('link', 'search', 'social')),
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_external boolean not null default false
);
alter table public.topbar_links enable row level security;
drop policy if exists "topbar_select" on public.topbar_links;
create policy "topbar_select" on public.topbar_links for select using (true);
alter table public.topbar_links add column if not exists title text;

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
drop policy if exists "banners_select" on public.banners;
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
drop policy if exists "postings_select" on public.postings;
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
drop policy if exists "posting_files_select" on public.posting_files;
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
drop policy if exists "board_select" on public.board_members;
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
drop policy if exists "team_select" on public.executive_team;
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
drop policy if exists "commissions_select" on public.commissions;
create policy "commissions_select" on public.commissions for select using (true);

create table if not exists public.commission_members (
  id uuid primary key default gen_random_uuid(),
  commission_id uuid not null references public.commissions(id) on delete cascade,
  name text not null,
  photo_url text,
  sort_order int not null default 0
);
alter table public.commission_members enable row level security;
drop policy if exists "commission_members_select" on public.commission_members;
create policy "commission_members_select" on public.commission_members for select using (true);

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
drop policy if exists "media_select" on public.media_items;
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
drop policy if exists "categories_select" on public.categories;
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
drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts for select using (true);

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);
alter table public.post_images enable row level security;
drop policy if exists "post_images_select" on public.post_images;
create policy "post_images_select" on public.post_images for select using (true);

create table if not exists public.post_files (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  sort_order int not null default 0
);
alter table public.post_files enable row level security;
drop policy if exists "post_files_select" on public.post_files;
create policy "post_files_select" on public.post_files for select using (true);

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
drop policy if exists "associates_select" on public.associates;
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
drop policy if exists "consultants_select" on public.consultants;
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
drop policy if exists "site_pages_select" on public.site_pages;
create policy "site_pages_select" on public.site_pages for select using (true);

-- ============================================================
-- ADMINISTRADOR
-- ============================================================
insert into public.profiles (id, email, full_name, is_admin)
values ('6e09bb10-94b7-487d-9325-a5436c7cd474', 'beardclick@gmail.com', 'Administrador', true)
on conflict (id) do update set is_admin = true, email = excluded.email;

-- ============================================================
-- LIMPIAR DATOS DEMO (permite re-ejecutar sin duplicados)
-- ============================================================
delete from public.posting_files;
delete from public.postings;
delete from public.executive_team;
delete from public.board_members;

-- ============================================================
-- JUNTA DIRECTIVA (con imágenes placeholder)
-- ============================================================
insert into public.board_members (name, position, photo_url, sort_order) values
  ('Felipe Rodriguez', 'Presidente', 'https://ui-avatars.com/api/?name=Felipe+Rodriguez&size=512&background=2F358A&color=fff&bold=true', 1),
  ('Maria Isabel De Anguizola', 'Vicepresidente', 'https://ui-avatars.com/api/?name=Maria+Isabel&size=512&background=2F358A&color=fff&bold=true', 2),
  ('Guillermo Villarreal', 'Segundo Vicepresidente', 'https://ui-avatars.com/api/?name=Guillermo+Villarreal&size=512&background=2F358A&color=fff&bold=true', 3),
  ('Douglas Gómez', 'Secretario', 'https://ui-avatars.com/api/?name=Douglas+Gomez&size=512&background=2F358A&color=fff&bold=true', 4),
  ('Luís Ríos', 'Tesorero', 'https://ui-avatars.com/api/?name=Luis+Rios&size=512&background=2F358A&color=fff&bold=true', 5),
  ('Ricardo Pérez', 'Vocal', 'https://ui-avatars.com/api/?name=Ricardo+Perez&size=512&background=2F358A&color=fff&bold=true', 6),
  ('Nixa De Ríos', 'Vocal', 'https://ui-avatars.com/api/?name=Nixa+De+Rios&size=512&background=2F358A&color=fff&bold=true', 7),
  ('Giselle Socarraz', 'Fiscal', 'https://ui-avatars.com/api/?name=Giselle+Socarraz&size=512&background=2F358A&color=fff&bold=true', 8),
  ('Malvina Moreno de Sánchez', 'Suplente', 'https://ui-avatars.com/api/?name=Malvina+Moreno&size=512&background=2F358A&color=fff&bold=true', 9),
  ('Alberto Nasta', 'Suplente', 'https://ui-avatars.com/api/?name=Alberto+Nasta&size=512&background=2F358A&color=fff&bold=true', 10);

-- ============================================================
-- EQUIPO EJECUTIVO (con imágenes placeholder)
-- ============================================================
insert into public.executive_team (name, position, photo_url, sort_order) values
  ('Mirhanna Sandoya', 'Directora Ejecutiva', 'https://ui-avatars.com/api/?name=Mirhanna+Sandoya&size=512&background=C63E43&color=fff&bold=true', 1),
  ('Orquídea Victoria', 'Administradora de Proyectos Especiales', 'https://ui-avatars.com/api/?name=Orquidea+Victoria&size=512&background=C63E43&color=fff&bold=true', 2);

-- ============================================================
-- VACANTES AECID (demo)
-- ============================================================
insert into public.postings (type, title, slug, description, apply_info, closing_date, location, is_active, created_at) values
  (
    'vacancy',
    'Contratación de Especialista en Ingeniería Eléctrica y Sistemas Fotovoltaicos',
    'especialista-ingenieria-electrica-fotovoltaicos',
    '<p>El CECOM-RO, en el marco de los proyectos de cooperación con AECID, requiere contratar un especialista en ingeniería eléctrica y sistemas fotovoltaicos para el desarrollo de proyectos de electrificación rural.</p><p>El profesional será responsable del diseño, supervisión e implementación de sistemas de generación fotovoltaica en comunidades de la región.</p>',
    'Enviar hoja de vida actualizada y carta de interés al correo convocatorias@cecomro.com, indicando en el asunto el nombre de la convocatoria, antes de la fecha de cierre.',
    current_date + interval '30 days',
    'Región Ño Kribo, Comarca Ngäbe Buglé',
    true,
    now() - interval '4 hours'
  ),
  (
    'vacancy',
    'Contratación de Servicio de Auditoría Intermedia Externa Financiera',
    'auditoria-intermedia-externa-financiera',
    '<p>Se invita a firmas de auditoría a presentar propuestas para la realización de una auditoría intermedia externa financiera de los proyectos ejecutados por el CECOM-RO en el marco de la cooperación internacional.</p>',
    'Presentar la propuesta técnica y económica en sobre cerrado en las oficinas del CECOM-RO, o por correo electrónico a compras@cecomro.com.',
    current_date + interval '15 days',
    null,
    true,
    now() - interval '26 hours'
  );

-- Documentos (PDF) de las vacantes demo (reemplazables desde admin)
insert into public.posting_files (posting_id, file_name, file_url, mime_type, sort_order)
select id, 'TDR-Especialista-Ingenieria-Fotovoltaicos.pdf', '/uploads/demo/tdr-especialista-fotovoltaicos.pdf', 'application/pdf', 1
from public.postings where slug = 'especialista-ingenieria-electrica-fotovoltaicos';

insert into public.posting_files (posting_id, file_name, file_url, mime_type, sort_order)
select id, 'TDR-Auditoria-Intermedia-Financiera.pdf', '/uploads/demo/tdr-auditoria-financiera.pdf', 'application/pdf', 1
from public.postings where slug = 'auditoria-intermedia-externa-financiera';

-- ------------------------------------------------------------
-- CIFRAS DEL HOME (stats editables)
-- ------------------------------------------------------------
create table if not exists public.home_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null default '',
  label text not null default '',
  sort_order int not null default 0
);
alter table public.home_stats enable row level security;
drop policy if exists "home_stats_select" on public.home_stats;
create policy "home_stats_select" on public.home_stats for select using (true);

delete from public.home_stats;
insert into public.home_stats (value, label, sort_order) values
  ('2015', 'Año de Fundación', 1),
  ('+84', 'Asociados y Aliados', 2),
  ('3', 'Socios Fundadores', 3),
  ('2050', 'Visión Regional', 4);

-- ------------------------------------------------------------
-- CONFIGURACIONES DEL SITIO (clave-valor)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);
alter table public.site_settings enable row level security;
drop policy if exists "site_settings_select" on public.site_settings;
create policy "site_settings_select" on public.site_settings for select using (true);

-- ------------------------------------------------------------
-- VISIONES (Visión País)
-- ------------------------------------------------------------
create table if not exists public.visions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sort_order int not null default 0
);
alter table public.visions enable row level security;
drop policy if exists "visions_select" on public.visions;
create policy "visions_select" on public.visions for select using (true);

create table if not exists public.vision_documents (
  id uuid primary key default gen_random_uuid(),
  vision_id uuid not null references public.visions(id) on delete cascade,
  label text not null,
  file_url text not null,
  sort_order int not null default 0
);
alter table public.vision_documents enable row level security;
drop policy if exists "vision_documents_select" on public.vision_documents;
create policy "vision_documents_select" on public.vision_documents for select using (true);

delete from public.vision_documents;
delete from public.visions;

insert into public.visions (title, slug, sort_order) values
  ('Visión País 2050', 'vision-pais-2050', 1),
  ('Visión País 2050 Resumen Ejecutivo', 'vision-pais-2050-resumen-ejecutivo', 2),
  ('Visión Veraguas 2050', 'vision-veraguas-2050', 3),
  ('Visión Comarca 2050', 'vision-comarca-2050', 4),
  ('Visión Chiriquí 2050', 'vision-chiriqui-2050', 5),
  ('Visión Bocas del Toro 2050', 'vision-bocas-del-toro-2050', 6),
  ('Visión Coclé 2050', 'vision-cocle-2050', 7),
  ('Visión Colón 2050', 'vision-colon-2050', 8),
  ('Visión Azuero 2050', 'vision-azuero-2050', 9),
  ('Visión Región Oriental 2050', 'vision-region-oriental-2050', 10);

insert into public.vision_documents (vision_id, label, file_url, sort_order)
select v.id,
  case d.n
    when 1 then 'Síntesis Diagnóstica Preliminar ' || v.title
    when 2 then 'Visión ' || v.title
    else 'Ver Versión Actualizada'
  end as label,
  '/uploads/demo/sintesis-diagnostica.pdf',
  d.n
from public.visions v
cross join (values (1), (2), (3)) as d(n);

-- ------------------------------------------------------------
-- ÍTEMS DEL MENÚ (bottom header) editables
-- ------------------------------------------------------------
create table if not exists public.menu_items (
  key text primary key,
  label text not null,
  href text not null,
  sort_order int not null default 0
);
alter table public.menu_items enable row level security;
drop policy if exists "menu_items_select" on public.menu_items;
create policy "menu_items_select" on public.menu_items for select using (true);

delete from public.menu_items;
insert into public.menu_items (key, label, href, sort_order) values
  ('inicio', 'Inicio', '/', 1),
  ('nosotros', 'Nosotros', '/nosotros/quienes-somos', 2),
  ('trabajo', 'Nuestro Trabajo', '/nuestro-trabajo', 3),
  ('red', 'Red de Centros Regionales', '/red-de-centros', 4),
  ('recursos', 'Recursos de Información', '/recursos-de-informacion', 5),
  ('noticias', 'Noticias', '/noticias', 6);
