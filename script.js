/**
 * Sunil Thatra - Personal Portfolio Interactive Scripts
 * Premium JS for recruiter-impressing interactive features.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Particle Network Background (Canvas)
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const colors = [
            'rgba(99, 102, 241, 0.4)',  // Indigo
            'rgba(139, 92, 246, 0.4)',  // Violet
            'rgba(168, 85, 247, 0.4)',  // Purple
            'rgba(6, 182, 212, 0.4)'    // Cyan
        ];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Bounce on boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction (gentle attraction)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.02;
                        this.y -= dy * force * 0.02;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Connect particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = (130 - distance) / 130 * 0.15;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // 3. Typing Animation
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const phrases = [
            'AI & Data Science Student',
            'Aspiring Google Researcher',
            'Full-Stack Developer',
            'Machine Learning Enthusiast'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 80;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 40;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingDelay = 2000; // Pause at end of string
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingDelay = 500; // Pause before next string
            }

            setTimeout(type, typingDelay);
        }
        setTimeout(type, 500);
    }

    // 4. Mobile Navigation & Clicking Outside
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                const icon = navToggle?.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // 5. Scroll Effects (Header scrolled & active section links)
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.scrollY;

        if (header) {
            if (scrollY >= 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for fixed nav
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
    scrollActive();

    // 6. Scroll Reveal Animations & Animated Stat Counters
    const revealElements = document.querySelectorAll('.reveal');
    
    const countNumber = (el) => {
        const target = +el.getAttribute('data-count');
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 50; // Speed adjustment

        const updateCount = () => {
            count += speed;
            if (count < target) {
                el.innerText = Math.floor(count) + suffix;
                setTimeout(updateCount, 30);
            } else {
                el.innerText = target + suffix;
            }
        };
        updateCount();
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger stat counters
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    if (!stat.classList.contains('counted')) {
                        stat.classList.add('counted');
                        countNumber(stat);
                    }
                });

                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 7. Interactive Card Glow Tracking
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

    // 8. Skill Tags entrance animations (CSS handles transitions, just add classes/triggers)
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const tags = skillsGrid.querySelectorAll('.skill-tag');
                tags.forEach((tag, index) => {
                    tag.style.transitionDelay = `${index * 50}ms`;
                    tag.classList.add('visible');
                });
            }
        }, { threshold: 0.2 });
        observer.observe(skillsGrid);
    }

    // 9. Contact Form handling
    const contactForm = document.getElementById('contactForm');
    const msgError = document.getElementById('msg-error');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if(!name || !email || !message) {
                if (msgError) {
                    msgError.style.display = 'block';
                    msgError.textContent = 'Please fill out all fields.';
                    msgError.style.color = '#ef4444';
                    setTimeout(() => { msgError.style.display = 'none'; }, 4000);
                }
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

            // Simulate sending message
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // 10. Smooth Page Load transition
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
