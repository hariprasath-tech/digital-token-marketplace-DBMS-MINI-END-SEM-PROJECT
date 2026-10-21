/**
 * NEXUS Animations & Micro-Interactions (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

// Smooth Scrolling with Lenis
export function initLenis() {
    if (typeof window.Lenis !== 'undefined') {
        const lenis = new window.Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return lenis;
    }
    return null;
}

// Magnetic Buttons
export function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const buttons = document.querySelectorAll('.cyber-btn, .magnetic-btn, .nav-item');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            setTimeout(() => {
                btn.style.transition = '';
            }, 300);
        });
    });
}

// 3D Card Tilt Effect with Holographic Glare
export function initCardTilt(container = document) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = container.querySelectorAll('.token-card, .detail-main-card, .stat-counter-card');
    cards.forEach(card => {
        let bounds;

        function mouseMove(e) {
            bounds = card.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            };
            const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

            const maxRotation = 8;
            const rotateX = (center.y / (bounds.height / 2)) * -maxRotation;
            const rotateY = (center.x / (bounds.width / 2)) * maxRotation;

            card.style.zIndex = '20';
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
                scale3d(1.015, 1.015, 1.015)
            `;

            // Adjust subtle glow shine
            const shine = card.querySelector('.token-card-shine');
            if (shine) {
                const angle = Math.atan2(center.y, center.x) * (180 / Math.PI);
                shine.style.background = `radial-gradient(circle at ${leftX}px ${topY}px, rgba(0, 240, 255, 0.15) 0%, rgba(139, 92, 255, 0.08) 40%, transparent 70%)`;
                shine.style.opacity = '1';
            }
        }

        function mouseLeave() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.4s ease-out';
            card.style.zIndex = '';
            const shine = card.querySelector('.token-card-shine');
            if (shine) {
                shine.style.opacity = '0';
            }
            setTimeout(() => {
                card.style.transition = '';
            }, 400);
        }

        card.removeEventListener('mousemove', card._tiltMove);
        card.removeEventListener('mouseleave', card._tiltLeave);
        card._tiltMove = mouseMove;
        card._tiltLeave = mouseLeave;
        card.addEventListener('mousemove', mouseMove);
        card.addEventListener('mouseleave', mouseLeave);
    });
}

// Animated Number Counters
export function animateCounters(container = document) {
    const counterElements = container.querySelectorAll('[data-counter]');

    counterElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
        const duration = 1200; // ms
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * ease);

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

// GSAP Section Reveals (60fps: animate ONLY transform and opacity)
export function initScrollReveals() {
    const reveals = document.querySelectorAll('.gsap-reveal:not(.revealed)');
    if (reveals.length === 0) return;

    if (typeof window.gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.webdriver) {
        // Fallback / automation: make elements immediately visible
        reveals.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('revealed');
        });
        return;
    }

    const { gsap } = window;

    // Staggered reveal animating transform & opacity only
    gsap.fromTo(reveals, {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        onComplete: () => {
            reveals.forEach(el => el.classList.add('revealed'));
        }
    });
}
