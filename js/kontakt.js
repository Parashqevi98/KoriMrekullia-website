document.addEventListener('DOMContentLoaded', function() {
    // Pret ngarkimin e plotë të faqes para ekzekutimit të kodit
    // Kontrollon nëse libraria EmailJS është e disponueshme në faqe
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS nuk &euml;sht&euml; ngarkuar. Ju lutemi sigurohuni q&euml; skripti i EmailJS &euml;sht&euml; i p&euml;rfshir&euml; n&euml; faqen tuaj.');
        return;
    }

    // Zgjedh formularin e kontaktit nga DOM
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Formulari i kontaktit nuk u gjet n&euml; faqe.');
        return;
    }
    
    // Vendos dëgjuesin e eventit për submit në formular
    // Kaplon dërgimin standard të formularit për validim dhe dërgim me AJAX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Merr vlerat nga fushat e formularit dhe heq hapësirat e panevojshme
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Variabël për gjurmimin e gjendjes së validimit
        let isValid = true;
        
        // Validimi i emrit - kontrollon nëse është i plotësuar dhe me gjatësi të mjaftueshme
        if (firstName === '') {
            displayError('firstName', 'Emri &euml;sht&euml; i detyruesh&euml;m');
            isValid = false;
        } else if (firstName.length < 2) {
            displayError('firstName', 'Emri duhet t&euml; ket&euml; t&euml; pakt&euml;n 2 karaktere');
            isValid = false;
        } else {
            clearError('firstName');
        }
        
        // Validimi i mbiemrit - kontrollon nëse është i plotësuar dhe me gjatësi të mjaftueshme
        if (lastName === '') {
            displayError('lastName', 'Mbiemri &euml;sht&euml; i detyruesh&euml;m');
            isValid = false;
        } else if (lastName.length < 2) {
            displayError('lastName', 'Mbiemri duhet t&euml; ket&euml; t&euml; pakt&euml;n 2 karaktere');
            isValid = false;
        } else {
            clearError('lastName');
        }
        
        // Validimi i emailit - kontrollon formatin e adresës me regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            displayError('email', 'Email-i &euml;sht&euml; i detyruesh&euml;m');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            displayError('email', 'Ju lutemi, vendosni nj&euml; email t&euml; vlefsh&euml;m');
            isValid = false;
        } else {
            clearError('email');
        }
        
        // Validimi i numrit të telefonit - opsional por kontrollon formatin shqiptar kur plotësohet
        if (phone !== '') {
            // Format shqiptar: +355 6X XXX XXXX ose 06X XXX XXXX
            const phoneRegex = /^(\+355|0)6[789]\d{7}$/;
            
            // Heq hapësirat dhe vizat për validim
            const cleanPhone = phone.replace(/[\s-]/g, '');
            
            if (!phoneRegex.test(cleanPhone)) {
                displayError('phone', 'Vendosni nj&euml; num&euml;r telefoni shqiptar t&euml; vlefsh&euml;m');
                isValid = false;
            } else {
                clearError('phone');
            }
        } else {
            clearError('phone');
        }
        
        // Validimi i mesazhit - kontrollon nëse është i plotësuar dhe me gjatësi të mjaftueshme
        if (message === '') {
            displayError('message', 'Mesazhi &euml;sht&euml; i detyruesh&euml;m');
            isValid = false;
        } else if (message.length < 10) {
            displayError('message', 'Mesazhi duhet t&euml; ket&euml; t&euml; pakt&euml;n 10 karaktere');
            isValid = false;
        } else {
            clearError('message');
        }
        
        // Nëse të gjitha fushat janë valide, vazhdon me dërgimin e formularit
        if (isValid) {
            // Shfaq indikator ngarkimi dhe çaktivizon butonin për të parandaluar dërgime të shumëfishta
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Duke d&euml;rguar...';
            submitButton.disabled = true;
            
            // Përgatit parametrat për dërgimin me EmailJS
            const templateParams = {
                from_name: firstName + ' ' + lastName,
                from_email: email,
                phone_number: phone,
                message: message,
                to_name: 'Kori Mrekullia'
            };
            
            // Dërgon emailin duke përdorur shërbimin dhe shablonin e konfiguruar në EmailJS
            emailjs.send('service_kontakt', 'template_kontakt', templateParams, 'gUkoXUUMokZRiEgt9')
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    // Pastron formularin pas dërgimit të suksesshëm
                    form.reset();
                    // Shfaq mesazhin e suksesit
                    showSuccessMessage();
                }, function(error) {
                    console.log('FAILED...', error);
                    // Shfaq mesazhin e gabimit nëse diçka shkoi keq
                    showErrorMessage('Ndodhi nj&euml; gabim gjat&euml; d&euml;rgimit t&euml; mesazhit. Ju lutemi provoni p&euml;rs&euml;ri.');
                })
                .finally(function() {
                    // Kthen butonin në gjendjen fillestare pas përfundimit të dërgimit
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        }
    });
    
    // Funksioni për shfaqjen e mesazheve të gabimit për fusha individuale
    function displayError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
        }
    }
    
    // Funksioni për fshirjen e mesazheve të gabimit
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
        }
    }
    
    // Funksioni për krijimin dhe shfaqjen e mesazhit të suksesit
    function showSuccessMessage() {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = 'Faleminderit! Mesazhi juaj u d&euml;rgua me sukses.';
        
        // Vendos mesazhin para formularit në DOM
        form.parentNode.insertBefore(messageContainer, form);
        
        // Fshin mesazhin automatikisht pas 5 sekondash
        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
    }
    
    // Funksioni për krijimin dhe shfaqjen e mesazhit të gabimit
    function showErrorMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'error-message-global';
        messageContainer.textContent = message;
        
        // Vendos mesazhin para formularit në DOM
        form.parentNode.insertBefore(messageContainer, form);
        
        // Fshin mesazhin automatikisht pas 5 sekondash
        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
    }
});