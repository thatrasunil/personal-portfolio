/* =========================================
   DOM ELEMENTS
   ========================================= */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contactForm');
const msgError = document.getElementById('msg-error');
const currentYear = document.getElementById('year');

/* =========================================
   INITIALIZATION
   ========================================= */
// Set current year in footer
if(currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================
   MOBILE MENU TOGGLE
   ========================================= */
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Change icon based on state
        const icon = navToggle.querySelector('i');
        if(navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

/* =========================================
   SCROLL EFFECTS (Navbar style & Active Link)
   ========================================= */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    // Header Background change on scroll
    if (scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Active Link Highlight
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Offset for fixed header
        const sectionId = current.getAttribute('id');
        
        const link = document.querySelector(`.nav-list a[href*=${sectionId}]`);
        
        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            // Optional: observer.unobserve(entry.target); // Unobserve if you only want it to animate once
        }
    });
}, revealOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

/* =========================================
   FORM VALIDATION
   ========================================= */
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple client-side validation
        if(!name || !email || !message) {
            msgError.style.display = 'block';
            msgError.textContent = 'Please fill out all fields.';
            
            setTimeout(() => {
                msgError.style.display = 'none';
            }, 3000);
            return;
        }
        
        // Mock successful submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Green gradient
        
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = ''; // Revert to CSS class rule
        }, 3000);
    });
}

/* =========================================
   INTERACTIVE HOVER GLOW / MOUSE TRACKING
   ========================================= */
// Add mouse move tracking to glass cards for dynamic reflection/glow
const glassCards = document.querySelectorAll('.glass-card');

glassCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* =========================================
   3D WORLD ANIMATION (VANTA)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VANTA !== 'undefined') {
        VANTA.GLOBE({
            el: "#vanta-canvas",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6366f1, // Indigo accent
            color2: 0xec4899, // Pink accent
            size: 1.10,
            backgroundColor: 0x050505 // Matches var(--bg-color)
        });
    }
});
