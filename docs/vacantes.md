# Vacantes generales y AECID

- `/vacantes` y `/admin/vacantes-generales`: sección general, dentro de Contenido.
- `/vacantes-aecid` y `/admin/vacantes`: sección AECID existente.
- Ambas reutilizan PostingManager, VacancyList y PostingDetail, incluidos archivos, imágenes, fechas, categorías y ubicaciones.

Para ser compatible con la restricción existente de `postings.type`, las vacantes generales se almacenan como `type = vacancy` con el namespace reservado `vacante-general-` al principio del slug. `src/lib/posting-sections.ts` centraliza esta clasificación. Los listados y detalles públicos y administrativos filtran por sección. El servidor conserva el namespace al editar e impide reclasificar una publicación existente.

No se necesita migrar la base de datos. Las publicaciones AECID existentes conservan sus identificadores y enlaces. Cualquier futura consulta directa de `postings` por tipo `vacancy` debe usar también `postingSection` para distinguir ambas secciones.

Las páginas públicas heredan ISR de una hora. Guardar, renombrar o eliminar una publicación invalida el listado y su detalle; el administrador continúa requiriendo sesión.
