// Main Application Controller
class WebBloomApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupForms();
        this.setupAdminSystem();
        this.setupParticles();
        this.setupScrollEffects();
        this.setupInteractiveElements();
        this.trackAnalytics();
    }

    // Navigation Setup
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Active nav link highlighting
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
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
    }

    // Advanced Animations Setup
    setupAnimations() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Landing animation
        const landingTimeline = gsap.timeline();
        landingTimeline
            .from('.spinning-globe', {
                scale: 0,
                rotation: 360,
                duration: 1.5,
                ease: 'bounce.out'
            })
            .from('.landing-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.landing-subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3');

        // Tilt card effects
        this.setupTiltCards();

        // Service and pricing cards animation
        gsap.utils.toArray('.tilt-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 100,
                rotateX: 45,
                duration: 1.2,
                ease: 'power3.out',
                delay: i * 0.1
            });
        });

        // Floating cards in hero section
        gsap.utils.toArray('.floating-card').forEach((card, i) => {
            gsap.to(card, {
                y: -20,
                duration: 2 + i * 0.5,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1
            });
        });

        // Section scroll animations
        gsap.utils.toArray('.scroll-effect').forEach((section, i) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 80,
                scale: 0.95,
                duration: 1.2,
                ease: 'power2.out',
                delay: i * 0.2
            });
        });
    }

    // Tilt Card Effects
    setupTiltCards() {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = -(y - centerY) / 10;
                const rotateY = (x - centerX) / 10;
                
                gsap.to(card, {
                    duration: 0.3,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Enhanced Form System
    setupForms() {
        const forms = document.querySelectorAll('.enhanced-form');
        
        forms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        const submitBtn = form.querySelector('.submit-btn');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const isValid = this.validateForm(form);
            if (!isValid) return;

            await this.submitForm(form);
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        // File validation
        if (field.type === 'file' && field.files.length > 0) {
            const file = field.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (file.size > maxSize) {
                isValid = false;
                message = 'File size should be less than 5MB';
            } else if (!allowedTypes.includes(file.type)) {
                isValid = false;
                message = 'Only PDF and Word documents are allowed';
            }
        }

        // Update field appearance and error message
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const formData = new FormData(form);
        const formType = form.id;

        // Show loading state
        submitBtn.classList.add('loading');

        try {
            // Simulate form submission
            await this.delay(2000);
            
            // Store form data locally for admin access
            this.storeFormSubmission(formType, formData);
            
            // Show success message
            this.showToast('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();
            form.querySelectorAll('.success').forEach(field => {
                field.classList.remove('success');
            });

        } catch (error) {
            this.showToast('Failed to submit form. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    storeFormSubmission(formType, formData) {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        const submission = {
            id: Date.now(),
            type: formType,
            timestamp: new Date().toISOString(),
            data: Object.fromEntries(formData.entries())
        };
        
        submissions.unshift(submission);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions.slice(0, 100))); // Keep only last 100
        
        // Update analytics
        this.updateAnalytics('submission');
    }

    // Admin System
    setupAdminSystem() {
        const adminBtn = document.getElementById('adminLoginBtn');
        const adminModal = document.getElementById('adminModal');
        const adminDashboard = document.getElementById('adminDashboard');
        const adminForm = document.getElementById('adminLoginForm');
        const logoutBtn = document.getElementById('logoutBtn');

        // Admin login button
        adminBtn.addEventListener('click', () => {
            if (this.isAdminLoggedIn()) {
                this.showAdminDashboard();
            } else {
                this.showModal(adminModal);
            }
        });

        // Admin login form
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminLogin();
        });

        // Logout
        logoutBtn.addEventListener('click', () => {
            this.adminLogout();
        });

        // Dashboard tabs
        this.setupDashboardTabs();

        // Check if admin is already logged in
        if (this.isAdminLoggedIn()) {
            adminBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path></svg>';
            adminBtn.title = 'Admin Dashboard';
        }
    }

    handleAdminLogin() {
        const passwordInput = document.getElementById('adminPassword');
        const password = passwordInput.value;
        const errorElement = document.getElementById('adminPasswordError');
        
        // Simple password check (in production, use proper authentication)
        const adminPassword = 'admin123'; // This should be in environment variables
        
        if (password === adminPassword) {
            // Set admin session
            localStorage.setItem('adminSession', JSON.stringify({
                loggedIn: true,
                timestamp: Date.now()
            }));
            
            this.hideModal(document.getElementById('adminModal'));
            this.showAdminDashboard();
            this.showToast('Admin login successful!', 'success');
            
            // Update admin button
            const adminBtn = document.getElementById('adminLoginBtn');
            adminBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path></svg>';
            adminBtn.title = 'Admin Dashboard';
            
        } else {
            errorElement.textContent = 'Invalid password';
            errorElement.classList.add('show');
            passwordInput.classList.add('error');
            this.showToast('Invalid admin password', 'error');
        }
        
        passwordInput.value = '';
    }

    isAdminLoggedIn() {
        const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
        const oneHour = 60 * 60 * 1000;
        
        return session.loggedIn && (Date.now() - session.timestamp < oneHour);
    }

    showAdminDashboard() {
        if (!this.isAdminLoggedIn()) {
            this.showToast('Admin session expired. Please login again.', 'warning');
            return;
        }
        
        this.loadDashboardData();
        this.showModal(document.getElementById('adminDashboard'));
    }

    adminLogout() {
        localStorage.removeItem('adminSession');
        this.hideModal(document.getElementById('adminDashboard'));
        this.showToast('Logged out successfully', 'success');
        
        // Reset admin button
        const adminBtn = document.getElementById('adminLoginBtn');
        adminBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
        adminBtn.title = 'Admin Access';
    }

    setupDashboardTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab pane
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetTab) {
                        pane.classList.add('active');
                    }
                });
                
                // Load tab-specific data
                this.loadTabData(targetTab);
            });
        });
    }

    loadDashboardData() {
        this.loadTabData('submissions');
        this.loadTabData('analytics');
    }

    loadTabData(tab) {
        switch (tab) {
            case 'submissions':
                this.loadSubmissions();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    loadSubmissions() {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        const container = document.getElementById('submissionsList');
        
        if (submissions.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light);">No submissions yet.</p>';
            return;
        }
        
        container.innerHTML = submissions.map(submission => `
            <div class="submission-item">
                <div class="submission-header">
                    <span class="submission-name">${submission.data.fullName || submission.data.contactName || 'Anonymous'}</span>
                    <span class="submission-date">${new Date(submission.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="submission-details">
                    <strong>Type:</strong> ${submission.type === 'jobApplicationForm' ? 'Job Application' : 'Contact Form'}<br>
                    <strong>Email:</strong> ${submission.data.email || 'N/A'}<br>
                    ${submission.data.phone ? `<strong>Phone:</strong> ${submission.data.phone}<br>` : ''}
                    ${submission.data.contactSubject ? `<strong>Subject:</strong> ${submission.data.contactSubject}<br>` : ''}
                    ${submission.data.skillLevel ? `<strong>Skill Level:</strong> ${submission.data.skillLevel}<br>` : ''}
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        const analytics = JSON.parse(localStorage.getItem('siteAnalytics') || '{}');
        
        document.getElementById('totalVisits').textContent = analytics.visits || 0;
        document.getElementById('totalSubmissions').textContent = analytics.submissions || 0;
        
        const conversionRate = analytics.visits > 0 ? 
            ((analytics.submissions / analytics.visits) * 100).toFixed(1) + '%' : '0%';
        document.getElementById('conversionRate').textContent = conversionRate;
    }

    updateAnalytics(type) {
        const analytics = JSON.parse(localStorage.getItem('siteAnalytics') || '{}');
        
        if (type === 'visit') {
            analytics.visits = (analytics.visits || 0) + 1;
        } else if (type === 'submission') {
            analytics.submissions = (analytics.submissions || 0) + 1;
        }
        
        localStorage.setItem('siteAnalytics', JSON.stringify(analytics));
    }

    // Particles System
    setupParticles() {
        const particlesBg = document.getElementById('particlesBg');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesBg);
        }

        // Continuously create new particles
        setInterval(() => {
            if (particlesBg.children.length < particleCount) {
                this.createParticle(particlesBg);
            }
        }, 3000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation duration
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }

    // Scroll Effects
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-effect').forEach(el => {
            observer.observe(el);
        });
    }

    // Interactive Elements
    setupInteractiveElements() {
        // Interactive cards
        document.querySelectorAll('.interactive-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.1,
                    rotateY: 10,
                    z: 50,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    scale: 1,
                    rotateY: 0,
                    z: 0,
                    ease: 'power2.out'
                });
            });
        });

        // Logo click effect
        document.querySelector('.logo-3d').addEventListener('click', () => {
            gsap.to('.logo-3d', {
                duration: 0.5,
                rotation: 360,
                scale: 1.2,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    gsap.set('.logo-3d', { rotation: 0, scale: 1 });
                }
            });
        });
    }

    // Modal System
    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
        
        // Close modal with escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal(modal));
        }
    }

    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Clear form errors when closing
        const form = modal.querySelector('form');
        if (form) {
            form.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });
            form.querySelectorAll('.form-error.show').forEach(error => {
                error.classList.remove('show');
            });
        }
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Utility Functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackAnalytics() {
        // Track page visit
        this.updateAnalytics('visit');
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = Math.round(scrollPercent);
                // Could send analytics data to server here
            }
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebBloomApp();
});

// Additional utility functions for enhanced interactions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
    };
}

// Performance optimization
const resizeHandler = debounce(() => {
    // Handle window resize events
    window.dispatchEvent(new Event('optimizedResize'));
}, 250);

window.addEventListener('resize', resizeHandler);

// Preload critical resources
const preloadResources = () => {
    const criticalResources = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
    });
};

// Initialize preloading
preloadResources();
