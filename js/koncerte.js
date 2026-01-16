// JavaScript për faqen e koncerteve të korit "Mrekullia"
// Kodi përmban funksionalitetet kryesore për sliderit e eventeve, interaksionet e videos dhe animacionet e kartave

// Ngarkon funksionet kryesore kur faqja është plotësisht e ngarkuar
document.addEventListener('DOMContentLoaded', function() {
  initEventSlider();    // Inicion sliderin për eventet e ardhshme
  setupVideoInteractions();    // Konfigurimi i interaksioneve me video
});

// Funksioni për krijimin dhe menaxhimin e sliderit të eventeve të ardhshme
function initEventSlider() {
  // Zgjedhja e elementeve DOM të nevojshëm për sliderin
  const slider = document.getElementById('eventSlider');    // Kontejneri kryesor i sliderit
  const slides = slider.querySelectorAll('.event-slide');    // Të gjitha slajdet brenda sliderit
  const prevBtn = document.getElementById('prevBtn');    // Butoni për slajdin e mëparshëm
  const nextBtn = document.getElementById('nextBtn');    // Butoni për slajdin e ardhshëm
  
  // Variablat për gjurmimin e slajdit aktual dhe numrin total të slajdeve
  let currentSlide = 0;    // Slajdi aktual fillimisht është 0 (i pari)
  const totalSlides = slides.length;    // Numri total i slajdeve
  
  // Funksioni për përditësimin e pozicionit të slajdeve duke përdorur CSS transform
  // Çdo slajd zhvendoset horizontalisht bazuar në pozicionin e tij në krahasim me slajdin aktual
  function updateSlider() {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
  }
  
  // Ngjarje për klikimin e butonit të mëparshëm
  // Përdor operacion modulo për të krijuar një rreth të mbyllur gjatë navigimit
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;    // Kalon në slajdin e mëparshëm, ose të fundit nëse jemi në të parin
    updateSlider();    // Përditëson pamjen e sliderit
  });
  
  // Ngjarje për klikimin e butonit të ardhshëm
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;    // Kalon në slajdin e ardhshëm, ose të parin nëse jemi në të fundit
    updateSlider();    // Përditëson pamjen e sliderit
  });
  
  // Inicializimi fillestar i sliderit për të vendosur pozicionet e sakta të slajdeve
  updateSlider();
  
  // Funksionaliteti i auto-play: ndërron slajdet automatikisht çdo 5 sekonda
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;    // Kalon në slajdin e ardhshëm
    updateSlider();    // Përditëson pamjen e sliderit
  }, 5000);    // Intervali 5000 milisekonda = 5 sekonda
}

// Funksioni për konfigurimin e interaksioneve të elementit video
function setupVideoInteractions() {
  // Merr elementin e videos nga DOM
  const video = document.getElementById('koncert-video');
  
  // Shton klasë për ndryshimin e sfondis kur video fillon të luhet
  video.addEventListener('play', () => {
    video.closest('.video-wrapper').classList.add('video-playing');    // Shton klasën për stilizim gjatë luajtjes
  });
  
  // Heq klasën kur video ndalohet
  video.addEventListener('pause', () => {
    video.closest('.video-wrapper').classList.remove('video-playing');    // Heq klasën kur ndërpritet luajtja
  });
  
  // Efekti hover: shton klasë për animacion kur kursori kalon mbi video
  video.addEventListener('mouseenter', () => {
    video.classList.add('hover-effect');    // Aktivizon efektin hover
  });
  
  // Heq efektin hover kur kursori largohet nga video
  video.addEventListener('mouseleave', () => {
    video.classList.remove('hover-effect');    // Çaktivizon efektin hover
  });
}

// Dallimi i kartave të eventeve kur përdoruesi lëviz në faqe (scroll)
// Aktivizon animacionet e kartave kur ato bëhen të dukshme në ekran
document.addEventListener('scroll', function() {
  // Zgjedh të gjitha kartat e eventeve
  const eventCards = document.querySelectorAll('.event-card');
  
  // Kontrollon çdo kartë për të parë nëse është e dukshme në ekran
  eventCards.forEach(card => {
    const cardPosition = card.getBoundingClientRect();    // Merr pozicionin e kartës në raport me dritaren e shfletuesit
    
    // Nëse karta është në 80% e lartësisë së dritares dhe është ende e dukshme
    if(cardPosition.top < window.innerHeight * 0.8 && cardPosition.bottom >= 0) {
      card.classList.add('animate-card');    // Shton klasën për animacion
    }
  });
});

// Funksioni për animimin gradual të kartave të eventeve
// Aktivizon kartat njëra pas tjetrës me një vonesë të caktuar
function animateCards() {
  // Zgjedh të gjitha kartat e eventeve
  const eventCards = document.querySelectorAll('.event-card');
  
  // Për çdo kartë, vendos një vonesë të ndryshme për shfaqjen e saj
  eventCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');    // Bën kartën të dukshme pas një vonese të caktuar
    }, 200 * index);    // Vonesa rritet me 200ms për çdo kartë të rradhës (efekt kaskadë)
  });
}

// Aktivizon animacionin e kartave pasi faqja të jetë ngarkuar plotësisht
window.addEventListener('load', animateCards);

// Konfigurime shtesë për efektet vizuale CSS
document.addEventListener('DOMContentLoaded', function() {
  // Merr timeline-in e eventeve dhe kartat brenda tij
  const eventsTimeline = document.querySelector('.events-timeline');
  const cards = eventsTimeline.querySelectorAll('.event-card');
  
  // Shton klasën për efektin e zbehjes graduale në kartat
  cards.forEach(card => {
    card.classList.add('fade-in-card');    // Efekti i shfaqjes graduale
  });
  
  // Shton efekte vizuale për kontejnerin e sliderit të eventeve të ardhshme
  const sliderContainer = document.querySelector('.upcoming-events');
  sliderContainer.classList.add('slider-container-effects');    // Përmirëson pamjen e kontejnerit të sliderit
});