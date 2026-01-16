document.addEventListener('DOMContentLoaded', function() {
  // Shfaq menjëherë butonat në pajisjet mobile për një përvojë më të mirë përdoruesi
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.donate-btn').forEach(btn => {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    });
  }
  
  // Inicializon librarinë EmailJS me çelësin publik
  emailjs.init("gUkoXUUMokZRiEgt9");
});

// Funksioni për hapjen e formularit të mbështetjes/donacionit
function openForm(type) {
  document.getElementById('popupForm').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('formTypeSelect').value = type;
  
  // Vendos fokusin tek fusha e parë për një përvojë më të mirë
  setTimeout(() => {
    document.querySelector('#supportForm input[name="emri"]').focus();
  }, 100);
  
  // Shton klasën për animacionin e hyrjes
  document.getElementById('popupForm').classList.add('fade-in');
  
  // Parandalon lëvizjen e sfondit
  document.body.style.overflow = 'hidden';
}

// Funksioni për mbylljen e formularit
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  
  // Rivendos lëvizjen normale të faqes
  document.body.style.overflow = 'auto';
}

// Funksioni për mbylljen e dritares së suksesit
function closeSuccess() {
  document.getElementById('successPopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  
  // Rivendos lëvizjen normale të faqes
  document.body.style.overflow = 'auto';
}

// Vendos event listener për dërgimin e formularit
document.getElementById('supportForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Kontrollon validimin e formës
  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }
  
  // Shfaq mesazhin e ngarkimit dhe çaktivizon butonin
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Duke d&euml;rguar...';
  submitBtn.disabled = true;
  
  // Merr të dhënat e formularit
  const formData = new FormData(this);
  const supportType = formData.get('lloji');
  const templateParams = {
    emri: formData.get('emri'),
    mbiemri: formData.get('mbiemri'),
    email: formData.get('email'),
    telefoni: formData.get('telefoni'),
    lloji: supportType,
    mesazhi: formData.get('mesazhi')
  };
  
  // Dërgon email duke përdorur EmailJS
  emailjs.send('default_service', 'template_support', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      closeForm();
      document.getElementById('successPopup').style.display = 'block';
      document.getElementById('overlay').style.display = 'block';
      
      // Rivendos formularin
      document.getElementById('supportForm').reset();
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }, function(error) {
      console.log('FAILED...', error);
      alert('Ndodhi nj&euml; gabim. Ju lutemi provoni p&euml;rs&euml;ri m&euml; von&euml;.');
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    });
});

// Mbyll dritaren kur shtypet butoni ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('popupForm').style.display === 'block') {
      closeForm();
    }
    if (document.getElementById('successPopup').style.display === 'block') {
      closeSuccess();
    }
  }
});

// Shton stilizime CSS për animacione
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -60%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  
  .popup-form, .success-popup {
    transition: opacity 0.3s, transform 0.3s;
  }
`;
document.head.appendChild(style);