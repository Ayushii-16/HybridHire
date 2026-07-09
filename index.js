// =============================================
// HYBRIDHIRE AI - Landing Page Functionality
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- MOBILE MENU TOGGLE -----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    let menuOpen = false;
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            menuOpen = !menuOpen;
            const icon = this.querySelector('.material-symbols-outlined');
            if (menuOpen) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
            console.log('Mobile menu toggled:', menuOpen ? 'Open' : 'Closed');
        });
    }
    
    // ----- SMOOTH SCROLL FOR NAV LINKS -----
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ----- STATISTICS COUNTER ANIMATION (Optional) -----
    const statNumbers = document.querySelectorAll('.text-3xl.font-bold.text-\\[\\#3B82F6\\]');
    
    function animateCounters() {
        statNumbers.forEach(function(stat) {
            const text = stat.textContent;
            const num = parseInt(text.replace(/[^0-9]/g, ''));
            
            if (!isNaN(num) && !stat.dataset.animated) {
                stat.dataset.animated = 'true';
                let current = 0;
                const increment = Math.ceil(num / 50);
                const timer = setInterval(function() {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    // Preserve any suffix like '+'
                    const suffix = text.includes('+') ? '+' : '';
                    stat.textContent = current.toLocaleString() + suffix;
                }, 40);
            }
        });
    }
    
    // Trigger counter animation when section is visible
    const statsSection = document.querySelector('.grid-cols-2.md\\:grid-cols-4');
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }
    
    console.log('✅ HybridHire AI Landing page loaded successfully!');
});