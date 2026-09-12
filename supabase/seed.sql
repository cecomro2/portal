-- ============================================================
-- CECOM-RO · Datos de ejemplo (seed)
-- Ejecutar después de schema.sql si se desea cargar contenido.
-- ============================================================

-- Páginas simples (texto + botones)
insert into public.simple_pages (title, path, content, parent_href, sort_order, is_active) values
  ('PIASI', '/nuestro-trabajo/ejecutados/agro/piasi', 'Proyecto PIASI. Agregue aquí la descripción del proyecto desde el panel de administración (Páginas Simples).', '/nuestro-trabajo/ejecutados/agro', 1, true)
on conflict (path) do nothing;

-- Junta Directiva
insert into public.board_members (name, position, sort_order) values
  ('Felipe Rodriguez', 'Presidente', 1),
  ('Maria Isabel De Anguizola', 'Vicepresidente', 2),
  ('Guillermo Villarreal', 'Segundo Vicepresidente', 3),
  ('Douglas Gómez', 'Secretario', 4),
  ('Luís Ríos', 'Tesorero', 5),
  ('Ricardo Pérez', 'Vocal', 6),
  ('Nixa De Ríos', 'Vocal', 7),
  ('Giselle Socarraz', 'Fiscal', 8),
  ('Malvina Moreno de Sánchez', 'Suplente', 9),
  ('Alberto Nasta', 'Suplente', 10);

-- Equipo Ejecutivo
insert into public.executive_team (name, position, sort_order) values
  ('Mirhanna Sandoya', 'Directora Ejecutiva', 1),
  ('Orquídea Victoria', 'Administradora de Proyectos Especiales', 2);

-- Vacantes AECID (demo)
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
