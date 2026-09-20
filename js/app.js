/**
 * ====================================================================
 * APLICACIÓN PRINCIPAL - CONTROLADOR GENERAL (APP.JS)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const App = {
    data: window.MASTER_DATA,
    currentFilter: "todos",
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
    },

    /* ---------------- 1. TEMA CLARO / OSCURO ---------------- */
    initTheme() {
      const savedTheme = localStorage.getItem("master_theme") || "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
      this.updateThemeIcon(savedTheme);

      const toggleBtn = document.getElementById("btn-theme-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const current = document.documentElement.getAttribute("data-theme") || "dark";
          const next = current === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("master_theme", next);
          this.updateThemeIcon(next);
        });
      }
    },

    updateThemeIcon(theme) {
      const icon = document.querySelector(".theme-icon-slot");
      if (!icon) return;
      if (theme === "dark") {
        icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    },

    /* ---------------- 2. RESUMEN DEL MÁSTER & STATS ---------------- */
    renderMasterHeader() {
      const { info, subjects, events } = this.data;

      // Actualizar textos principales
      const titleEl = document.getElementById("master-title");
      const subtitleEl = document.getElementById("master-subtitle");
      const univEl = document.getElementById("master-university");
      const yearEl = document.getElementById("master-year");

      if (titleEl) titleEl.textContent = info.title;
      if (subtitleEl) subtitleEl.textContent = info.subtitle;
      if (univEl) univEl.textContent = info.university;
      if (yearEl) yearEl.textContent = info.academicYear;

      // Stats rápidos
      const totalCredsEl = document.getElementById("stat-total-credits");
      if (totalCredsEl) totalCredsEl.textContent = `${info.totalCredits} ECTS`;

      const totalSubjectsEl = document.getElementById("stat-total-subjects");
      if (totalSubjectsEl) totalSubjectsEl.textContent = `${subjects.length} Asignaturas`;

      // Calcular próxima entrega más cercana
      const nextDeadlineEl = document.getElementById("stat-next-deadline");
      const nextDeadlineSubEl = document.getElementById("stat-next-deadline-sub");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingEvents = events
        .filter(e => new Date(e.date + "T00:00:00") >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (upcomingEvents.length > 0 && nextDeadlineEl) {
        const next = upcomingEvents[0];
        const diffDays = Math.ceil((new Date(next.date + "T00:00:00") - today) / (1000 * 60 * 60 * 24));
        nextDeadlineEl.textContent = diffDays === 0 ? "¡Vence hoy!" : (diffDays === 1 ? "Mañana" : `En ${diffDays} días`);
        if (nextDeadlineSubEl) nextDeadlineSubEl.textContent = `${next.title} (${next.subjectName})`;
      } else if (nextDeadlineEl) {
        nextDeadlineEl.textContent = "Sin entregas";
        if (nextDeadlineSubEl) nextDeadlineSubEl.textContent = "Al día";
      }
    },

    /* ---------------- 3. RENDERIZADO DE ASIGNATURAS Y FILTROS ---------------- */
    renderSubjects() {
      const grid = document.getElementById("subjects-grid");
      if (!grid) return;

      const filtered = this.data.subjects.filter(s => {
        if (this.currentFilter === "todos") return true;
        if (this.currentFilter === "sem1") return s.semester === 1;
        if (this.currentFilter === "sem2") return s.semester === 2;
        if (this.currentFilter === "en_curso") return s.status === "en_curso";
        return true;
      });

      grid.innerHTML = filtered.map(subject => {
        const apuntesCount = subject.sections.apuntes ? subject.sections.apuntes.length : 0;
        const ejerciciosCount = subject.sections.ejercicios ? subject.sections.ejercicios.length : 0;
        const practicasCount = subject.sections.practicas ? subject.sections.practicas.length : 0;
        const examenesCount = subject.sections.examenes ? subject.sections.examenes.length : 0;

        const statusBadge = subject.status === "en_curso" 
          ? `<span class="badge badge-indigo">En Curso</span>` 
          : `<span class="badge badge-subtle">2º Semestre</span>`;

        return `
          <div class="subject-card" style="--card-accent: ${subject.color}">
            <div class="subject-card-header">
              <span class="subject-code">${subject.code}</span>
              <div style="display: flex; gap: 0.4rem; align-items: center;">
                <span class="badge badge-subtle">${subject.ects} ECTS</span>
                ${statusBadge}
              </div>
            </div>

            <h3 class="subject-title">${subject.name}</h3>
            
            <div class="subject-prof">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>${subject.professor.name}</span>
            </div>

            <div class="subject-indicators">
              <div class="indicator-item">
                <span class="indicator-count">${apuntesCount}</span>
                <span class="indicator-label">Apuntes</span>
              </div>
              <div class="indicator-item">
                <span class="indicator-count">${ejerciciosCount}</span>
                <span class="indicator-label">Problemas</span>
              </div>
              <div class="indicator-item">
                <span class="indicator-count">${practicasCount}</span>
                <span class="indicator-label">Prácticas</span>
              </div>
              <div class="indicator-item">
                <span class="indicator-count">${examenesCount}</span>
                <span class="indicator-label">Exámenes</span>
              </div>
            </div>

            <div class="subject-card-footer">
              <button class="btn btn-primary btn-block btn-open-subject" data-subject-id="${subject.id}">
                <span>Ver Contenido</span>
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
              <a href="${subject.campusUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" title="Aula Virtual">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
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

      // Configurar eventos para abrir modal
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

      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeSubjectModal());
      }

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

      // Actualizar cabecera del modal
      document.getElementById("modal-subject-code").textContent = subject.code;
      document.getElementById("modal-subject-title").textContent = subject.name;
      document.getElementById("modal-subject-ects").textContent = `${subject.ects} ECTS - ${subject.semester}º Cuatrimestre`;
      document.getElementById("modal-prof-name").textContent = subject.professor.name;
      document.getElementById("modal-prof-email").textContent = subject.professor.email;
      document.getElementById("modal-prof-tutoring").textContent = subject.professor.tutoring;
      document.getElementById("modal-prof-office").textContent = subject.professor.office;

      const campusLink = document.getElementById("modal-campus-link");
      if (campusLink) campusLink.href = subject.campusUrl;

      // Renderizar contenidos de pestañas
      this.renderModalApuntes(subject);
      this.renderModalEjercicios(subject);
      this.renderModalPracticas(subject);
      this.renderModalExamenes(subject);
      this.renderModalGuia(subject);

      // Activar pestaña indicada
      const targetTabBtn = document.querySelector(`.modal-tab-btn[data-tab="${initialTab}"]`);
      if (targetTabBtn) targetTabBtn.click();

      // Mostrar modal
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
        container.innerHTML = this.getEmptyStateHtml("No hay apuntes subidos todavía para esta asignatura.");
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div class="resource-info">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-primary);" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>${item.title}</span>
                </div>
                <div class="resource-desc">${item.description}</div>
                <div class="resource-meta">
                  <span>📅 Fecha: ${item.date}</span>
                  <span>📄 Formato: ${item.type.toUpperCase()}</span>
                </div>
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
        container.innerHTML = this.getEmptyStateHtml("No hay hojas de ejercicios publicadas aún.");
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div class="resource-info">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-amber);" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>${item.title}</span>
                  ${item.hasSolutions ? '<span class="badge badge-emerald">Con Soluciones</span>' : '<span class="badge badge-subtle">Sin Resolver</span>'}
                </div>
                <div class="resource-desc">${item.description}</div>
                <div class="resource-meta">
                  <span>📅 Publicado: ${item.date}</span>
                </div>
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
        container.innerHTML = this.getEmptyStateHtml("No hay prácticas asignadas en este momento.");
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => {
            const statusClass = item.status === "en_progreso" ? "badge-amber" : (item.status === "entregada" ? "badge-emerald" : "badge-subtle");
            return `
              <div class="resource-card">
                <div class="resource-info">
                  <div class="resource-title">
                    <svg class="icon icon-sm" style="color: var(--accent-sky);" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    <span>${item.title}</span>
                    <span class="badge ${statusClass}">${item.status.replace("_", " ")}</span>
                  </div>
                  <div class="resource-desc">${item.description}</div>
                  <div class="resource-meta">
                    <span>⏳ Entrega límite: <strong>${item.deadline}</strong></span>
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  ${item.repoUrl ? `
                    <a href="${item.repoUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" title="Repositorio">
                      <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      <span>Repo</span>
                    </a>
                  ` : ''}
                  <a href="${item.fileUrl || '#'}" class="btn btn-secondary btn-sm">
                    <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Enunciado</span>
                  </a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    },

    renderModalExamenes(subject) {
      const container = document.getElementById("pane-examenes");
      if (!container) return;

      const items = subject.sections.examenes || [];
      if (items.length === 0) {
        container.innerHTML = this.getEmptyStateHtml("No hay convocatorias de examen registradas.");
        return;
      }

      container.innerHTML = `
        <div class="resource-list">
          ${items.map(item => `
            <div class="resource-card">
              <div class="resource-info">
                <div class="resource-title">
                  <svg class="icon icon-sm" style="color: var(--accent-rose);" viewBox="0 0 24 24"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <span>${item.title}</span>
                  <span class="badge badge-rose">Peso: ${item.weight}</span>
                </div>
                <div class="resource-desc">${item.notes || 'Convocatoria oficial'}</div>
                <div class="resource-meta">
                  <span>📅 Fecha: <strong>${item.date}</strong></span>
                  <span>📍 Lugar: ${item.location || 'Por determinar'}</span>
                </div>
              </div>
              <div>
                ${item.fileUrl ? `
                  <a href="${item.fileUrl}" class="btn btn-secondary btn-sm">
                    <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span>Modelo Examen</span>
                  </a>
                ` : '<span class="badge badge-subtle">Sin modelo adjunto</span>'}
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
            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">📖 Descripción General</h4>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">${guia.descripcion || 'Sin descripción detallada.'}</p>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">🎯 Criterios de Evaluación y Ponderación</h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${evalList.map(ev => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 600; margin-bottom: 0.25rem;">
                    <span>${ev.item}</span>
                    <span>${ev.weight}%</span>
                  </div>
                  <div style="height: 8px; background: var(--bg-surface-elevated); border-radius: var(--radius-full); overflow: hidden;">
                    <div style="height: 100%; width: ${ev.weight}%; background: var(--accent-primary);"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div>
            <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">📚 Bibliografía de Referencia</h4>
            <p style="color: var(--text-secondary); font-size: 0.92rem; font-family: var(--font-mono); background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              ${guia.bibliografia || 'Consultar guía docente del aula virtual.'}
            </p>
          </div>
        </div>
      `;
    },

    getEmptyStateHtml(message) {
      return `
        <div class="resource-empty-state">
          <svg class="resource-empty-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <p>${message}</p>
        </div>
      `;
    },

    /* ---------------- 5. HUB DE ENLACES RÁPIDOS ---------------- */
    renderLinks() {
      const container = document.getElementById("links-categories-wrap");
      if (!container) return;

      const categories = this.data.links || [];

      container.innerHTML = categories.map(cat => `
        <div class="links-category-wrap">
          <h3 class="links-category-title">
            <svg class="icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            <span>${cat.category}</span>
          </h3>
          <div class="links-grid">
            ${cat.items.map(item => `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="link-card">
                <div class="link-icon-box">
                  <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                </div>
                <div class="link-info">
                  <div class="link-header-row">
                    <span class="link-title">${item.title}</span>
                    <span class="badge badge-subtle">${item.badge}</span>
                  </div>
                  <p class="link-desc">${item.desc}</p>
                </div>
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

    /* ---------------- 7. HERRAMIENTAS EXTRAS: CALCULADORA ---------------- */
    initGradesCalculator() {
      const select = document.getElementById("calc-subject-select");
      const weightsContainer = document.getElementById("calc-weights-list");
      const scoreBig = document.getElementById("calc-final-score");
      const statusBadge = document.getElementById("calc-status-badge");

      if (!select || !weightsContainer) return;

      // Llenar selector con las 10 asignaturas
      select.innerHTML = this.data.subjects.map(s => `
        <option value="${s.id}">${s.code} - ${s.name}</option>
      `).join("");

      const updateCalculation = () => {
        const subjectId = select.value;
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const inputs = weightsContainer.querySelectorAll(".calc-weight-input");
        let weightedSum = 0;
        let totalWeightUsed = 0;

        inputs.forEach(input => {
          const val = parseFloat(input.value);
          const weight = parseFloat(input.getAttribute("data-weight"));
          if (!isNaN(val)) {
            weightedSum += val * (weight / 100);
            totalWeightUsed += weight;
          }
        });

        const finalScore = weightedSum.toFixed(2);
        scoreBig.textContent = finalScore;

        if (weightedSum >= 9.0) {
          statusBadge.textContent = "Sobresaliente";
          statusBadge.className = "badge badge-emerald";
        } else if (weightedSum >= 7.0) {
          statusBadge.textContent = "Notable";
          statusBadge.className = "badge badge-indigo";
        } else if (weightedSum >= 5.0) {
          statusBadge.textContent = "Aprobado";
          statusBadge.className = "badge badge-sky";
        } else {
          statusBadge.textContent = "Suspenso / En progreso";
          statusBadge.className = "badge badge-rose";
        }
      };

      const loadSubjectWeights = () => {
        const subjectId = select.value;
        const subject = this.data.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        weightsContainer.innerHTML = (subject.evaluation || []).map((ev, index) => `
          <div class="calc-weight-item">
            <span class="calc-weight-name">${ev.item}</span>
            <span class="calc-weight-pct">(${ev.weight}%)</span>
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

    /* ---------------- 8. HERRAMIENTAS EXTRAS: TO-DO LIST ---------------- */
    initTodoList() {
      const form = document.getElementById("todo-form");
      const input = document.getElementById("todo-input");
      const list = document.getElementById("todo-list");

      if (!form || !input || !list) return;

      const getTasks = () => {
        return JSON.parse(localStorage.getItem("master_tasks") || "[]");
      };

      const saveTasks = (tasks) => {
        localStorage.setItem("master_tasks", JSON.stringify(tasks));
      };

      const renderTasks = () => {
        const tasks = getTasks();
        if (tasks.length === 0) {
          list.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-tertiary); font-size: 0.88rem;">No tienes tareas pendientes apuntadas.</div>`;
          return;
        }

        list.innerHTML = tasks.map((task, index) => `
          <div class="todo-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
            <span class="todo-text">${task.text}</span>
            <button class="todo-delete-btn" data-index="${index}" title="Eliminar">
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

        list.querySelectorAll(".todo-delete-btn").forEach(btn => {
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
        tasks.unshift({ text, completed: false, date: new Date().toISOString() });
        saveTasks(tasks);
        input.value = "";
        renderTasks();
      });

      // Añadir tareas de ejemplo si está vacío la primera vez
      if (getTasks().length === 0) {
        saveTasks([
          { text: "Revisar temario inicial de Asignatura 1", completed: false },
          { text: "Descargar boletín de problemas de Asignatura 2", completed: true },
          { text: "Configurar acceso VPN de la biblioteca", completed: false }
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

      // Atajo de teclado: Ctrl + K o Cmd + K
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          if (overlay.classList.contains("active")) {
            closePalette();
          } else {
            openPalette();
          }
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
        // Mostrar accesos directos por defecto
        container.innerHTML = `
          <div style="padding: 0.5rem 1rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;">Asignaturas Disponibles</div>
          ${this.data.subjects.slice(0, 5).map(s => `
            <div class="command-item" data-action="open-subject" data-id="${s.id}" data-tab="apuntes">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>${s.code} - ${s.name}</span>
              <span class="command-item-type">Asignatura</span>
            </div>
          `).join("")}
        `;
      } else {
        const results = [];

        // 1. Asignaturas
        this.data.subjects.forEach(s => {
          if (s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || s.professor.name.toLowerCase().includes(query)) {
            results.push({
              title: `${s.code}: ${s.name} (${s.professor.name})`,
              action: "open-subject",
              id: s.id,
              tab: "apuntes",
              type: "Asignatura"
            });
          }

          // 2. Apuntes de asignaturas
          (s.sections.apuntes || []).forEach(ap => {
            if (ap.title.toLowerCase().includes(query) || ap.description.toLowerCase().includes(query)) {
              results.push({
                title: `${ap.title} [${s.code}]`,
                action: "open-subject",
                id: s.id,
                tab: "apuntes",
                type: "Apunte"
              });
            }
          });

          // 3. Prácticas
          (s.sections.practicas || []).forEach(pr => {
            if (pr.title.toLowerCase().includes(query) || pr.description.toLowerCase().includes(query)) {
              results.push({
                title: `${pr.title} [${s.code}]`,
                action: "open-subject",
                id: s.id,
                tab: "practicas",
                type: "Práctica"
              });
            }
          });

          // 4. Exámenes
          (s.sections.examenes || []).forEach(ex => {
            if (ex.title.toLowerCase().includes(query)) {
              results.push({
                title: `${ex.title} [${s.code}]`,
                action: "open-subject",
                id: s.id,
                tab: "examenes",
                type: "Examen"
              });
            }
          });
        });

        // 5. Enlaces
        this.data.links.forEach(cat => {
          cat.items.forEach(link => {
            if (link.title.toLowerCase().includes(query) || link.desc.toLowerCase().includes(query)) {
              results.push({
                title: link.title,
                url: link.url,
                action: "open-url",
                type: "Enlace Externo"
              });
            }
          });
        });

        if (results.length === 0) {
          container.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">No se encontraron resultados para "${query}".</div>`;
          return;
        }

        container.innerHTML = results.slice(0, 10).map(r => `
          <div class="command-item" data-action="${r.action}" data-id="${r.id || ''}" data-tab="${r.tab || ''}" data-url="${r.url || ''}">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>${r.title}</span>
            <span class="command-item-type">${r.type}</span>
          </div>
        `).join("");
      }

      // Asignar listeners a los resultados
      container.querySelectorAll(".command-item").forEach(item => {
        item.addEventListener("click", () => {
          const action = item.getAttribute("data-action");
          if (action === "open-subject") {
            const subjectId = item.getAttribute("data-id");
            const tab = item.getAttribute("data-tab");
            this.closeCommandPalette();
            this.openSubjectModal(subjectId, tab);
          } else if (action === "open-url") {
            const url = item.getAttribute("data-url");
            window.open(url, "_blank");
            this.closeCommandPalette();
          }
        });
      });
    },

    /* ---------------- 10. SCROLL SUAVE Y NAVEGACIÓN ---------------- */
    initSmoothScroll() {
      document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
          const targetId = link.getAttribute("href");
          if (targetId && targetId.startsWith("#")) {
            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth" });
              document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
              link.classList.add("active");
            }
          }
        });
      });
    }
  };

  // Arrancar la aplicación
  App.init();
});
