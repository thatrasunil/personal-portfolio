/**
 * Sunil Thatra - Personal Portfolio Interactive Scripts
 * Premium JS for recruiter-impressing interactive features.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ══════════════════════════════════════════════════════════════════════
    // 1. FOOTER YEAR UPDATE
    // ══════════════════════════════════════════════════════════════════════
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ══════════════════════════════════════════════════════════════════════
    // 2. GREEN-INDIGO PARTICLE NETWORK BACKGROUND
    // ══════════════════════════════════════════════════════════════════════
    const initParticleBackground = () => {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Green (#10b981) and Indigo (#6366f1) color palette with slight opacity
        const colors = [
            'rgba(16, 185, 129, 0.65)', // Emerald Green
            'rgba(99, 102, 241, 0.65)'  // Indigo
        ];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.75;
                this.vy = (Math.random() - 0.5) * 0.75;
                this.radius = Math.random() * 2.5 + 1.2;
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

                // Mouse interaction (gentle attraction within radius)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= dx * force * 0.018;
                        this.y -= dy * force * 0.018;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }
        }

        const createParticles = () => {
            particles = [];
            // Scale particle density with screen resolution
            const count = Math.min(95, Math.floor((canvas.width * canvas.height) / 12500));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        };

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

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Connect neighboring particles with green-to-indigo gradient lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 125) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Line opacity fades out over distance
                        const opacity = ((125 - distance) / 125) * 0.18;
                        
                        // Create gradient for lines matching connection endpoints
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y, 
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity})`);
                        gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity})`);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    };
    initParticleBackground();

    // ══════════════════════════════════════════════════════════════════════
    // 3. 3D PARALLAX TILT EFFECT (HERO IMAGE CARD)
    // ══════════════════════════════════════════════════════════════════════
    const initHeroTilt = () => {
        const heroCard = document.querySelector('.hero-image-card') || document.querySelector('.tech-card-globe');
        if (!heroCard) return;

        const heroImg = heroCard.querySelector('img');
        const globeInner = heroCard.querySelector('.globe-inner');
        const techTags = heroCard.querySelectorAll('.tech-tag');

        // Apply 3D setup
        heroCard.style.transformStyle = 'preserve-3d';
        heroCard.style.perspective = '1000px';

        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            
            // Mouse coordinate offset relative to element center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            // Maximum tilt rotation angle in degrees
            const maxTilt = 16;
            const rotateX = -percentY * maxTilt;
            const rotateY = percentX * maxTilt;

            // Apply smooth 3D tilt rotation and scaling on parent card
            heroCard.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.12s ease';
            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
            
            // Add custom emerald/indigo combined hover glow shadow
            heroCard.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.45), 0 0 30px rgba(16, 185, 129, 0.22), 0 0 40px rgba(99, 102, 241, 0.15)';
            heroCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';

            // Parallax translations for nested children
            if (heroImg) {
                // Slide nested image in reverse direction for dynamic parallax layering depth
                const transX = -percentX * 12;
                const transY = -percentY * 12;
                heroImg.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
                heroImg.style.transform = `scale(1.12) translate(${transX}px, ${transY}px) translateZ(50px)`;
            }

            if (globeInner) {
                globeInner.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
                globeInner.style.transform = 'translateZ(45px)';
            }

            techTags.forEach((tag, idx) => {
                tag.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
                const tagZ = 30 + (idx * 6);
                tag.style.transform = `translateZ(${tagZ}px)`;
            });
        });

        heroCard.addEventListener('mouseleave', () => {
            // Smoothly reset tilt transitions to origin
            heroCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease, border-color 0.5s ease';
            heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            heroCard.style.boxShadow = '';
            heroCard.style.borderColor = '';

            if (heroImg) {
                heroImg.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                heroImg.style.transform = 'scale(1) translate(0, 0) translateZ(0)';
            }

            if (globeInner) {
                globeInner.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                globeInner.style.transform = 'translateZ(0px)';
            }

            techTags.forEach(tag => {
                tag.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                tag.style.transform = 'translateZ(0px)';
            });
        });
    };
    initHeroTilt();

    // ══════════════════════════════════════════════════════════════════════
    // 4. TYPING ANIMATION (CYCLING SKILLS & HEADLINES)
    // ══════════════════════════════════════════════════════════════════════
    const initTyping = () => {
        const typingEl = document.querySelector('.typing-text');
        if (!typingEl) return;

        const phrases = [
            'AI & Data Science Student',
            'Aspiring Google Student Researcher',
            'Full-Stack Web Developer',
            'Machine Learning Enthusiast',
            'Deep Learning & NLP Specialist',
            'Computer Vision Developer'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 80;

        const type = () => {
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
                typingDelay = 2200; // Delay before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingDelay = 400; // Pause before typing next phrase
            }

            setTimeout(type, typingDelay);
        };

        setTimeout(type, 600);
    };
    initTyping();

    // ══════════════════════════════════════════════════════════════════════
    // 5. RESPONSIVE MOBILE NAVIGATION MENU
    // ══════════════════════════════════════════════════════════════════════
    const initNavigation = () => {
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

            // Close mobile menu if clicked outside
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

        // Close menu on selecting navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = navToggle?.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });

        // Toggle header background on scroll & active navigation states
        const sections = document.querySelectorAll('section[id]');
        const scrollActive = () => {
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
                const sectionTop = current.offsetTop - 120; // Offset for header navbar
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
        };

        window.addEventListener('scroll', scrollActive);
        scrollActive();
    };
    initNavigation();

    // ══════════════════════════════════════════════════════════════════════
    // 6. SCROLL REVEAL & BUTTERY-SMOOTH NUMERICAL STAT COUNTERS
    // ══════════════════════════════════════════════════════════════════════
    const countNumber = (el) => {
        const targetValueAttr = el.getAttribute('data-count') || '0';
        const target = parseFloat(targetValueAttr) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        
        // Setup animation duration
        const duration = 2000; // 2 seconds animation
        const frameRate = 60;
        const totalFrames = Math.round((duration / 1000) * frameRate);
        let frame = 0;
        
        // Check number of decimal places from data-count string
        const decimalPlaces = targetValueAttr.includes('.') ? targetValueAttr.split('.')[1].length : 0;
        
        // Easing function: quadratic ease-out
        const easeOutQuad = (t) => t * (2 - t);

        const updateCount = () => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const current = progress * target;
            
            el.textContent = current.toFixed(decimalPlaces) + suffix;
            
            if (frame < totalFrames) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target.toFixed(decimalPlaces) + suffix;
            }
        };
        
        updateCount();
    };

    const initScrollReveals = () => {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Trigger counters inside newly revealed grid/section
                    const stats = entry.target.querySelectorAll('.stat-number');
                    stats.forEach(stat => {
                        if (!stat.classList.contains('counted')) {
                            stat.classList.add('counted');
                            countNumber(stat);
                        }
                    });
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    };
    initScrollReveals();

    // ══════════════════════════════════════════════════════════════════════
    // 7. CARD HOVER GLOW INTERACTION
    // ══════════════════════════════════════════════════════════════════════
    const initCardGlow = () => {
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    };
    initCardGlow();

    // ══════════════════════════════════════════════════════════════════════
    // 8. SKILL TAGS STAGGERED REVEAL ON SCROLL
    // ══════════════════════════════════════════════════════════════════════
    const initSkillTagsReveal = () => {
        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const tags = skillsGrid.querySelectorAll('.skill-tag');
                    tags.forEach((tag, index) => {
                        tag.style.transitionDelay = `${index * 45}ms`;
                        tag.classList.add('visible');
                    });
                }
            }, { threshold: 0.15 });
            observer.observe(skillsGrid);
        }
    };
    initSkillTagsReveal();

    // ══════════════════════════════════════════════════════════════════════
    // 9. FORM VALIDATION & INTERACTIVE SUBMIT STATES
    // ══════════════════════════════════════════════════════════════════════
    const initContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const getOrCreateValidationMsg = (input) => {
            const formGroup = input.parentElement;
            let msgEl = formGroup.querySelector('.form-validation-msg');
            if (!msgEl) {
                msgEl = document.createElement('div');
                msgEl.className = 'form-validation-msg';
                formGroup.appendChild(msgEl);
            }
            return msgEl;
        };

        const validateName = (showErrorMsg = true) => {
            const val = nameInput.value.trim();
            const msgEl = getOrCreateValidationMsg(nameInput);
            
            if (val.length === 0) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Please tell us your name.';
                    msgEl.style.display = 'block';
                    nameInput.classList.add('invalid-field');
                    nameInput.style.borderColor = '#ef4444';
                }
                return false;
            } else if (val.length < 2) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Name must be at least 2 characters long.';
                    msgEl.style.display = 'block';
                    nameInput.classList.add('invalid-field');
                    nameInput.style.borderColor = '#ef4444';
                }
                return false;
            }
            
            // Clear errors
            msgEl.style.display = 'none';
            nameInput.classList.remove('invalid-field');
            nameInput.style.borderColor = '';
            return true;
        };

        const validateEmail = (showErrorMsg = true) => {
            const val = emailInput.value.trim();
            const msgEl = getOrCreateValidationMsg(emailInput);
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (val.length === 0) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Please enter your email address.';
                    msgEl.style.display = 'block';
                    emailInput.classList.add('invalid-field');
                    emailInput.style.borderColor = '#ef4444';
                }
                return false;
            } else if (!emailRegex.test(val)) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Please enter a valid email address.';
                    msgEl.style.display = 'block';
                    emailInput.classList.add('invalid-field');
                    emailInput.style.borderColor = '#ef4444';
                }
                return false;
            }
            
            // Clear errors
            msgEl.style.display = 'none';
            emailInput.classList.remove('invalid-field');
            emailInput.style.borderColor = '';
            return true;
        };

        const validateMessage = (showErrorMsg = true) => {
            const val = messageInput.value.trim();
            const msgEl = getOrCreateValidationMsg(messageInput);
            
            if (val.length === 0) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Please write a message.';
                    msgEl.style.display = 'block';
                    messageInput.classList.add('invalid-field');
                    messageInput.style.borderColor = '#ef4444';
                }
                return false;
            } else if (val.length < 10) {
                if (showErrorMsg) {
                    msgEl.textContent = 'Message must be at least 10 characters long.';
                    msgEl.style.display = 'block';
                    messageInput.classList.add('invalid-field');
                    messageInput.style.borderColor = '#ef4444';
                }
                return false;
            }
            
            // Clear errors
            msgEl.style.display = 'none';
            messageInput.classList.remove('invalid-field');
            messageInput.style.borderColor = '';
            return true;
        };

        // Live validation bindings
        nameInput.addEventListener('input', () => validateName(false));
        nameInput.addEventListener('blur', () => validateName(true));

        emailInput.addEventListener('input', () => validateEmail(false));
        emailInput.addEventListener('blur', () => validateEmail(true));

        messageInput.addEventListener('input', () => validateMessage(false));
        messageInput.addEventListener('blur', () => validateMessage(true));

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Run validations on submit attempt
            const isNameValid = validateName(true);
            const isEmailValid = validateEmail(true);
            const isMessageValid = validateMessage(true);

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                // Focus first invalid field
                if (!isNameValid) nameInput.focus();
                else if (!isEmailValid) emailInput.focus();
                else messageInput.focus();
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            if (!submitBtn) return;
            
            const textEl = submitBtn.querySelector('span');
            const iconEl = submitBtn.querySelector('i');
            const originalText = textEl ? textEl.textContent : 'Send Message';
            const originalIconClass = iconEl ? iconEl.className : 'fas fa-paper-plane';

            // Disable fields during mock transmit
            submitBtn.disabled = true;
            nameInput.disabled = true;
            emailInput.disabled = true;
            messageInput.disabled = true;

            // Submit loading visual state
            if (textEl) textEl.textContent = 'Sending message...';
            if (iconEl) iconEl.className = 'fas fa-spinner fa-spin';
            submitBtn.classList.add('submitting');
            submitBtn.style.pointerEvents = 'none';

            // Simulated AJAX network delay
            setTimeout(() => {
                // Success submit state
                if (textEl) textEl.textContent = 'Message Sent Successfully!';
                if (iconEl) iconEl.className = 'fas fa-check-circle';
                
                submitBtn.classList.remove('submitting');
                submitBtn.classList.add('success');
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Success green gradient
                submitBtn.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
                
                contactForm.reset();

                // Revert submit button back to original look after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.pointerEvents = 'auto';
                    nameInput.disabled = false;
                    emailInput.disabled = false;
                    messageInput.disabled = false;
                    
                    if (textEl) textEl.textContent = originalText;
                    if (iconEl) iconEl.className = originalIconClass;
                    submitBtn.classList.remove('success');
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);
            }, 1600);
        });
    };
    initContactForm();

    // ══════════════════════════════════════════════════════════════════════
    // 10. INTERACTIVE DEVELOPER TERMINAL PLAYGROUND
    // ══════════════════════════════════════════════════════════════════════
    const initDeveloperTerminal = () => {
        const termInput = document.getElementById('terminalInput');
        const termBody = document.getElementById('terminalBody');
        const matrixCanvas = document.getElementById('matrix-rain-canvas');
        if (!termInput || !termBody || !matrixCanvas) return;

        let matrixInterval = null;

        const printLine = (text, className = '') => {
            const p = document.createElement('p');
            if (className) p.className = className;
            p.innerHTML = text;
            const inputLine = termBody.querySelector('.terminal-input-line');
            if (inputLine) {
                termBody.insertBefore(p, inputLine);
            } else {
                termBody.appendChild(p);
            }
            termBody.scrollTop = termBody.scrollHeight;
        };

        const handleTerminalCommand = (rawInput) => {
            const command = rawInput.trim().toLowerCase();
            if (!command) return;

            printLine(`guest@sunilthatra:~$ ${rawInput}`, 'term-blue');

            switch (command) {
                case 'help':
                    printLine('Available commands:', 'term-yellow');
                    printLine('  <span class="term-green">about</span>:    Short background story');
                    printLine('  <span class="term-green">skills</span>:   List core developer skillsets with metrics');
                    printLine('  <span class="term-green">projects</span>: Key products built (Saarthi, etc.)');
                    printLine('  <span class="term-green">neofetch</span>: System configuration & academic info');
                    printLine('  <span class="term-green">matrix</span>:   Toggle falling digital code canvas');
                    printLine('  <span class="term-green">secret</span>:   Developer easter egg');
                    printLine('  <span class="term-green">clear</span>:    Clear output logs');
                    break;
                case 'clear':
                    const outputs = termBody.querySelectorAll('.terminal-output p, .terminal-output br, p, br');
                    outputs.forEach(el => {
                        if (!el.parentElement.classList.contains('terminal-input-line') && el.id !== 'terminalInput') {
                            el.remove();
                        }
                    });
                    break;
                case 'about':
                    printLine('Sunil Thatra - AI & Full-Stack Developer', 'term-cyan');
                    printLine('----------------------------------------', 'term-muted');
                    printLine('I enjoy translating ideas into real digital products. My core focus is building applications leveraging computational intelligence, next-gen databases, and responsive web technologies. Currently working on Saarthi.');
                    break;
                case 'skills':
                    printLine('Core Competencies & Metrics:', 'term-cyan');
                    printLine('----------------------------', 'term-muted');
                    printLine('Programming      [██████████████████░░] 90% (Python, JS, TS, SQL)', 'term-green');
                    printLine('Frontend         [██████████████████░░] 90% (React, Next.js, Tailwind)', 'term-green');
                    printLine('Backend          [████████████████░░░░] 80% (Flask, Django, Node.js)', 'term-green');
                    printLine('Database/Cloud   [███████████████░░░░░] 75% (PostgreSQL, AWS, GCP)', 'term-green');
                    printLine('Data Science     [████████████████░░░░] 80% (Pandas, ML, Prompt Eng.)', 'term-green');
                    break;
                case 'projects':
                    printLine('Featured Projects:', 'term-cyan');
                    printLine('------------------', 'term-muted');
                    printLine('1. <span class="term-highlight">Saarthi</span> - AI Travel OS (Next.js, Supabase, Gemini API)');
                    printLine('2. <span class="term-highlight">TaxBee Solutions</span> - Online ITR Filing Platform (React, Firebase)');
                    printLine('3. <span class="term-highlight">Heal Ayur</span> - AI Skin Analyzer (Flask, Firebase, Image Proc)');
                    printLine('4. <span class="term-highlight">CodeConnect</span> - Collab Platform (Firebase, JS)');
                    printLine('5. <span class="term-highlight">Logistics Invoice</span> - Billing system (70% time saved)');
                    break;
                case 'neofetch':
                    printLine(`   <span class="term-green">.-/+oossssoo+/-.</span>               <span class="term-green">sunil@LAPTOP-Device</span>`, 'term-green');
                    printLine(` <span class="term-green">\`:+ssssssssssssssssss:\`</span>            ------------------`, 'term-green');
                    printLine(` <span class="term-green">-+ssssssssssssssssssyys+-</span>           OS: Windows 11 / B.Tech AI & DS`, 'term-green');
                    printLine(` <span class="term-green">.ossssssssssssssssssdMMMNys.</span>         Host: Annamacharya Institute (AITS)`, 'term-green');
                    printLine(` <span class="term-green">-ysssssssssssydMMMMMMMMMMMMys.</span>       CGPA: 8.53 / 10`, 'term-green');
                    printLine(` <span class="term-green">\`ysssssssssssmMMMMMMMMMMMMMMMMys\`</span>     Role: AI & Full-Stack Developer`, 'term-green');
                    printLine(` <span class="term-green">-yssssssssssdMMMMMMMMMMMMMMMMMMys-</span>    Status: Open to Opportunities`, 'term-green');
                    printLine(` <span class="term-green">.ossssssssssNMMMMMMMMMMMMMMMMMMys.</span>    Target: Google / AI Startups`, 'term-green');
                    printLine(`  <span class="term-green">-ysssssssssmMMMMMMMMMMMMMMMMys.</span>      GitHub: github.com/thatrasunil`, 'term-green');
                    printLine(`   <span class="term-green">-+sssssssssdMMMMMMMMMMMMys+-</span>        Uptime: 2 Years Coding`, 'term-green');
                    printLine(`     <span class="term-green">\`:+ssssssssssyysssssss:\`</span>`, 'term-green');
                    printLine(`       <span class="term-green">.-/+oossssoo+/-.</span>`, 'term-green');
                    break;
                case 'matrix':
                    if (matrixInterval) {
                        stopMatrixRain();
                        printLine('Matrix Code deactivated.', 'term-muted');
                    } else {
                        startMatrixRain();
                        printLine('Matrix Code rain activated! Click terminal screen to deactivate.', 'term-green');
                    }
                    break;
                case 'secret':
                    printLine(' _____ _                 _', 'term-cyan');
                    printLine('|  ___| |               | |', 'term-cyan');
                    printLine('| |__ | |__   ___   ___ | | __ _ _   _', 'term-cyan');
                    printLine('|  __|| \'_ \\ / _ \\ / _ \\| |/ _` | | | |', 'term-cyan');
                    printLine('| |___| | | | (_) | (_) | | (_| | |_| |', 'term-cyan');
                    printLine('\\____/|_| |_|\\___/ \\___/|_|\\__, |\\__,_|', 'term-cyan');
                    printLine('                            __/ |', 'term-cyan');
                    printLine('                           |___/', 'term-cyan');
                    printLine('"Always build products that solve real problems!"', 'term-yellow');
                    break;
                default:
                    printLine(`Command not found: ${command}. Type <span class="term-highlight">help</span> for assistance.`, 'term-error');
                    break;
            }
        };

        const startMatrixRain = () => {
            const ctx = matrixCanvas.getContext('2d');
            const termRect = matrixCanvas.parentElement.getBoundingClientRect();
            matrixCanvas.width = termRect.width;
            matrixCanvas.height = termRect.height || 380;

            const letters = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ💻🧠⚡";
            const alphabet = letters.split("");

            const fontSize = 12;
            const columns = matrixCanvas.width / fontSize;

            const rainDrops = [];
            for (let x = 0; x < columns; x++) {
                rainDrops[x] = 1;
            }

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                ctx.fillStyle = '#10b981';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < rainDrops.length; i++) {
                    const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                    if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        rainDrops[i] = 0;
                    }
                    rainDrops[i]++;
                }
            };

            matrixCanvas.classList.add('active');
            matrixInterval = setInterval(draw, 33);
        };

        const stopMatrixRain = () => {
            if (matrixInterval) {
                clearInterval(matrixInterval);
                matrixInterval = null;
            }
            matrixCanvas.classList.remove('active');
            const ctx = matrixCanvas.getContext('2d');
            ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        };

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = termInput.value;
                handleTerminalCommand(val);
                termInput.value = '';
            }
        });

        const termWin = document.querySelector('.terminal-window');
        if (termWin) {
            termWin.addEventListener('click', () => {
                if (matrixCanvas.classList.contains('active')) {
                    stopMatrixRain();
                    printLine('guest@sunilthatra:~$ matrix', 'term-blue');
                    printLine('Matrix Code deactivated.', 'term-muted');
                }
                termInput.focus();
            });
        }
    };
    initDeveloperTerminal();

    // ══════════════════════════════════════════════════════════════════════
    // 11. PAGE LOADING TRANSITION TRIGGER
    // ══════════════════════════════════════════════════════════════════════
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
