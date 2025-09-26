document.addEventListener('DOMContentLoaded', function() {
    // Initialize ScrollSpy for navbar
    const navbarHeight = document.querySelector('.custom-navbar').offsetHeight;
    const scrollSpyOptions = {
        target: '#navbar',
        offset: navbarHeight + 50
    };
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavLink();
                updateNavbarBackground();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Update navbar background on scroll
    function updateNavbarBackground() {
        const navbar = document.querySelector('.custom-navbar');
        if (!navbar) return;
        
        const scrolled = window.pageYOffset > 50;
        
        if (scrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const successToast = new bootstrap.Toast(document.getElementById('successToast'));

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        let isValid = true;
        
        // Validate name
        if (!name) {
            markFieldInvalid('name', 'Name is required');
            isValid = false;
        } else {
            markFieldValid('name');
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            markFieldInvalid('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            markFieldInvalid('email', 'Please enter a valid email');
            isValid = false;
        } else {
            markFieldValid('email');
        }
        
        // Validate message
        if (!message) {
            markFieldInvalid('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            markFieldInvalid('message', 'Message must be at least 10 characters');
            isValid = false;
        } else {
            markFieldValid('message');
        }
        
        if (isValid) {
            // Create mailto link
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:siddharthsaravanan27@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success toast
            successToast.show();
            
            // Reset form
            contactForm.reset();
            clearValidationStates();
        }
    });

    function markFieldInvalid(fieldId, message) {
        const field = document.getElementById(fieldId);
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        feedback.textContent = message;
    }

    function markFieldValid(fieldId) {
        const field = document.getElementById(fieldId);
        
        field.classList.add('is-valid');
        field.classList.remove('is-invalid');
    }

    function clearValidationStates() {
        const fields = ['name', 'email', 'message'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    // Real-time form validation
    const formFields = ['name', 'email', 'message'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                // Re-validate on input if field was previously invalid
                const event = new Event('submit');
                event.preventDefault();
                contactForm.dispatchEvent(event);
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.badass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced scroll animations with stagger effect
    function addScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and timeline items
        const animatedElements = document.querySelectorAll('.badass-card, .timeline-item, .contact-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    // Initialize scroll animations
    addScrollAnimation();

    // Navbar collapse on mobile when link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    });

    // Preload images to prevent layout shift
    function preloadImages() {
        const images = ['public/portfolio.jpg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    // Add loading state to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });

    // Initialize tooltips for better UX
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add focus trap for modals (accessibility)
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const focusableElements = this.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        });
    });

    // Add smooth reveal animation to hero content
    function animateHeroContent() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            // Animate hero content elements individually
            const heroElements = heroContent.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-social');
            
            heroElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 300 + (index * 200));
            });
            
            // Animate profile image
            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateY(0)';
            }, 800);
        }
    }

    // Initialize hero animations
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(30px)';
        heroImage.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        animateHeroContent();
    }

    // Add parallax effect to hero section
    function addParallaxEffect() {
        const heroParticles = document.querySelector('.hero-particles');
        const heroOverlay = document.querySelector('.hero-bg-overlay');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const rate2 = scrolled * -0.3;
            
            if (heroParticles) {
                heroParticles.style.transform = `translateY(${rate}px)`;
            }
            if (heroOverlay) {
                heroOverlay.style.transform = `translateY(${rate2}px)`;
            }
        });
    }

    // Initialize parallax effect
    addParallaxEffect();

    // Add typing effect to hero title
    function addTypingEffect() {
        const titleLine1 = document.querySelector('.title-line-1');
        const titleLine2 = document.querySelector('.title-line-2');
        
        if (titleLine1 && titleLine2) {
            const text1 = titleLine1.textContent;
            const text2 = titleLine2.textContent;
            
            titleLine1.textContent = '';
            titleLine2.textContent = '';
            
            let i = 0;
            const typeWriter1 = setInterval(() => {
                if (i < text1.length) {
                    titleLine1.textContent += text1.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter1);
                    // Start typing second line
                    let j = 0;
                    const typeWriter2 = setInterval(() => {
                        if (j < text2.length) {
                            titleLine2.textContent += text2.charAt(j);
                            j++;
                        } else {
                            clearInterval(typeWriter2);
                        }
                    }, 100);
                }
            }, 150);
        }
    }

    // Initialize typing effect after a delay
    setTimeout(addTypingEffect, 1000);

    // Add mouse movement effect to cards
    function addMouseEffects() {
        const cards = document.querySelectorAll('.badass-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            });
        });
    }

    // Initialize mouse effects
    addMouseEffects();

    // Add performance optimization for scroll events
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            // Scroll has stopped
            document.body.classList.remove('scrolling');
        }, 150);
        
        document.body.classList.add('scrolling');
    }, { passive: true });

    // Add custom cursor effect
    function addCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Initialize custom cursor (optional)
    // addCustomCursor();

    console.log('Portfolio website initialized successfully!');
});

// Add CSS class for scrolling state
const style = document.createElement('style');
style.textContent = `
    body.scrolling {
        pointer-events: none;
    }
    body.scrolling a,
    body.scrolling button,
    body.scrolling input,
    body.scrolling textarea,
    body.scrolling select {
        pointer-events: auto;
    }
`;