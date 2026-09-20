/**
 * ====================================================================
 * CALENDARIO ACADÉMICO VISUAL (CALENDAR.JS)
 * ====================================================================
 * Dos vistas sobre los mismos eventos de data.js:
 *   - Mes:   cuadrícula con barras continuas de color por asignatura (estilo Google Calendar).
 *   - Curso: cronograma tipo Gantt de octubre a julio, una fila por asignatura.
 * Además: detalle del día, agenda con cuenta atrás, filtro por asignatura y exportación .ics.
 */
(function () {
  "use strict";

  const { esc, icon, parseISO, toISO, daysBetween } = window.UI;

  const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const DOW = ["L", "M", "X", "J", "V", "S", "D"];
  const TYPE = {
    clase:      { label: "Clases a distancia", badge: "badge-emerald" },
    presencial: { label: "Semana presencial",  badge: "badge-blue" },
    examen:     { label: "Examen / entrega",   badge: "badge-rose" }
  };

  const fmtShort = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" });
  const fmtLong = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const fmtWeekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" });
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const rangeText = (ev) => (ev.end > ev.start ? `${fmtShort.format(ev.start)} – ${fmtShort.format(ev.end)}` : fmtShort.format(ev.start));

  class AcademicCalendar {
    constructor({ events, subjects, info, onOpenSubject }) {
      this.subjects = new Map((subjects || []).map((s) => [s.id, s]));
      this.info = info || {};
      this.onOpenSubject = onOpenSubject || (() => {});
      this.today = startOfDay(new Date());

      this.events = (events || []).map((ev) => {
        const s = this.subjects.get(ev.subjectId) || {};
        return { ...ev, start: parseISO(ev.date), end: parseISO(ev.endDate || ev.date), color: s.color || "#2563eb", short: s.shortName || ev.subjectName };
      }).sort((a, b) => a.start - b.start || b.end - a.end);

      this.view = "mes";
      this.hidden = new Set();
      this.selected = null;

      const $ = (id) => document.getElementById(id);
      this.el = {
        main: $("calendar-month-container"), title: $("calendar-month-year"), feed: $("deadlines-feed-container"),
        detail: $("calendar-day-detail"), legend: $("cal-legend"), switcher: $("cal-view-switch"), nav: $("cal-nav"),
        prev: $("btn-prev-month"), next: $("btn-next-month"), todayBtn: $("btn-today"), export: $("btn-export-calendar")
      };
      if (!this.el.main || !this.events.length) return;

      this.setInitialPosition();
      this.bind();
      this.renderAll();
    }

    /* ---------------- Estado inicial: el próximo hito (o el último mes del curso) ---------------- */
    setInitialPosition() {
      const upcoming = this.events.find((ev) => ev.end >= this.today);
      if (upcoming) {
        const focus = this.today > upcoming.start ? this.today : upcoming.start;
        this.year = focus.getFullYear();
        this.month = focus.getMonth();
        this.selected = toISO(focus);
      } else {
        const last = this.events[this.events.length - 1].end;
        this.year = last.getFullYear();
        this.month = last.getMonth();
      }
    }

    bind() {
      this.el.prev.addEventListener("click", () => this.shiftMonth(-1));
      this.el.next.addEventListener("click", () => this.shiftMonth(1));
      this.el.todayBtn.addEventListener("click", () => this.goToday());
      this.el.export.addEventListener("click", () => this.exportToICS());

      this.el.switcher.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-view]");
        if (btn) this.setView(btn.dataset.view);
      });

      // Delegación de clics sobre todo el bloque del calendario
      const root = this.el.main.closest(".calendar-shell") || document;
      root.addEventListener("click", (e) => {
        const day = e.target.closest("[data-date]");
        const chip = e.target.closest("[data-legend-subject]");
        const open = e.target.closest("[data-open-subject]");

        if (chip) return this.toggleSubject(chip.dataset.legendSubject);
        if (open) return this.onOpenSubject(open.dataset.openSubject);
        if (day && root.contains(day)) {
          const date = day.dataset.date;
          this.select(date, { navigate: true, fromGantt: !!day.closest(".gantt") });
        }
      });
    }

    /* ---------------- Navegación ---------------- */
    setView(view) {
      this.view = view;
      this.el.switcher.querySelectorAll("[data-view]").forEach((b) => {
        const on = b.dataset.view === view;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      this.el.nav.classList.toggle("is-hidden", view === "curso");
      this.renderMain();
    }

    shiftMonth(delta) {
      const d = new Date(this.year, this.month + delta, 1);
      this.year = d.getFullYear();
      this.month = d.getMonth();
      this.renderMain();
    }

    goToday() {
      const inCourse = this.today >= this.courseStart() && this.today <= this.courseEnd();
      if (inCourse) {
        this.year = this.today.getFullYear();
        this.month = this.today.getMonth();
        this.selected = toISO(this.today);
      } else {
        this.setInitialPosition();
      }
      if (this.view !== "mes") this.setView("mes"); else this.renderMain();
      this.renderDetail();
      this.renderAgenda();
    }

    select(iso, { navigate = false, fromGantt = false } = {}) {
      this.selected = iso;
      const d = parseISO(iso);
      if (navigate) { this.year = d.getFullYear(); this.month = d.getMonth(); }
      if (fromGantt) { this.setView("mes"); } else { this.renderMain(); }
      this.renderDetail();
      this.renderAgenda();
    }

    toggleSubject(id) {
      if (this.hidden.has(id)) this.hidden.delete(id); else this.hidden.add(id);
      this.renderLegend();
      this.renderMain();
      this.renderDetail();
      this.renderAgenda();
    }

    courseStart() { const f = this.events.reduce((m, e) => (e.start < m ? e.start : m), this.events[0].start); return new Date(f.getFullYear(), f.getMonth(), 1); }
    courseEnd() { const l = this.events.reduce((m, e) => (e.end > m ? e.end : m), this.events[0].end); return new Date(l.getFullYear(), l.getMonth() + 1, 0); }
    visible() { return this.events.filter((e) => !this.hidden.has(e.subjectId)); }

    /* ---------------- Render general ---------------- */
    renderAll() {
      this.renderLegend();
      this.renderMain();
      this.renderDetail();
      this.renderAgenda();
    }

    renderMain() {
      if (this.view === "curso") {
        this.el.title.textContent = `Curso ${this.info.academicYear || ""}`.trim();
        this.el.main.innerHTML = this.courseHTML();
      } else {
        this.el.title.textContent = `${MONTHS[this.month]} ${this.year}`;
        this.el.main.innerHTML = this.monthHTML();
      }
    }

    /* ---------------- Leyenda: filtros por asignatura + clave de tipos ---------------- */
    renderLegend() {
      const ids = [...new Set(this.events.map((e) => e.subjectId))];
      const chips = ids.map((id) => {
        const s = this.subjects.get(id);
        if (!s) return "";
        const on = !this.hidden.has(id);
        return `<button type="button" class="legend-chip${on ? "" : " is-off"}" data-legend-subject="${esc(id)}" aria-pressed="${on}" style="--c:${esc(s.color)}" title="${on ? "Ocultar" : "Mostrar"} ${esc(s.name)}"><i></i>${esc(s.shortName)}</button>`;
      }).join("");

      this.el.legend.innerHTML = `
        <div class="legend-chips">${chips}</div>
        <div class="legend-key" aria-label="Significado de las barras">
          <span><i class="key-swatch key-presencial"></i>Semana presencial</span>
          <span><i class="key-swatch key-clase"></i>Clases a distancia</span>
          <span><i class="key-swatch key-examen">${icon("flag", "icon-xs")}</i>Examen / entrega</span>
        </div>`;
    }

    /* ====================================================================
       VISTA MES
       ==================================================================== */
    monthHTML() {
      const y = this.year, m = this.month;
      const offset = (new Date(y, m, 1).getDay() + 6) % 7;            // lunes = 0
      const weeks = Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7);
      const visible = this.visible();
      const todayISO = toISO(this.today);

      let html = `<div class="cal-month" role="grid" aria-label="${MONTHS[m]} ${y}">
        <div class="cal-dow" role="row">${DOW.map((d) => `<span role="columnheader">${d}</span>`).join("")}</div>`;

      for (let w = 0; w < weeks; w++) {
        const ws = new Date(y, m, 1 - offset + w * 7);
        const we = addDays(ws, 6);

        // Segmentos de evento que tocan esta semana
        const segs = [];
        visible.forEach((ev) => {
          if (ev.end < ws || ev.start > we) return;
          segs.push({ ev, c0: Math.max(0, daysBetween(ws, ev.start)), c1: Math.min(6, daysBetween(ws, ev.end)), contL: ev.start < ws, contR: ev.end > we });
        });
        // Reparto en carriles (lanes) para que no se pisen
        const laneEnds = [];
        segs.forEach((s) => {
          let lane = laneEnds.findIndex((end) => end < s.c0);
          if (lane === -1) { lane = laneEnds.length; laneEnds.push(s.c1); } else { laneEnds[lane] = s.c1; }
          s.lane = lane;
        });

        let cells = "";
        for (let d = 0; d < 7; d++) {
          const date = addDays(ws, d);
          const iso = toISO(date);
          const dayEvents = visible.filter((ev) => ev.start <= date && ev.end >= date);
          const cls = ["cal-day"];
          if (date.getMonth() !== m) cls.push("other-month");
          if (d >= 5) cls.push("weekend");
          if (iso === todayISO) cls.push("today");
          if (iso === this.selected) cls.push("selected");
          const label = `${date.getDate()} de ${MONTHS[date.getMonth()].toLowerCase()}${dayEvents.length ? ": " + dayEvents.map((e) => `${e.short} — ${e.title}`).join("; ") : ""}`;
          cells += `<button type="button" class="${cls.join(" ")}" data-date="${iso}" aria-label="${esc(label)}" aria-pressed="${iso === this.selected}" title="${esc(dayEvents.map((e) => `${e.short}: ${e.title}`).join("\n"))}"><span class="cal-day-num">${date.getDate()}</span></button>`;
        }

        const bars = segs.map((s) => {
          const { ev } = s;
          const span = s.c1 - s.c0 + 1;
          const showLabel = !s.contL || s.c0 === 0;
          let text = ev.short;
          if (span >= 3 && ev.type === "presencial") text += " · presencial";
          if (span >= 3 && ev.type === "clase") text += " · distancia";
          const flag = ev.type === "examen" ? icon("flag", "icon-xs") : "";
          return `<span class="cal-bar bar-${ev.type}${s.contL ? " cont-l" : ""}${s.contR ? " cont-r" : ""}" style="grid-column:${s.c0 + 1} / ${s.c1 + 2};grid-row:${s.lane + 1};--c:${esc(ev.color)}">${showLabel ? `${flag}<span class="cal-bar-text">${esc(text)}</span>` : ""}</span>`;
        }).join("");

        html += `<div class="cal-week" style="--lanes:${Math.max(laneEnds.length, 1)}" role="row">
          <div class="cal-week-days">${cells}</div>
          <div class="cal-week-events" aria-hidden="true">${bars}</div>
        </div>`;
      }
      return html + "</div>";
    }

    /* ====================================================================
       VISTA CURSO (Gantt)
       ==================================================================== */
    courseHTML() {
      const start = this.courseStart();
      const end = this.courseEnd();
      const total = daysBetween(start, end) + 1;
      const pct = (d) => (daysBetween(start, d) / total) * 100;

      // Meses
      const months = [];
      for (let d = new Date(start); d <= end; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
        const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        months.push({ label: `${MONTHS[d.getMonth()].slice(0, 3)}${d.getMonth() === 0 || !months.length ? " " + String(d.getFullYear()).slice(2) : ""}`, left: pct(d), width: ((daysBetween(d, mEnd) + 1) / total) * 100 });
      }
      const grid = months.map((m) => `<i class="gantt-month-line" style="left:${m.left}%"></i>`).join("");
      const todayPct = this.today >= start && this.today <= end ? pct(this.today) : null;

      // Una fila por asignatura con eventos, en orden cronológico
      const rows = [];
      const seen = new Set();
      this.visible().forEach((ev) => { if (!seen.has(ev.subjectId)) { seen.add(ev.subjectId); rows.push(ev.subjectId); } });

      const body = rows.map((id) => {
        const s = this.subjects.get(id);
        const evs = this.visible().filter((e) => e.subjectId === id);
        const segs = evs.map((ev) => {
          const tip = `${ev.subjectName} · ${ev.title}\n${rangeText(ev)}\n${ev.sede || ""}`;
          if (ev.type === "examen") {
            return `<button type="button" class="gantt-flag" data-date="${toISO(ev.start)}" style="left:${pct(ev.start) + 0.5 / total * 100}%;--c:${esc(ev.color)}" title="${esc(tip)}" aria-label="${esc(tip)}">${icon("flag", "icon-xs")}</button>`;
          }
          const w = Math.max(((daysBetween(ev.start, ev.end) + 1) / total) * 100, 0.9);
          return `<button type="button" class="gantt-seg seg-${ev.type}" data-date="${toISO(ev.start)}" style="left:${pct(ev.start)}%;width:${w}%;--c:${esc(ev.color)}" title="${esc(tip)}" aria-label="${esc(tip)}"></button>`;
        }).join("");
        return `<div class="gantt-row">
          <div class="gantt-label" style="--c:${esc(s ? s.color : "#2563eb")}"><i></i><span>${esc(s ? s.shortName : id)}</span></div>
          <div class="gantt-track">${grid}${todayPct !== null ? `<i class="gantt-today" style="left:${todayPct}%"></i>` : ""}${segs}</div>
        </div>`;
      }).join("");

      if (!rows.length) return `<div class="resource-empty-state"><p>Todas las asignaturas están ocultas. Activa alguna en la leyenda.</p></div>`;

      return `<div class="gantt-scroll"><div class="gantt">
        <div class="gantt-row gantt-head">
          <div class="gantt-label"></div>
          <div class="gantt-track">${months.map((m) => `<span class="gantt-month" style="left:${m.left}%;width:${m.width}%">${m.label}</span>`).join("")}</div>
        </div>
        ${body}
      </div></div>
      <p class="gantt-hint">Pulsa una barra o una bandera para abrir ese día en la vista de mes.</p>`;
    }

    /* ====================================================================
       DETALLE DEL DÍA
       ==================================================================== */
    countdown(ev) {
      if (ev.start <= this.today && ev.end >= this.today) return { text: "En curso", cls: "badge-emerald" };
      const diff = daysBetween(this.today, ev.start);
      if (diff < 0) return { text: "Finalizado", cls: "badge-neutral" };
      if (diff === 0) return { text: "¡Hoy!", cls: "badge-rose" };
      if (diff === 1) return { text: "Mañana", cls: "badge-rose" };
      if (diff <= 14) return { text: `En ${diff} días`, cls: "badge-amber" };
      return { text: `En ${diff} días`, cls: "badge-blue" };
    }

    renderDetail() {
      const el = this.el.detail;
      if (!this.selected) {
        el.innerHTML = `<p class="day-hint">${icon("calendar")} Pulsa un día del calendario para ver su detalle.</p>`;
        return;
      }
      const date = parseISO(this.selected);
      const evs = this.visible().filter((e) => e.start <= date && e.end >= date);

      const head = `
        <div class="day-detail-head">
          <div>
            <span class="day-detail-weekday">${cap(fmtWeekday.format(date))}</span>
            <h4>${fmtLong.format(date)}</h4>
          </div>
          ${date.getTime() === this.today.getTime() ? '<span class="badge badge-blue">Hoy</span>' : ""}
        </div>`;

      if (!evs.length) {
        const next = this.visible().find((e) => e.start > date);
        el.innerHTML = `${head}
          <p class="day-empty">Sin actividades este día.</p>
          ${next ? `<button type="button" class="day-next" data-date="${toISO(next.start)}">Siguiente: <strong>${esc(next.short)} · ${esc(next.title)}</strong> (${rangeText(next)}) ${icon("right")}</button>` : ""}`;
        return;
      }

      el.innerHTML = `${head}<ul class="day-events">${evs.map((ev) => {
        const t = TYPE[ev.type] || TYPE.clase;
        return `<li class="day-event" style="--c:${esc(ev.color)}">
          <div class="day-event-top"><strong>${esc(ev.subjectName)}</strong><span class="badge ${t.badge}">${t.label}</span></div>
          <div class="day-event-title">${esc(ev.title)}</div>
          <div class="day-event-meta">
            <span>${icon("pin")}${esc(ev.sede || "Por confirmar")}</span>
            ${ev.end > ev.start ? `<span>${icon("calendar")}${rangeText(ev)}</span>` : ""}
          </div>
          ${ev.description ? `<p class="day-event-desc">${esc(ev.description)}</p>` : ""}
          <button type="button" class="btn btn-secondary btn-sm" data-open-subject="${esc(ev.subjectId)}">${icon("book")}<span>Abrir asignatura</span></button>
        </li>`;
      }).join("")}</ul>`;
    }

    /* ====================================================================
       AGENDA (lista cronológica con cuenta atrás)
       ==================================================================== */
    renderAgenda() {
      const sel = this.selected ? parseISO(this.selected) : null;
      const item = (ev) => {
        const t = TYPE[ev.type] || TYPE.clase;
        const c = this.countdown(ev);
        const active = sel && ev.start <= sel && ev.end >= sel;
        return `<button type="button" class="agenda-item type-${ev.type}${active ? " active" : ""}" data-date="${toISO(ev.start)}" style="--c:${esc(ev.color)}">
          <span class="agenda-date"><b>${ev.start.getDate()}</b><small>${fmtShort.format(ev.start).replace(/^\d+\s*/, "").replace(".", "")}</small></span>
          <span class="agenda-body">
            <span class="agenda-top"><strong>${esc(ev.short)}</strong><span class="badge ${t.badge}">${ev.type === "examen" ? "Examen" : ev.type === "presencial" ? "Presencial" : "Distancia"}</span><span class="badge ${c.cls} agenda-count">${c.text}</span></span>
            <span class="agenda-title">${esc(ev.title)}</span>
            <span class="agenda-meta">${rangeText(ev)} · ${esc(ev.sede || "")}</span>
          </span>
        </button>`;
      };

      const vis = this.visible();
      const upcoming = vis.filter((e) => e.end >= this.today);
      const past = vis.filter((e) => e.end < this.today);

      this.el.feed.innerHTML =
        (upcoming.length ? upcoming.map(item).join("") : `<p class="day-empty">No quedan fechas próximas.</p>`) +
        (past.length ? `<details class="agenda-past"><summary>Ver ${past.length} anteriores</summary>${past.map(item).join("")}</details>` : "");
    }

    /* ====================================================================
       EXPORTAR A .ICS (Google Calendar, Apple Calendar, Outlook, móvil)
       ==================================================================== */
    exportToICS() {
      const escText = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
      const fold = (line) => {                          // RFC 5545: líneas de máx. 75 caracteres
        if (line.length <= 73) return line;
        const out = [line.slice(0, 73)];
        for (let i = 73; i < line.length; i += 72) out.push(" " + line.slice(i, i + 72));
        return out.join("\r\n");
      };
      const ymd = (d) => toISO(d).replace(/-/g, "");
      const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Master Fisica Nuclear UCM//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Máster Física Nuclear"];
      this.events.forEach((ev) => {
        lines.push(
          "BEGIN:VEVENT",
          `UID:${ev.id}@master-fisica-nuclear`,
          `DTSTAMP:${stamp}`,
          `DTSTART;VALUE=DATE:${ymd(ev.start)}`,
          `DTEND;VALUE=DATE:${ymd(addDays(ev.end, 1))}`,       // DTEND de día completo es exclusivo
          `SUMMARY:${escText(`[${ev.short}] ${ev.title}`)}`,
          `LOCATION:${escText(ev.sede)}`,
          `DESCRIPTION:${escText(ev.description)}`,
          "STATUS:CONFIRMED",
          "END:VEVENT"
        );
      });
      lines.push("END:VCALENDAR");

      const blob = new Blob([lines.map(fold).join("\r\n")], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "calendario-fisica-nuclear-ucm.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
  }

  window.AcademicCalendar = AcademicCalendar;
})();
