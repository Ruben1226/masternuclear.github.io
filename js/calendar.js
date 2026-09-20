/**
 * ====================================================================
 * CALENDARIO ACADÉMICO & CRONOGRAMA DE SEMANAS INTENSIVAS (CALENDAR.JS)
 * ====================================================================
 */

class AcademicCalendar {
  constructor(events, containerSelector, feedSelector) {
    this.events = events || [];
    this.container = document.querySelector(containerSelector);
    this.feedContainer = document.querySelector(feedSelector);
    
    // Inicio en octubre de 2026 (mes en el que arrancan las clases intensivas del máster)
    this.currentYear = 2026;
    this.currentMonth = 9; // Octubre (0 = Enero, 9 = Octubre)

    this.monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    this.dayNames = ["L", "M", "X", "J", "V", "S", "D"];

    this.init();
  }

  init() {
    this.renderMonth();
    this.renderDeadlinesFeed();
    this.setupExportButton();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderMonth();
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderMonth();
  }

  getEventsForDate(year, month, day) {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return this.events.filter(ev => {
      if (ev.date === formatted) return true;
      if (ev.endDate) {
        return formatted >= ev.date && formatted <= ev.endDate;
      }
      return false;
    });
  }

  renderMonth() {
    if (!this.container) return;

    const monthTitle = document.getElementById("calendar-month-year");
    if (monthTitle) {
      monthTitle.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const startingDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

    let html = `
      <div class="calendar-grid">
        ${this.dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join("")}
    `;

    // Días del mes anterior
    for (let i = startingDay - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      html += `
        <div class="calendar-cell other-month">
          <span class="calendar-day-num">${dayNum}</span>
        </div>
      `;
    }

    const today = new Date();
    const isThisMonth = today.getFullYear() === this.currentYear && today.getMonth() === this.currentMonth;

    // Días del mes actual
    for (let day = 1; day <= totalDays; day++) {
      const isToday = isThisMonth && today.getDate() === day;
      const dayEvents = this.getEventsForDate(this.currentYear, this.currentMonth, day);

      let dotsHtml = "";
      if (dayEvents.length > 0) {
        dotsHtml = `<div class="calendar-cell-dots">
          ${dayEvents.slice(0, 3).map(ev => `<span class="event-dot dot-${ev.type}" title="${ev.title}"></span>`).join("")}
        </div>`;
      }

      html += `
        <div class="calendar-cell ${isToday ? 'today' : ''}" data-day="${day}" title="${dayEvents.length > 0 ? dayEvents.map(e => e.title).join(' | ') : ''}">
          <span class="calendar-day-num">${day}</span>
          ${dotsHtml}
        </div>
      `;
    }

    // Completar última fila
    const remainingCells = 42 - (startingDay + totalDays);
    if (remainingCells < 7) {
      for (let i = 1; i <= remainingCells; i++) {
        html += `
          <div class="calendar-cell other-month">
            <span class="calendar-day-num">${i}</span>
          </div>
        `;
      }
    }

    html += `</div>`;
    this.container.innerHTML = html;

    // Listeners al pulsar celdas
    this.container.querySelectorAll(".calendar-cell:not(.other-month)").forEach(cell => {
      cell.addEventListener("click", () => {
        const day = cell.getAttribute("data-day");
        const events = this.getEventsForDate(this.currentYear, this.currentMonth, parseInt(day));
        if (events.length > 0) {
          alert(`📌 ${day} de ${this.monthNames[this.currentMonth]} (${this.currentYear}):\n\n` + 
            events.map(e => `• [${e.subjectName}] ${e.title}\n  📍 Sede: ${e.sede}\n  ${e.description}`).join("\n\n"));
        }
      });
    });
  }

  renderDeadlinesFeed() {
    if (!this.feedContainer) return;

    // Filtrar entregas y exámenes prioritarios
    const deadlines = this.events
      .filter(e => e.type === "examen" || e.type === "presencial")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = "";

    deadlines.forEach(ev => {
      const eventDate = new Date(ev.date + "T00:00:00");
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let badgeClass = "badge-blue";
      let countdownText = `En ${diffDays} días`;

      if (diffDays === 0) {
        badgeClass = "badge-rose";
        countdownText = "¡Hoy!";
      } else if (diffDays === 1) {
        badgeClass = "badge-rose";
        countdownText = "Mañana";
      } else if (diffDays < 0) {
        badgeClass = "badge-neutral";
        countdownText = "Finalizado";
      } else if (diffDays <= 14) {
        badgeClass = "badge-amber";
        countdownText = `En ${diffDays} días`;
      }

      const typeLabel = ev.type === "examen" ? "Límite / Examen" : "Fase Presencial";
      const typeBadge = ev.type === "examen" ? "badge-rose" : "badge-blue";

      html += `
        <div class="deadline-item">
          <div class="deadline-item-top">
            <span class="badge ${typeBadge}">${typeLabel}</span>
            <span class="badge ${badgeClass}">${countdownText}</span>
          </div>
          <div class="deadline-item-title">${ev.subjectName}</div>
          <div class="deadline-item-meta">
            <span>📍 ${ev.sede}</span>
            <span>📅 ${ev.date}</span>
          </div>
        </div>
      `;
    });

    this.feedContainer.innerHTML = html;
  }

  setupExportButton() {
    const exportBtn = document.getElementById("btn-export-calendar");
    if (!exportBtn) return;

    exportBtn.addEventListener("click", () => {
      this.exportToICS();
    });
  }

  exportToICS() {
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Master Fisica Nuclear UCM//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    this.events.forEach(ev => {
      const cleanDate = ev.date.replace(/-/g, "");
      icsContent.push("BEGIN:VEVENT");
      icsContent.push(`SUMMARY:[${ev.subjectName}] ${ev.title}`);
      icsContent.push(`LOCATION:${ev.sede}`);
      icsContent.push(`DESCRIPTION:${ev.description}`);
      icsContent.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      icsContent.push(`DTEND;VALUE=DATE:${cleanDate}`);
      icsContent.push(`STATUS:CONFIRMED`);
      icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "calendario-fisica-nuclear-ucm.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.AcademicCalendar = AcademicCalendar;
