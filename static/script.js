// Enhanced Portfolio JavaScript with Interactive Features

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    // Initialize all components
    initLoadingScreen();
    initNavigation();
    initThemeToggle();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initCounterAnimation();
    initParticles();
    initContactForm(); // Make sure this is included
    initBackToTop();
    initAOS();
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', theme);
    }
}

// Typing Effect
function initTypingEffect() {
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Vaibhav Tiwari", "a Developer", "a Problem Solver", "a Tech Enthusiast"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 1500;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!typedTextSpan.querySelector('.cursor')) {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                cursor.textContent = '|';
                typedTextSpan.appendChild(cursor);
            }
            typedTextSpan.innerHTML = textArray[textArrayIndex].substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.innerHTML = textArray[textArrayIndex].substring(0, charIndex - 1) + '<span class="cursor">|</span>';
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    // Start typing effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // Text Rotator
    const textRotate = document.querySelector('.text-rotate');
    if (textRotate) {
        const rotateTexts = JSON.parse(textRotate.getAttribute('data-rotate'));
        let rotateIndex = 0;
        
        function rotateText() {
            textRotate.style.opacity = '0';
            setTimeout(() => {
                textRotate.textContent = rotateTexts[rotateIndex];
                textRotate.style.opacity = '1';
                rotateIndex = (rotateIndex + 1) % rotateTexts.length;
            }, 500);
        }
        
        setInterval(rotateText, 3000);
        rotateText(); // Initial call
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(skillBar => {
            const skillLevel = skillBar.getAttribute('data-level');
            const skillPosition = skillBar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (skillPosition < screenPosition) {
                skillBar.style.width = skillLevel + '%';
                
                // Add percentage display
                const percentage = document.createElement('span');
                percentage.className = 'skill-percentage';
                percentage.textContent = skillLevel + '%';
                percentage.style.position = 'absolute';
                percentage.style.right = '10px';
                percentage.style.top = '50%';
                percentage.style.transform = 'translateY(-50%)';
                percentage.style.color = 'white';
                percentage.style.fontSize = '0.8rem';
                percentage.style.fontWeight = '600';
                
                skillBar.appendChild(percentage);
            }
        });
    };

    window.addEventListener('scroll', animateSkillBars);
    // Initial check
    animateSkillBars();
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const speed = 2000; // Animation duration in ms
            const increment = target / (speed / 16); // 60fps
            
            if (count < target && counter.getBoundingClientRect().top < window.innerHeight - 100) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 16);
            } else {
                counter.innerText = target;
            }
        });
    };

    let animated = false;
    
    window.addEventListener('scroll', () => {
        if (!animated && document.querySelector('.stats-grid').getBoundingClientRect().top < window.innerHeight - 100) {
            animated = true;
            animateCounters();
        }
    });
}

// Particles.js Background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Enhanced Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset previous messages
            clearFormErrors();
            formMessage.innerHTML = '';
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                
                const response = await fetch('contact_handler.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success message
                    formMessage.innerHTML = `
                        <div class="message-success">
                            <i class="fas fa-check-circle"></i>
                            ${data.message}
                        </div>
                    `;
                    contactForm.reset();
                    
                    // Show success animation
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                    }, 2000);
                    
                } else {
                    // Show errors
                    if (data.errors) {
                        showFormErrors(data.errors);
                    }
                    formMessage.innerHTML = `
                        <div class="message-error">
                            <i class="fas fa-exclamation-circle"></i>
                            ${data.message}
                        </div>
                    `;
                    submitBtn.innerHTML = originalText;
                }
                
            } catch (error) {
                console.error('Error:', error);
                formMessage.innerHTML = `
                    <div class="message-error">
                        <i class="fas fa-exclamation-circle"></i>
                        Sorry, there was an error sending your message. Please try again.
                    </div>
                `;
            } finally {
                submitBtn.disabled = false;
                if (!formMessage.innerHTML.includes('Sent!')) {
                    submitBtn.innerHTML = originalText;
                }
            }
        });
        
        // Real-time validation
        setupRealTimeValidation();
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
    });
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
}

function showFormErrors(errors) {
    errors.forEach(error => {
        if (error.includes('Name')) {
            showError('name', error);
        } else if (error.includes('Email')) {
            showError('email', error);
        } else if (error.includes('Subject')) {
            showError('subject', error);
        } else if (error.includes('Message')) {
            showError('message', error);
        }
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = document.querySelector(`#${fieldId}`).closest('.form-group');
    
    if (errorElement && formGroup) {
        errorElement.textContent = message;
        formGroup.classList.add('error');
    }
}

function setupRealTimeValidation() {
    const fields = ['name', 'email', 'subject', 'message'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field && errorElement) {
            field.addEventListener('blur', () => {
                validateField(fieldId, field.value);
            });
            
            field.addEventListener('input', () => {
                // Clear error when user starts typing
                if (errorElement.textContent) {
                    errorElement.textContent = '';
                    field.closest('.form-group').classList.remove('error');
                }
            });
        }
    });
}

function validateField(fieldId, value) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const formGroup = document.querySelector(`#${fieldId}`).closest('.form-group');
    
    if (!errorElement || !formGroup) return;
    
    let error = '';
    
    switch(fieldId) {
        case 'name':
            if (!value.trim()) error = 'Name is required';
            else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
            break;
        case 'email':
            if (!value.trim()) error = 'Email is required';
            else if (!isValidEmail(value)) error = 'Please enter a valid email address';
            break;
        case 'subject':
            if (!value.trim()) error = 'Subject is required';
            else if (value.trim().length < 5) error = 'Subject must be at least 5 characters';
            break;
        case 'message':
            if (!value.trim()) error = 'Message is required';
            else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
            break;
    }
    
    if (error) {
        errorElement.textContent = error;
        formGroup.classList.add('error');
    } else {
        errorElement.textContent = '';
        formGroup.classList.remove('error');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// AOS Animation
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
}

// Additional Interactive Features

// Floating Elements Animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Randomize animation delays and durations
        const delay = index * 0.5;
        const duration = 3 + Math.random() * 2;
        
        element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Cursor Effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Add styles for custom cursor
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--secondary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hide cursor on touch devices
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initFloatingElements();
    // initCursorEffects(); // Uncomment if you want custom cursor
    
    // Add hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .btn, .card, .project-card, .skill-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Your scroll-related functions here
}, 100));