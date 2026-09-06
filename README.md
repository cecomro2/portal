# CECOM-RO · Sitio web institucional

Sitio web del **Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO)**.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP/ScrollTrigger · Supabase · Cloudflare R2 · Resend**.

## Requisitos

- Node.js 20+ (probado con 25)
- npm

## Instalación

```bash
npm install
```

## Configuración

1. Copia `.env.example` a `.env.local` y completa las variables.
2. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta el SQL de
   `supabase/schema.sql` en el **SQL Editor**.
3. (Opcional) Configura un bucket público en **Cloudflare R2** para archivos.
   Si no lo configuras, los archivos se guardan localmente en `/public/uploads`
   (solo para desarrollo).
4. (Opcional) Configura **Resend** para recibir correos del formulario de contacto.

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000.

## Panel de administración

- URL: `/admin`
- Crea un usuario en Supabase (Authentication → Users → Add user).
- Luego, otórgale permisos de administrador:

```sql
update public.profiles set is_admin = true where email = 'TU_CORREO';
```

Desde el panel puedes gestionar: banners del inicio, vacantes AECID, portal de
compras AECID, junta directiva, equipo ejecutivo, comisiones (organigrama),
galería de medios, enlaces del top header, noticias/categorías, asociados,
consultores y contenido de páginas.

## Producción

```bash
npm run build
npm run start
```

> Recomendado: configura Cloudflare R2 para el almacenamiento de archivos en
> producción (los archivos locales no persisten en plataformas serverless).

## Estructura

- `src/app/(site)` — sitio público
- `src/app/admin` — panel de administración
- `src/components/site` — componentes del sitio público
- `src/components/admin` — componentes del panel
- `src/lib` — datos, Supabase, almacenamiento (R2), Resend, tipos y config
- `supabase/schema.sql` — esquema de base de datos
