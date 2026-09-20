/**
 * ====================================================================
 * CALENDARIO ACADÉMICO & GESTOR DE ENTREGAS (CALENDAR.JS)
 * ====================================================================
 */

class AcademicCalendar {
  constructor(events, containerSelector, feedSelector) {
    this.events = events || [];
    this.container = document.querySelector(containerSelector);
    this.feedContainer = document.querySelector(feedSelector);
    
    // Fecha inicial (usamos septiembre de 2026 como referencia del curso)
    const initialDate = new Date();
    // Si la fecha actual no está en el año académico, tomamos septiembre 2026
    this.currentYear = initialDate.getFullYear() >= 2026 ? initialDate.getFullYear() : 2026;
    this.currentMonth = initialDate.getMonth(); // 0 = Enero, 8 = Septiembre

    this.monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    this.dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

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
    return this.events.filter(ev => ev.date === formatted);
  }

  renderMonth() {
    if (!this.container) return;

    const monthTitle = document.getElementById("calendar-month-year");
    if (monthTitle) {
      monthTitle.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
    // Ajuste para que la semana empiece en Lunes (0 = Domingo en JS -> pasar Lunes a 0)
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
          ${dayEvents.map(ev => `<span class="event-dot dot-${ev.type}" title="${ev.title}"></span>`).join("")}
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

    // Listeners en celdas
    this.container.querySelectorAll(".calendar-cell:not(.other-month)").forEach(cell => {
      cell.addEventListener("click", () => {
        const day = cell.getAttribute("data-day");
        const events = this.getEventsForDate(this.currentYear, this.currentMonth, parseInt(day));
        if (events.length > 0) {
          alert(`📌 Eventos del ${day} de ${this.monthNames[this.currentMonth]}:\n\n` + 
            events.map(e => `• [${e.type.toUpperCase()}] ${e.title} (${e.subjectName}) a las ${e.time}\n  ${e.description}`).join("\n\n"));
        }
      });
    });
  }

  renderDeadlinesFeed() {
    if (!this.feedContainer) return;

    // Ordenar eventos por fecha más cercana
    const sorted = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = "";

    sorted.forEach(ev => {
      const eventDate = new Date(ev.date + "T00:00:00");
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let badgeClass = "countdown-normal";
      let countdownText = `En ${diffDays} días`;

      if (diffDays === 0) {
        badgeClass = "countdown-imminent";
        countdownText = "¡Vence hoy!";
      } else if (diffDays === 1) {
        badgeClass = "countdown-imminent";
        countdownText = "Mañana";
      } else if (diffDays < 0) {
        badgeClass = "badge-subtle";
        countdownText = "Concluido";
      } else if (diffDays <= 7) {
        badgeClass = "countdown-soon";
        countdownText = `En ${diffDays} días`;
      }

      const typeBadgeClass = ev.type === "examen" ? "badge-rose" : (ev.type === "entrega" ? "badge-sky" : "badge-amber");

      html += `
        <div class="deadline-item">
          <div class="deadline-item-top">
            <span class="badge ${typeBadgeClass}">${ev.type}</span>
            <span class="countdown-badge ${badgeClass}">${countdownText}</span>
          </div>
          <div class="deadline-item-title">${ev.title}</div>
          <div class="deadline-item-meta">
            <span>📚 ${ev.subjectName}</span>
            <span>📅 ${ev.date} (${ev.time})</span>
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
      "PRODID:-//Portal Academico Master//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    this.events.forEach(ev => {
      const cleanDate = ev.date.replace(/-/g, "");
      icsContent.push("BEGIN:VEVENT");
      icsContent.push(`SUMMARY:[${ev.subjectName}] ${ev.title}`);
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
    link.setAttribute("download", "calendario-master.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.AcademicCalendar = AcademicCalendar;
