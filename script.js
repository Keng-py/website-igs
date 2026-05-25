// ========================================
// IGNATIUS GLOBAL SCHOOL - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    CustomCursor.init();
    Navbar.init();
    HeroSlider.init();
    ScrollAnimations.init();
    StatsCounter.init();
    PrestasiFilter.init();
    Gallery.init();
    ContactForm.init();
    BackToTop.init();
    ThemeToggle.init();
});

// ========================================
// PRELOADER
// ========================================
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 1500);
        });
    }
};

// ========================================
// CUSTOM CURSOR
// ========================================
const CustomCursor = {
    init() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animate = () => {
            // Cursor follows immediately
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Follower follows with delay
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .person-card, .prestasi-card, .berita-card, .gallery-item');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover');
            });
        });
    }
};

// ========================================
// NAVBAR
// ========================================
const Navbar = {
    init() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
};

// ========================================
// HERO SLIDER
// ========================================
const HeroSlider = {
    currentSlide: 0,
    slides: null,
    dots: null,
    progressBar: null,
    autoplayInterval: null,
    autoplayDelay: 6000,
    
    init() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.progressBar = document.querySelector('.progress-bar');
        
        if (!this.slides.length) return;
        
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        prevBtn.addEventListener('click', () => this.prevSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.startAutoplay();
        
        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoplay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },
    
    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        if (this.currentSlide >= this.slides.length) this.currentSlide = 0;
        if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;
        
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        this.resetProgress();
    },
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    },
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    },
    
    resetProgress() {
        if (this.progressBar) {
            this.progressBar.style.animation = 'none';
            this.progressBar.offsetHeight; // Trigger reflow
            this.progressBar.style.animation = `progress ${this.autoplayDelay}ms linear infinite`;
        }
    },
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
};

// ========================================
// SCROLL ANIMATIONS
// ========================================
const ScrollAnimations = {
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
        
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            document.querySelectorAll('.parallax-bg').forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
};

// ========================================
// STATS COUNTER
// ========================================
const StatsCounter = {
    init() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        stats.forEach(stat => observer.observe(stat));
    },
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
};

// ========================================
// PRESTASI FILTER
// ========================================
const PrestasiFilter = {
    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.prestasi-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                cards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
};

// ========================================
// GALLERY LIGHTBOX
// ========================================
const Gallery = {
    currentIndex: 0,
    images: [],
    
    init() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        if (!galleryItems.length || !lightbox) return;
        
        // Collect all images
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            this.images.push(img.src);
            
            item.addEventListener('click', () => {
                this.currentIndex = index;
                this.openLightbox();
            });
        });
        
        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    },
    
    openLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        lightboxImage.src = this.images[this.currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    prevImage() {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.images.length - 1;
        
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = this.images[this.currentIndex];
            lightboxImage.style.opacity = '1';
        }, 200);
    },
    
    nextImage() {
        this.currentIndex++;
        if (this.currentIndex >= this.images.length) this.currentIndex = 0;
        
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = this.images[this.currentIndex];
            lightboxImage.style.opacity = '1';
        }, 200);
    }
};

// ========================================
// CONTACT FORM
// ========================================
const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.btn-submit');
            const formData = new FormData(form);
            
            // Add loading state
            submitBtn.classList.add('loading');
            
            // Simulate form submission (replace with actual API call)
            try {
                await this.submitForm(formData);
                
                // Success
                this.showNotification('Pesan berhasil dikirim! Terima kasih atas masukan Anda.', 'success');
                form.reset();
                
            } catch (error) {
                // Error
                this.showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
            }
            
            submitBtn.classList.remove('loading');
        });
        
        // Input animation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    },
    
    async submitForm(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Random success/failure for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Failed'));
                }
            }, 2000);
        });
    },
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '20px 30px',
            background: type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            zIndex: '10000',
            animation: 'slideIn 0.5s ease'
        });
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
};

// Add notification animations to CSS via JS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// BACK TO TOP
// ========================================
const BackToTop = {
    init() {
        const button = document.getElementById('backToTop');
        
        if (!button) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ========================================
// THEME TOGGLE
// ========================================
const ThemeToggle = {
    init() {
        const toggle = document.getElementById('themeToggle');
        const icon = toggle.querySelector('i');
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateIcon(icon, savedTheme);
        }
        
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateIcon(icon, newTheme);
        });
    },
    
    updateIcon(icon, theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
};

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        
        if (target) {
            e.preventDefault();
            
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// TYPEWRITER EFFECT (Optional Enhancement)
// ========================================
const TypeWriter = {
    init(element, texts, wait = 3000) {
        this.element = element;
        this.texts = texts;
        this.wait = parseInt(wait, 10);
        this.txt = '';
        this.textIndex = 0;
        this.isDeleting = false;
        this.type();
    },
    
    type() {
        const current = this.textIndex % this.texts.length;
        const fullTxt = this.texts[current];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.element.innerHTML = `<span class="txt">${this.txt}</span>`;
        
        let typeSpeed = 100;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
};

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================
const ScrollReveal = {
    init() {
        const reveals = document.querySelectorAll('.reveal');
        
        window.addEventListener('scroll', () => {
            reveals.forEach(reveal => {
                const windowHeight = window.innerHeight;
                const revealTop = reveal.getBoundingClientRect().top;
                const revealPoint = 150;
                
                if (revealTop < windowHeight - revealPoint) {
                    reveal.classList.add('active');
                }
            });
        });
    }
};

// ========================================
// MAGNETIC BUTTONS (Optional)
// ========================================
const MagneticButtons = {
    init() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
};

// Initialize magnetic buttons
MagneticButtons.init();

// ========================================
// TILT EFFECT FOR CARDS
// ========================================
const TiltEffect = {
    init() {
        const cards = document.querySelectorAll('.person-card, .prestasi-card, .bahasa-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
};

// Initialize tilt effect
TiltEffect.init();

// ========================================
// PARTICLE BACKGROUND (Optional)
// ========================================
const ParticleBackground = {
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            Object.assign(particle.style, {
                width: size + 'px',
                height: size + 'px',
                left: x + '%',
                top: y + '%',
                animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                opacity: Math.random() * 0.5 + 0.2
            });
            
            container.appendChild(particle);
        }
    }
};

// ========================================
// LAZY LOADING IMAGES
// ========================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// Initialize lazy load
LazyLoad.init();

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log(`
%c
╔═══════════════════════════════════════════╗
║                                           ║
║     IGNATIUS GLOBAL SCHOOL               ║
║     Website by [Your Name]               ║
║                                           ║
║     🎓 Building Future Leaders           ║
║                                           ║
╚═══════════════════════════════════════════╝
`, 'color: #2563eb; font-size: 14px; font-weight: bold;');
