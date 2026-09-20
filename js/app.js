/**
 * ====================================================================
 * APLICACIÓN PRINCIPAL - CONTROLADOR GENERAL (APP.JS)
 * ====================================================================
 * Orden de carga: data.js -> docs-manifest.js -> docs-meta.js -> ui.js -> docs.js -> calendar.js -> app.js
 */

document.addEventListener("DOMContentLoaded", () => {
  const { esc, norm, icon, ScrollLock, store, parseISO, daysBetween } = window.UI;
  const Docs = window.Docs;

  const App = {
    data: window.MASTER_DATA,
    currentFilter: "todas",
    activeSubject: null,
    calendarInstance: null,

    init() {
      Docs.build(this.data);

      this.initTheme();
      this.renderMasterHeader();
      this.initSubjects();
      this.initSubjectModal();
      Docs.initReader();
      Docs.initLibrary();
      this.renderLinks();
      this.initCalendar();
      this.initGradesCalculator();
      this.initTodoList();
      this.initCommandPalette();
      this.initSmoothScroll();
      this.initMobileNav();
      this.initGlobalKeys();

      // Refresca las barras de progreso de las tarjetas cuando marcas algo como leído
      document.addEventListener("docs:readchange", () => Docs.refreshProgress());

      Docs.openFromHash();      // enlaces compartibles: index.html#leer=<ruta del archivo>
    },

    /* ---------------- 1. TEMA CLARO / OSCURO ---------------- */
    initTheme() {
      const saved = store.getRaw("master_theme", "light");
      document.documentElement.setAttribute("data-theme", saved);
      this.updateThemeIcon(saved);

      const toggleBtn = document.getElementById("btn-theme-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const next = (document.documentElement.getAttribute("data-theme") || "light") === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", next);
          store.setRaw("master_theme", next);
          this.updateThemeIcon(next);
        });
      }
    },

    updateThemeIcon(theme) {
      const slot = document.querySelector(".theme-icon-slot");
      if (!slot) return;
      slot.innerHTML = theme === "light"
        ? `<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    },

    /* ---------------- 2. RESUMEN DEL MÁSTER & STATS ---------------- */
    renderMasterHeader() {
      const { info, subjects, events } = this.data;
      const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

      set("master-title", info.title);
      set("master-subtitle", info.subtitle);
      set("master-university", info.university);
      set("master-year", info.academicYear);
      set("stat-total-credits", `${info.totalCredits} ECTS`);
      set("stat-total-subjects", `${subjects.filter((s) => s.type !== "TFM").length} + TFM`);

      const stats = Docs.stats();
      set("stat-docs", stats.total ? `${stats.total} documentos` : "Sin documentos");
      set("stat-docs-sub", stats.total ? `${stats.subjects} asignaturas con material` : "Añade PDFs a las carpetas");

      // Próximo hito: el primer evento que no haya terminado
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const upcoming = events
        .filter((e) => parseISO(e.endDate || e.date) >= today)
        .sort((a, b) => parseISO(a.date) - parseISO(b.date));

      if (upcoming.length) {
        const next = upcoming[0];
        const diff = daysBetween(today, parseISO(next.date));
        set("stat-next-deadline", diff <= 0 ? "En curso" : diff === 1 ? "Mañana" : `En ${diff} días`);
        set("stat-next-deadline-sub", `${next.subjectName}: ${next.title}`);
      } else {
        set("stat-next-deadline", "Curso completado");
        set("stat-next-deadline-sub", "No quedan fechas próximas");
      }
    },

    /* ---------------- 3. ASIGNATURAS ---------------- */
    initSubjects() {
      const grid = document.getElementById("subjects-grid");
      if (!grid) return;

      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentFilter = btn.getAttribute("data-filter");
          this.renderSubjects();
        });
      });

      // Un único listener para todas las tarjetas (botón principal y chips de documentos)
      grid.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-open-subject]");
        if (trigger) this.openSubjectModal(trigger.dataset.openSubject, trigger.dataset.tab);
      });

      this.renderSubjects();
    },

    renderSubjects() {
      const grid = document.getElementById("subjects-grid");
      if (!grid) return;

      const filtered = this.data.subjects.filter((s) => {
        if (this.currentFilter === "obligatorias") return s.type === "Obligatoria";
        if (this.currentFilter === "optativas") return s.type === "Optativa";
        if (this.currentFilter === "tfm") return s.type === "TFM";
        return true;
      });

      grid.innerHTML = filtered.map((subject) => {
        const badge = subject.type === "Optativa" ? "badge-amber" : subject.type === "TFM" ? "badge-emerald" : "badge-blue";
        const sch = subject.schedule || {};
        const info = Docs.forSubject(subject.id);

        // "Subir" solo aparece cuando la web sabe a qué repositorio de GitHub apuntar (ver info.github en data.js)
        const uploadChip = Docs.canUpload(subject)
          ? `<button type="button" class="doc-chip tone-neutral" data-open-subject="${esc(subject.id)}" data-tab="subir">${icon("upload")}<span>Subir</span></button>` : "";

        const docsBlock = info.total ? `
          <div class="subject-docs">
            <div class="subject-docs-head">${icon("folder")}<span>${info.total} ${info.total === 1 ? "documento" : "documentos"}</span></div>
            ${Docs.progressHTML(subject.id)}
            <div class="doc-chips">
              ${Docs.categoryChips(subject.id).map((c) => `
                <button type="button" class="doc-chip tone-${c.tone}" data-open-subject="${esc(subject.id)}" data-tab="${esc(c.key)}">
                  ${icon(c.icon)}<span>${esc(c.label)}</span><b>${c.count}</b>
                </button>`).join("")}
              ${uploadChip}
            </div>
          </div>` : (uploadChip ? `
          <div class="subject-docs">
            <div class="subject-docs-head">${icon("folder")}<span>Aún sin documentos</span></div>
            <div class="doc-chips">${uploadChip}</div>
          </div>` : "");

        return `
          <div class="subject-card" style="--subject-color:${esc(subject.color)}">
            <div class="subject-card-top">
              <span class="subject-sede">${icon("pin", "icon-sm", "color:var(--subject-color)")}<span>${esc(subject.sede)}</span></span>
              <div class="subject-badges">
                <span class="badge badge-neutral">${subject.ects} ECTS</span>
                <span class="badge ${badge}">${esc(subject.type)}</span>
              </div>
            </div>

            <h3 class="subject-title">${esc(subject.name)}</h3>

            <div class="subject-dates-box">
              ${sch.distancia ? `<div class="subject-date-row">${icon("globe", "icon-sm", "color:var(--accent-cyan)")}<div><strong>A distancia:</strong> ${esc(sch.distancia)}</div></div>` : ""}
              ${sch.presencial ? `<div class="subject-date-row">${icon("calendar", "icon-sm", "color:var(--accent-primary)")}<div><strong>Presencial:</strong> ${esc(sch.presencial)}</div></div>` : ""}
              ${sch.limiteTexto ? `<div class="subject-date-row is-deadline">${icon("clock", "icon-sm", "color:var(--accent-rose)")}<div><strong>Límite / Examen:</strong> ${esc(sch.limiteTexto)}</div></div>` : ""}
            </div>

            ${docsBlock}

            <div class="subject-card-footer">
              <button type="button" class="btn btn-primary btn-block" data-open-subject="${esc(subject.id)}">
                <span>${info.total ? "Abrir asignatura y documentos" : "Ver ficha de la asignatura"}</span>
                ${icon("right")}
              </button>
            </div>
          </div>`;
      }).join("");
    },

    /* ---------------- 4. MODAL DE ASIGNATURA (pestañas dinámicas) ---------------- */
    initSubjectModal() {
      const modal = document.getElementById("subject-modal");
      const closeBtn = document.getElementById("btn-close-modal");
      const tabs = document.getElementById("modal-tabs");

      if (closeBtn) closeBtn.addEventListener("click", () => this.closeSubjectModal());
      if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) this.closeSubjectModal(); });
      if (tabs) tabs.addEventListener("click", (e) => {
        const tab = e.target.closest(".modal-tab-btn");
        if (tab) this.activateTab(tab.dataset.tab);
      });
    },

    activateTab(key) {
      document.querySelectorAll("#modal-tabs .modal-tab-btn").forEach((t) => {
        const on = t.dataset.tab === key;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
        if (on) t.scrollIntoView({ inline: "center", block: "nearest" });   // que la pestaña activa nunca quede fuera de vista
      });
      document.querySelectorAll("#modal-body .tab-pane").forEach((p) => p.classList.toggle("active", p.dataset.pane === key));
      const body = document.getElementById("modal-body");
      if (body) body.scrollTop = 0;
    },

    openSubjectModal(subjectId, initialTab) {
      const subject = this.data.subjects.find((s) => s.id === subjectId);
      if (!subject) return;
      this.activeSubject = subject;

      const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
      setText("modal-subject-code", subject.code);
      setText("modal-subject-title", subject.name);
      setText("modal-subject-ects", `${subject.ects} ECTS · ${subject.sede}`);
      setText("modal-prof-name", subject.professor.name);
      setText("modal-prof-email", subject.professor.email);
      setText("modal-prof-tutoring", subject.professor.tutoring);
      setText("modal-prof-office", subject.professor.office);

      const progress = document.getElementById("modal-progress");
      if (progress) progress.innerHTML = Docs.progressHTML(subject.id);

      // Solo aparecen las categorías que tienen archivos + la guía siempre
      const info = Docs.forSubject(subject.id);
      const tabs = [
        ...info.categories.map((c) => ({ key: c.key, label: c.short, title: c.label, icon: c.icon, count: c.items.length })),
        { key: "guia", label: "Guía", title: "Guía y criterios de evaluación", icon: "info", count: 0 }
      ];
      if (Docs.canUpload(subject)) tabs.push({ key: "subir", label: "Subir", title: "Subir documentos a GitHub", icon: "upload", count: 0 });

      document.getElementById("modal-tabs").innerHTML = tabs.map((t) => `
        <button type="button" class="modal-tab-btn" role="tab" data-tab="${esc(t.key)}" title="${esc(t.title)}">
          ${icon(t.icon)}<span>${esc(t.label)}</span>${t.count ? `<em class="tab-count">${t.count}</em>` : ""}
        </button>`).join("");

      document.getElementById("modal-body").innerHTML = tabs.map((t) => `
        <div class="tab-pane" role="tabpanel" data-pane="${esc(t.key)}">
          ${t.key === "guia" ? this.guideHTML(subject) : t.key === "subir" ? Docs.uploadPaneHTML(subject) : Docs.renderPane(subject.id, t.key)}
        </div>`).join("");

      this.activateTab(tabs.some((t) => t.key === initialTab) ? initialTab : tabs[0].key);

      const modal = document.getElementById("subject-modal");
      if (modal && !modal.classList.contains("active")) {
        modal.classList.add("active");
        ScrollLock.lock();
      }
    },

    closeSubjectModal() {
      const modal = document.getElementById("subject-modal");
      if (modal && modal.classList.contains("active")) {
        modal.classList.remove("active");
        ScrollLock.unlock();
      }
    },

    guideHTML(subject) {
      const guia = (subject.sections && subject.sections.guia) || {};
      const sch = subject.schedule || {};
      const evalList = subject.evaluation || [];
      const convocatorias = (subject.sections && subject.sections.examenes) || [];

      const dates = [
        sch.distancia && { ic: "globe", color: "var(--accent-cyan)", label: "A distancia", text: sch.distancia },
        sch.presencial && { ic: "calendar", color: "var(--accent-primary)", label: "Presencial", text: sch.presencial },
        sch.limiteTexto && { ic: "clock", color: "var(--accent-rose)", label: "Límite / Examen", text: sch.limiteTexto }
      ].filter(Boolean);

      return `
        <div class="guide">
          <section>
            <h4>${icon("info")}Descripción general</h4>
            <p class="guide-text">${esc(guia.descripcion || "Sin descripción disponible.")}</p>
          </section>

          ${subject.professor ? `
          <section>
            <h4>${icon("user")}Profesorado y contacto</h4>
            <div class="guide-dates">
              <div class="guide-date">${icon("user", "icon-sm", "color:var(--accent-primary)")}<div><strong>Profesorado</strong><span>${esc(subject.professor.name)}</span></div></div>
              <div class="guide-date">${icon("mail", "icon-sm", "color:var(--accent-primary)")}<div><strong>Correo</strong><span>${String(subject.professor.email || "").split(/[,;]\s*/).filter(Boolean).map((m) => (m.includes("@") ? `<a href="mailto:${esc(m)}">${esc(m)}</a>` : esc(m))).join("<br>")}</span></div></div>
              <div class="guide-date">${icon("home", "icon-sm", "color:var(--accent-primary)")}<div><strong>Lugar</strong><span>${esc(subject.professor.office)}</span></div></div>
              <div class="guide-date">${icon("clock", "icon-sm", "color:var(--accent-primary)")}<div><strong>Tutorías</strong><span>${esc(subject.professor.tutoring)}</span></div></div>
            </div>
          </section>` : ""}

          ${dates.length ? `
          <section>
            <h4>${icon("calendar")}Fechas clave</h4>
            <div class="guide-dates">
              ${dates.map((d) => `<div class="guide-date">${icon(d.ic, "icon-sm", `color:${d.color}`)}<div><strong>${d.label}</strong><span>${esc(d.text)}</span></div></div>`).join("")}
            </div>
            ${convocatorias.map((c) => `
              <div class="guide-exam">
                ${icon("flag")}
                <div>
                  <strong>${esc(c.title)}</strong> · ${esc(c.date)}
                  <span>${esc(c.location || "")}${c.weight ? ` · ${esc(c.weight)}` : ""}</span>
                  ${c.notes ? `<span>${esc(c.notes)}</span>` : ""}
                </div>
              </div>`).join("")}
          </section>` : ""}

          ${guia.temario && guia.temario.length ? `
          <section>
            <h4>${icon("book")}Temario</h4>
            <ol class="guide-list">${guia.temario.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
          </section>` : ""}

          ${evalList.length ? `
          <section>
            <h4>${icon("exam")}Criterios de evaluación</h4>
            <div class="eval-list">
              ${evalList.map((ev) => `
                <div>
                  <div class="eval-row"><span>${esc(ev.item)}</span><strong>${ev.weight}%</strong></div>
                  <div class="eval-track"><div class="eval-fill" style="width:${ev.weight}%"></div></div>
                </div>`).join("")}
            </div>
          </section>` : ""}

          ${guia.competencias && guia.competencias.length ? `
          <section>
            <h4>${icon("check")}Objetivos y competencias</h4>
            <ul class="guide-list">${guia.competencias.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          </section>` : ""}

          <section>
            <h4>${icon("book")}Bibliografía</h4>
            <p class="guide-biblio">${esc(guia.bibliografia || "Consultar la guía docente oficial en el Campus Virtual UCM.")}</p>
          </section>
        </div>`;
    },

    /* ---------------- 5. HUB DE ENLACES ---------------- */
    renderLinks() {
      const container = document.getElementById("links-categories-wrap");
      if (!container) return;

      container.innerHTML = (this.data.links || []).map((cat) => `
        <div class="links-category-wrap">
          <h3 class="links-category-title">${icon("link", "icon-sm", "color:var(--accent-primary)")}<span>${esc(cat.category)}</span></h3>
          <div class="links-grid">
            ${cat.items.map((item) => `
              <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="link-card">
                <div>
                  <div class="link-title">${esc(item.title)}</div>
                  <div class="link-desc">${esc(item.desc)}</div>
                </div>
                <span class="badge badge-neutral">${esc(item.badge)}</span>
              </a>`).join("")}
          </div>
        </div>`).join("");
    },

    /* ---------------- 6. CALENDARIO ---------------- */
    initCalendar() {
      if (!window.AcademicCalendar) return;
      this.calendarInstance = new window.AcademicCalendar({
        events: this.data.events,
        subjects: this.data.subjects,
        info: this.data.info,
        onOpenSubject: (id) => this.openSubjectModal(id)
      });
    },

    /* ---------------- 7. CALCULADORA DE NOTAS ---------------- */
    initGradesCalculator() {
      const select = document.getElementById("calc-subject-select");
      const weightsContainer = document.getElementById("calc-weights-list");
      const scoreBig = document.getElementById("calc-final-score");
      const statusBadge = document.getElementById("calc-status-badge");
      if (!select || !weightsContainer) return;

      select.innerHTML = this.data.subjects.map((s) => `<option value="${esc(s.id)}">${esc(s.shortName)} (${esc(s.type)})</option>`).join("");

      const update = () => {
        let sum = 0;
        weightsContainer.querySelectorAll(".calc-weight-input").forEach((input) => {
          const val = parseFloat(input.value);
          if (!isNaN(val)) sum += val * (parseFloat(input.dataset.weight) / 100);
        });
        scoreBig.textContent = sum.toFixed(2);

        const [text, cls] = sum >= 9 ? ["Sobresaliente", "badge-emerald"] : sum >= 7 ? ["Notable", "badge-blue"] : sum >= 5 ? ["Aprobado", "badge-blue"] : ["Suspenso / En progreso", "badge-rose"];
        statusBadge.textContent = text;
        statusBadge.className = `badge ${cls}`;
      };

      const load = () => {
        const subject = this.data.subjects.find((s) => s.id === select.value);
        if (!subject) return;
        weightsContainer.innerHTML = (subject.evaluation || []).map((ev) => `
          <div class="calc-weight-item">
            <span class="calc-weight-name">${esc(ev.item)}</span>
            <span class="calc-weight-pct">(${ev.weight}%)</span>
            <input type="number" class="calc-weight-input" data-weight="${ev.weight}" min="0" max="10" step="0.1" placeholder="Nota" value="0" aria-label="Nota de ${esc(ev.item)}">
          </div>`).join("");
        weightsContainer.querySelectorAll(".calc-weight-input").forEach((inp) => inp.addEventListener("input", update));
        update();
      };

      select.addEventListener("change", load);
      load();
    },

    /* ---------------- 8. TAREAS ---------------- */
    initTodoList() {
      const form = document.getElementById("todo-form");
      const input = document.getElementById("todo-input");
      const list = document.getElementById("todo-list");
      if (!form || !input || !list) return;

      const KEY = "fn_tasks";
      let tasks = store.get(KEY, null);
      if (!Array.isArray(tasks)) {
        tasks = [
          { text: "Preparar lecturas para Estructura Nuclear (Granada)", completed: false },
          { text: "Configurar acceso al Campus Virtual UCM", completed: true },
          { text: "Descargar guion de prácticas de laboratorio L1", completed: false }
        ];
        store.set(KEY, tasks);
      }

      const render = () => {
        if (!tasks.length) {
          list.innerHTML = `<div class="todo-empty">No hay tareas pendientes.</div>`;
          return;
        }
        list.innerHTML = tasks.map((task, i) => `
          <div class="todo-item${task.completed ? " is-done" : ""}">
            <input type="checkbox" class="todo-checkbox" data-index="${i}" ${task.completed ? "checked" : ""} aria-label="Completada: ${esc(task.text)}">
            <span class="todo-text">${esc(task.text)}</span>
            <button type="button" class="icon-btn todo-delete" data-index="${i}" title="Eliminar" aria-label="Eliminar tarea">${icon("trash")}</button>
          </div>`).join("");
      };

      list.addEventListener("change", (e) => {
        const chk = e.target.closest(".todo-checkbox");
        if (!chk) return;
        tasks[Number(chk.dataset.index)].completed = chk.checked;
        store.set(KEY, tasks);
        render();
      });
      list.addEventListener("click", (e) => {
        const del = e.target.closest(".todo-delete");
        if (!del) return;
        tasks.splice(Number(del.dataset.index), 1);
        store.set(KEY, tasks);
        render();
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        tasks.unshift({ text, completed: false });
        store.set(KEY, tasks);
        input.value = "";
        render();
      });

      render();
    },

    /* ---------------- 9. BUSCADOR GLOBAL (Ctrl + K): asignaturas y documentos ---------------- */
    initCommandPalette() {
      const overlay = document.getElementById("command-palette-modal");
      const trigger = document.getElementById("btn-open-search");
      const input = document.getElementById("command-search-input");
      const results = document.getElementById("command-results");
      if (!overlay || !input) return;

      this.palette = { items: [], active: 0 };

      const open = () => {
        if (!overlay.classList.contains("active")) { overlay.classList.add("active"); ScrollLock.lock(); }
        input.value = "";
        this.runSearch("");
        input.focus();
      };
      this.closeCommandPalette = () => {
        if (overlay.classList.contains("active")) { overlay.classList.remove("active"); ScrollLock.unlock(); }
      };
      this.isPaletteOpen = () => overlay.classList.contains("active");

      if (trigger) trigger.addEventListener("click", open);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) this.closeCommandPalette(); });

      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          if (this.isPaletteOpen()) this.closeCommandPalette(); else open();
        }
      });

      input.addEventListener("input", () => this.runSearch(input.value.trim()));
      input.addEventListener("keydown", (e) => {
        const p = this.palette;
        if (!p.items.length) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          p.active = (p.active + (e.key === "ArrowDown" ? 1 : -1) + p.items.length) % p.items.length;
          this.paintPalette();
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.pickPaletteItem(p.active);
        }
      });
      results.addEventListener("click", (e) => {
        const el = e.target.closest("[data-index]");
        if (el) this.pickPaletteItem(Number(el.dataset.index));
      });
    },

    runSearch(query) {
      const container = document.getElementById("command-results");
      if (!container) return;
      const q = norm(query);
      const items = [];

      const subjects = this.data.subjects.filter((s) => !q || norm([s.name, s.shortName, s.sede, s.code].join(" ")).includes(q));
      subjects.forEach((s) => items.push({ kind: "subject", id: s.id, title: s.name, sub: s.sede, color: s.color }));

      if (q) {
        Docs.search(query, 8).forEach((d) => {
          const s = Docs.subject(d.subjectId);
          items.push({ kind: "doc", id: d.id, title: d.title, sub: `${s.shortName} · ${Docs.category(d.subjectId, d.catKey).short}`, color: s.color, external: d.external });
        });
      }

      this.palette.items = items;
      this.palette.active = 0;

      if (!items.length) {
        container.innerHTML = `<div class="command-empty">No se encontraron resultados.</div>`;
        return;
      }

      let html = "";
      let lastKind = "";
      items.forEach((it, i) => {
        if (it.kind !== lastKind) {
          html += `<div class="command-heading">${it.kind === "subject" ? (q ? "Asignaturas" : "Asignaturas matriculadas") : "Documentos"}</div>`;
          lastKind = it.kind;
        }
        html += `
          <div class="command-item" data-index="${i}" role="option">
            <span class="command-dot" style="background:${esc(it.color)}"></span>
            <span class="command-title">${esc(it.title)}</span>
            <span class="command-sub">${esc(it.sub)}</span>
            ${icon(it.kind === "doc" ? (it.external ? "external" : "eye") : "right")}
          </div>`;
      });
      container.innerHTML = html;
      this.paintPalette();
    },

    paintPalette() {
      document.querySelectorAll("#command-results .command-item").forEach((el) => {
        const on = Number(el.dataset.index) === this.palette.active;
        el.classList.toggle("active", on);
        if (on) el.scrollIntoView({ block: "nearest" });
      });
    },

    pickPaletteItem(index) {
      const it = this.palette.items[index];
      if (!it) return;
      this.closeCommandPalette();
      if (it.kind === "subject") this.openSubjectModal(it.id);
      else Docs.openDoc(it.id, "");
    },

    /* ---------------- 10. TECLADO GLOBAL (Esc cierra lo de más arriba) ---------------- */
    initGlobalKeys() {
      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (this.isPaletteOpen && this.isPaletteOpen()) this.closeCommandPalette();
        else if (Docs.reader.open) Docs.closeReader();
        else this.closeSubjectModal();
      });
    },

    /* ---------------- 11. NAVEGACIÓN ---------------- */
    initSmoothScroll() {
      document.querySelectorAll(".nav-link, .mobile-nav-item").forEach((link) => {
        link.addEventListener("click", (e) => {
          const targetId = link.getAttribute("href");
          if (!targetId || !targetId.startsWith("#")) return;
          e.preventDefault();
          const target = document.querySelector(targetId);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      });
    },

    initMobileNav() {
      const ids = ["dashboard", "asignaturas", "biblioteca", "calendario", "enlaces", "herramientas"];
      const setActive = (id) => {
        document.querySelectorAll(".mobile-nav-item, .nav-link").forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
        });
      };

      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const pos = window.scrollY + window.innerHeight * 0.3;
          let current = ids[0];
          ids.forEach((id) => { const sec = document.getElementById(id); if (sec && pos >= sec.offsetTop) current = id; });
          setActive(current);
        });
      }, { passive: true });
    }
  };

  App.init();
});
