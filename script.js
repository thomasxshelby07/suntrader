document.addEventListener('DOMContentLoaded', () => {
    console.log('Sun Trader Initialized');

    // --------------------------------------------------------
    // 1. Theme Toggle Logic
    // --------------------------------------------------------
    const themeBtn = document.querySelector('.theme-toggle-btn');
    const htmlEl = document.documentElement;
    document.documentElement.setAttribute('data-theme', 'dark'); // Enforce Dark Mode

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const isMobile = window.innerWidth < 768;

    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        if (themeBtn) themeBtn.innerHTML = savedTheme === 'light' ? '<span>🌙</span>' : '<span>☀️</span>';
    } else if (isMobile) {
        htmlEl.setAttribute('data-theme', 'light');
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --------------------------------------------------------
    // 2. Header Scroll Effect (Smart Hide/Show)
    // --------------------------------------------------------
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add frosted glass effect when scrolled
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Smart Hide/Show Logic
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('nav-hidden'); // Scrolling DOWN -> Hide
        } else {
            header.classList.remove('nav-hidden'); // Scrolling UP -> Show
        }
        lastScrollY = currentScrollY;
    });

    // --------------------------------------------------------
    // 3. Mobile Menu Toggle
    // --------------------------------------------------------
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuCloseBtn = document.querySelector('.mobile-menu-close');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                navLinks.classList.add('active');
                menuToggle.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock Scroll
            }
        });

        const closeMenu = () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = ''; // Unlock Scroll
        };

        if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --------------------------------------------------------
    // 4. Hero Section Blending Cursor
    // --------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    const heroCursor = document.getElementById('hero-cursor');

    if (heroSection && heroCursor) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroCursor.style.left = `${x}px`;
            heroCursor.style.top = `${y}px`;
        });

        heroSection.addEventListener('mouseenter', () => {
            heroCursor.style.opacity = '1';
            heroCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        heroSection.addEventListener('mouseleave', () => {
            heroCursor.style.opacity = '0';
            heroCursor.style.transform = 'translate(-50%, -50%) scale(0)';
        });
    }

    // --------------------------------------------------------
    // 5. GSAP Animations & ScrollTrigger
    // --------------------------------------------------------
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal Sequence - INSTANT FEEL
        const heroTl = gsap.timeline();
        heroTl.to('.hero-title', { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' })
            .to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }, '-=0.4')
            .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }, '-=0.4');

        // Dashboard Mockup Parallax
        gsap.to('.dashboard-img', {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.dashboard-mockup',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Staggered Reveal for Cards - FASTER
        // Staggered Reveal for Cards - FASTER & RESPONSIVE
        const revealElements = document.querySelectorAll('.slide-up, .feature-card, .glass-card, .dashboard-mockup, .stat-item, .faq-item, .faq-more');
        revealElements.forEach(element => {
            // Check for delay classes
            let delayTime = 0;
            if (element.classList.contains('delay-1')) delayTime = 0.1;
            if (element.classList.contains('delay-2')) delayTime = 0.2;
            if (element.classList.contains('delay-3')) delayTime = 0.3;

            gsap.fromTo(element,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: delayTime, // Use computed delay
                    ease: 'power3.out', // Smoother feel
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 95%', // Triggers almost immediately when entering view
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Stagger List Items
        gsap.from('.values-list li', {
            scrollTrigger: {
                trigger: '.values-list',
                start: 'top 90%', // Triggers sooner
            },
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05, // Rapid fire
            ease: 'back.out(1.7)' // Pop effect
        });

        // Old Stats Counter (Removed to avoid conflict with new Premium Stats logic)

    }

    // --------------------------------------------------------
    // 6. Lenis Smooth Scroll
    // --------------------------------------------------------
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.0, // Smoother but still responsive
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } else {
        console.warn('Lenis not loaded');
    }
});

// --------------------------------------------------------
// 7. Video Auto-Play Handling
// --------------------------------------------------------
window.addEventListener('load', () => {
    const video = document.getElementById('hero-video');
    if (video) {
        const source = document.createElement('source');
        source.src = 'herovideo.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => video.classList.add('loaded')).catch(e => console.log('Autoplay blocked'));
        }

        // Force loop if it ends (fallback)
        video.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    // --------------------------------------------------------
    // 7. Horizontal Scroll (Key Features) - NEW UNIQUE LAYOUT
    // --------------------------------------------------------
    // --------------------------------------------------------
    // 7. Horizontal Scroll (Key Features) - NEW UNIQUE LAYOUT
    // --------------------------------------------------------
    // --------------------------------------------------------
    // 7. Horizontal Scroll (Key Features) - ROBUST
    // --------------------------------------------------------
    // --------------------------------------------------------
    // 7. Horizontal Scroll (Key Features) - NATIVE + WHEEL HOOK
    // --------------------------------------------------------
    const featuresSection = document.querySelector('.key-features-section');
    const track = document.querySelector('.horizontal-scroll-track');

    if (featuresSection && track && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        console.log('Horizontal Scroll: GSAP Sticky Initialized');

        function getScrollAmount() {
            let trackWidth = track.scrollWidth;
            return -(trackWidth - window.innerWidth);
        }

        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
        });

        ScrollTrigger.create({
            trigger: featuresSection,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true
        });
    }

    // --------------------------------------------------------
    // 8. FAQ Accordion Logic
    // --------------------------------------------------------

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current
            item.classList.toggle('active');
        });
    });

    // --------------------------------------------------------
    // 9. UI/UX Phone Interaction
    // --------------------------------------------------------
    const phones = document.querySelectorAll('.phone-mockup');

    // Set default active
    if (phones.length > 1) {
        phones[1].classList.add('active'); // Center phone
    }

    phones.forEach(phone => {
        phone.addEventListener('click', () => {
            // Remove active from all
            phones.forEach(p => p.classList.remove('active'));
            // Add active to clicked
            phone.classList.add('active');
        });
    });


    // --------------------------------------------------------
    // 10. CUSTOM UI/UX SECTION ANIMATION (Smooth Entry)
    // --------------------------------------------------------
    if (typeof gsap !== 'undefined') {
        const uiUxTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.ui-ux-section',
                start: 'top 75%', // Start when section is mostly visible
                toggleActions: 'play none none reverse'
            }
        });

        // Content slides in from left
        uiUxTl.fromTo('.ui-ux-content', {
            x: -50,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
        })
            // Visual (Phones) slides in from right with a slight delay
            .fromTo('.ui-ux-visual', {
                x: 50,
                opacity: 0,
                scale: 0.95
            }, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out'
            }, '-=0.8'); // Overlap for smoothness
    }
});

// --------------------------------------------------------
// 8. Premium Stats Counter Animation
// --------------------------------------------------------
const statsSection = document.querySelector('.stats-section');
const counters = document.querySelectorAll('.counter');
let started = false;

function startCount(el) {
    const target = +el.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 20); // 60fps approx (1000ms / 20ms = 50 steps) - wait, duration/16ms is better.
    // Let's use a simple interval

    let current = 0;
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            el.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            el.innerText = target;
        }
    };
    updateCounter();
}

if (statsSection && counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            counters.forEach((counter) => startCount(counter));
            started = true;
        }
    }, {
        threshold: 0.3 // Trigger earlier
    });
    observer.observe(statsSection);
}
// --------------------------------------------------------
// 9. Contact Section Animations (Mast Entry)
// --------------------------------------------------------
if (document.querySelector('.contact-section')) {
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%', // Trigger when section comes into view
            toggleActions: 'play none none reverse'
        }
    });

    // Text Slide In from Left
    contactTl.to('.anim-fade-right', {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, 0)
        // Image Slide In from Right
        .to('.anim-fade-left', {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, 0.2); // Slight staggered start
}
