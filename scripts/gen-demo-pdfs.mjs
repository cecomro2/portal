// Genera PDFs de demostración para las convocatorias y documentos.
// Uso: node scripts/gen-demo-pdfs.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "uploads", "demo");

function buildPdf(title, lines) {
  const content = lines
    .map((l, i) => {
      const escaped = l
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
      const y = 720 - i * 24;
      return `BT /F1 16 Tf 72 ${y} Td (${escaped}) Tj ET`;
    })
    .join("\n");
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let out = "%PDF-1.4\n";
  const offsets = [0];
  objs.forEach((body, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = out.length;
  out += `xref\n0 ${objs.length + 1}\n`;
  out += "0000000000 65535 f \n";
  for (let i = 0; i < objs.length; i++) {
    out += `${String(offsets[i + 1]).padStart(10, "0")} 00000 n \n`;
  }
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(out, "ascii");
}

mkdirSync(outDir, { recursive: true });

const docs = [
  {
    file: "tdr-especialista-fotovoltaicos.pdf",
    lines: [
      "CECOM-RO",
      "Terminos de Referencia (Demo)",
      "Especialista en Ingenieria Electrica y Sistemas Fotovoltaicos",
      "Region No Kribo, Comarca Ngabe Bugle",
    ],
  },
  {
    file: "tdr-auditoria-financiera.pdf",
    lines: [
      "CECOM-RO",
      "Terminos de Referencia (Demo)",
      "Auditoria Intermedia Externa Financiera",
    ],
  },
  {
    file: "sintesis-diagnostica.pdf",
    lines: [
      "CECOM-RO",
      "Sintesis Diagnostica Preliminar (Demo)",
      "Documento de diagnostico provincial - Vision 2040",
    ],
  },
];

for (const d of docs) {
  const p = path.join(outDir, d.file);
  writeFileSync(p, buildPdf(d.file, d.lines));
  console.log("Generado:", p);
}
