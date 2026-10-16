import { useState } from "react";
import { createRoot } from "react-dom/client";
import { RichTextEditor } from "../src/components/admin/rich-text-editor";

function Fixture() {
  const [html, setHtml] = useState('<p>Texto de prueba <strong>con formato</strong>.</p><p><a href="https://example.com/original">Enlace existente</a></p>');
  const [submissions, setSubmissions] = useState(0);
  return <form onSubmit={(event) => { event.preventDefault(); setSubmissions((n) => n + 1); }}><RichTextEditor value={html} onChange={setHtml} /><pre id="saved-html">{html}</pre><output id="form-submissions">{submissions}</output><button type="submit">Guardar noticia de prueba</button></form>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
