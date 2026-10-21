/**
 * NEXUS UI Components, Effects & Helpers (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

// Refresh Lucide SVGs
export function refreshIcons() {
    if (typeof window !== 'undefined' && window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// Toast Notifications (Zero Emojis, Neon Glow & Slide)
export function showToast(message, type = 'info', duration = 3800) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `cyber-toast ${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'error') iconName = 'alert-triangle';
    if (type === 'warning') iconName = 'alert-circle';

    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon ${type}"></i>
        <div class="toast-content">${message}</div>
        <button class="toast-close" type="button" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);
    refreshIcons();

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => dismissToast(toast));
    }

    const timer = setTimeout(() => dismissToast(toast), duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
}

function dismissToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%) scale(0.92)';
    toast.style.transition = 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => toast.remove(), 280);
}

// Animated Expiry Countdown Ring
export function createCountdownRing(expiryDateStr, size = 46, strokeWidth = 3.5) {
    if (!expiryDateStr) {
        return `
            <div class="countdown-ring-wrapper" style="width:${size}px; height:${size}px;" title="No Expiry">
                <span class="countdown-ring-text">--</span>
            </div>
        `;
    }

    const now = Date.now();
    const expiry = new Date(expiryDateStr).getTime();
    const diff = expiry - now;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let strokeClass = 'ring-emerald';
    let label = '';
    let percent = 1;

    const totalWindowMs = 7 * 24 * 60 * 60 * 1000; // 7-day scale for ring representation

    if (diff <= 0) {
        strokeClass = 'ring-rose ring-expired pulse-fast';
        label = 'EXP';
        percent = 0;
    } else {
        const hours = diff / (1000 * 60 * 60);
        const days = Math.floor(hours / 24);
        const remHours = Math.floor(hours % 24);
        const remMins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours < 3) {
            strokeClass = 'ring-rose pulse-fast';
            label = `${remHours > 0 ? remHours + 'h' : remMins + 'm'}`;
        } else if (hours < 24) {
            strokeClass = 'ring-amber';
            label = `${Math.ceil(hours)}h`;
        } else {
            strokeClass = 'ring-emerald';
            label = `${days}d`;
        }

        percent = Math.max(0.04, Math.min(1, diff / totalWindowMs));
    }

    const dashoffset = circumference * (1 - percent);

    return `
        <div class="countdown-ring-wrapper" title="Expiry: ${formatDateTime(expiryDateStr)}" style="width:${size}px; height:${size}px;">
            <svg class="countdown-svg" width="${size}" height="${size}">
                <circle class="countdown-ring-bg"
                    cx="${size / 2}" cy="${size / 2}" r="${radius}"
                    stroke-width="${strokeWidth}" />
                <circle class="countdown-ring-progress ${strokeClass}"
                    cx="${size / 2}" cy="${size / 2}" r="${radius}"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${dashoffset}" />
            </svg>
            <span class="countdown-ring-text">${label}</span>
        </div>
    `;
}

// Status Badges with Pulse Dot
export function renderBadge(status) {
    const s = (status || 'AVAILABLE').toUpperCase();
    let badgeClass = 'badge-available';
    let text = 'AVAILABLE';

    switch (s) {
        case 'AVAILABLE':
            badgeClass = 'badge-available';
            text = 'AVAILABLE';
            break;
        case 'TRANSFER_PENDING':
            badgeClass = 'badge-pending';
            text = 'TRANSFER PENDING';
            break;
        case 'TRANSFERRED':
            badgeClass = 'badge-transferred';
            text = 'TRANSFERRED';
            break;
        case 'USED':
            badgeClass = 'badge-used';
            text = 'USED';
            break;
        case 'EXPIRED':
            badgeClass = 'badge-expired';
            text = 'EXPIRED';
            break;
        default:
            badgeClass = 'badge-available';
            text = s;
    }

    return `
        <span class="cyber-badge ${badgeClass}">
            <span class="badge-pulse-dot"></span>
            ${text}
        </span>
    `;
}

// Confetti Particle Burst on Transfer
export function triggerConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    const count = 48;
    const colors = ['#00f0ff', '#8b5cff', '#ff3df2', '#b6ff3c', '#ffffff'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'cyber-confetti-particle';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const isCircle = Math.random() > 0.5;

        particle.style.position = 'fixed';
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = isCircle ? '50%' : '2px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999999';
        particle.style.boxShadow = `0 0 10px ${color}`;

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 240 + 90;
        const destX = Math.cos(angle) * velocity;
        const destY = Math.sin(angle) * velocity + 100;
        const rotate = Math.random() * 720 - 360;

        const animation = particle.animate([
            { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) rotate(${rotate}deg) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 750 + 650,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        });

        animation.onfinish = () => particle.remove();
    }
}

// Modals
export function openModal(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    backdrop.classList.remove('hidden');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const firstInput = backdrop.querySelector('input:not([type=hidden]), select, textarea, button.cyber-btn');
        if (firstInput) firstInput.focus();
    }, 100);
}

export function closeModal(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    backdrop.classList.remove('visible');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
}

// Glowing Cursor with Trailing Particles (Desktop pointer:fine & hover:hover only)
export function initCursor() {
    if (typeof window === 'undefined') return;

    // Check media queries: strictly desktop with hover and pointer: fine, no reduced motion
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDesktop || prefersReducedMotion) return;

    let dot = document.getElementById('cursorDot');
    let ring = document.getElementById('cursorRing');

    if (!dot) {
        dot = document.createElement('div');
        dot.id = 'cursorDot';
        dot.className = 'nexus-cursor-dot';
        document.body.appendChild(dot);
    }
    if (!ring) {
        ring = document.createElement('div');
        ring.id = 'cursorRing';
        ring.className = 'nexus-cursor-ring';
        document.body.appendChild(ring);
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastParticleTime = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        const now = performance.now();
        if (now - lastParticleTime > 40) {
            lastParticleTime = now;
            spawnCursorParticle(mouseX, mouseY);
        }
    }, { passive: true });

    function renderRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    document.addEventListener('mouseover', (e) => {
        if (e.target && e.target.closest('a, button, input, select, textarea, .token-card, .category-chip, .custom-select-trigger, .nav-item')) {
            document.body.classList.add('cursor-hover');
        } else {
            document.body.classList.remove('cursor-hover');
        }
    }, { passive: true });
}

function spawnCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'nexus-cursor-particle';
    particle.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    document.body.appendChild(particle);

    const anim = particle.animate([
        { transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1)`, opacity: 0.8 },
        { transform: `translate3d(${x + (Math.random() * 16 - 8)}px, ${y + (Math.random() * 16 - 8)}px, 0) translate(-50%, -50%) scale(0)`, opacity: 0 }
    ], {
        duration: 340,
        easing: 'ease-out'
    });

    anim.onfinish = () => particle.remove();
}

// Skeletons
export function renderCardSkeletons(count = 6) {
    return Array.from({ length: count }).map(() => `
        <div class="token-card skeleton-card">
            <div class="skeleton-shimmer" style="height: 145px; border-radius: var(--radius-sm); margin-bottom: 14px;"></div>
            <div class="skeleton-shimmer" style="height: 16px; width: 40%; border-radius: 4px; margin-bottom: 10px;"></div>
            <div class="skeleton-shimmer" style="height: 24px; width: 85%; border-radius: 4px; margin-bottom: 14px;"></div>
            <div class="skeleton-shimmer" style="height: 14px; width: 65%; border-radius: 4px; margin-bottom: 8px;"></div>
            <div class="skeleton-shimmer" style="height: 14px; width: 50%; border-radius: 4px; margin-bottom: 18px;"></div>
            <div class="skeleton-shimmer" style="height: 38px; width: 100%; border-radius: var(--radius-sm); margin-top: auto;"></div>
        </div>
    `).join('');
}

// Formatting Utilities
export function formatDate(dtString) {
    if (!dtString) return 'Not Scheduled';
    const d = new Date(dtString);
    if (isNaN(d.getTime())) return 'Not Scheduled';
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export function formatDateTime(dtString) {
    if (!dtString) return 'Not Scheduled';
    const d = new Date(dtString);
    if (isNaN(d.getTime())) return 'Not Scheduled';
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getInitials(name) {
    if (!name) return 'SE';
    return name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// ====================================================================
// UNIQUE GENERATIVE SVG ARTWORK FOR ACTIVITY TOKENS
// Fallback art per activity type & ID (Zero Emojis, Pure SVG Vector)
// ====================================================================
export function getActivityCardArt(token) {
    if (!token) return generateUniqueActivitySvg(1, 'EVENT', 'Campus Activity', 'TKN-000');

    const explicitUrl = token.activityImageUrl || token.imageUrl;
    if (explicitUrl && typeof explicitUrl === 'string' && explicitUrl.trim().length > 0) {
        return explicitUrl.trim();
    }

    const actId = token.activityId || 1;
    const cat = (token.activityCategory || token.category || 'EVENT').toUpperCase();
    const title = token.activityTitle || token.title || 'Campus Activity';
    const code = token.tokenCode || `TKN-ACT-${actId}`;

    return generateUniqueActivitySvg(actId, cat, title, code);
}

export function generateUniqueActivitySvg(actId, category, title, code) {
    const id = parseInt(actId, 10) || 1;
    const cat = (category || 'EVENT').toUpperCase();
    const safeTitle = (title || 'Nexus Token').replace(/[<>&"]/g, '');
    const safeCode = (code || 'TKN').replace(/[<>&"]/g, '');

    let bgGrad = '';
    let accentColor = '#00f0ff';
    let subColor = '#8b5cf6';
    let graphics = '';

    if (id === 1 || cat.includes('AI') || (cat === 'WORKSHOP' && id !== 6)) {
        // GenAI & LLM Bootcamp: Neural network, synapse nodes, glowing core
        accentColor = '#00f0ff';
        subColor = '#8b5cf6';
        bgGrad = `
            <radialGradient id="g1" cx="40%" cy="40%" r="75%">
                <stop offset="0%" stop-color="#312e81"/>
                <stop offset="50%" stop-color="#1e1b4b"/>
                <stop offset="100%" stop-color="#050814"/>
            </radialGradient>
            <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f0ff"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
            </linearGradient>
        `;
        graphics = `
            <!-- Neural Synapse Connections -->
            <path d="M 100 225 Q 250 90 400 225 T 700 225" stroke="#00f0ff" stroke-width="2.5" fill="none" opacity="0.65" stroke-dasharray="8 4"/>
            <path d="M 140 330 Q 300 170 460 330 T 720 160" stroke="#a855f7" stroke-width="2.5" fill="none" opacity="0.55"/>
            <path d="M 200 110 L 400 225 L 600 130" stroke="#38bdf8" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 280 350 L 400 225 L 540 340" stroke="#818cf8" stroke-width="2" fill="none" opacity="0.7"/>
            
            <!-- Neural Nodes -->
            <circle cx="400" cy="225" r="32" fill="url(#g2)" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 0 20px #00f0ff)"/>
            <circle cx="400" cy="225" r="12" fill="#ffffff"/>
            <circle cx="200" cy="110" r="14" fill="#1e1b4b" stroke="#00f0ff" stroke-width="3" filter="drop-shadow(0 0 10px #00f0ff)"/>
            <circle cx="600" cy="130" r="16" fill="#1e1b4b" stroke="#c084fc" stroke-width="3" filter="drop-shadow(0 0 10px #c084fc)"/>
            <circle cx="140" cy="330" r="12" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2.5"/>
            <circle cx="700" cy="225" r="14" fill="#1e1b4b" stroke="#00f0ff" stroke-width="2.5"/>
            <circle cx="280" cy="350" r="10" fill="#818cf8"/>
            <circle cx="540" cy="340" r="11" fill="#00f0ff"/>
            
            <!-- AI Chip Micro-vectors -->
            <rect x="360" y="185" width="80" height="80" rx="10" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="6 3" opacity="0.85"/>
            <line x1="360" y1="205" x2="335" y2="205" stroke="#00f0ff" stroke-width="2.5"/>
            <line x1="360" y1="245" x2="335" y2="245" stroke="#00f0ff" stroke-width="2.5"/>
            <line x1="440" y1="205" x2="465" y2="205" stroke="#00f0ff" stroke-width="2.5"/>
            <line x1="440" y1="245" x2="465" y2="245" stroke="#00f0ff" stroke-width="2.5"/>
        `;
    } else if (id === 2 || cat.includes('EVENT') || cat.includes('HACK')) {
        // HackIndia National Hackathon: Wireframe digital matrix grid & code bracket geometry
        accentColor = '#10b981';
        subColor = '#00f0ff';
        bgGrad = `
            <radialGradient id="g1" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stop-color="#065f46"/>
                <stop offset="50%" stop-color="#022c22"/>
                <stop offset="100%" stop-color="#021410"/>
            </radialGradient>
        `;
        graphics = `
            <!-- Perspective Cyber Matrix Grid -->
            <g opacity="0.45" stroke="#10b981" stroke-width="1.5">
                <line x1="0" y1="340" x2="800" y2="340"/>
                <line x1="0" y1="375" x2="800" y2="375"/>
                <line x1="0" y1="415" x2="800" y2="415"/>
                <line x1="400" y1="220" x2="80" y2="450"/>
                <line x1="400" y1="220" x2="240" y2="450"/>
                <line x1="400" y1="220" x2="400" y2="450"/>
                <line x1="400" y1="220" x2="560" y2="450"/>
                <line x1="400" y1="220" x2="720" y2="450"/>
            </g>
            
            <!-- Central Hackathon Crest Geometry -->
            <polygon points="400,85 495,140 495,270 400,325 305,270 305,140" fill="#064e3b" fill-opacity="0.6" stroke="#10b981" stroke-width="3.5" filter="drop-shadow(0 0 20px #10b981)"/>
            <polygon points="400,115 465,155 465,255 400,295 335,255 335,155" fill="#022c22" fill-opacity="0.8" stroke="#00f0ff" stroke-width="2"/>
            
            <!-- Code Brackets < / > -->
            <path d="M 365 185 L 340 210 L 365 235" stroke="#00f0ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="drop-shadow(0 0 10px #00f0ff)"/>
            <path d="M 435 185 L 460 210 L 435 235" stroke="#00f0ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="drop-shadow(0 0 10px #00f0ff)"/>
            <line x1="414" y1="180" x2="386" y2="240" stroke="#34d399" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 8px #34d399)"/>
            
            <!-- Orbiting Particle Sparks -->
            <circle cx="495" cy="140" r="7" fill="#00f0ff" filter="drop-shadow(0 0 8px #00f0ff)"/>
            <circle cx="305" cy="270" r="7" fill="#10b981" filter="drop-shadow(0 0 8px #10b981)"/>
            <circle cx="400" cy="85" r="8" fill="#6ee7b7" filter="drop-shadow(0 0 10px #6ee7b7)"/>
        `;
    } else if (id === 3 || cat.includes('LAB') || cat.includes('ROBOT')) {
        // Drone Navigation & Flight Simulation: Radar target crosshairs, telemetry rings
        accentColor = '#38bdf8';
        subColor = '#2563eb';
        bgGrad = `
            <radialGradient id="g1" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stop-color="#1e3a8a"/>
                <stop offset="50%" stop-color="#0f172a"/>
                <stop offset="100%" stop-color="#020817"/>
            </radialGradient>
        `;
        graphics = `
            <!-- Concentric Telemetry Radar Rings -->
            <circle cx="400" cy="225" r="160" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.4" stroke-dasharray="12 6"/>
            <circle cx="400" cy="225" r="115" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.6"/>
            <circle cx="400" cy="225" r="68" fill="#1e3a8a" fill-opacity="0.5" stroke="#00f0ff" stroke-width="3" filter="drop-shadow(0 0 18px #00f0ff)"/>
            <circle cx="400" cy="225" r="16" fill="#00f0ff"/>
            <circle cx="400" cy="225" r="6" fill="#ffffff"/>
            
            <!-- Drone Crosshairs & Flight Vectors -->
            <line x1="160" y1="225" x2="640" y2="225" stroke="#38bdf8" stroke-width="2" opacity="0.75"/>
            <line x1="400" y1="35" x2="400" y2="415" stroke="#38bdf8" stroke-width="2" opacity="0.75"/>
            
            <!-- 4 Rotor Thrust Hubs -->
            <circle cx="320" cy="145" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2.5" filter="drop-shadow(0 0 8px #00f0ff)"/>
            <circle cx="480" cy="145" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2.5" filter="drop-shadow(0 0 8px #00f0ff)"/>
            <circle cx="320" cy="305" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2.5" filter="drop-shadow(0 0 8px #00f0ff)"/>
            <circle cx="480" cy="305" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2.5" filter="drop-shadow(0 0 8px #00f0ff)"/>
            <line x1="320" y1="145" x2="480" y2="305" stroke="#60a5fa" stroke-width="3" opacity="0.7"/>
            <line x1="480" y1="145" x2="320" y2="305" stroke="#60a5fa" stroke-width="3" opacity="0.7"/>
        `;
    } else if (id === 4 || cat.includes('SPORT')) {
        // Inter-Department Badminton / Sports: Dynamic kinetic velocity streaks & stadium waves
        accentColor = '#f97316';
        subColor = '#ec4899';
        bgGrad = `
            <radialGradient id="g1" cx="40%" cy="40%" r="80%">
                <stop offset="0%" stop-color="#9a3412"/>
                <stop offset="50%" stop-color="#4c0519"/>
                <stop offset="100%" stop-color="#140208"/>
            </radialGradient>
        `;
        graphics = `
            <!-- Kinetic Velocity Diagonal Streaks -->
            <path d="M 80 430 L 720 70" stroke="#f97316" stroke-width="6" stroke-linecap="round" opacity="0.85" filter="drop-shadow(0 0 14px #f97316)"/>
            <path d="M 130 450 L 750 90" stroke="#ec4899" stroke-width="3.5" stroke-linecap="round" opacity="0.7" filter="drop-shadow(0 0 10px #ec4899)"/>
            <path d="M 40 410 L 680 50" stroke="#fdba74" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
            
            <!-- Shuttlecock Aerodynamic Geometry -->
            <g transform="translate(420, 185) rotate(-35)">
                <path d="M 0 0 L -46 -80 L 46 -80 Z" fill="#ec4899" fill-opacity="0.5" stroke="#f97316" stroke-width="3" filter="drop-shadow(0 0 16px #ec4899)"/>
                <line x1="-22" y1="-80" x2="0" y2="0" stroke="#ffedd5" stroke-width="2"/>
                <line x1="22" y1="-80" x2="0" y2="0" stroke="#ffedd5" stroke-width="2"/>
                <circle cx="0" cy="10" r="16" fill="#ffffff" stroke="#f97316" stroke-width="3" filter="drop-shadow(0 0 12px #ffffff)"/>
            </g>
            
            <!-- Stadium Energy Arc -->
            <path d="M 180 370 Q 400 270 620 370" stroke="#f43f5e" stroke-width="4" fill="none" opacity="0.8" filter="drop-shadow(0 0 12px #f43f5e)"/>
            <circle cx="180" cy="370" r="8" fill="#f97316" filter="drop-shadow(0 0 8px #f97316)"/>
            <circle cx="620" cy="370" r="8" fill="#f97316" filter="drop-shadow(0 0 8px #f97316)"/>
        `;
    } else if (id === 5 || cat.includes('CLUB') || cat.includes('CYBER') || cat.includes('CTF')) {
        // Cybersecurity CTF: Cryptographic shield hexagon, lock vector & laser barrier
        accentColor = '#a855f7';
        subColor = '#f43f5e';
        bgGrad = `
            <radialGradient id="g1" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stop-color="#581c87"/>
                <stop offset="50%" stop-color="#2e1065"/>
                <stop offset="100%" stop-color="#0f021e"/>
            </radialGradient>
        `;
        graphics = `
            <!-- Laser Security Matrix Grid -->
            <g opacity="0.4" stroke="#c084fc" stroke-width="1.5">
                <line x1="120" y1="0" x2="120" y2="450"/>
                <line x1="260" y1="0" x2="260" y2="450"/>
                <line x1="540" y1="0" x2="540" y2="450"/>
                <line x1="680" y1="0" x2="680" y2="450"/>
            </g>
            
            <!-- Cryptographic Shield Outline -->
            <path d="M 400 80 L 530 140 L 530 260 Q 400 370 400 370 Q 270 260 270 260 L 270 140 Z" fill="#3b0764" fill-opacity="0.6" stroke="#c084fc" stroke-width="3.5" filter="drop-shadow(0 0 20px #c084fc)"/>
            <path d="M 400 110 L 500 155 L 500 245 Q 400 335 400 335 Q 300 245 300 245 L 300 155 Z" fill="#1e0538" fill-opacity="0.8" stroke="#f43f5e" stroke-width="2"/>
            
            <!-- Padlock Vector Geometry -->
            <rect x="370" y="210" width="60" height="50" rx="8" fill="#1e0538" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 0 10px #ffffff)"/>
            <path d="M 382 210 L 382 185 Q 400 165 418 185 L 418 210" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
            <circle cx="400" cy="235" r="5" fill="#c084fc"/>
            <line x1="400" y1="240" x2="400" y2="248" stroke="#c084fc" stroke-width="3"/>
        `;
    } else {
        // Kubernetes & Cloud Native: Hexagonal cluster constellation & server nodes
        accentColor = '#06b6d4';
        subColor = '#3b82f6';
        bgGrad = `
            <radialGradient id="g1" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stop-color="#115e59"/>
                <stop offset="50%" stop-color="#0f2b38"/>
                <stop offset="100%" stop-color="#021118"/>
            </radialGradient>
        `;
        graphics = `
            <!-- Hexagonal Cluster Mesh -->
            <g stroke="#00f0ff" stroke-width="2" fill="none">
                <!-- Center Pod -->
                <polygon points="400,160 450,188 450,248 400,276 350,248 350,188" fill="#0e3a47" fill-opacity="0.8" stroke="#00f0ff" stroke-width="3.5" filter="drop-shadow(0 0 20px #00f0ff)"/>
                <!-- Satellite Pods -->
                <polygon points="270,105 315,130 315,180 270,205 225,180 225,130" fill="#082f49" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 10px #38bdf8)"/>
                <polygon points="530,105 575,130 575,180 530,205 485,180 485,130" fill="#082f49" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 10px #38bdf8)"/>
                <polygon points="270,285 315,310 315,360 270,385 225,360 225,310" fill="#082f49" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 10px #38bdf8)"/>
                <polygon points="530,285 575,310 575,360 530,385 485,360 485,310" fill="#082f49" stroke="#38bdf8" stroke-width="2" filter="drop-shadow(0 0 10px #38bdf8)"/>
                
                <!-- Optical Links -->
                <line x1="350" y1="188" x2="315" y2="155" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 3"/>
                <line x1="450" y1="188" x2="485" y2="155" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 3"/>
                <line x1="350" y1="248" x2="315" y2="310" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 3"/>
                <line x1="450" y1="248" x2="485" y2="310" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6 3"/>
            </g>
            <circle cx="400" cy="218" r="16" fill="#00f0ff" filter="drop-shadow(0 0 12px #ffffff)"/>
            <circle cx="400" cy="218" r="6" fill="#ffffff"/>
        `;
    }


    const svgXml = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
    <defs>
        ${bgGrad}
        <pattern id="dotGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#ffffff" fill-opacity="0.08"/>
        </pattern>
        <linearGradient id="scanline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="transparent"/>
            <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
    </defs>

    <!-- Base Cyber Canvas Background -->
    <rect width="800" height="450" fill="url(#g1)"/>
    <rect width="800" height="450" fill="url(#dotGrid)"/>
    <rect width="800" height="450" fill="url(#scanline)"/>

    <!-- Decorative Corner Crop Marks -->
    <path d="M 24 44 L 24 24 L 44 24" stroke="${accentColor}" stroke-width="2.5" fill="none" opacity="0.8"/>
    <path d="M 776 44 L 776 24 L 756 24" stroke="${accentColor}" stroke-width="2.5" fill="none" opacity="0.8"/>
    <path d="M 24 406 L 24 426 L 44 426" stroke="${accentColor}" stroke-width="2.5" fill="none" opacity="0.8"/>
    <path d="M 776 406 L 776 426 L 756 426" stroke="${accentColor}" stroke-width="2.5" fill="none" opacity="0.8"/>

    <!-- Category Watermark Geometry -->
    ${graphics}

    <!-- Top Left Category Strip -->
    <rect x="36" y="34" width="12" height="12" rx="2" fill="${accentColor}"/>
    <text x="56" y="44" fill="${accentColor}" font-family="Orbitron, monospace" font-size="12" font-weight="700" letter-spacing="2">${cat}</text>

    <!-- Bottom Left Token Code & Title Watermark -->
    <text x="36" y="405" fill="#ffffff" font-family="Orbitron, monospace" font-size="20" font-weight="800" opacity="0.9" letter-spacing="1">${safeCode}</text>
    <text x="36" y="424" fill="#94a3b8" font-family="Inter, sans-serif" font-size="12" font-weight="500" opacity="0.8">${safeTitle.substring(0, 48)}</text>

    <!-- Top Right Technical Hex Indicator -->
    <g transform="translate(730, 36)" opacity="0.75">
        <polygon points="16,0 32,9 32,27 16,36 0,27 0,9" fill="none" stroke="${subColor}" stroke-width="1.5"/>
        <circle cx="16" cy="18" r="4" fill="${subColor}"/>
    </g>
</svg>
    `.trim();

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXml);
}

