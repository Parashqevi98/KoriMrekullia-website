document.addEventListener('DOMContentLoaded', function () {
    // Funksionaliteti i menus dropdown - Lejon shfaqjen e nënmenuve kur klikohet mbi linkun prind
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-content');
        
        dropdownToggle.addEventListener('click', function (e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });
    });
    
    // Mbyllja e dropdown menu-ve kur klikohet në një zonë jashtë menusë
    // Përmirëson përvojën e përdoruesit duke pastruar ndërfaqen kur nuk nevojitet më një menu
    document.addEventListener('click', function (e) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentElement.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // Aktivizimi i menus hamburger për pajisjet mobile
    // Shfaq ose fsheh menunë e navigimit kur klikohet ikona hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Shtimi i klasës 'active' tek linku i faqes aktuale
    // Tregon vizualisht se në cilën faqe ndodhet përdoruesi
    const navItems = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    
    navItems.forEach(link => {
        if (link.href.includes(currentPath) && currentPath !== '/') {
            link.classList.add('active');
        } else if (currentPath === '/' && link.getAttribute('href') === '/') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mbyllja e menus në pajisjet mobile pas klikimit të një linku
    // Përmirëson përvojën duke mbyllur automatikisht menunë pas zgjedhjes së një destinacioni
    if (window.innerWidth <= 1024) {
        const allNavLinks = document.querySelectorAll('.nav-links a');
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Kontrollon nëse linku nuk është një dropdown toggle
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('dropdown-content')) {
                    // Mbyll menunë hamburger
                    if (navLinks) {
                        navLinks.classList.remove('active');
                    }
                    
                    // Mbyll të gjitha dropdown menutë
                    const dropdownMenus = document.querySelectorAll('.dropdown-content');
                    dropdownMenus.forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
            });
        });
    }
    
    // Funksionaliteti i lëvizjes së butë për linket anchor brenda faqes
    // Krijon një eksperiencë navigimi më të pëlqyeshme për përdoruesin
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Zbritje për navbar-in
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Funksionaliteti i karuselit të dëshmive (testimonials)
    // Inicializohet vetëm nëse karruseli ekziston në faqe
    const testimonialCarousel = document.querySelector('.testimonials-carousel');
    
    if (testimonialCarousel) {
        const testimonials = document.querySelectorAll('.testimonial-item');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        let currentIndex = 0;
        
        // Krijimi i treguesve (indicators) për karruselin
        if (indicatorsContainer && testimonials.length > 0) {
            // Pastron treguesit ekzistues
            indicatorsContainer.innerHTML = '';
            
            for (let i = 0; i < testimonials.length; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === 0) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => {
                    goToSlide(i);
                });
                indicatorsContainer.appendChild(indicator);
            }
        }
        
        const indicators = document.querySelectorAll('.indicator');
        
        // Funksioni për shfaqjen e një dëshmie specifike
        function goToSlide(index) {
            if (!testimonials || testimonials.length === 0) return;
            
            if (index < 0) {
                index = testimonials.length - 1;
            } else if (index >= testimonials.length) {
                index = 0;
            }
            
            // Fsheh të gjitha dëshmitë
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
            });
            
            // Heq klasën 'active' nga të gjithë treguesit
            if (indicators && indicators.length > 0) {
                indicators.forEach(indicator => {
                    indicator.classList.remove('active');
                });
                
                // Përditëson treguesin aktiv
                if (indicators[index]) {
                    indicators[index].classList.add('active');
                }
            }
            
            // Shfaq dëshminë e zgjedhur
            testimonials[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Sigurohet që dëshmia e parë të jetë aktive kur ngarkohet faqja
        if (testimonials.length > 0 && !document.querySelector('.testimonial-item.active')) {
            testimonials[0].classList.add('active');
        }
        
        // Shtimi i event listeners për shigjetat e navigimit
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        // Rrotullimi automatik i slajtdeve çdo 7 sekonda
        let autoRotate;
        
        if (testimonials.length > 1) {
            autoRotate = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 7000);
            
            // Ndërpret rrotullimin automatik kur përdoruesi ndërvepron me karruselin
            testimonialCarousel.addEventListener('mouseenter', () => {
                clearInterval(autoRotate);
            });
            
            // Rifillon rrotullimin automatik kur përdoruesi largohet nga karruseli
            testimonialCarousel.addEventListener('mouseleave', () => {
                autoRotate = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, 7000);
            });
        }
    }
});