/**
 * ====================================================================
 * BIBLIOTECA DE DOCUMENTOS Y LECTOR INTEGRADO (DOCS.JS)
 * ====================================================================
 * Combina tres fuentes para construir el modelo de documentos:
 *   1. window.DOCS_MANIFEST  -> archivos reales (lo genera tools/generar-manifiesto.mjs)
 *   2. window.DOCS_META      -> títulos/descripciones bonitos (docs-meta.js, opcional)
 *   3. subject.extraDocs     -> enlaces externos (Drive, web...) definidos en data.js
 *
 * Las carpetas vacías no existen en el manifiesto, así que nunca se ven en la web.
 */
(function () {
  "use strict";

  const { esc, norm, icon, ScrollLock, store, formatSize } = window.UI;
  const READ_KEY = "master_docs_read";

  /* ---------------- Categorías (nombre de carpeta -> aspecto) ---------------- */
  const CATEGORY_DEFS = {
    documentacion: { label: "Documentación",   short: "Documentación", order: 0, tone: "cyan",    icon: "info" },
    temas:         { label: "Apuntes & Temas", short: "Temas",         order: 1, tone: "primary", icon: "file" },
    ejercicios:    { label: "Problemas",       short: "Problemas",     order: 2, tone: "amber",   icon: "edit" },
    practicas:     { label: "Prácticas / Lab", short: "Prácticas",     order: 3, tone: "emerald", icon: "code" },
    examenes:      { label: "Exámenes",        short: "Exámenes",      order: 4, tone: "rose",    icon: "exam" }
  };

  // Variantes de nombre de carpeta que se reconocen (sin tildes ni mayúsculas)
  const CATEGORY_ALIASES = {
    documentacion: "documentacion", documentos: "documentacion", guias: "documentacion", guia: "documentacion",
    temas: "temas", tema: "temas", apuntes: "temas", teoria: "temas", resumenes: "temas",
    ejercicios: "ejercicios", ejercicio: "ejercicios", problemas: "ejercicios", boletines: "ejercicios",
    practicas: "practicas", practica: "practicas", laboratorio: "practicas", lab: "practicas",
    examenes: "examenes", examen: "examenes"
  };

  // Nombres de carpeta que se proponen al subir a una categoría que aún no existe (los mismos que ya usas)
  const STANDARD_FOLDERS = [
    { key: "documentacion", folder: "Documentacion" },
    { key: "temas",         folder: "TEMAS" },
    { key: "ejercicios",    folder: "Ejercicios" },
    { key: "practicas",     folder: "Practicas" },
    { key: "examenes",      folder: "Examenes" }
  ];

  const KIND_BY_EXT = {
    pdf: "pdf",
    png: "image", jpg: "image", jpeg: "image", gif: "image", webp: "image", svg: "image",
    txt: "text", md: "text", csv: "text", dat: "text", json: "text", tex: "text",
    m: "text", py: "text", c: "text", cpp: "text", h: "text", f: "text", f90: "text", for: "text", sh: "text", ipynb: "other"
  };
  const EXT_LABELS = { m: "MATLAB", py: "Python", f: "Fortran", f90: "Fortran", for: "Fortran", c: "C", cpp: "C++" };

  /* ---------------- Utilidades ---------------- */
  const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

  /** Título automático para archivos que no están en docs-meta.js */
  function autoTitle(fileName) {
    let t = fileName.replace(/\.[^.]+$/, "")
      .replace(/^wuolah-free-/i, "").replace(/^wuolah-/i, "")
      .replace(/-gulag-free$/i, "")
      .replace(/[_]+/g, " ").replace(/-+/g, " ")
      .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
      .replace(/\s+/g, " ").trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  const titleCase = (s) => s.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  function categoryFor(folderName) {
    const n = norm(folderName).replace(/[^a-z0-9]+/g, "");
    const key = CATEGORY_ALIASES[n];
    if (key) return { key, ...CATEGORY_DEFS[key] };
    return { key: `otros-${n || "x"}`, label: titleCase(folderName), short: titleCase(folderName), order: 9, tone: "neutral", icon: "file" };
  }

  const collator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

  /* ====================================================================
     MODELO
     ==================================================================== */
  const Docs = {
    data: null,
    bySubject: new Map(),   // subjectId -> { categories, total, docs }
    byId: new Map(),        // docId -> doc
    contexts: new Map(),    // clave de lista -> [docId] (para "anterior / siguiente" en el lector)
    read: new Set(),
    all: [],

    build(data) {
      this.data = data;
      this.bySubject.clear();
      this.byId.clear();
      this.all = [];
      this.read = new Set(store.get(READ_KEY, []));

      const manifest = (window.DOCS_MANIFEST && window.DOCS_MANIFEST.folders) || {};
      const meta = window.DOCS_META || {};

      data.subjects.forEach((subject) => {
        const cats = new Map();
        const push = (folderName, doc) => {
          const def = categoryFor(folderName);
          if (!cats.has(def.key)) cats.set(def.key, { ...def, folderName, items: [] });   // folderName: nombre real de la carpeta en disco
          doc.catKey = def.key;
          cats.get(def.key).items.push(doc);
        };

        // 1) Archivos reales de la carpeta
        const wanted = norm(subject.docsFolder || "");
        const folderKey = subject.docsFolder
          ? Object.keys(manifest).find((k) => k === subject.docsFolder) || Object.keys(manifest).find((k) => norm(k) === wanted)
          : null;

        if (folderKey) {
          Object.entries(manifest[folderKey]).forEach(([folderName, files]) => {
            files.forEach((file) => {
              const ext = (file.name.match(/\.([^.]+)$/) || [, ""])[1].toLowerCase();
              const m = meta[file.path] || {};
              push(folderName, {
                id: file.path, subjectId: subject.id, external: false,
                title: m.title || autoTitle(file.name), desc: m.desc || "", tag: m.tag || "",
                fileName: file.name, path: file.path, url: encodePath(file.path),
                ext, extLabel: EXT_LABELS[ext] || ext.toUpperCase(), kind: KIND_BY_EXT[ext] || (["doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "odp", "ods"].includes(ext) ? "office" : "other"),
                size: file.size, sub: file.sub || ""
              });
            });
          });
        }

        // 2) Enlaces externos (Drive, OneDrive, GitHub Releases, web). Si la url está vacía, no se muestra.
        (subject.extraDocs || []).filter((x) => x.url).forEach((x) => {
          push(x.category || "Documentacion", {
            id: `ext:${x.url}`, subjectId: subject.id, external: true, downloadLink: !!x.download,
            title: x.title, desc: x.desc || "", tag: x.tag || (x.download ? "Descarga" : "Enlace"), fileName: "", path: "", url: x.url,
            ext: "", extLabel: x.extLabel || "Enlace", kind: "link", size: 0, sizeText: x.sizeText || "", sub: ""
          });
        });

        const categories = [...cats.values()]
          .filter((c) => c.items.length > 0)                       // categoría vacía = no se muestra
          .sort((a, b) => a.order - b.order || collator.compare(a.label, b.label));

        categories.forEach((c) => {
          c.items.sort((a, b) =>
            (a.external === b.external ? 0 : a.external ? -1 : 1) ||
            collator.compare(a.sub, b.sub) || collator.compare(a.title, b.title));
        });

        const docs = categories.flatMap((c) => c.items);
        docs.forEach((d) => {
          d.search = norm([d.title, d.desc, d.tag, d.fileName, d.extLabel, subject.name, subject.shortName, subject.code, categories.find((c) => c.key === d.catKey).label].join(" "));
          this.byId.set(d.id, d);
        });
        this.all.push(...docs);
        if (docs.length) this.bySubject.set(subject.id, { categories, total: docs.length, docs });
      });
      return this;
    },

    subject(id) { return this.data.subjects.find((s) => s.id === id); },
    forSubject(id) { return this.bySubject.get(id) || { categories: [], total: 0, docs: [] }; },
    stats() { return { total: this.all.length, subjects: this.bySubject.size }; },
    category(subjectId, catKey) { return this.forSubject(subjectId).categories.find((c) => c.key === catKey); },

    /* ---------------- Progreso de lectura ---------------- */
    progress(subjectId) {
      const docs = this.forSubject(subjectId).docs;
      const read = docs.filter((d) => this.read.has(d.id)).length;
      return { read, total: docs.length, pct: docs.length ? Math.round((read / docs.length) * 100) : 0 };
    },

    progressHTML(subjectId) {
      const p = this.progress(subjectId);
      if (!p.total) return "";
      return `
        <div class="progress-line">
          <span class="progress-track"><span class="progress-fill" data-progress-bar="${esc(subjectId)}" style="width:${p.pct}%"></span></span>
          <span class="progress-label" data-progress-label="${esc(subjectId)}">${p.read}/${p.total} leídos</span>
        </div>`;
    },

    refreshProgress() {
      this.bySubject.forEach((_, id) => {
        const p = this.progress(id);
        document.querySelectorAll(`[data-progress-bar="${id}"]`).forEach((el) => { el.style.width = `${p.pct}%`; });
        document.querySelectorAll(`[data-progress-label="${id}"]`).forEach((el) => { el.textContent = `${p.read}/${p.total} leídos`; });
      });
    },

    isRead(id) { return this.read.has(id); },

    toggleRead(id) {
      if (this.read.has(id)) this.read.delete(id); else this.read.add(id);
      store.set(READ_KEY, [...this.read]);
      const now = this.read.has(id);
      document.querySelectorAll(".doc-card").forEach((card) => {
        if (card.dataset.docId !== id) return;
        card.classList.toggle("is-read", now);
        const btn = card.querySelector('[data-doc-action="toggle-read"]');
        if (btn) { btn.setAttribute("aria-pressed", String(now)); btn.title = now ? "Marcado como leído (pulsa para quitar)" : "Marcar como leído"; }
      });
      this.refreshProgress();
      this.syncReaderReadButton();
      document.dispatchEvent(new CustomEvent("docs:readchange"));
    },

    /* ====================================================================
       RENDER: tarjetas y listas
       ==================================================================== */
    registerContext(key, docs) { this.contexts.set(key, docs.map((d) => d.id)); return key; },

    canPreview(doc) { return ["pdf", "image", "text"].includes(doc.kind); },

    renderCard(doc, ctx, opts = {}) {
      const subject = this.subject(doc.subjectId);
      const cat = this.category(doc.subjectId, doc.catKey);
      const read = this.read.has(doc.id);
      const url = esc(doc.url);
      const idAttr = esc(doc.id);

      let primary;
      if (doc.external) {
        primary = `<a class="btn btn-primary btn-sm" href="${url}" target="_blank" rel="noopener noreferrer">${icon(doc.downloadLink ? "download" : "external")}<span>${doc.downloadLink ? "Descargar" : "Abrir"}</span></a>`;
      } else if (this.canPreview(doc)) {
        primary = `<button type="button" class="btn btn-primary btn-sm" data-doc-action="read" data-doc-id="${idAttr}" data-ctx="${esc(ctx)}">${icon("eye")}<span>Leer</span></button>`;
      } else {
        primary = `<a class="btn btn-primary btn-sm" href="${url}" download="${esc(doc.fileName)}">${icon("download")}<span>Descargar</span></a>`;
      }

      const download = !doc.external && this.canPreview(doc)
        ? `<a class="icon-btn" href="${url}" download="${esc(doc.fileName)}" title="Descargar" aria-label="Descargar ${esc(doc.title)}">${icon("download")}</a>` : "";
      const check = `<button type="button" class="icon-btn doc-check" data-doc-action="toggle-read" data-doc-id="${idAttr}" aria-pressed="${read}" title="${read ? "Marcado como leído (pulsa para quitar)" : "Marcar como leído"}" aria-label="Marcar como leído">${icon("check")}</button>`;

      const metaBits = [];
      if (opts.showSubject && subject) metaBits.push(`<span class="doc-subject"><i style="background:${esc(subject.color)}"></i>${esc(subject.shortName)}</span>`);
      if (opts.showCategory) metaBits.push(`<span>${esc(cat.short)}</span>`);
      metaBits.push(`<span class="doc-ext">${esc(doc.extLabel)}</span>`);
      if (doc.size || doc.sizeText) metaBits.push(`<span>${esc(doc.sizeText || formatSize(doc.size))}</span>`);

      return `
        <article class="doc-card tone-${cat.tone}${read ? " is-read" : ""}" data-doc-id="${idAttr}">
          <div class="doc-icon">${icon(doc.external ? "link" : cat.icon, "icon")}</div>
          <div class="doc-main">
            <div class="doc-title-row">
              <h4 class="doc-title">${esc(doc.title)}</h4>
              ${doc.tag ? `<span class="badge badge-neutral doc-tag">${esc(doc.tag)}</span>` : ""}
            </div>
            ${doc.desc ? `<p class="doc-desc">${esc(doc.desc)}</p>` : ""}
            <div class="doc-meta">${metaBits.join('<span class="doc-sep">·</span>')}</div>
          </div>
          <div class="doc-actions">${primary}${download}${check}</div>
        </article>`;
    },

    /** Bloque de una categoría: (título opcional) + tarjetas, agrupadas por subcarpeta si la hay. */
    renderCategoryBlock(subjectId, cat, items, ctxKey, opts = {}) {
      const ctx = this.registerContext(ctxKey, items);
      const groups = new Map();
      items.forEach((d) => { if (!groups.has(d.sub)) groups.set(d.sub, []); groups.get(d.sub).push(d); });

      const body = [...groups.entries()].map(([sub, list]) => `
        ${sub ? `<h5 class="doc-subgroup">${icon("folder")}<span>${esc(sub)}</span></h5>` : ""}
        <div class="doc-list">${list.map((d) => this.renderCard(d, ctx, opts)).join("")}</div>`).join("");

      return `
        <section class="doc-group tone-${cat.tone}">
          ${opts.showTitle ? `<h4 class="doc-group-title">${icon(cat.icon)}<span>${esc(cat.label)}</span><em>${items.length}</em></h4>` : ""}
          ${body}
        </section>`;
    },

    /** Pestaña de una categoría dentro del modal de asignatura */
    renderPane(subjectId, catKey) {
      const cat = this.category(subjectId, catKey);
      if (!cat) return "";
      return this.renderCategoryBlock(subjectId, cat, cat.items, `modal:${subjectId}:${catKey}`, { showTitle: false });
    },

    /** Resumen "Temas 4 · Exámenes 8" para las tarjetas de asignatura */
    categoryChips(subjectId) {
      return this.forSubject(subjectId).categories.map((c) => ({ key: c.key, label: c.short, count: c.items.length, tone: c.tone, icon: c.icon }));
    },

    /* ====================================================================
       SUBIR DOCUMENTOS
       GitHub Pages es estático y no puede recibir archivos, pero GitHub sí tiene una
       página de subida por carpeta: https://github.com/USUARIO/REPO/upload/main/<carpeta>
       Aquí solo generamos esos enlaces; al subir, el workflow regenera el índice.
       ==================================================================== */
    githubTarget() {
      const g = (this.data.info && this.data.info.github) || {};
      if (g.enabled === false) return null;
      let user = g.user, repo = g.repo;
      if (!user || !repo) {
        const host = location.hostname;
        if (host.endsWith(".github.io")) {                       // https://USUARIO.github.io/REPO/
          user = host.split(".")[0];
          const seg = location.pathname.split("/").filter(Boolean)[0];
          repo = seg && !seg.includes(".") ? seg : `${user}.github.io`;
        }
      }
      return user && repo ? { user, repo, branch: g.branch || "main" } : null;
    },

    uploadURL(folderPath) {
      const t = this.githubTarget();
      if (!t) return "";
      const path = folderPath.split("/").filter(Boolean).map(encodeURIComponent).join("/");
      return `https://github.com/${t.user}/${t.repo}/upload/${t.branch}${path ? `/${path}` : ""}`;
    },

    canUpload(subject) { return !!(subject.docsFolder && this.githubTarget()); },

    uploadPaneHTML(subject) {
      const t = this.githubTarget();
      const info = this.forSubject(subject.id);
      const root = subject.docsFolder;

      const dests = STANDARD_FOLDERS.map((s) => {
        const existing = info.categories.find((c) => c.key === s.key);
        const folder = existing ? existing.folderName : s.folder;
        const def = CATEGORY_DEFS[s.key];
        return `
          <a class="upload-dest tone-${def.tone}" href="${esc(this.uploadURL(`${root}/${folder}`))}" target="_blank" rel="noopener noreferrer">
            <span class="doc-icon">${icon(def.icon, "icon")}</span>
            <span class="upload-dest-text"><strong>${esc(def.label)}</strong><small>${esc(root)}/${esc(folder)}</small></span>
            <em>${existing ? `${existing.items.length} ${existing.items.length === 1 ? "archivo" : "archivos"}` : "carpeta nueva"}</em>
            ${icon("external")}
          </a>`;
      }).join("");

      return `
        <div class="upload-pane">
          <p class="upload-intro">Elige la carpeta de destino: se abre GitHub con la página de subida ya apuntando a ella.
            Arrastra tus archivos (o toca <em>choose your files</em> en el móvil) y pulsa <strong>Commit changes</strong>.
            En 1–3 minutos aparecerán aquí, porque el índice de documentos se actualiza solo.</p>
          <div class="upload-dests">
            ${dests}
            <a class="upload-dest tone-neutral" href="${esc(this.uploadURL(root))}" target="_blank" rel="noopener noreferrer">
              <span class="doc-icon">${icon("folder", "icon")}</span>
              <span class="upload-dest-text"><strong>Otra carpeta</strong><small>${esc(root)}/… (escribe el nombre nuevo en la ruta)</small></span>
              ${icon("external")}
            </a>
          </div>
          <ul class="upload-notes">
            <li>${icon("info")}<span>Necesitas haber iniciado sesión en GitHub con permiso de escritura en <strong>${esc(t.user)}/${esc(t.repo)}</strong>.</span></li>
            <li>${icon("info")}<span>Desde el navegador GitHub admite hasta <strong>25 MB por archivo</strong>. Entre 25 y 100 MB usa GitHub Desktop o <code>git</code>; por encima de 100 MB, un enlace de Drive o una Release (mira el README).</span></li>
            <li>${icon("info")}<span>Para crear una subcarpeta, añade su nombre a la ruta (p. ej. <code>${esc(root)}/Examenes/2024</code>). La web la mostrará agrupada.</span></li>
          </ul>
        </div>`;
    },

    /** Búsqueda de documentos (para Ctrl+K) */
    search(query, limit = 6) {
      const tokens = norm(query).split(/\s+/).filter(Boolean);
      if (!tokens.length) return [];
      return this.all.filter((d) => tokens.every((t) => d.search.includes(t))).slice(0, limit);
    },

    /* ====================================================================
       LECTOR INTEGRADO
       ==================================================================== */
    reader: { list: [], index: 0, token: 0, open: false },

    canInlinePdf() {
      const ua = navigator.userAgent || "";
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/i.test(ua);
      if (isIOS || isAndroid) return false;      // los móviles abren el PDF con su visor nativo, en pestaña nueva
      return navigator.pdfViewerEnabled !== false;
    },

    initReader() {
      const $ = (id) => document.getElementById(id);
      this.el = {
        root: $("doc-reader"), title: $("reader-title"), subject: $("reader-subject"), position: $("reader-position"),
        stage: $("reader-stage"), prev: $("reader-prev"), next: $("reader-next"), close: $("reader-close"),
        read: $("reader-read"), openLink: $("reader-open"), download: $("reader-download")
      };
      if (!this.el.root) return;

      this.el.close.addEventListener("click", () => this.closeReader());
      this.el.prev.addEventListener("click", () => this.step(-1));
      this.el.next.addEventListener("click", () => this.step(1));
      this.el.read.addEventListener("click", () => {
        const doc = this.reader.list[this.reader.index];
        if (doc) this.toggleRead(doc.id);
      });

      document.addEventListener("keydown", (e) => {
        if (!this.reader.open) return;
        if (e.target.closest?.("input, textarea")) return;
        if (e.key === "ArrowLeft") this.step(-1);
        if (e.key === "ArrowRight") this.step(1);
      });

      // Delegación: cualquier botón de tarjeta en cualquier lista
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-doc-action]");
        if (!btn) return;
        const id = btn.dataset.docId;
        if (btn.dataset.docAction === "read") this.openDoc(id, btn.dataset.ctx);
        if (btn.dataset.docAction === "toggle-read") this.toggleRead(id);
      });
    },

    openDoc(id, ctxKey) {
      const doc = this.byId.get(id);
      if (!doc) return;
      if (doc.external) { window.open(doc.url, "_blank", "noopener"); return; }
      if (doc.kind === "pdf" && !this.canInlinePdf()) { window.open(doc.url, "_blank", "noopener"); return; }

      let ids = this.contexts.get(ctxKey);
      if (!ids || !ids.includes(id)) {
        const cat = this.category(doc.subjectId, doc.catKey);
        ids = cat.items.map((d) => d.id);
      }
      // En el lector solo tienen sentido los documentos que se pueden previsualizar
      this.reader.list = ids.map((i) => this.byId.get(i)).filter((d) => d && !d.external && (this.canPreview(d) && (d.kind !== "pdf" || this.canInlinePdf())));
      if (!this.reader.list.some((d) => d.id === id)) this.reader.list = [doc];
      this.reader.index = this.reader.list.findIndex((d) => d.id === id);

      if (!this.reader.open) {
        this.reader.open = true;
        this.el.root.classList.add("active");
        ScrollLock.lock();
      }
      this.renderReader();
      this.el.close.focus({ preventScroll: true });
    },

    step(delta) {
      const next = this.reader.index + delta;
      if (next < 0 || next >= this.reader.list.length) return;
      this.reader.index = next;
      this.renderReader();
    },

    closeReader() {
      if (!this.reader.open) return;
      this.reader.open = false;
      this.reader.token++;
      this.el.root.classList.remove("active");
      this.el.stage.innerHTML = "";              // libera el PDF de memoria
      ScrollLock.unlock();
      try { history.replaceState(null, "", location.pathname + location.search); } catch (_) { /* file:// restringido */ }
    },

    syncReaderReadButton() {
      if (!this.reader.open || !this.el) return;
      const doc = this.reader.list[this.reader.index];
      if (!doc) return;
      const read = this.read.has(doc.id);
      this.el.read.setAttribute("aria-pressed", String(read));
      this.el.read.querySelector("span").textContent = read ? "Leído" : "Marcar leído";
    },

    renderReader() {
      const { list, index } = this.reader;
      const doc = list[index];
      const subject = this.subject(doc.subjectId);
      const cat = this.category(doc.subjectId, doc.catKey);
      const token = ++this.reader.token;
      const e = this.el;

      e.title.textContent = doc.title;
      e.subject.innerHTML = `<i style="background:${esc(subject.color)}"></i>${esc(subject.shortName)} · ${esc(cat.short)}`;
      e.position.textContent = list.length > 1 ? `${index + 1} / ${list.length}` : "";
      e.prev.disabled = index <= 0;
      e.next.disabled = index >= list.length - 1;
      e.openLink.href = doc.url;
      e.download.href = doc.url;
      e.download.setAttribute("download", doc.fileName);
      this.syncReaderReadButton();

      try { history.replaceState(null, "", `#leer=${encodeURIComponent(doc.id)}`); } catch (_) { /* file:// restringido */ }

      const fallback = (msg) => {
        e.stage.innerHTML = `
          <div class="reader-fallback">
            ${icon("file", "icon-lg")}
            <h3>${esc(doc.title)}</h3>
            <p>${esc(msg)}</p>
            <div class="reader-fallback-actions">
              <a class="btn btn-primary" href="${esc(doc.url)}" target="_blank" rel="noopener">${icon("external")}<span>Abrir en pestaña nueva</span></a>
              <a class="btn btn-secondary" href="${esc(doc.url)}" download="${esc(doc.fileName)}">${icon("download")}<span>Descargar</span></a>
            </div>
          </div>`;
      };

      if (doc.kind === "pdf") {
        e.stage.innerHTML = `
          <div class="reader-loading"><span class="spinner"></span><p>Cargando documento…${doc.size ? ` <small>(${formatSize(doc.size)})</small>` : ""}</p></div>
          <iframe class="reader-frame" title="${esc(doc.title)}" src="${esc(doc.url)}#view=FitH"></iframe>`;
        e.stage.querySelector("iframe").addEventListener("load", () => {
          if (token === this.reader.token) e.stage.querySelector(".reader-loading")?.remove();
        });
      } else if (doc.kind === "image") {
        e.stage.innerHTML = `<div class="reader-image-wrap"><img class="reader-image" src="${esc(doc.url)}" alt="${esc(doc.title)}"></div>`;
      } else if (doc.kind === "text") {
        if (doc.size > 1.5 * 1024 * 1024) { fallback("Este archivo es demasiado grande para mostrarlo aquí."); return; }
        e.stage.innerHTML = `<div class="reader-loading"><span class="spinner"></span><p>Cargando…</p></div>`;
        fetch(doc.url)
          .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
          .then((text) => {
            if (token !== this.reader.token) return;
            e.stage.innerHTML = `<pre class="reader-text"><code>${esc(text)}</code></pre>`;
          })
          .catch(() => { if (token === this.reader.token) fallback("No se pudo cargar el archivo en el lector."); });
      } else {
        fallback("Este tipo de archivo no se puede previsualizar.");
      }
    },

    /** Abre el lector si la URL trae #leer=<ruta> (enlace compartible a un documento) */
    openFromHash() {
      const m = location.hash.match(/^#leer=(.+)$/);
      if (!m) return;
      let id;
      try { id = decodeURIComponent(m[1]); } catch (_) { return; }
      if (this.byId.has(id)) this.openDoc(id, "");
    },

    /* ====================================================================
       BIBLIOTECA (sección global con buscador y filtros)
       ==================================================================== */
    lib: { q: "", cat: "todas", open: new Set(), els: null },

    initLibrary() {
      const $ = (id) => document.getElementById(id);
      const els = { root: $("biblioteca"), search: $("library-search"), chips: $("library-chips"), summary: $("library-summary"), list: $("library-list") };
      this.lib.els = els;
      if (!els.root || !els.list) return;

      if (!this.all.length) {
        els.root.querySelector(".library-tools")?.remove();
        els.summary.textContent = "";
        els.list.innerHTML = `
          <div class="resource-empty-state">
            <p><strong>Todavía no hay documentos indexados.</strong></p>
            <p>Coloca tus PDFs en las carpetas de cada asignatura y ejecuta <code>actualizar-documentos.bat</code> (o sube los cambios a GitHub y se actualizará solo).</p>
          </div>`;
        return;
      }

      // Chips de tipo (solo los que existen)
      const counts = new Map();
      this.all.forEach((d) => {
        const c = this.category(d.subjectId, d.catKey);
        const cur = counts.get(c.key) || { ...c, count: 0 };
        cur.count++;
        counts.set(c.key, cur);
      });
      const chips = [{ key: "todas", short: "Todos", count: this.all.length, tone: "primary" }, ...[...counts.values()].sort((a, b) => a.order - b.order)];
      els.chips.innerHTML = chips.map((c) =>
        `<button type="button" class="chip${c.key === "todas" ? " active" : ""}" data-cat="${esc(c.key)}" aria-pressed="${c.key === "todas"}">${esc(c.short)}<em>${c.count}</em></button>`).join("");
      els.chips.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-cat]");
        if (!chip) return;
        this.lib.cat = chip.dataset.cat;
        els.chips.querySelectorAll(".chip").forEach((b) => { const on = b === chip; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); });
        this.renderLibrary();
      });

      els.search.addEventListener("input", () => { this.lib.q = els.search.value; this.renderLibrary(); });

      // Recordar qué asignaturas abre el usuario (mientras no haya filtros)
      els.list.addEventListener("toggle", (e) => {
        const det = e.target.closest?.("details.lib-group");
        if (!det || this.libFiltering()) return;
        if (det.open) this.lib.open.add(det.dataset.subject); else this.lib.open.delete(det.dataset.subject);
      }, true);

      const first = [...this.bySubject.keys()][0];
      if (first) this.lib.open.add(first);
      this.renderLibrary();
    },

    libFiltering() { return this.lib.q.trim() !== "" || this.lib.cat !== "todas"; },

    renderLibrary() {
      const { els } = this.lib;
      const tokens = norm(this.lib.q).split(/\s+/).filter(Boolean);
      const filtering = this.libFiltering();
      let shown = 0;

      const groups = this.data.subjects.filter((s) => this.bySubject.has(s.id)).map((subject) => {
        const info = this.forSubject(subject.id);
        const cats = info.categories.map((cat) => ({
          cat,
          items: cat.items.filter((d) => (this.lib.cat === "todas" || cat.key === this.lib.cat) && tokens.every((t) => d.search.includes(t)))
        })).filter((c) => c.items.length);
        return { subject, info, cats, count: cats.reduce((n, c) => n + c.items.length, 0) };
      }).filter((g) => g.count > 0);

      groups.forEach((g) => { shown += g.count; });

      els.summary.textContent = filtering
        ? `${shown} de ${this.all.length} documentos`
        : `${this.all.length} documentos en ${this.bySubject.size} asignaturas`;

      if (!groups.length) {
        els.list.innerHTML = `<div class="resource-empty-state"><p>Ningún documento coincide con tu búsqueda.</p></div>`;
        return;
      }

      els.list.innerHTML = groups.map(({ subject, cats, count }) => {
        const open = filtering || this.lib.open.has(subject.id);
        const chipsHtml = cats.map(({ cat, items }) => `<span class="mini-chip tone-${cat.tone}">${esc(cat.short)} <b>${items.length}</b></span>`).join("");
        return `
          <details class="lib-group" data-subject="${esc(subject.id)}" style="--subject-color:${esc(subject.color)}"${open ? " open" : ""}>
            <summary>
              <span class="lib-dot"></span>
              <span class="lib-name">${esc(subject.name)}</span>
              <span class="lib-count">${count} ${count === 1 ? "documento" : "documentos"}</span>
              <span class="lib-chips">${chipsHtml}</span>
              <span class="lib-chevron">${icon("right")}</span>
            </summary>
            <div class="lib-body">
              ${this.progressHTML(subject.id)}
              ${cats.map(({ cat, items }) => this.renderCategoryBlock(subject.id, cat, items, `lib:${subject.id}:${cat.key}`, { showTitle: true })).join("")}
            </div>
          </details>`;
      }).join("");
    }
  };

  window.Docs = Docs;
})();
