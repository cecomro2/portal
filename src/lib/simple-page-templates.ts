export interface SimplePageTemplate {
  id: string;
  label: string;
  description: string;
  html: string;
}

/**
 * Plantillas de bloques para páginas simples.
 * Se copian desde el admin y se pegan en el campo "Contenido".
 * Los placeholders (URL_...) se reemplazan por las URLs reales.
 */
export const SIMPLE_PAGE_TEMPLATES: SimplePageTemplate[] = [
  {
    id: "docs",
    label: "Texto + botones (estilo Visión)",
    description:
      "Texto a la izquierda y botones de documento (Ver PDF / Descargar) a la derecha.",
    html: `<div class="sp-split">
  <div>
    <h3 class="sp-heading">Título de la sección</h3>
    <p class="sp-text">Escribe aquí el texto descriptivo.</p>
  </div>
  <div class="sp-docs">
    <div class="sp-doc">
      <span class="sp-doc__icon">PDF</span>
      <span class="sp-doc__label">Nombre del documento</span>
      <a class="sp-btn sp-btn--primary" href="URL_DEL_PDF" target="_blank" rel="noopener">Ver Documento (PDF)</a>
      <a class="sp-btn sp-btn--outline" href="URL_DEL_PDF" download>Descargar</a>
    </div>
  </div>
</div>`,
  },
  {
    id: "img-text",
    label: "Imagen izquierda + texto derecha",
    description: "Imagen a la izquierda y texto (con botones debajo) a la derecha.",
    html: `<div class="sp-split">
  <div class="sp-media">
    <img src="URL_DE_LA_IMAGEN" alt="Descripción de la imagen" />
  </div>
  <div>
    <h3 class="sp-heading">Título de la sección</h3>
    <p class="sp-text">Escribe aquí el texto descriptivo.</p>
    <div class="sp-actions">
      <a class="sp-btn sp-btn--primary" href="URL">Botón principal</a>
      <a class="sp-btn sp-btn--outline" href="URL">Botón secundario</a>
    </div>
  </div>
</div>`,
  },
  {
    id: "text-img",
    label: "Texto izquierda + imagen derecha",
    description: "Texto a la izquierda e imagen (con botones debajo) a la derecha.",
    html: `<div class="sp-split sp-split--rev">
  <div class="sp-media">
    <img src="URL_DE_LA_IMAGEN" alt="Descripción de la imagen" />
  </div>
  <div>
    <h3 class="sp-heading">Título de la sección</h3>
    <p class="sp-text">Escribe aquí el texto descriptivo.</p>
    <div class="sp-actions">
      <a class="sp-btn sp-btn--primary" href="URL">Botón principal</a>
      <a class="sp-btn sp-btn--outline" href="URL">Botón secundario</a>
    </div>
  </div>
</div>`,
  },
  {
    id: "text-buttons",
    label: "Texto + botones debajo",
    description: "Texto con botones debajo (botón principal y secundario).",
    html: `<div class="sp-block">
  <h3 class="sp-heading">Título de la sección</h3>
  <p class="sp-text">Escribe aquí el texto descriptivo.</p>
  <div class="sp-actions">
    <a class="sp-btn sp-btn--primary" href="URL">Botón principal</a>
    <a class="sp-btn sp-btn--outline" href="URL">Botón secundario</a>
  </div>
</div>`,
  },
  {
    id: "img-buttons",
    label: "Imagen + botones debajo",
    description: "Imagen centrada con botones debajo.",
    html: `<div class="sp-block">
  <div class="sp-media">
    <img src="URL_DE_LA_IMAGEN" alt="Descripción de la imagen" />
  </div>
  <div class="sp-actions">
    <a class="sp-btn sp-btn--primary" href="URL">Botón principal</a>
    <a class="sp-btn sp-btn--outline" href="URL">Botón secundario</a>
  </div>
</div>`,
  },
  {
    id: "doc",
    label: "Documento (PDF)",
    description:
      "Un solo botón de documento con Ver PDF / Descargar (estilo Visión).",
    html: `<div class="sp-doc">
  <span class="sp-doc__icon">PDF</span>
  <span class="sp-doc__label">Nombre del documento</span>
  <a class="sp-btn sp-btn--primary" href="URL_DEL_PDF" target="_blank" rel="noopener">Ver Documento (PDF)</a>
  <a class="sp-btn sp-btn--outline" href="URL_DEL_PDF" download>Descargar</a>
</div>`,
  },
];
