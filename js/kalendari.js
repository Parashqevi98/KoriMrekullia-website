// Kalendari JavaScript - Kodi për kalendarin interaktiv të aktiviteteve të korit
const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const infoBox = document.getElementById("infoBox");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Array i eventeve të korit - mund të zëvendësohet me të dhëna dinamike nga serveri
const events = [
  { date: "2025-05-05", type: "provë", title: "Prova e Korit - Grupet A & B", location: "Salla e Muzik&euml;s", time: "16:00" },
  { date: "2025-05-12", type: "provë", title: "Prova Individuale - Solist&euml;t", location: "Studio A", time: "15:30" },
  { date: "2025-05-15", type: "provë", title: "Prova e P&euml;rgjithshme", location: "Salla Kryesore", time: "16:00" },
  { date: "2025-05-20", type: "koncert", title: "Koncert Pranveror", location: "Teatri Komb&euml;tar", time: "18:30" },
  { date: "2025-05-25", type: "prindër", title: "Takim p&euml;r Prind&euml;rit - Projektet Verore", location: "Salla e Konferencave", time: "17:00" },
  { date: "2025-06-02", type: "prindër", title: "Workshop p&euml;r Prind&euml;rit dhe F&euml;mij&euml;t", location: "Klasa 4B", time: "17:00" },
  { date: "2025-06-10", type: "provë", title: "Prova p&euml;r Festivalin", location: "Salla Kryesore", time: "16:30" },
  { date: "2025-06-15", type: "koncert", title: "Festival i Koreve p&euml;r F&euml;mij&euml;", location: "Parku i Qytetit", time: "11:00" }
];

// Funksioni kryesor për krijimin dhe shfaqjen e kalendarit bazuar në muajin dhe vitin aktual
function renderCalendar() {
  calendar.innerHTML = "";
  // Krijon një objekt datë për ditën e parë të muajit aktual
  const date = new Date(currentYear, currentMonth, 1);
  
  // Llogarit ditën e javës kur fillon muaji dhe e përshtat për sistemin europian (e hënë - e diel)
  // Standardizimi i ditëve të javës: 0=e hënë, 6=e diel (ndryshe nga JavaScript standard)
  let firstDay = date.getDay();
  if (firstDay === 0) firstDay = 7; // Konverton 0 (e diel) në 7
  firstDay -= 1; // Përshtat indeksin për të filluar nga 0 (e hënë)
  
  // Rivendos lartësinë e kalendarit para ripopullimit për të shmangur zgjerimin e panevojshëm
  calendar.style.height = "auto";
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  const filters = getActiveFilters();
  
  // Përditëson etiketën e muajit dhe vitit në krye të kalendarit
  monthLabel.textContent = date.toLocaleDateString("sq-AL", { month: "long", year: "numeric" }).toUpperCase();
  
  // Shton kutitë bosh për ditët para fillimit të muajit
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "empty-day"; // Kutitë bosh për balancim vizual
    calendar.appendChild(emptyDay);
  }
  
  // Krijon kutitë për çdo ditë të muajit aktual me përmbajtjen përkatëse
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.setAttribute("data-date", fullDate);
    
    // Shton klasë speciale për ditën e sotme për theksim vizual
    const isToday = today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    if (isToday) {
      dayDiv.classList.add("today");
    }
    
    // Shton numrin e ditës në kuadrat
    dayDiv.innerHTML = `<div class="label">${i}</div>`;
    
    // Filtron eventet përkatëse për këtë ditë duke aplikuar filtrat aktive
    const todaysEvents = events.filter(e => 
      e.date === fullDate && (filters.length === 0 || filters.includes(e.type))
    );
    
    // Konfiguron shfaqjen e eventeve (maksimum 2 për dukshmëri të mirë)
    const maxVisibleEvents = 2;
    const visibleEvents = todaysEvents.slice(0, maxVisibleEvents);
    const remainingCount = todaysEvents.length - maxVisibleEvents;
    
    // Shton eventet e dukshme në kutinë e ditës
    visibleEvents.forEach(e => {
      const ev = document.createElement("div");
      ev.className = `event event-${e.type.replace('ë', 'e')}`;
      ev.textContent = e.title;
      dayDiv.appendChild(ev);
    });
    
    // Nëse ka më shumë evente se sa mund të shfaqen, tregon numrin e atyre që mbeten
    if (remainingCount > 0) {
      const moreIndicator = document.createElement("div");
      moreIndicator.className = "more-events";
      moreIndicator.textContent = `+ ${remainingCount} t&euml; tjera`;
      dayDiv.appendChild(moreIndicator);
    }
    
    // Shton event listener për klikimin mbi ditë për të shfaqur informacion të detajuar
    dayDiv.addEventListener("click", () => {
      // Hiq statusin aktiv nga të gjitha ditët e tjera
      document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
      // Bën këtë ditë aktive
      dayDiv.classList.add("active");
      // Shfaq detajet e eventeve ose njoftimin për mungesë eventesh
      showInfo(todaysEvents.length ? todaysEvents : null, i, currentMonth, currentYear);
    });
    
    calendar.appendChild(dayDiv);
  }
}

// Funksioni për marrjen e filtrave aktive të zgjedhur nga përdoruesi
function getActiveFilters() {
  return Array.from(document.querySelectorAll(".filterCheck:checked")).map(i => i.value);
}

// Funksioni për aplikimin e filtrave dhe përditësimin e pamjes së kalendarit
function applyFilters() {
  renderCalendar();
}

// Funksioni për kërkimin dhe kontrollin e një date specifike të zgjedhur nga përdoruesi
function checkSelectedDate() {
  const inputDate = document.getElementById("dateInput").value;
  if (!inputDate) {
    alert("Ju lutem zgjidhni nj&euml; dat&euml;!");
    return;
  }
  
  const selected = new Date(inputDate);
  const filteredEvents = events.filter(e => e.date === inputDate);
  
  // Përditëson muajin dhe vitin aktual bazuar në datën e zgjedhur
  currentMonth = selected.getMonth();
  currentYear = selected.getFullYear();
  
  // Ripërtërit kalendarin me muajin e ri
  renderCalendar();
  
  // Gjen dhe aktivizon elementën e ditës së zgjedhur
  const dayElement = document.querySelector(`[data-date="${inputDate}"]`);
  if (dayElement) {
    dayElement.classList.add("active");
    showInfo(filteredEvents.length ? filteredEvents : null, selected.getDate(), currentMonth, currentYear);
    // Siguron që dita e zgjedhur është e dukshme në ekran
    dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Funksioni për shfaqjen e informacionit të detajuar për eventet e një dite
function showInfo(eventList, day, month, year) {
  if (!eventList || eventList.length === 0) {
    const date = new Date(year, month, day);
    const dateStr = date.toLocaleDateString("sq-AL", { day: 'numeric', month: 'long', year: 'numeric' });
    
    infoBox.innerHTML = `
      <h3>Detaje p&euml;r ${dateStr}</h3>
      <p>Nuk ka aktivitete t&euml; planifikuara p&euml;r k&euml;t&euml; dat&euml;.</p>
    `;
    return;
  }
  
  const date = new Date(year, month, day);
  const dateStr = date.toLocaleDateString("sq-AL", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  let infoHTML = `<h3>Detaje p&euml;r ${dateStr}</h3>`;
  
  // Paraqet çdo event me detajet përkatëse dhe ikonat ilustruese
  eventList.forEach((event, index) => {
    let eventType = "";
    switch(event.type) {
      case "provë":
        eventType = "Prov&euml;";
        break;
      case "koncert":
        eventType = "Koncert";
        break;
      case "prindër":
        eventType = "Takim Prind&euml;rish";
        break;
      default:
        eventType = "Aktivitet";
    }
    
    infoHTML += `
      <div class="event-details">
        <p><strong>${event.title}</strong></p>
        <p><i class="fas fa-tag"></i> ${eventType}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
        <p><i class="fas fa-clock"></i> Ora ${event.time}</p>
      </div>
    `;
    
    // Shton vijë ndarëse ndërmjet eventeve të shumta
    if (index < eventList.length - 1) {
      infoHTML += `<hr>`;
    }
  });
  
  infoBox.innerHTML = infoHTML;
}

// Funksioni për lëvizjen në muajin paraardhës
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

// Funksioni për lëvizjen në muajin pasardhës
function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

// Funksioni për vendosjen e datës aktuale në zgjedhësin e datave
function setTodayInDatePicker() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  document.getElementById("dateInput").value = `${year}-${month}-${day}`;
}

// Inicializimi i kalendarit kur ngarkohet faqja
document.addEventListener("DOMContentLoaded", function() {
  setTodayInDatePicker();
  renderCalendar();
});