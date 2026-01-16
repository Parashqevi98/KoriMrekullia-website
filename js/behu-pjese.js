// Funksion ndihmës për të marrë tekstin e nivelit të kursit
function getCourseLevelText() {
    if (document.getElementById('beginner') && document.getElementById('beginner').checked) {
        return 'Fillestare (4-9 vjeç)';
    } else if (document.getElementById('intermediate') && document.getElementById('intermediate').checked) {
        return 'I mesëm (10-12 vjeç)';
    } else if (document.getElementById('advanced') && document.getElementById('advanced').checked) {
        return 'I avancuar (13-15 vjeç)';
    }
    return 'Nuk është zgjedhur';
}

// Ngjarje që ekzekutohet kur dokumenti është plotësisht i ngarkuar
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM i ngarkuar - duke inicializuar formën...");
    
    const form = document.getElementById('joinForm');
    
    if (form) {
        console.log("Forma u gjet, duke shtuar event listener...");
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Forma u dorëzua");
            
            // Resetimi i mesazheve të mëparshme të gabimit
            clearErrors();
            
            // Validimi i formës
            const isValid = validateForm();
            console.log("Validimi i formës:", isValid);
            
            if (isValid) {
                // Dërgimi i email-it me të dhënat e formës
                sendFormDataByEmail();
            }
        });
    } else {
        console.log("GABIM: Forma me ID 'joinForm' nuk u gjet");
    }
    
    // Konfigurimi i fushave të ngarkimit të skedarëve
    setupFileInputs();
    
    // Shtimi i dëgjuesve të ngjarjeve për validimin në kohë reale
    addInputValidationListeners();
});

// Funksion për konfigurimin e fushave të ngarkimit të skedarëve
function setupFileInputs() {
    // Fusha për foton e fëmijës
    const childPhotoInput = document.getElementById('childPhoto');
    const childPhotoName = document.getElementById('childPhotoName');
    
    if (childPhotoInput && childPhotoName) {
        childPhotoInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                childPhotoName.textContent = this.files[0].name;
                validateFileType(this, 'childPhotoError', ['image/jpeg', 'image/png', 'image/jpg'], 5);
            } else {
                childPhotoName.textContent = 'Asnjë skedar i zgjedhur';
            }
        });
    }
    
    // Fusha për dokumentet
    const documentsInput = document.getElementById('documents');
    const documentsName = document.getElementById('documentsName');
    
    if (documentsInput && documentsName) {
        documentsInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                documentsName.textContent = this.files[0].name;
                validateFileType(this, 'documentsError', 
                    [
                        'application/pdf', 
                        'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ], 10);
            } else {
                documentsName.textContent = 'Asnjë skedar i zgjedhur';
            }
        });
    }
}

// Funksion për validimin e tipit dhe madhësisë së skedarëve
function validateFileType(fileInput, errorId, allowedTypes, maxSizeMB) {
    const errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileSize = file.size / (1024 * 1024); // Konvertimi në MB
        
        // Kontrollimi i tipit të skedarit
        if (!allowedTypes.includes(file.type)) {
            errorElement.textContent = 'Formati i skedarit nuk është i pranueshëm';
            fileInput.value = ''; // Pastrimi i fushës së skedarit
            
            if (fileInput.id === 'childPhoto' && document.getElementById('childPhotoName')) {
                document.getElementById('childPhotoName').textContent = 'Asnjë skedar i zgjedhur';
            } else if (fileInput.id === 'documents' && document.getElementById('documentsName')) {
                document.getElementById('documentsName').textContent = 'Asnjë skedar i zgjedhur';
            }
            
            return false;
        }
        
        // Kontrollimi i madhësisë së skedarit
        if (fileSize > maxSizeMB) {
            errorElement.textContent = `Madhësia e skedarit duhet të jetë më e vogël se ${maxSizeMB}MB`;
            fileInput.value = ''; // Pastrimi i fushës së skedarit
            
            if (fileInput.id === 'childPhoto' && document.getElementById('childPhotoName')) {
                document.getElementById('childPhotoName').textContent = 'Asnjë skedar i zgjedhur';
            } else if (fileInput.id === 'documents' && document.getElementById('documentsName')) {
                document.getElementById('documentsName').textContent = 'Asnjë skedar i zgjedhur';
            }
            
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }
    
    return true; // Nëse nuk është zgjedhur asnjë skedar, konsiderohet i vlefshëm (përveç nëse është i detyrueshëm)
}

// Shtimi i dëgjuesve të ngjarjeve për validim në kohë reale për të gjitha fushat
function addInputValidationListeners() {
    // Kontrollimi nëse elementet ekzistojnë para se të shtohen dëgjuesit e ngjarjeve
    const childNameInput = document.getElementById('childName');
    if (childNameInput) {
        childNameInput.addEventListener('input', function() {
            validateName(this, 'childNameError');
        });
    }
    
    const childBirthdateInput = document.getElementById('childBirthdate');
    if (childBirthdateInput) {
        childBirthdateInput.addEventListener('input', function() {
            validateBirthdate(this, 'childBirthdateError');
        });
    }
    
    const schoolInput = document.getElementById('school');
    if (schoolInput) {
        schoolInput.addEventListener('input', function() {
            validateRequired(this, 'schoolError', 'Ju lutem shkruani emrin e shkollës');
        });
    }
    
    const parentNameInput = document.getElementById('parentName');
    if (parentNameInput) {
        parentNameInput.addEventListener('input', function() {
            validateName(this, 'parentNameError');
        });
    }
    
    const relationshipInput = document.getElementById('relationship');
    if (relationshipInput) {
        relationshipInput.addEventListener('input', function() {
            validateRequired(this, 'relationshipError', 'Ju lutem shkruani marrëdhënien me fëmijën');
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhone(this, 'phoneError');
        });
    }
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this, 'emailError');
        });
    }
    
    // Shtimi i validimit për elementet select
    const timePreferenceSelect = document.getElementById('timePreference');
    if (timePreferenceSelect) {
        timePreferenceSelect.addEventListener('change', function() {
            validateSelect(this, 'timePreferenceError', 'Ju lutem zgjidhni një opsion');
        });
    }
    
    // Shtimi i validimit për butonat radio
    const radioButtons = document.querySelectorAll('input[name="courseLevel"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            validateRadioGroup('courseLevel', 'courseLevelError', 'Ju lutem zgjidhni një nivel kursi');
        });
    });
    
    // Shtimi i validimit për kutitë e kontrollit
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateCheckboxes();
        });
    });
}

// Validimi i kutive të kontrollit (checkbox)
function validateCheckboxes() {
    const termsCheckbox = document.getElementById('termsAgreement');
    const privacyCheckbox = document.getElementById('privacyAgreement');
    const errorElement = document.getElementById('termsError');
    
    if (!errorElement) {
        console.log("Error element with ID 'termsError' not found");
        return false;
    }
    
    if (!termsCheckbox || !privacyCheckbox) {
        errorElement.textContent = 'Ju duhet të pranoni të gjitha kushtet për të vazhduar';
        return false;
    }
    
    if (!termsCheckbox.checked || !privacyCheckbox.checked) {
        errorElement.textContent = 'Ju duhet të pranoni të gjitha kushtet për të vazhduar';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

// Funksion për validimin e të gjithë formës
function validateForm() {
    let isValid = true;
    
    // Kontrollon nëse elementet ekzistojnë para se të validohen
    const childNameInput = document.getElementById('childName');
    const childBirthdateInput = document.getElementById('childBirthdate');
    const schoolInput = document.getElementById('school');
    const parentNameInput = document.getElementById('parentName');
    const relationshipInput = document.getElementById('relationship');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const timePreferenceSelect = document.getElementById('timePreference');
    
    // Validimi i informacionit të fëmijës
    if (childNameInput && !validateName(childNameInput, 'childNameError')) isValid = false;
    if (childBirthdateInput && !validateBirthdate(childBirthdateInput, 'childBirthdateError')) isValid = false;
    if (schoolInput && !validateRequired(schoolInput, 'schoolError', 'Ju lutem shkruani emrin e shkollës')) isValid = false;
    
    // Validimi i informacionit të prindit
    if (parentNameInput && !validateName(parentNameInput, 'parentNameError')) isValid = false;
    if (relationshipInput && !validateRequired(relationshipInput, 'relationshipError', 'Ju lutem shkruani marrëdhënien me fëmijën')) isValid = false;
    if (phoneInput && !validatePhone(phoneInput, 'phoneError')) isValid = false;
    if (emailInput && !validateEmail(emailInput, 'emailError')) isValid = false;
    
    // Validimi i ngarkimit të skedarëve
    const documentsInput = document.getElementById('documents');
    if (documentsInput && documentsInput.required && documentsInput.files.length === 0) {
        displayError(documentsInput, 'documentsError', 'Ju lutem ngarkoni një dokument identifikimi');
        isValid = false;
    } else if (documentsInput && documentsInput.files.length > 0) {
        if (!validateFileType(documentsInput, 'documentsError', 
            [
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ], 10)) {
            isValid = false;
        }
    }
    
    // Validimi i fotos së fëmijës nëse është ngarkuar
    const childPhotoInput = document.getElementById('childPhoto');
    if (childPhotoInput && childPhotoInput.files.length > 0) {
        if (!validateFileType(childPhotoInput, 'childPhotoError', ['image/jpeg', 'image/png', 'image/jpg'], 5)) {
            isValid = false;
        }
    }
    
    // Validimi i zgjedhjeve
    if (timePreferenceSelect && !validateSelect(timePreferenceSelect, 'timePreferenceError', 'Ju lutem zgjidhni një opsion për oraret')) isValid = false;
    if (!validateRadioGroup('courseLevel', 'courseLevelError', 'Ju lutem zgjidhni një nivel kursi')) isValid = false;
    
    // Validimi i kutive të kontrollit
    if (!validateCheckboxes()) isValid = false;
    
    return isValid;
}

// Validimi i emrit dhe mbiemrit
function validateName(input, errorId) {
    // Emri duhet të përmbajë të paktën 2 fjalë, secila me të paktën 2 karaktere, vetëm shkronja
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+ [A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!input.value.trim()) {
        displayError(input, errorId, 'Ky fushë është e detyrueshme');
        return false;
    } else if (!nameRegex.test(input.value.trim())) {
        displayError(input, errorId, 'Ju lutem shkruani emrin dhe mbiemrin e plotë');
        return false;
    } else {
        clearError(input, errorId);
        return true;
    }
}

// Validimi i datës së lindjes
function validateBirthdate(input, errorId) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!input.value) {
        displayError(input, errorId, 'Ju lutem zgjidhni datën e lindjes');
        return false;
    }
    
    const birthDate = new Date(input.value);
    const today = new Date();
    const minAge = 5; // Mosha minimale për korin
    const maxAge = 16; // Mosha maksimale për korin
    
    // Llogaritja e moshës
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < minAge) {
        displayError(input, errorId, `Fëmija duhet të jetë të paktën ${minAge} vjeç për t'u regjistruar`);
        return false;
    } else if (age > maxAge) {
        displayError(input, errorId, `Fëmija duhet të jetë nën ${maxAge} vjeç për t'u regjistruar`);
        return false;
    } else {
        clearError(input, errorId);
        return true;
    }
}

// Validimi i fushave të detyrueshme
function validateRequired(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!input.value.trim()) {
        displayError(input, errorId, message || 'Ky fushë është e detyrueshme');
        return false;
    } else {
        clearError(input, errorId);
        return true;
    }
}

// Validimi i numrit të telefonit
function validatePhone(input, errorId) {
    // Validimi i numrit të telefonit për Shqipërinë (fillon me +355 ose 0 i ndjekur nga 9 ose 10 shifra)
    const phoneRegex = /^(\+355|0)[0-9]{9,10}$/;
    
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!input.value.trim()) {
        displayError(input, errorId, 'Ju lutem shkruani numrin e telefonit');
        return false;
    } else if (!phoneRegex.test(input.value.trim())) {
        displayError(input, errorId, 'Ju lutem shkruani një numër telefoni të vlefshëm shqiptar');
        return false;
    } else {
        clearError(input, errorId);
        return true;
    }
}

// Validimi i adresës email
function validateEmail(input, errorId) {
    // Validimi standard i email-it
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!input.value.trim()) {
        displayError(input, errorId, 'Ju lutem shkruani adresën e email-it');
        return false;
    } else if (!emailRegex.test(input.value.trim())) {
        displayError(input, errorId, 'Ju lutem shkruani një adresë email-i të vlefshme');
        return false;
    } else {
        clearError(input, errorId);
        return true;
    }
}

// Validimi i elementeve select
function validateSelect(selectElement, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!selectElement.value) {
        displayError(selectElement, errorId, message || 'Ju lutem bëni një zgjedhje');
        return false;
    } else {
        clearError(selectElement, errorId);
        return true;
    }
}

// Validimi i grupit të butonave radio
function validateRadioGroup(radioName, errorId, message) {
    const radioButtons = document.querySelectorAll(`input[name="${radioName}"]`);
    let isChecked = false;
    
    radioButtons.forEach(radio => {
        if (radio.checked) {
            isChecked = true;
        }
    });
    
    const errorElement = document.getElementById(errorId);
    if (!errorElement) {
        console.log(`Error element with ID '${errorId}' not found`);
        return false;
    }
    
    if (!isChecked) {
        errorElement.textContent = message || 'Ju lutem bëni një zgjedhje';
        // Shtimi i klasës së gabimit te kontejneri prind
        if (radioButtons.length > 0 && radioButtons[0].closest('.checkbox-options')) {
            radioButtons[0].closest('.checkbox-options').classList.add('error');
        }
        return false;
    } else {
        errorElement.textContent = '';
        if (radioButtons.length > 0 && radioButtons[0].closest('.checkbox-options')) {
            radioButtons[0].closest('.checkbox-options').classList.remove('error');
        }
        return true;
    }
}

// Funksion për shfaqjen e mesazheve të gabimit
function displayError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        input.classList.add('error');
    } else {
        console.log(`Error element with ID '${errorId}' not found`);
    }
}

// Funksion për pastrimin e mesazheve të gabimit
function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
        input.classList.remove('error');
    } else {
        console.log(`Error element with ID '${errorId}' not found`);
    }
}

// Funksion për pastrimin e të gjitha mesazheve të gabimit
function clearErrors() {
    // Pastrimi i të gjitha mesazheve të gabimit
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
    
    // Heqja e klasës së gabimit nga inputet
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.classList.remove('error');
    });
    
    // Heqja e klasës së gabimit nga opsionet e kutive të kontrollit
    document.querySelectorAll('.checkbox-options').forEach(element => {
        element.classList.remove('error');
    });
}

// Funksion për dërgimin e të dhënave të formës me email
function sendFormDataByEmail() {
    console.log("Përpjekje për të dërguar email...");
    
    // Shfaqja e gjendjes së ngarkimit
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) {
        console.log("Submit button not found");
        return;
    }
    
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Duke dërguar...';
    submitBtn.disabled = true;
    
    // Marrja e të dhënave të formës
    const form = document.getElementById('joinForm');
    if (!form) {
        console.log("Form not found");
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        return;
    }
    
    const formData = new FormData(form);
    
    // Krijimi i parametrave për EmailJS
    const templateParams = {
        to_email: 'kori.mrekullia@gmail.com',
        from_name: formData.get('parentName') || 'N/A',
        from_email: formData.get('email') || 'N/A',
        child_name: formData.get('childName') || 'N/A',
        child_birthdate: formData.get('childBirthdate') || 'N/A',
        child_gender: formData.get('childGender') || 'Nuk është zgjedhur',
        school: formData.get('school') || 'N/A',
        parent_name: formData.get('parentName') || 'N/A',
        relationship: formData.get('relationship') || 'N/A',
        phone: formData.get('phone') || 'N/A',
        experience: formData.get('experience') || 'Nuk është specifikuar',
        time_preference: formData.get('timePreference') === 'pasdite' ? 'E shtunë - 10:30-11:30' : 'E shtunë - 12:30-13:30',
        course_level: getCourseLevelText(),
        subject: `Aplikim i ri për Korin Mrekullia: ${formData.get('childName') || 'Fëmija i ri'}`
    };
    
    console.log("Duke dërguar të dhënat:", templateParams);
    
    // Dërgimi i email-it duke përdorur EmailJS - provo fillimisht pa çelës privat
    emailjs.send('service_mrekullia', 'template_aplikimi', templateParams)
        .then(function(response) {
            console.log('SUKSES!', response.status, response.text);
            
            // Resetimi i formës
            form.reset();
            
            // Resetimi i emrave të fushave të skedarëve
            const childPhotoName = document.getElementById('childPhotoName');
            const documentsName = document.getElementById('documentsName');
            
            if (childPhotoName) {
                childPhotoName.textContent = 'Asnjë skedar i zgjedhur';
            }
            
            if (documentsName) {
                documentsName.textContent = 'Asnjë skedar i zgjedhur';
            }
            
            // Shfaqja e mesazhit të suksesit
            showSuccessMessage();
            
            // Resetimi i butonit
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }, function(error) {
            console.log('DËSHTOI...', error);
            
            // Provo përsëri me çelës privat nëse përpjekja e parë dështon
            emailjs.send('service_mrekullia', 'template_aplikimi', templateParams, {
                privateKey: 'HaC-D0TMi5YyRnMjxgahq'
            })
            .then(function(response) {
                console.log('SUKSES me private key!', response.status, response.text);
                
                // Resetimi i formës
                form.reset();
                
                // Resetimi i emrave të fushave të skedarëve
                const childPhotoName = document.getElementById('childPhotoName');
                const documentsName = document.getElementById('documentsName');
                
                if (childPhotoName) {
                    childPhotoName.textContent = 'Asnjë skedar i zgjedhur';
                }
                
                if (documentsName) {
                    documentsName.textContent = 'Asnjë skedar i zgjedhur';
                }
                
                // Shfaqja e mesazhit të suksesit
                showSuccessMessage();
                
                // Resetimi i butonit
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, function(error) {
                console.log('DËSHTOI edhe me private key...', error);
                
                // Shfaqja e mesazhit të gabimit
                showErrorMessage();
                
                // Resetimi i butonit
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
}

// Funksion për shfaqjen e mesazhit të suksesit
function showSuccessMessage() {
    // Kontrollon nëse mesazhi i suksesit ekziston tashmë
    let successMessage = document.querySelector('.success-message');
    
    if (!successMessage) {
        // Krijimi i mesazhit të suksesit
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Faleminderit për aplikimin! Ne do t\'ju kontaktojmë së shpejti.';
        
        // Vendosja para formës
        const form = document.getElementById('joinForm');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(successMessage, form);
        } else {
            console.log("Cannot find form or its parent node");
            document.body.appendChild(successMessage);
        }
    }
    
    // Shfaqja e mesazhit
    successMessage.style.display = 'block';
    
    // Lëvizja e ekranit te mesazhi i suksesit
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Fshehja pas 5 sekondash
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Funksion për shfaqjen e mesazhit të gabimit
function showErrorMessage() {
    // Kontrollon nëse mesazhi i gabimit ekziston tashmë
    let errorMessage = document.querySelector('.error-message-global');
    
    if (!errorMessage) {
        // Krijimi i mesazhit të gabimit
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message-global';
        errorMessage.textContent = 'Ka ndodhur një gabim gjatë dërgimit të formularit. Ju lutemi provoni përsëri.';
        
        // Vendosja para formës
        const form = document.getElementById('joinForm');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(errorMessage, form);
        } else {
            console.log("Cannot find form or its parent node");
            document.body.appendChild(errorMessage);
        }
    }
    
    // Shfaqja e mesazhit
    errorMessage.style.display = 'block';
    
    // Lëvizja e ekranit te mesazhi i gabimit
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Fshehja pas 5 sekondash
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}