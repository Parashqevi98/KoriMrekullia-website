document.addEventListener('DOMContentLoaded', function() {
    
    // Animimi i elementeve kur bejme scroll
    function checkScroll() {
        const elements = document.querySelectorAll('.value-item, .activity-item, .vision, .mission');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Shtojmë klasën 'visible' për animim kur bejme scroll
    window.addEventListener('scroll', checkScroll);
    
    // Kontrollojmë gjendjen fillestare të faqes në rast se jemi në mes të faqes pas një rifreskimi
    checkScroll();
    
    // Shtojmë animim për seksionet e faqes
    const sections = document.querySelectorAll('.about-intro, .about-values, .about-repertory, .about-activities, .about-join');
    
    function fadeInSections() {
        sections.forEach(section => {
            const sectionPosition = section.getBoundingClientRect().top;
            
            if (sectionPosition < window.innerHeight - 50) {
                setTimeout(() => {
                    section.style.opacity = 1;
                    section.style.transform = 'translateY(0)';
                }, 200);
            }
        });
    }
    
    // Aplikojmë stilet fillestare për fade-in animation
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Aktivizojmë animimin
    window.addEventListener('scroll', fadeInSections);
    fadeInSections();
    
    // Shtojmë klasën 'active' për link-un aktiv në navbar
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '/pages/rreth-nesh.html') {
            link.classList.add('active');
        }
    });
});