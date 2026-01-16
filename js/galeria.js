document.addEventListener('DOMContentLoaded', function() {
    // Zgjedhja e elementeve DOM të nevojshëm për funksionalitetin e galerisë
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('galleryModal');
    const closeModal = document.querySelector('.close-modal');
    const modalMedia = document.querySelector('.modal-media');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    // ZGJIDHJA E PROBLEMIT ME HAMBURGER MENUNË - KODI I RI
    // Kjo është zgjidhja themelore - funksioni aktivizohet para çdo gjëje tjetër
    initializeHamburgerMenu();
    
    // Variablat për të mbajtur shënim elementin aktual në modal dhe listën e elementeve të filtruara
    let currentIndex = 0;
    let filteredItems = [...galleryItems];

    // Funksionaliteti i filtrimit të elementeve të galerisë
    // Lejon përdoruesin të shfaqë vetëm kategoritë specifike
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Heq klasën 'active' nga të gjithë butonat
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Shton klasën 'active' tek butoni i klikuar
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filtron elementet sipas kategorisë së zgjedhur
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Përditëson listën e elementeve të filtruara për navigimin në modal
            filteredItems = [...galleryItems].filter(item => 
                filter === 'all' || item.classList.contains(filter)
            );
        });
    });

    // Hapja e modalit kur klikohet mbi elementet e galerisë ose mbi butonat "Shiko"
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        
        // Bën të klikueshëm të gjithë elementin
        item.addEventListener('click', () => {
            openModal(item);
        });
        
        // Bën të klikueshëm butonin "Shiko"
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Parandalon aktivizimin e dyfishtë
                openModal(item);
            });
        }
    });

    // Mbyllja e modalit me klikim në butonin e mbylljes
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            // Ndal çdo video që po luhet kur mbyllet modali
            const videoEl = modalMedia.querySelector('video');
            if (videoEl) {
                videoEl.pause();
            }
        });
    }

    // Mbyllja e modalit me klikim jashtë përmbajtjes së tij
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.classList.remove('active');
            // Ndal çdo video që po luhet kur mbyllet modali
            const videoEl = modalMedia.querySelector('video');
            if (videoEl) {
                videoEl.pause();
            }
        }
    });

    // Mbyllja e modalit me tastin Escape dhe navigimi me tastet e shigjetave
    document.addEventListener('keydown', (e) => {
        if (modal && e.key === 'Escape') {
            modal.classList.remove('active');
            // Ndal çdo video që po luhet kur mbyllet modali
            const videoEl = modalMedia.querySelector('video');
            if (videoEl) {
                videoEl.pause();
            }
        }
        
        // Navigimi nëpërmjet elementeve me tastet e shigjetave
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                navigateModal('next');
            } else if (e.key === 'ArrowLeft') {
                navigateModal('prev');
            }
        }
    });

    // Butonat e navigimit në modal
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => navigateModal('prev'));
        nextBtn.addEventListener('click', () => navigateModal('next'));
    }

    // Funksioni për hapjen e modalit me një element të caktuar
    function openModal(item) {
        if (!modal || !modalMedia || !modalTitle || !modalDescription) return;
        
        // Gjen indeksin e elementit në listën e elementeve të filtruara
        currentIndex = filteredItems.indexOf(item);
        if (currentIndex === -1) currentIndex = 0;
        
        updateModalContent(item);
        modal.classList.add('active');
    }

    // Funksioni për përditësimin e përmbajtjes së modalit
    function updateModalContent(item) {
        if (!modalMedia || !modalTitle || !modalDescription) return;
        
        // Pastron përmbajtjen e mëparshme
        modalMedia.innerHTML = '';
        
        // Vendos titullin dhe përshkrimin
        const itemOverlay = item.querySelector('.item-overlay');
        if (!itemOverlay) return;
        
        const itemTitle = itemOverlay.querySelector('h3')?.textContent || '';
        const itemDescription = itemOverlay.querySelector('p')?.textContent || '';
        
        modalTitle.textContent = itemTitle;
        modalDescription.textContent = itemDescription;
        
        // Kontrollon nëse është video apo imazh
        if (item.classList.contains('video')) {
            // Merr burimin e videos nga elementi i fshehur span
            const videoSrcElement = item.querySelector('.video-source');
            const videoSrc = videoSrcElement ? videoSrcElement.textContent : '';
            
            // Krijon një element video
            const videoElement = document.createElement('video');
            videoElement.src = videoSrc;
            videoElement.controls = true;
            videoElement.autoplay = false;
            videoElement.classList.add('modal-video');
            
            // Shton një imazh poster nëse dëshirohet (duke përdorur imazhin thumbnail)
            const thumbnailImg = item.querySelector('.video-thumbnail img');
            if (thumbnailImg) {
                videoElement.poster = thumbnailImg.src;
            }
            
            modalMedia.appendChild(videoElement);
        } else {
            // Shfaq imazhin
            const img = item.querySelector('img');
            if (img) {
                const imgSrc = img.getAttribute('src');
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = itemTitle;
                modalMedia.appendChild(imgElement);
            }
        }
    }

    // Funksioni për navigimin mes elementeve në modal
    function navigateModal(direction) {
        if (!modalMedia || filteredItems.length === 0) return;
        
        // Ndal çdo video që po luhet
        const videoEl = modalMedia.querySelector('video');
        if (videoEl) {
            videoEl.pause();
        }
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % filteredItems.length;
        } else {
            currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        }
        
        updateModalContent(filteredItems[currentIndex]);
    }

    // Funksioni i ri për inicializimin e butonit hamburger
    function initializeHamburgerMenu() {
        // Provoj disa mënyra të ndryshme për të zgjedhur hamburger butonin
        let hamburger = document.querySelector('.hamburger');
        
        // Nëse nuk gjendet me klasë, provoj me ID
        if (!hamburger) {
            hamburger = document.getElementById('hamburger');
        }
        
        // Si zgjidhje të fundit, shoh nëse mund ta krijoj nëse nuk ekziston
        if (!hamburger) {
            // Kontrollo nëse ekziston navbar
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                // Krijo butonin hamburger nëse nuk ekziston
                hamburger = document.createElement('div');
                hamburger.className = 'hamburger';
                hamburger.id = 'hamburger';
                
                // Shto tri vizat
                for (let i = 0; i < 3; i++) {
                    const span = document.createElement('span');
                    hamburger.appendChild(span);
                }
                
                // Gjej pozicionin e duhur për të vendosur butonin
                const logo = navbar.querySelector('.logo');
                if (logo) {
                    navbar.insertBefore(hamburger, logo.nextSibling);
                } else {
                    navbar.prepend(hamburger);
                }
            }
        }
        
        // Zgjidh nav-links
        const navLinks = document.querySelector('.nav-links');
        
        // Nëse kemi të dy elementët, shtojmë event listener
        if (hamburger && navLinks) {
            // Heq event listeners të mëparshëm për të shmangur duplikimin
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);
            hamburger = newHamburger;
            
            // Shto event listener të ri
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
                console.log('Hamburger clicked!'); // Log për debug
            });
        }
        
        // Trajtimi i menyve dropdown për mobile dhe desktop
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                // Heq event listeners të mëparshëm
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // Shto event listener të ri
                newLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const content = dropdown.querySelector('.dropdown-content');
                    if (content) {
                        // Mbyll të gjitha dropdown-et e tjera së pari
                        document.querySelectorAll('.dropdown-content').forEach(dc => {
                            if (dc !== content) {
                                dc.classList.remove('show');
                            }
                        });
                        
                        content.classList.toggle('show');
                    }
                });
            }
        });
        
        // Mbyll dropdown-et kur klikohet jashtë tyre
        document.addEventListener('click', function(e) {
            const dropdownContents = document.querySelectorAll('.dropdown-content');
            dropdownContents.forEach(content => {
                if (!e.target.closest('.dropdown')) {
                    content.classList.remove('show');
                }
            });
        });
    }
});