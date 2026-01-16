// Zgjedhja e elementeve DOM: 
// - të gjitha elementet me klasën 'faq' 
// - fusha e kërkimit me id 'searchInput'
const faqItems = document.querySelectorAll('.faq');     
const searchInput = document.getElementById('searchInput');      

// Vendosja e event listeners për çdo element FAQ
// Kur klikohet mbi pyetjen, hapet përgjigja përkatëse (toggle)
// Vetëm një FAQ mund të jetë e hapur në të njëjtën kohë
faqItems.forEach(faq => {       
  faq.querySelector('.faq-question').addEventListener('click', () => {         
    const isActive = faq.classList.contains('active');         
    // Mbyllen të gjitha FAQs e tjera
    faqItems.forEach(otherFaq => otherFaq.classList.remove('active'));         
    // Nëse elementi i klikuar nuk ishte aktiv, e bën atë aktiv
    if (!isActive) faq.classList.add('active');       
  });     
});      

// Funksionaliteti i kërkimit në FAQ
// Filtron pyetjet bazuar në tekstin e shkruar në fushën e kërkimit
searchInput.addEventListener('input', () => {       
  const filter = searchInput.value.toLowerCase();       
  faqItems.forEach(faq => {         
    const questionText = faq.querySelector('.faq-question span').textContent.toLowerCase();         
    // Shfaq ose fsheh elementin FAQ bazuar në përputhjen e tekstit të kërkimit
    faq.style.display = questionText.includes(filter) ? 'block' : 'none';       
  });     
});      

// Funksioni për të shfaqur/fshehur formularin e dërgimit të pyetjeve të reja
// Ndërron pamjen e formës nga e fshehur në të dukshme dhe anasjelltas
function toggleForm() {       
  const form = document.getElementById('faqForm');       
  form.style.display = form.style.display === 'flex' ? 'none' : 'flex';       
  form.style.flexDirection = 'column';     
}      

// Funksioni për të shfaqur udhëzuesin e prindërve
// Bën të dukshëm elementin me id 'parentGuide'
function showGuide() {       
  document.getElementById('parentGuide').style.display = 'block';     
}      

// Funksioni për të mbyllur udhëzuesin e prindërve
// Fshin elementin me id 'parentGuide'
function closeGuide() {       
  document.getElementById('parentGuide').style.display = 'none';     
}      

// Funksioni për të dërguar një pyetje të re
// Kontrollon nëse fusha nuk është e zbrazët, pastron vlerën dhe shfaq mesazhin e suksesit
function sendQuestion(event) {       
  event.preventDefault();       
  const input = document.getElementById('questionInput');       
  if (input.value.trim() !== '') {         
    input.value = '';         
    document.getElementById('successPopup').style.display = 'block';       
  }     
}      

// Funksioni për të mbyllur dritaren e suksesit pas dërgimit të pyetjes
// Fshin elementin me id 'successPopup'
function closeSuccess() {       
  document.getElementById('successPopup').style.display = 'none';     
}