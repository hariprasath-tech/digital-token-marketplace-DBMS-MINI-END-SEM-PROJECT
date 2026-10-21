/**
 * NEXUS Animations & Micro-Interactions (ES Module)
 * 60fps High Performance Pass: GSAP Ticker + Lenis + ScrollTrigger Batch
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

let activeLenisInstance = null;

// Smooth Scrolling with Lenis driven strictly by GSAP Ticker
export function initLenis() {
    if (activeLenisInstance) return activeLenisInstance;
    if (typeof window.Lenis === 'undefined') return null;

    const lenis = new window.Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false
    });
    activeLenisInstance = lenis;

    const hasGsap = typeof window.gsap !== 'undefined';
    const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

    if (hasGsap && hasScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        // Connect Lenis scroll events to ScrollTrigger updates
        lenis.on('scroll', window.ScrollTrigger.update);

        // Drive Lenis strictly through GSAP Ticker (Single rAF Loop)
        window.gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        window.gsap.ticker.lagSmoothing(0);
    } else {
        // Fallback single rAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Toggle .is-scrolling class on body to pause heavy background animations during scroll
    let scrollTimeout = null;
    lenis.on('scroll', () => {
        if (!document.body.classList.contains('is-scrolling')) {
            document.body.classList.add('is-scrolling');
        }
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 120);
    });

    return lenis;
}

// Kill all ScrollTrigger instances and active GSAP tweens on route change
export function cleanupAnimations() {
    if (typeof window.ScrollTrigger !== 'undefined') {
        window.ScrollTrigger.getAll().forEach(st => st.kill());
    }
    if (typeof window.gsap !== 'undefined') {
        window.gsap.killTweensOf('*');
    }
}

// Magnetic Buttons (Desktop only, passive listeners, rAF throttled, cached bounds)
export function initMagneticButtons() {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.cyber-btn, .magnetic-btn, .nav-item');
    buttons.forEach(btn => {
        if (btn._hasMagnetic) return;
        btn._hasMagnetic = true;

        let bounds = null;
        let rafId = null;

        btn.addEventListener('mouseenter', () => {
            bounds = btn.getBoundingClientRect();
        }, { passive: true });

        btn.addEventListener('mousemove', (e) => {
            if (!bounds || rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;
                btn.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
            });
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            bounds = null;
            btn.style.transform = 'translate3d(0, 0, 0)';
            btn.style.transition = 'transform 0.28s ease-out';
            setTimeout(() => {
                btn.style.transition = '';
            }, 280);
        }, { passive: true });
    });
}

// 3D Card Tilt Effect (Throttled with rAF, cached bounds, desktop only, no layout thrashing)
export function initCardTilt(container = document) {
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || prefersReducedMotion) return;

    const cards = container.querySelectorAll('.token-card, .detail-main-card, .stat-counter-card');
    cards.forEach(card => {
        if (card._hasTilt) return;
        card._hasTilt = true;

        let bounds = null;
        let rafId = null;

        function onEnter() {
            bounds = card.getBoundingClientRect();
            card.style.willChange = 'transform';
        }

        function mouseMove(e) {
            if (!bounds || rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const leftX = mouseX - bounds.left;
                const topY = mouseY - bounds.top;

                const centerX = leftX - bounds.width / 2;
                const centerY = topY - bounds.height / 2;

                const maxRotation = 6;
                const rotateX = (centerY / (bounds.height / 2)) * -maxRotation;
                const rotateY = (centerX / (bounds.width / 2)) * maxRotation;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

                const shine = card.querySelector('.token-card-shine');
                if (shine) {
                    shine.style.background = `radial-gradient(circle at ${leftX.toFixed(0)}px ${topY.toFixed(0)}px, rgba(0, 240, 255, 0.12) 0%, rgba(139, 92, 255, 0.05) 40%, transparent 70%)`;
                    shine.style.opacity = '1';
                }
            });
        }

        function mouseLeave() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            bounds = null;
            card.style.willChange = 'auto';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.transition = 'transform 0.35s ease-out';

            const shine = card.querySelector('.token-card-shine');
            if (shine) {
                shine.style.opacity = '0';
            }
            setTimeout(() => {
                card.style.transition = '';
            }, 350);
        }

        card.addEventListener('mouseenter', onEnter, { passive: true });
        card.addEventListener('mousemove', mouseMove, { passive: true });
        card.addEventListener('mouseleave', mouseLeave, { passive: true });
    });
}

// Animated Number Counters (Throttled & Simple Ease)
export function animateCounters(container = document) {
    const counterElements = container.querySelectorAll('[data-counter]');
    if (counterElements.length === 0) return;

    counterElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const duration = 1000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * ease);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    });
}

// GSAP ScrollTrigger.batch for Smooth Card & Section Reveals
export function initScrollReveals() {
    const reveals = document.querySelectorAll('.gsap-reveal:not(.revealed)');
    if (reveals.length === 0) return;

    if (
        typeof window.gsap === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        navigator.webdriver
    ) {
        // Immediate fallback
        reveals.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('revealed');
        });
        return;
    }

    const { gsap, ScrollTrigger } = window;

    if (ScrollTrigger && typeof ScrollTrigger.batch === 'function') {
        ScrollTrigger.batch(reveals, {
            interval: 0.1,
            batchMax: 6,
            onEnter: (batch) => {
                gsap.fromTo(batch, {
                    opacity: 0,
                    y: 18
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.38,
                    stagger: 0.04,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity',
                    onComplete: () => {
                        batch.forEach(el => el.classList.add('revealed'));
                    }
                });
            },
            once: true
        });
    } else {
        // Staggered fallback
        gsap.fromTo(reveals, {
            opacity: 0,
            y: 18
        }, {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            onComplete: () => {
                reveals.forEach(el => el.classList.add('revealed'));
            }
        });
    }
}
