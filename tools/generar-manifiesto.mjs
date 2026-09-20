#!/usr/bin/env node
/**
 * ====================================================================
 * GENERADOR DEL ÍNDICE DE DOCUMENTOS  ·  tools/generar-manifiesto.mjs
 * ====================================================================
 * GitHub Pages es un servidor estático: el navegador NO puede listar el
 * contenido de una carpeta. Este script lo hace por él: recorre las carpetas
 * de asignaturas (las de la raíz del proyecto) y escribe `js/docs-manifest.js`.
 *
 * Reglas:
 *   - Cada carpeta de primer nivel (salvo css, js, docs, tools...) es una asignatura.
 *   - Cada subcarpeta (TEMAS, Ejercicios, Examenes...) es una categoría.
 *   - Las carpetas VACÍAS no aparecen: la web solo muestra lo que tiene archivos.
 *   - Se ignoran ZIP/RAR/7z y cualquier archivo > 95 MB (GitHub rechaza > 100 MB).
 *
 * Uso:   node tools/generar-manifiesto.mjs
 * (o doble clic en actualizar-documentos.bat). En GitHub se ejecuta solo
 * en cada push gracias a .github/workflows/actualizar-documentos.yml
 */

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "js", "docs-manifest.js");

const IGNORED_ROOT_DIRS = new Set([
  "css", "js", "docs", "tools", "assets", "img", "images", "fonts", "node_modules"
]);
const IGNORED_FILES = /^(thumbs\.db|desktop\.ini|\.ds_store|leeme\.txt|readme\.md|~\$.*)$/i;
const BLOCKED_EXT = new Set([".zip", ".rar", ".7z", ".tmp", ".bak", ".crdownload"]);
const MAX_BYTES = 95 * 1024 * 1024;   // límite duro de GitHub: 100 MB
const WARN_BYTES = 50 * 1024 * 1024;  // GitHub avisa a partir de 50 MB
const MB = (n) => (n / 1024 / 1024).toFixed(1) + " MB";

const skipped = [];
const warnings = [];

const byPath = (a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
const byName = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Recorre una carpeta y devuelve todos sus archivos (recursivo). */
function collectFiles(absDir, relDir, subPath = "") {
  const files = [];
  for (const entry of readdirSync(absDir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = join(absDir, entry.name);
    const rel = `${relDir}/${entry.name}`;

    if (entry.isDirectory()) {
      files.push(...collectFiles(abs, rel, subPath ? `${subPath}/${entry.name}` : entry.name));
      continue;
    }
    if (IGNORED_FILES.test(entry.name)) continue;

    const ext = extname(entry.name).toLowerCase();
    const size = statSync(abs).size;

    if (BLOCKED_EXT.has(ext)) {
      skipped.push(`${rel} (${MB(size)}) — ${ext} no se publica`);
      continue;
    }
    if (size > MAX_BYTES) {
      skipped.push(`${rel} (${MB(size)}) — supera el límite de GitHub (100 MB)`);
      continue;
    }
    if (size > WARN_BYTES) warnings.push(`${rel} (${MB(size)}) — pesado, GitHub avisará`);

    const doc = { name: entry.name, path: rel, size };
    if (subPath) doc.sub = subPath;
    files.push(doc);
  }
  return files.sort(byPath);
}

const folders = {};
const rootEntries = readdirSync(ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .filter((e) => !e.name.startsWith(".") && !e.name.startsWith("_"))
  .filter((e) => !IGNORED_ROOT_DIRS.has(e.name.toLowerCase()))
  .map((e) => e.name)
  .sort(byName);

for (const subject of rootEntries) {
  const subjectDir = join(ROOT, subject);
  const categories = {};

  for (const entry of readdirSync(subjectDir, { withFileTypes: true }).sort((a, b) => byName(a.name, b.name))) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      const list = collectFiles(join(subjectDir, entry.name), `${subject}/${entry.name}`);
      if (list.length) categories[entry.name] = list;          // carpetas vacías: se omiten
    }
  }

  // Archivos sueltos directamente en la carpeta de la asignatura
  const loose = readdirSync(subjectDir, { withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.startsWith(".") && !IGNORED_FILES.test(e.name))
    .map((e) => {
      const abs = join(subjectDir, e.name);
      const ext = extname(e.name).toLowerCase();
      const size = statSync(abs).size;
      if (BLOCKED_EXT.has(ext) || size > MAX_BYTES) {
        skipped.push(`${subject}/${e.name} (${MB(size)}) — no se publica`);
        return null;
      }
      return { name: e.name, path: `${subject}/${e.name}`, size };
    })
    .filter(Boolean)
    .sort(byPath);
  if (loose.length) categories["Otros"] = loose;

  if (Object.keys(categories).length) folders[subject] = categories;
}

const banner =
  "/* ARCHIVO GENERADO AUTOMÁTICAMENTE por tools/generar-manifiesto.mjs — no editar a mano. */\n";
writeFileSync(OUT, `${banner}window.DOCS_MANIFEST = ${JSON.stringify({ folders }, null, 2)};\n`, "utf8");

// ---- Informe por consola ----
let total = 0;
console.log("\n📚 Índice de documentos generado: js/docs-manifest.js\n");
for (const [subject, cats] of Object.entries(folders)) {
  const n = Object.values(cats).reduce((acc, l) => acc + l.length, 0);
  total += n;
  const detail = Object.entries(cats).map(([c, l]) => `${c} ${l.length}`).join(" · ");
  console.log(`  • ${subject}: ${n} archivos  (${detail})`);
}
console.log(`\n  Total: ${total} archivos en ${Object.keys(folders).length} asignaturas.`);
if (warnings.length) console.log("\n⚠️  Archivos pesados:\n  - " + warnings.join("\n  - "));
if (skipped.length) console.log("\n🚫 Excluidos del índice (no se pueden subir a GitHub):\n  - " + skipped.join("\n  - "));
console.log("");
