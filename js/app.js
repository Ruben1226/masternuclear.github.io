/**
 * ====================================================================
 * APLICACIÓN PRINCIPAL - CONTROLADOR GENERAL (APP.JS)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const App = {
    data: window.MASTER_DATA,
    currentFilter: "todas",
    activeSubject: null,
    calendarInstance: null,

    init() {
      this.initTheme();
      this.renderMasterHeader();
      this.renderSubjects();
      this.initSubjectModal();
      this.renderLinks();
      this.initCalendar();
      this.initGradesCalculator();
      this.initTodoList();
      this.initCommandPalette();
      this.initSmoothScroll();
      this.initMobileNav();
    },

    /* ---------------- 1. TEMA CLARO / OSCURO (POR DEFECTO CLARO CON LUZ) ---------------- */
    initTheme() {
      const savedTheme = localStorage.getItem("master_theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
      this.updateThemeIcon(savedTheme);

      const toggleBtn = document.getElementById("btn-theme-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const current = document.documentElement.getAttribute("data-theme") || "light";
          const next = current === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("master_theme", next);
          this.updateThemeIcon(next);
        });
      }
    },

    updateThemeIcon(theme) {
      const icon = document.querySelector(".theme-icon-slot");
      if (!icon) return;
      if (theme === "light") {
        icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      } else {
        icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      }
    },

    /* ---------------- 2. RESUMEN DEL MÁSTER & STATS ---------------- */
    renderMasterHeader() {
      const { info, subjects, events } = this.data;

      const titleEl = document.getElementById("master-title");
      const subtitleEl = document.getElementById("master-subtitle");
      const univEl = document.getElementById("master-university");
      const yearEl = document.getElementById("master-year");

      if (titleEl) titleEl.textContent = info.title;
      if (subtitleEl) subtitleEl.textContent = info.subtitle;
      if (univEl) univEl.textContent = info.university;
      if (yearEl) yearEl.textContent = info.academicYear;

      const totalCredsEl = document.getElementById("stat-total-credits");
      if (totalCredsEl) totalCredsEl.textContent = `${info.totalCredits} ECTS`;

      const totalSubjectsEl = document.getElementById("stat-total-subjects");
      if (totalSubjectsEl) totalSubjectsEl.textContent = `${subjects.length} Materias`;

      // Calcular próximo hito oficial
      const nextDeadlineEl = document.getElementById("stat-next-deadline");
      const nextDeadlineSubEl = document.getElementById("stat-next-deadline-sub");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = events
        .filter(e => new Date(e.date + "T00:00:00") >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (upcoming.length > 0 && nextDeadlineEl) {
        const next = upcoming[0];
        const diffDays = Math.ceil((new Date(next.date + "T00:00:00") - today) / (1000 * 60 * 60 * 24));
        nextDeadlineEl.textContent = diffDays === 0 ? "¡Hoy!" : (diffDays === 1 ? "Mañana" : `En ${diffDays} días`);
        if (nextDeadlineSubEl) nextDeadlineSubEl.textContent = `${next.subjectName}: ${next.title}`;
      } else if (nextDeadlineEl) {
        nextDeadlineEl.textContent = "5 Octubre";
        if (nextDeadlineSubEl) nextDeadlineSubEl.textContent = "Inicio Estructura Nuclear";
      }
    },

    /* ---------------- 3. RENDERIZADO DE ASIGNATURAS (LIMPIO Y SIN SATURAR) ---------------- */
    renderSubjects() {
      const grid = document.getElementById("subjects-grid");
      if (!grid) return;

      const filtered = this.data.subjects.filter(s => {
        if (this.currentFilter === "todas") return true;
        if (this.currentFilter === "obligatorias") return s.type === "Obligatoria";
        if (this.currentFilter === "optativas") return s.type === "Optativa";
        if (this.currentFilter === "tfm") return s.type === "TFM";
        return true;
      });

      grid.innerHTML = filtered.map(subject => {
        let typeBadgeClass = "badge-blue";
        if (subject.type === "Optativa") typeBadgeClass = "badge-amber";
        if (subject.type === "TFM") typeBadgeClass = "badge-emerald";

        const sch = subject.schedule || {};

        return `
          <div class="subject-card">
            <div class="subject-card-top">
              <span class="subject-sede">
                <svg class="icon icon-sm" style="color: var(--accent-primary);" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${subject.sede}</span>
              </span>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <span class="badge badge-neutral">${subject.ects} ECTS</span>
                <span class="badge ${typeBadgeClass}">${subject.type}</span>
              </div>
            </div>

            <h3 class="subject-title">${subject.name}</h3>

            <!-- Bloque de Fechas Clave -->
            <div class="subject-dates-box">
              ${sch.distancia ? `
                <div class="subject-date-row">
                  <svg class="icon icon-sm" style="color: var(--accent-cyan); margin-top: 2px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <div><strong>A distancia:</strong> ${sch.distancia}</div>
                </div>
              ` : ''}

              ${sch.presencial ? `
                <div class="subject-date-row">
                  <svg class="icon icon-sm" style="color: var(--accent-primary); margin-top: 2px;" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <div><strong>Presencial:</strong> ${sch.presencial}</div>
                </div>
              ` : ''}

              ${sch.limiteTexto ? `
                <div class="subject-date-row" style="color: var(--accent-rose);">
                  <svg class="icon icon-sm" style="color: var(--accent-rose); margin-top: 2px;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <div><strong>Límite / Examen:</strong> ${sch.limiteTexto}</div>
                </div>
              ` : ''}
            </div>

            <div class="subject-card-footer">
              <button class="btn btn-primary btn-block btn-open-subject" data-subject-id="${subject.id}">
                <span>Ver Recursos (Apuntes, Exámenes)</span>
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        `;
      }).join("");

      // Configurar botones de filtro
      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.currentFilter = btn.getAttribute("data-filter");
          this.renderSubjects();
        });
      });

      // Configurar botones de apertura del modal
      document.querySelectorAll(".btn-open-subject").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const subjectId = e.currentTarget.getAttribute("data-subject-id");
          this.openSubjectModal(subjectId);
        });
      });
    },

    /* ---------------- 4. MODAL PANORÁMICO DE ASIGNATURA ---------------- */
    initSubjectModal() {
      const modal = document.getElementById("subject-modal");
      const closeBtn = document.getElementById("btn-close-modal");

      if (closeBtn) closeBtn.addEventListener("click", () => this.closeSubjectModal());
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) this.closeSubjectModal();
        });
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeSubjectModal();
          this.closeCommandPalette();
        }
      });

      // Pestañas del modal
      document.querySelectorAll(".modal-tab-btn").forEach(tab => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".modal-tab-btn").forEach(t => t.classList.remove("active"));
          document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
          
          tab.classList.add("active");
          const targetPane = document.getElementById(`pane-${tab.getAttribute("data-tab")}`);
          if (targetPane) targetPane.classList.add("active");
        });
      });
    },

    openSubjectModal(subjectId, initialTab = "apuntes") {
      const subject = this.data.subjects.find(s => s.id === subjectId);
      if (!subject) return;

      this.activeSubject = subject;

      // Encabezado
      document.getElementById("modal-subject-code").textContent = subject.code;
      document.getElementById("modal-subject-title").textContent = subject.name;
      document.getElementById("modal-subject-ects").textContent = `${subject.ects} ECTS - Sede: ${subject.sede}`;
      document.getElementById("modal-prof-name").textContent = subject.professor.name;
      document.getElementById("modal-prof-email").textContent = subject.professor.email;
      document.getElementById("modal-prof-tutoring").textContent = subject.professor.tutoring;
      document.getElementById("modal-prof-office").textContent = subject.professor.office;

      // Contenidos
      this.renderModalApuntes(subject);
      this.renderModalEjercicios(subject);
      this.renderModalPracticas(subject);
      this.renderModalExamenes(subject);
      this.renderModalGuia(subject);

      // Pestaña inicial
      const targetTabBtn = document.querySelector(`.modal-tab-btn[data-tab="${initialTab}"]`);
      if (targetTabBtn) targetTabBtn.click();

      // Abrir modal
      const modal = document.getElementById("subject-modal");
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    },

    closeSubjectModal() {
      const modal = document.getElementById("subject-modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    },

    renderModalApuntes(subject) {
      const container = document.getElementById("pane-apuntes");
      if (!container) return;

      const items = subject.sections.apuntes || [];
      if (items.length === 0) {
        container.innerHTML = `<div class="resource-empty-state"><p>Guarda tus apuntes o PDFs de esta materia en <code style="font-family: var(--font-mono); color: var(--accent-primary);">docs/asignaturas/</code>.</p></div>`;
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div style="flex: 1;">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-primary);" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>${item.title}</span>
                </div>
                <div class="resource-desc">${item.description}</div>
                <div class="resource-meta">📅 Fecha: ${item.date}</div>
              </div>
              <div>
                <a href="${item.fileUrl || '#'}" class="btn btn-secondary btn-sm" ${item.fileUrl ? 'download' : ''}>
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    },

    renderModalEjercicios(subject) {
      const container = document.getElementById("pane-ejercicios");
      if (!container) return;

      const items = subject.sections.ejercicios || [];
      if (items.length === 0) {
        container.innerHTML = `<div class="resource-empty-state"><p>No hay boletines de problemas registrados todavía.</p></div>`;
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div style="flex: 1;">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-amber);" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>${item.title}</span>
                </div>
                <div class="resource-desc">${item.description}</div>
                <div class="resource-meta">📅 Publicado: ${item.date}</div>
              </div>
              <div>
                <a href="${item.fileUrl || '#'}" class="btn btn-secondary btn-sm">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Boletín</span>
                </a>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    },

    renderModalPracticas(subject) {
      const container = document.getElementById("pane-practicas");
      if (!container) return;

      const items = subject.sections.practicas || [];
      if (items.length === 0) {
        container.innerHTML = `<div class="resource-empty-state"><p>Esta asignatura no tiene prácticas de laboratorio externas o se evalúa mediante problemas.</p></div>`;
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div style="flex: 1;">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-emerald);" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  <span>${item.title}</span>
                </div>
                <div class="resource-desc">${item.description}</div>
                <div class="resource-meta">⏳ Entrega: <strong>${item.deadline}</strong></div>
              </div>
              <div>
                <a href="${item.fileUrl || '#'}" class="btn btn-secondary btn-sm">
                  <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Guion</span>
                </a>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    },

    renderModalExamenes(subject) {
      const container = document.getElementById("pane-examenes");
      if (!container) return;

      const items = subject.sections.examenes || [];
      if (items.length === 0) {
        container.innerHTML = `<div class="resource-empty-state"><p>No hay convocatorias de examen registradas.</p></div>`;
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div style="flex: 1;">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-rose);" viewBox="0 0 24 24"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>${item.title}</span>
                  <span class="badge badge-rose">${item.weight}</span>
                </div>
                <div class="resource-desc">${item.notes || 'Convocatoria oficial'}</div>
                <div class="resource-meta">📅 Fecha: <strong>${item.date}</strong> | 📍 ${item.location}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    },

    renderModalGuia(subject) {
      const container = document.getElementById("pane-guia");
      if (!container) return;

      const guia = subject.sections.guia || {};
      const evalList = subject.evaluation || [];

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.4rem;">📖 Descripción General</h4>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">${guia.descripcion || 'Sin descripción disponible.'}</p>
          </div>

          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.65rem;">🎯 Criterios de Evaluación y Ponderación</h4>
            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              ${evalList.map(ev => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 600; margin-bottom: 0.2rem;">
                    <span>${ev.item}</span>
                    <span>${ev.weight}%</span>
                  </div>
                  <div style="height: 6px; background: var(--bg-surface-hover); border-radius: var(--radius-full); overflow: hidden;">
                    <div style="height: 100%; width: ${ev.weight}%; background: var(--accent-primary);"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.4rem;">📚 Bibliografía de Referencia</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; background: var(--bg-surface-elevated); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              ${guia.bibliografia || 'Consultar guía docente oficial en el Campus Virtual UCM.'}
            </p>
          </div>
        </div>
      `;
    },

    /* ---------------- 5. HUB DE ENLACES UCM ---------------- */
    renderLinks() {
      const container = document.getElementById("links-categories-wrap");
      if (!container) return;

      const categories = this.data.links || [];

      container.innerHTML = categories.map(cat => `
        <div class="links-category-wrap">
          <h3 class="links-category-title">
            <svg class="icon icon-sm" style="color: var(--accent-primary);" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            <span>${cat.category}</span>
          </h3>
          <div class="links-grid">
            ${cat.items.map(item => `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="link-card">
                <div>
                  <div class="link-title">${item.title}</div>
                  <div class="link-desc">${item.desc}</div>
                </div>
                <span class="badge badge-neutral">${item.badge}</span>
              </a>
            `).join("")}
          </div>
        </div>
      `).join("");
    },

    /* ---------------- 6. CALENDARIO ACADÉMICO ---------------- */
    initCalendar() {
      if (window.AcademicCalendar) {
        this.calendarInstance = new window.AcademicCalendar(
          this.data.events,
          "#calendar-month-container",
          "#deadlines-feed-container"
        );

        const prevBtn = document.getElementById("btn-prev-month");
        const nextBtn = document.getElementById("btn-next-month");
        if (prevBtn) prevBtn.addEventListener("click", () => this.calendarInstance.prevMonth());
        if (nextBtn) nextBtn.addEventListener("click", () => this.calendarInstance.nextMonth());
      }
    },

    /* ---------------- 7. HERRAMIENTAS: CALCULADORA ---------------- */
    initGradesCalculator() {
      const select = document.getElementById("calc-subject-select");
      const weightsContainer = document.getElementById("calc-weights-list");
      const scoreBig = document.getElementById("calc-final-score");
      const statusBadge = document.getElementById("calc-status-badge");

      if (!select || !weightsContainer) return;

      select.innerHTML = this.data.subjects.map(s => `
        <option value="${s.id}">${s.shortName} (${s.type})</option>
      `).join("");

      const updateCalculation = () => {
        const inputs = weightsContainer.querySelectorAll(".calc-weight-input");
        let weightedSum = 0;

        inputs.forEach(input => {
          const val = parseFloat(input.value);
          const weight = parseFloat(input.getAttribute("data-weight"));
          if (!isNaN(val)) {
            weightedSum += val * (weight / 100);
          }
        });

        scoreBig.textContent = weightedSum.toFixed(2);

        if (weightedSum >= 9.0) {
          statusBadge.textContent = "Sobresaliente";
          statusBadge.className = "badge badge-emerald";
        } else if (weightedSum >= 7.0) {
          statusBadge.textContent = "Notable";
          statusBadge.className = "badge badge-blue";
        } else if (weightedSum >= 5.0) {
          statusBadge.textContent = "Aprobado";
          statusBadge.className = "badge badge-blue";
        } else {
          statusBadge.textContent = "Suspenso / En progreso";
          statusBadge.className = "badge badge-rose";
        }
      };

      const loadSubjectWeights = () => {
        const subjectId = select.value;
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        weightsContainer.innerHTML = (subject.evaluation || []).map(ev => `
          <div class="calc-weight-item">
            <span class="calc-weight-name">${ev.item}</span>
            <span style="font-size: 0.8rem; color: var(--text-tertiary);">(${ev.weight}%)</span>
            <input type="number" class="calc-weight-input" data-weight="${ev.weight}" min="0" max="10" step="0.1" placeholder="Nota" value="0">
          </div>
        `).join("");

        weightsContainer.querySelectorAll(".calc-weight-input").forEach(inp => {
          inp.addEventListener("input", updateCalculation);
        });

        updateCalculation();
      };

      select.addEventListener("change", loadSubjectWeights);
      loadSubjectWeights();
    },

    /* ---------------- 8. HERRAMIENTAS: TO-DO LIST ---------------- */
    initTodoList() {
      const form = document.getElementById("todo-form");
      const input = document.getElementById("todo-input");
      const list = document.getElementById("todo-list");

      if (!form || !input || !list) return;

      const getTasks = () => JSON.parse(localStorage.getItem("fn_tasks") || "[]");
      const saveTasks = (tasks) => localStorage.setItem("fn_tasks", JSON.stringify(tasks));

      const renderTasks = () => {
        const tasks = getTasks();
        if (tasks.length === 0) {
          list.innerHTML = `<div style="text-align:center; padding: 1.5rem; color: var(--text-tertiary); font-size: 0.85rem;">No hay tareas pendientes.</div>`;
          return;
        }

        list.innerHTML = tasks.map((task, index) => `
          <div class="todo-item" style="${task.completed ? 'opacity: 0.55; text-decoration: line-through;' : ''}">
            <input type="checkbox" class="todo-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
            <span class="todo-text">${task.text}</span>
            <button class="icon-btn" data-index="${index}" style="width: 2rem; height: 2rem; border: none;" title="Eliminar">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        `).join("");

        list.querySelectorAll(".todo-checkbox").forEach(chk => {
          chk.addEventListener("change", (e) => {
            const idx = e.target.getAttribute("data-index");
            const t = getTasks();
            t[idx].completed = e.target.checked;
            saveTasks(t);
            renderTasks();
          });
        });

        list.querySelectorAll("button").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const idx = e.currentTarget.getAttribute("data-index");
            const t = getTasks();
            t.splice(idx, 1);
            saveTasks(t);
            renderTasks();
          });
        });
      };

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        const tasks = getTasks();
        tasks.unshift({ text, completed: false });
        saveTasks(tasks);
        input.value = "";
        renderTasks();
      });

      if (getTasks().length === 0) {
        saveTasks([
          { text: "Preparar lecturas para Estructura Nuclear (Granada)", completed: false },
          { text: "Configurar acceso al Campus Virtual UCM", completed: true },
          { text: "Descargar guion de prácticas de laboratorio L1", completed: false }
        ]);
      }

      renderTasks();
    },

    /* ---------------- 9. BUSCADOR GLOBAL / COMMAND PALETTE (CTRL+K) ---------------- */
    initCommandPalette() {
      const overlay = document.getElementById("command-palette-modal");
      const triggerBtn = document.getElementById("btn-open-search");
      const searchInput = document.getElementById("command-search-input");
      const resultsContainer = document.getElementById("command-results");

      if (!overlay || !searchInput) return;

      const openPalette = () => {
        overlay.classList.add("active");
        searchInput.value = "";
        this.runSearch("");
        searchInput.focus();
        document.body.style.overflow = "hidden";
      };

      const closePalette = () => {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      };

      if (triggerBtn) triggerBtn.addEventListener("click", openPalette);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePalette();
      });

      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          if (overlay.classList.contains("active")) closePalette();
          else openPalette();
        }
      });

      searchInput.addEventListener("input", (e) => {
        this.runSearch(e.target.value.toLowerCase().trim());
      });
    },

    closeCommandPalette() {
      const overlay = document.getElementById("command-palette-modal");
      if (overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    },

    runSearch(query) {
      const container = document.getElementById("command-results");
      if (!container) return;

      if (!query) {
        container.innerHTML = `
          <div style="padding: 0.5rem 0.9rem; font-size: 0.72rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;">Asignaturas Matriculadas</div>
          ${this.data.subjects.map(s => `
            <div class="command-item" data-action="open-subject" data-id="${s.id}">
              <svg class="icon icon-sm" style="color: var(--accent-primary);" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>${s.name} (${s.sede})</span>
            </div>
          `).join("")}
        `;
      } else {
        const results = [];

        this.data.subjects.forEach(s => {
          if (s.name.toLowerCase().includes(query) || s.sede.toLowerCase().includes(query) || s.shortName.toLowerCase().includes(query)) {
            results.push({ title: `${s.name} (${s.sede})`, id: s.id });
          }
          (s.sections.apuntes || []).forEach(ap => {
            if (ap.title.toLowerCase().includes(query)) {
              results.push({ title: `${ap.title} [${s.shortName}]`, id: s.id });
            }
          });
        });

        if (results.length === 0) {
          container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-tertiary); font-size: 0.9rem;">No se encontraron resultados.</div>`;
          return;
        }

        container.innerHTML = results.slice(0, 8).map(r => `
          <div class="command-item" data-action="open-subject" data-id="${r.id}">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>${r.title}</span>
          </div>
        `).join("");
      }

      container.querySelectorAll(".command-item").forEach(item => {
        item.addEventListener("click", () => {
          const subjectId = item.getAttribute("data-id");
          this.closeCommandPalette();
          this.openSubjectModal(subjectId, "apuntes");
        });
      });
    },

    /* ---------------- 10. SCROLL SUAVE Y NAVEGACIÓN MÓVIL ---------------- */
    initSmoothScroll() {
      document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
        link.addEventListener("click", (e) => {
          const targetId = link.getAttribute("href");
          if (targetId && targetId.startsWith("#")) {
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth" });
              document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(l => l.classList.remove("active"));
              link.classList.add("active");
            }
          }
        });
      });
    },

    initMobileNav() {
      // Sincronizar item activo con el scroll
      window.addEventListener("scroll", () => {
        const sections = ["dashboard", "asignaturas", "calendario", "enlaces", "herramientas"];
        const scrollPos = window.scrollY + 200;

        sections.forEach(secId => {
          const sec = document.getElementById(secId);
          if (sec && scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll(".mobile-nav-item").forEach(item => {
              item.classList.toggle("active", item.getAttribute("href") === `#${secId}`);
            });
            document.querySelectorAll(".nav-link").forEach(item => {
              item.classList.toggle("active", item.getAttribute("href") === `#${secId}`);
            });
          }
        });
      }, { passive: true });
    }
  };

  App.init();
});
