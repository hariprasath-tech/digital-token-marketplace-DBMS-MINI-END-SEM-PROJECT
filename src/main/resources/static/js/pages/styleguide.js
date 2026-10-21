/**
 * NEXUS Design System & Component Library (ES Module)
 * Route: #/styleguide
 * Author: Hari Prasath (DBMS Mini Project)
 * Sri Eshwar College of Engineering
 */

import {
    createCountdownRing,
    renderBadge,
    refreshIcons,
    showToast,
    triggerConfetti,
    openModal,
    closeModal,
    getActivityCardArt,
    generateUniqueActivitySvg,
    renderCardSkeletons
} from '../ui.js';
import { initCardTilt } from '../animations.js';

export function renderStyleguide(container) {
    // Generate sample SVG artworks for the showcase
    const artWorkshop = generateUniqueActivitySvg(1, 'WORKSHOP', 'Generative AI & LLM Bootcamp', 'TKN-GAI-001');
    const artEvent = generateUniqueActivitySvg(2, 'EVENT', 'HackIndia 2026 Hackathon', 'TKN-HCK-002');
    const artLab = generateUniqueActivitySvg(3, 'LAB_SESSION', 'Drone Simulation & Robotics', 'TKN-DRN-003');
    const artSports = generateUniqueActivitySvg(4, 'SPORTS', 'Badminton Championship', 'TKN-SPT-004');
    const artClub = generateUniqueActivitySvg(5, 'CLUB_ACTIVITY', 'Cybersecurity CTF Challenge', 'TKN-CTF-005');
    const artK8s = generateUniqueActivitySvg(6, 'WORKSHOP', 'Cloud Native Kubernetes', 'TKN-K8S-006');

    // Sample expiry dates for countdown rings
    const now = Date.now();
    const expirySafe = new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(); // 4 days
    const expiryWarning = new Date(now + 14 * 60 * 60 * 1000).toISOString();   // 14 hours
    const expiryUrgent = new Date(now + 75 * 60 * 1000).toISOString();          // 1h 15m
    const expiryPassed = new Date(now - 3600 * 1000).toISOString();            // 1h ago

    container.innerHTML = `
        <div class="styleguide-page container">
            <!-- Header Banner -->
            <div class="styleguide-header">
                <div class="section-tag">LIVING SPECIFICATION</div>
                <h1 class="page-main-title">NEXUS DESIGN SYSTEM</h1>
                <p class="page-subtitle">
                    A high-tech cyberpunk component library and visual token system engineered for Sri Eshwar College of Engineering.
                    Zero emojis, inline SVG iconography, WCAG AA compliance, and hardware-accelerated 60fps micro-animations.
                </p>

                <!-- Navigation Quick-Jump Anchor Strip -->
                <div class="styleguide-nav-pills">
                    <a href="#sg-tokens" class="styleguide-nav-pill"><i data-lucide="palette"></i><span>Colors &amp; Tokens</span></a>
                    <a href="#sg-typography" class="styleguide-nav-pill"><i data-lucide="type"></i><span>Typography</span></a>
                    <a href="#sg-buttons" class="styleguide-nav-pill"><i data-lucide="square"></i><span>Buttons</span></a>
                    <a href="#sg-badges" class="styleguide-nav-pill"><i data-lucide="tag"></i><span>Badges &amp; Chips</span></a>
                    <a href="#sg-forms" class="styleguide-nav-pill"><i data-lucide="form-input"></i><span>Form Controls</span></a>
                    <a href="#sg-rings" class="styleguide-nav-pill"><i data-lucide="clock"></i><span>Expiry Rings</span></a>
                    <a href="#sg-cards" class="styleguide-nav-pill"><i data-lucide="layers"></i><span>Cards &amp; Artwork</span></a>
                    <a href="#sg-feedback" class="styleguide-nav-pill"><i data-lucide="bell"></i><span>Feedback &amp; Modals</span></a>
                    <a href="#sg-timeline" class="styleguide-nav-pill"><i data-lucide="git-commit"></i><span>Audit Nodes</span></a>
                </div>
            </div>

            <!-- 1. COLOR TOKENS & SWATCHES -->
            <section class="styleguide-section" id="sg-tokens">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="palette"></i> Design Tokens &amp; Color Palette</h2>
                    <span class="sg-section-badge">CSS Variables</span>
                </div>
                <p class="sg-section-desc">Tailored high-contrast cyber palette with vibrant neon accents and deep space obsidian backgrounds.</p>

                <div class="swatches-grid">
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #00f0ff; box-shadow: 0 0 16px rgba(0,240,255,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--neon-cyan</strong>
                            <code>#00f0ff</code>
                            <span>Primary Brand &amp; Laser Accent</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #06b6d4; box-shadow: 0 0 16px rgba(6,182,212,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--cyber-cyan</strong>
                            <code>#06b6d4</code>
                            <span>Secondary Cyan &amp; Sub-brand</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #8b5cf6; box-shadow: 0 0 16px rgba(139,92,246,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--neon-violet</strong>
                            <code>#8b5cf6</code>
                            <span>Transfer &amp; Web3 Accents</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #10b981; box-shadow: 0 0 16px rgba(16,185,129,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--neon-lime</strong>
                            <code>#10b981</code>
                            <span>Available Status &amp; Success</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #f59e0b; box-shadow: 0 0 16px rgba(245,158,11,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--neon-amber</strong>
                            <code>#f59e0b</code>
                            <span>Pending Transfer &amp; Warning</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #f43f5e; box-shadow: 0 0 16px rgba(244,63,94,0.45);"></div>
                        <div class="swatch-info">
                            <strong>--status-expired</strong>
                            <code>#f43f5e</code>
                            <span>Expired State &amp; Destruction</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: #060813; border: 1px solid rgba(255,255,255,0.15);"></div>
                        <div class="swatch-info">
                            <strong>--color-bg</strong>
                            <code>#060813</code>
                            <span>Deep Space Canvas</span>
                        </div>
                    </div>
                    <div class="swatch-card">
                        <div class="swatch-preview" style="background: rgba(15,23,42,0.75); border: 1px solid rgba(0,240,255,0.3);"></div>
                        <div class="swatch-info">
                            <strong>--card-bg</strong>
                            <code>rgba(15,23,42,0.75)</code>
                            <span>Frosted Glass Surface</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 2. TYPOGRAPHY SYSTEM -->
            <section class="styleguide-section" id="sg-typography">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="type"></i> Typography Hierarchy</h2>
                    <span class="sg-section-badge">Orbitron / Syne / Inter / JetBrains</span>
                </div>
                <p class="sg-section-desc">Typeface pairings combining geometric display headings with legible sans-serif body copy and monospace telemetry data.</p>

                <div class="type-scale-grid">
                    <div class="type-scale-item">
                        <span class="type-meta">DISPLAY H1 - ORBITRON 40PX 800</span>
                        <h1 style="font-family: var(--font-display); font-size: 40px; font-weight: 800; letter-spacing: 1.5px; line-height: 1.2;">
                            CAMPUS TOKEN EXCHANGE
                        </h1>
                    </div>
                    <div class="type-scale-item">
                        <span class="type-meta">SECTION H2 - ORBITRON 28PX 700</span>
                        <h2 style="font-family: var(--font-display); font-size: 28px; font-weight: 700; letter-spacing: 1.2px; line-height: 1.3;">
                            DECENTRALIZED WORKSHOP LEDGER
                        </h2>
                    </div>
                    <div class="type-scale-item">
                        <span class="type-meta">CARD TITLE H3 - ORBITRON 20PX 600</span>
                        <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 600; letter-spacing: 0.8px;">
                            Autonomous Drone Flight Simulation
                        </h3>
                    </div>
                    <div class="type-scale-item">
                        <span class="type-meta">BODY LEAD - INTER 17PX</span>
                        <p style="font-size: 17px; color: var(--text-secondary); line-height: 1.6;">
                            Students claim and transfer authenticated digital token passes across college departments with instant cryptographic verification.
                        </p>
                    </div>
                    <div class="type-scale-item">
                        <span class="type-meta">BODY BASE &amp; SMALL - INTER 14PX &amp; 12PX</span>
                        <p style="font-size: 14px; color: var(--text-primary); margin-bottom: 6px;">
                            Standard paragraph text for activity descriptions, venue addresses, and transaction notes.
                        </p>
                        <p style="font-size: 12px; color: var(--text-muted);">
                            Secondary caption text for timestamps, seat allocations, and auxiliary technical specifications.
                        </p>
                    </div>
                    <div class="type-scale-item">
                        <span class="type-meta">MONOSPACE TELEMETRY - JETBRAINS MONO 14PX</span>
                        <p style="font-family: var(--font-mono); font-size: 14px; color: var(--neon-cyan); letter-spacing: 1px;">
                            TOKEN: TKN-GAI-2026-001 | HASH: 0x8F7A3C4E91B2 | LEDGER_STATUS: VERIFIED_OK
                        </p>
                    </div>
                </div>
            </section>

            <!-- 3. BUTTONS & INTERACTIVE ELEMENTS -->
            <section class="styleguide-section" id="sg-buttons">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="square"></i> Buttons &amp; Interactive Triggers</h2>
                    <span class="sg-section-badge">Magnetic Physics &amp; Glows</span>
                </div>
                <p class="sg-section-desc">Interactive buttons featuring subtle hover elevation, neon perimeter glow, and accessibility focus outlines.</p>

                <div class="sg-sub-block">
                    <h4 class="sg-sub-title">Button Variants</h4>
                    <div class="demo-flex-wrap">
                        <button type="button" class="cyber-btn primary-glow">
                            <i data-lucide="zap"></i><span>Primary Glow</span>
                        </button>
                        <button type="button" class="cyber-btn secondary-glass">
                            <i data-lucide="shield"></i><span>Secondary Glass</span>
                        </button>
                        <button type="button" class="cyber-btn success-glow">
                            <i data-lucide="check-circle-2"></i><span>Success Glow</span>
                        </button>
                        <button type="button" class="cyber-btn danger-glow">
                            <i data-lucide="trash-2"></i><span>Danger Glow</span>
                        </button>
                        <button type="button" class="cyber-btn ghost-btn">
                            <i data-lucide="arrow-right"></i><span>Ghost Link</span>
                        </button>
                    </div>
                </div>

                <div class="sg-sub-block">
                    <h4 class="sg-sub-title">Button Sizes &amp; States</h4>
                    <div class="demo-flex-wrap">
                        <button type="button" class="cyber-btn primary-glow btn-lg">
                            <i data-lucide="ticket"></i><span>Large (btn-lg)</span>
                        </button>
                        <button type="button" class="cyber-btn primary-glow">
                            <i data-lucide="ticket"></i><span>Medium (Default)</span>
                        </button>
                        <button type="button" class="cyber-btn primary-glow btn-sm">
                            <i data-lucide="ticket"></i><span>Small (btn-sm)</span>
                        </button>
                        <button type="button" class="cyber-btn primary-glow btn-xs">
                            <span>Extra-Small (btn-xs)</span>
                        </button>
                        <button type="button" class="cyber-btn primary-glow" disabled>
                            <i data-lucide="lock"></i><span>Disabled State</span>
                        </button>
                        <button type="button" class="cyber-btn primary-glow">
                            <span class="loading-spinner-sm"></span><span>Loading State</span>
                        </button>
                    </div>
                </div>
            </section>

            <!-- 4. CHIPS, CATEGORIES & REAL-TIME STATUS BADGES -->
            <section class="styleguide-section" id="sg-badges">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="tag"></i> Category Chips &amp; Pulsing Status Badges</h2>
                    <span class="sg-section-badge">Real-Time Indicators</span>
                </div>
                <p class="sg-section-desc">Pills with categorical color tokens and pulsing status indicators showing live state of every digital token.</p>

                <div class="sg-sub-block">
                    <h4 class="sg-sub-title">Category Chips (Interactive Filter Tabs)</h4>
                    <div class="demo-flex-wrap">
                        <button type="button" class="category-chip active"><i data-lucide="layers"></i><span>All Categories</span></button>
                        <button type="button" class="category-chip"><i data-lucide="cpu"></i><span>Workshops</span></button>
                        <button type="button" class="category-chip"><i data-lucide="trophy"></i><span>Hackathons &amp; Events</span></button>
                        <button type="button" class="category-chip"><i data-lucide="flask-conical"></i><span>Lab Sessions</span></button>
                        <button type="button" class="category-chip"><i data-lucide="activity"></i><span>Sports Complex</span></button>
                        <button type="button" class="category-chip"><i data-lucide="users"></i><span>Club Activities</span></button>
                    </div>
                </div>

                <div class="sg-sub-block">
                    <h4 class="sg-sub-title">Real-Time Status Badges (With Pulsing Beacon Dot)</h4>
                    <div class="demo-flex-wrap">
                        ${renderBadge('AVAILABLE')}
                        ${renderBadge('TRANSFER_PENDING')}
                        ${renderBadge('TRANSFERRED')}
                        ${renderBadge('USED')}
                        ${renderBadge('EXPIRED')}
                    </div>
                </div>

                <div class="sg-sub-block">
                    <h4 class="sg-sub-title">Category Badges</h4>
                    <div class="demo-flex-wrap">
                        <span class="token-category-badge workshop">WORKSHOP</span>
                        <span class="token-category-badge event">EVENT</span>
                        <span class="token-category-badge lab">LAB_SESSION</span>
                        <span class="token-category-badge sports">SPORTS</span>
                        <span class="token-category-badge club">CLUB_ACTIVITY</span>
                    </div>
                </div>
            </section>

            <!-- 5. FORM CONTROLS & INPUTS -->
            <section class="styleguide-section" id="sg-forms">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="form-input"></i> Form Controls &amp; Input Fields</h2>
                    <span class="sg-section-badge">Glassmorphism &amp; Focus Glow</span>
                </div>
                <p class="sg-section-desc">Accessible, sleek dark form controls with contextual inline icons and validation feedback.</p>

                <div class="form-demo-grid">
                    <div class="form-group">
                        <label class="form-label"><span>Search Keyword</span><span class="req-star">*</span></label>
                        <div class="input-with-icon">
                            <i data-lucide="search"></i>
                            <input type="text" class="cyber-input" placeholder="Search tokens or activities..." value="Generative AI">
                        </div>
                        <span class="form-help-text">Instant filtering across token code, title, and venue.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label"><span>College Email</span><span class="req-star">*</span></label>
                        <div class="input-with-icon">
                            <i data-lucide="mail"></i>
                            <input type="email" class="cyber-input" placeholder="student@sece.ac.in" value="hari@sece.ac.in">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label"><span>Security Password</span><span class="req-star">*</span></label>
                        <div class="input-with-icon">
                            <i data-lucide="key"></i>
                            <input type="password" class="cyber-input" value="••••••••••••">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label"><span>Category Selection</span></label>
                        <select class="cyber-select">
                            <option value="WORKSHOP">Workshop &amp; Technical Bootcamp</option>
                            <option value="EVENT">Hackathon &amp; Symposium</option>
                            <option value="LAB">Laboratory Session</option>
                            <option value="SPORTS">Sports Facility Slot</option>
                        </select>
                    </div>

                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label class="form-label"><span>Listing Remarks</span></label>
                        <textarea class="cyber-textarea" rows="3" placeholder="Add custom terms or seat details...">Reserved for full day session. Includes high-RAM GPU workstation access.</textarea>
                    </div>
                </div>
            </section>

            <!-- 6. COUNTDOWN EXPIRY RINGS -->
            <section class="styleguide-section" id="sg-rings">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="clock"></i> SVG Expiry Countdown Rings</h2>
                    <span class="sg-section-badge">SVG Stroke Geometry</span>
                </div>
                <p class="sg-section-desc">Dynamic circular progress rings that shift color and pulse speed based on time remaining before token validity lapses.</p>

                <div class="rings-demo-grid">
                    <div class="ring-demo-card">
                        <div class="ring-demo-visual">
                            ${createCountdownRing(expirySafe, 56, 4)}
                        </div>
                        <div class="ring-demo-meta">
                            <strong>Safe Window (&gt;24h)</strong>
                            <span>Neon Emerald stroke with remaining days label.</span>
                        </div>
                    </div>

                    <div class="ring-demo-card">
                        <div class="ring-demo-visual">
                            ${createCountdownRing(expiryWarning, 56, 4)}
                        </div>
                        <div class="ring-demo-meta">
                            <strong>Warning Window (&lt;24h)</strong>
                            <span>Electric Amber stroke with countdown hours remaining.</span>
                        </div>
                    </div>

                    <div class="ring-demo-card">
                        <div class="ring-demo-visual">
                            ${createCountdownRing(expiryUrgent, 56, 4)}
                        </div>
                        <div class="ring-demo-meta">
                            <strong>Critical Urgent (&lt;3h)</strong>
                            <span>Neon Rose stroke with accelerated strobe pulse animation.</span>
                        </div>
                    </div>

                    <div class="ring-demo-card">
                        <div class="ring-demo-visual">
                            ${createCountdownRing(expiryPassed, 56, 4)}
                        </div>
                        <div class="ring-demo-meta">
                            <strong>Expired / Past Due</strong>
                            <span>Zero stroke progress with EXP flag.</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 7. GENERATIVE SVG ARTWORKS & TOKEN CARD -->
            <section class="styleguide-section" id="sg-cards">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="layers"></i> Generative Artwork &amp; Token Cards</h2>
                    <span class="sg-section-badge">100% Vector &amp; Zero Stock</span>
                </div>
                <p class="sg-section-desc">Custom-generated 16:9 cyberpunk vector banners produced programmatically per activity category. Zero repetition and zero stock assets.</p>

                <h4 class="sg-sub-title" style="margin-bottom: 16px;">Generative SVG Artwork Catalog</h4>
                <div class="artworks-grid">
                    <div class="artwork-preview-card">
                        <img src="${artWorkshop}" alt="AI Workshop" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>WORKSHOP (AI &amp; Neural Nets)</strong>
                            <span>Electric Cyan / Indigo with Synapse Nodes</span>
                        </div>
                    </div>

                    <div class="artwork-preview-card">
                        <img src="${artEvent}" alt="Hackathon Event" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>EVENT (HackIndia Hackathon)</strong>
                            <span>Matrix Emerald / Cyan with Terminal Brackets</span>
                        </div>
                    </div>

                    <div class="artwork-preview-card">
                        <img src="${artLab}" alt="Drone Simulation Lab" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>LAB_SESSION (Drone Robotics)</strong>
                            <span>Cobalt Blue / Azure with Telemetry Radar</span>
                        </div>
                    </div>

                    <div class="artwork-preview-card">
                        <img src="${artSports}" alt="Badminton Championship" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>SPORTS (Badminton Tournament)</strong>
                            <span>Fiery Orange / Crimson with Velocity Streaks</span>
                        </div>
                    </div>

                    <div class="artwork-preview-card">
                        <img src="${artClub}" alt="Cybersecurity CTF" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>CLUB_ACTIVITY (Cyber CTF)</strong>
                            <span>Ultraviolet / Pink with Cryptographic Shield</span>
                        </div>
                    </div>

                    <div class="artwork-preview-card">
                        <img src="${artK8s}" alt="Kubernetes Cloud" width="400" height="225" loading="eager">
                        <div class="artwork-preview-caption">
                            <strong>WORKSHOP (Cloud Kubernetes)</strong>
                            <span>Teal / Cobalt with Cluster Mesh Hexagons</span>
                        </div>
                    </div>
                </div>

                <h4 class="sg-sub-title" style="margin-top: 36px; margin-bottom: 16px;">Complete Token Card Instance</h4>
                <div style="max-width: 380px;">
                    <div class="token-card" tabindex="0">
                        <div class="token-banner-wrap">
                            <img src="${artWorkshop}" alt="Sample Token" class="token-card-banner" width="380" height="214">
                            <div class="token-banner-overlay"></div>
                            <span class="token-category-badge workshop">WORKSHOP</span>
                            <div class="token-banner-ring">
                                ${createCountdownRing(expirySafe, 44, 3.5)}
                            </div>
                        </div>

                        <div class="token-card-body">
                            <div class="token-card-code">
                                <i data-lucide="hash"></i>
                                <span>TKN-GAI-2026-001</span>
                            </div>

                            <h3 class="token-card-title">Generative AI &amp; LLM Fine-Tuning Bootcamp</h3>

                            <div class="token-card-meta">
                                <div class="meta-row">
                                    <i data-lucide="map-pin"></i>
                                    <span class="meta-venue-text">Advanced Computing Lab (Lab 3)</span>
                                </div>
                                <div class="meta-row">
                                    <i data-lucide="clock"></i>
                                    <span>Expires: Oct 24, 2026, 11:59 PM</span>
                                </div>
                            </div>

                            <div class="token-owner-strip">
                                <div class="owner-chip">
                                    <div class="owner-avatar">HP</div>
                                    <div class="owner-info">
                                        <span class="owner-name">Hari Prasath</span>
                                        <span class="owner-tag">(Author)</span>
                                    </div>
                                </div>
                                ${renderBadge('AVAILABLE')}
                            </div>

                            <div class="token-card-actions">
                                <button type="button" class="cyber-btn primary-glow btn-sm" style="flex:1;">
                                    <i data-lucide="arrow-right-left"></i><span>Request Token</span>
                                </button>
                                <button type="button" class="cyber-btn secondary-glass btn-sm" style="padding: 0 12px;">
                                    <i data-lucide="external-link"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 8. LOADING SKELETONS & SHIMMER -->
            <section class="styleguide-section" id="sg-skeletons">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="loader"></i> Loading Skeletons &amp; Shimmer</h2>
                    <span class="sg-section-badge">GPU Transform Shimmer</span>
                </div>
                <p class="sg-section-desc">Low-latency skeleton placeholders with flowing light gradient shimmer preventing layout shifts during async queries.</p>

                <div class="token-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                    ${renderCardSkeletons(2)}
                </div>
            </section>

            <!-- 9. TOAST NOTIFICATIONS & MODAL DEMO -->
            <section class="styleguide-section" id="sg-feedback">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="bell"></i> Feedback, Toasts &amp; Modals</h2>
                    <span class="sg-section-badge">Micro-Interactions</span>
                </div>
                <p class="sg-section-desc">Interactive notification cues, confetti particle systems, and accessible dialog backdrops.</p>

                <div class="demo-flex-wrap">
                    <button type="button" class="cyber-btn success-glow" id="sgToastSuccess">
                        <i data-lucide="check-circle-2"></i><span>Trigger Success Toast</span>
                    </button>
                    <button type="button" class="cyber-btn" style="border-color: var(--neon-amber); color: var(--neon-amber);" id="sgToastWarning">
                        <i data-lucide="alert-circle"></i><span>Trigger Warning Toast</span>
                    </button>
                    <button type="button" class="cyber-btn danger-glow" id="sgToastError">
                        <i data-lucide="alert-triangle"></i><span>Trigger Error Toast</span>
                    </button>
                    <button type="button" class="cyber-btn secondary-glass" id="sgToastInfo">
                        <i data-lucide="info"></i><span>Trigger Info Toast</span>
                    </button>
                    <button type="button" class="cyber-btn primary-glow" id="sgConfettiBtn">
                        <i data-lucide="sparkles"></i><span>Trigger Confetti Blast</span>
                    </button>
                    <button type="button" class="cyber-btn secondary-glass" id="sgOpenModalBtn">
                        <i data-lucide="maximize-2"></i><span>Open Demo Modal</span>
                    </button>
                </div>

                <!-- Hidden Demo Modal -->
                <div class="cyber-modal-backdrop hidden" id="sgDemoModalBackdrop" role="dialog" aria-modal="true">
                    <div class="cyber-modal">
                        <div class="modal-header">
                            <h3 class="modal-title"><i data-lucide="shield-check"></i> Design System Modal Demo</h3>
                            <button type="button" class="modal-close-btn" id="sgCloseModalBtn">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p style="margin-bottom: 12px; color: var(--text-secondary);">
                                This dialog demonstrates the glassmorphic modal window with a frosted backdrop blur, glowing cyan border accents, and keyboard focus trap.
                            </p>
                            <div class="swatch-card" style="margin-top: 14px;">
                                <div class="swatch-info">
                                    <strong>Access Control Verified</strong>
                                    <code>X-STUDENT-ID: 1 (ADMIN)</code>
                                    <span>Cryptographic session signature validated on server.</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="sgCancelModalBtn">Close Window</button>
                            <button type="button" class="cyber-btn primary-glow" id="sgConfirmModalBtn">Confirm Action</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 10. AUDIT TIMELINE NODES -->
            <section class="styleguide-section" id="sg-timeline">
                <div class="sg-section-header">
                    <h2 class="sg-section-title"><i data-lucide="git-commit"></i> Transaction Audit Timeline Nodes</h2>
                    <span class="sg-section-badge">P2P Ledger Trail</span>
                </div>
                <p class="sg-section-desc">Audit trail nodes tracking token lifecycle across minting, marketplace listing, transfer approval, and redemption.</p>

                <div class="audit-timeline-flow">
                    <div class="timeline-step done">
                        <div class="timeline-step-marker"><i data-lucide="plus"></i></div>
                        <div class="timeline-step-content">
                            <h4>Token Minted</h4>
                            <p>Reservation TKN-GAI-2026-001 created for SECE AI Club Workshop.</p>
                            <span class="timeline-time">Oct 14, 2026, 09:30 AM</span>
                        </div>
                    </div>
                    <div class="timeline-step done">
                        <div class="timeline-step-marker"><i data-lucide="store"></i></div>
                        <div class="timeline-step-content">
                            <h4>Published to Marketplace</h4>
                            <p>Listed for peer-to-peer exchange by Hari Prasath.</p>
                            <span class="timeline-time">Oct 14, 2026, 10:15 AM</span>
                        </div>
                    </div>
                    <div class="timeline-step active">
                        <div class="timeline-step-marker"><i data-lucide="clock"></i></div>
                        <div class="timeline-step-content">
                            <h4>Transfer Request In Flight</h4>
                            <p>Transfer request submitted by Priya S (AI &amp; DS Dept).</p>
                            <span class="timeline-time">Oct 14, 2026, 02:40 PM</span>
                        </div>
                    </div>
                    <div class="timeline-step">
                        <div class="timeline-step-marker"><i data-lucide="check"></i></div>
                        <div class="timeline-step-content">
                            <h4>Redemption &amp; Completion</h4>
                            <p>Pending token owner authorization and attendance check-in.</p>
                            <span class="timeline-time">Scheduled</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;

    refreshIcons();
    initCardTilt();
    setupStyleguideInteractions(container);
}

function setupStyleguideInteractions(container) {
    // Toast Triggers
    container.querySelector('#sgToastSuccess')?.addEventListener('click', () => {
        showToast('Token transfer authorized and ledger updated!', 'success');
    });

    container.querySelector('#sgToastWarning')?.addEventListener('click', () => {
        showToast('Token validity expires in under 3 hours!', 'warning');
    });

    container.querySelector('#sgToastError')?.addEventListener('click', () => {
        showToast('Authorization failed: Student role does not have admin permissions.', 'error');
    });

    container.querySelector('#sgToastInfo')?.addEventListener('click', () => {
        showToast('Live synchronization active: Refreshed token marketplace.', 'info');
    });

    // Confetti Trigger
    container.querySelector('#sgConfettiBtn')?.addEventListener('click', () => {
        triggerConfetti();
        showToast('Confetti particles dispatched!', 'info');
    });

    // Modal Triggers
    const modalId = 'sgDemoModalBackdrop';
    container.querySelector('#sgOpenModalBtn')?.addEventListener('click', () => openModal(modalId));
    container.querySelector('#sgCloseModalBtn')?.addEventListener('click', () => closeModal(modalId));
    container.querySelector('#sgCancelModalBtn')?.addEventListener('click', () => closeModal(modalId));
    container.querySelector('#sgConfirmModalBtn')?.addEventListener('click', () => {
        closeModal(modalId);
        showToast('Confirmed demo modal action.', 'success');
    });
}
