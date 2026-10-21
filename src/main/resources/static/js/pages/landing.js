/**
 * NEXUS Landing Page Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { state } from '../state.js';
import { initThreeHero } from '../three-hero.js';
import { createCountdownRing, renderBadge, refreshIcons, formatDateTime, getInitials, getActivityCardArt } from '../ui.js';
import { animateCounters, initCardTilt, initScrollReveals } from '../animations.js';

function getCardImage(token) {
    return getActivityCardArt(token);
}


export function renderLanding(container) {
    let destroyHeroScene = null;

    container.innerHTML = `
        <div class="landing-page">
            <!-- Hero Section -->
            <section class="landing-hero container">
                <div class="hero-content">
                    <div class="hero-pill gsap-reveal">
                        <span class="pulse-dot"></span>
                        <span>SRI ESHWAR COLLEGE OF ENGINEERING // DBMS PROJECT</span>
                    </div>

                    <h1 class="hero-title gsap-reveal">
                        PEER-TO-PEER <br>
                        <span class="neon-text-gradient">DIGITAL TOKEN</span><br>
                        MARKETPLACE
                    </h1>

                    <p class="hero-description gsap-reveal">
                        A futuristic campus platform where students exchange unused digital tokens and reservations for workshops, hackathons, lab sessions, and sports facilities through an ACID-compliant transaction engine.
                    </p>

                    <div class="hero-actions gsap-reveal">
                        <a href="#/marketplace" class="cyber-btn primary-glow">
                            <i data-lucide="compass"></i>
                            <span>Explore Marketplace</span>
                        </a>
                        <a href="#/my-tokens" class="cyber-btn secondary-glass">
                            <i data-lucide="plus-circle"></i>
                            <span>List a Token</span>
                        </a>
                        <a href="#/dashboard" class="cyber-btn ghost-btn">
                            <i data-lucide="activity"></i>
                            <span>Live Metrics</span>
                        </a>
                    </div>

                    <!-- Author & Tech Badges (Zero Emojis) -->
                    <div class="hero-credits gsap-reveal">
                        <span class="credit-badge"><i data-lucide="user-check"></i> Author: Hari Prasath (23CS101)</span>
                        <span class="credit-badge"><i data-lucide="database"></i> MySQL 8 InnoDB</span>
                        <span class="credit-badge"><i data-lucide="lock"></i> ACID Row-Locked</span>
                    </div>
                </div>

                <!-- 3D Hologram Hero Canvas -->
                <div class="hero-canvas-container gsap-reveal">
                    <div class="canvas-underlay-glow"></div>
                    <canvas id="landingThreeCanvas" class="hero-three-canvas" width="500" height="450"></canvas>
                    <div class="canvas-tag">
                        <i data-lucide="rotate-3d"></i>
                        <span>INTERACTIVE 3D HOLOGRAM - DRAG TO ROTATE</span>
                    </div>
                </div>
            </section>

            <!-- Activity Types Infinite Marquee -->
            <div class="marquee-container" aria-hidden="true">
                <div class="marquee-content">
                    <div class="marquee-item"><i data-lucide="code-2"></i> WORKSHOPS AND HACKATHONS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="cpu"></i> IOT AND ROBOTICS LABS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="activity"></i> BADMINTON AND SPORTS COURTS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="sparkles"></i> TECH SYMPOSIUMS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="users"></i> CLUB MEETS AND SEMINARS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="shield-check"></i> ACID TRANSACTION AUDIT</div>
                    <span class="marquee-dot"></span>
                    <!-- Duplicate for infinite loop -->
                    <div class="marquee-item"><i data-lucide="code-2"></i> WORKSHOPS AND HACKATHONS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="cpu"></i> IOT AND ROBOTICS LABS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="activity"></i> BADMINTON AND SPORTS COURTS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="sparkles"></i> TECH SYMPOSIUMS</div>
                    <span class="marquee-dot"></span>
                    <div class="marquee-item"><i data-lucide="users"></i> CLUB MEETS AND SEMINARS</div>
                    <span class="marquee-dot"></span>
                </div>
            </div>

            <!-- Live Stats Counter Strip -->
            <section class="container">
                <div class="stats-counter-strip">
                    <div class="stat-counter-card gsap-reveal">
                        <span class="stat-counter-number" data-counter="${state.stats.totalTokens || 11}">0</span>
                        <span class="stat-counter-label">TOTAL LISTINGS</span>
                        <div class="stat-decor cyan"></div>
                    </div>
                    <div class="stat-counter-card gsap-reveal">
                        <span class="stat-counter-number" data-counter="${state.stats.availableTokens || 7}">0</span>
                        <span class="stat-counter-label">AVAILABLE NOW</span>
                        <div class="stat-decor emerald"></div>
                    </div>
                    <div class="stat-counter-card gsap-reveal">
                        <span class="stat-counter-number" data-counter="${state.stats.totalTransfers || 3}">0</span>
                        <span class="stat-counter-label">TRANSFERS COMPLETED</span>
                        <div class="stat-decor purple"></div>
                    </div>
                    <div class="stat-counter-card gsap-reveal">
                        <span class="stat-counter-number" data-counter="${state.stats.activeStudents || 6}">0</span>
                        <span class="stat-counter-label">REGISTERED STUDENTS</span>
                        <div class="stat-decor amber"></div>
                    </div>
                </div>
            </section>

            <!-- "How It Works" Section -->
            <section class="timeline-section container">
                <div class="section-intro gsap-reveal">
                    <span class="section-tag">ENGINE ARCHITECTURE</span>
                    <h2>HOW THE MARKETPLACE WORKS</h2>
                    <p>Designed for zero reservation wastage and strictly guaranteed single-owner transfer semantics.</p>
                </div>

                <div class="timeline-steps">
                    <div class="timeline-step-card gsap-reveal">
                        <div class="step-number-bubble">01</div>
                        <h3>List Unused Token</h3>
                        <p>Students list spare reservations for workshops, labs, or sports facilities with an automated expiry deadline.</p>
                    </div>

                    <div class="timeline-step-card gsap-reveal">
                        <div class="step-number-bubble">02</div>
                        <h3>Peer Request</h3>
                        <p>Interested peers discover listings on the marketplace and submit transfer requests with custom priority notes.</p>
                    </div>

                    <div class="timeline-step-card gsap-reveal">
                        <div class="step-number-bubble">03</div>
                        <h3>ACID Row-Lock Transfer</h3>
                        <p>Upon approval, a MySQL row-locking transaction atomically swaps token ownership and auto-cancels competing requests.</p>
                    </div>
                </div>
            </section>

            <!-- Featured Tokens Section -->
            <section class="featured-section container">
                <div class="featured-header gsap-reveal">
                    <div>
                        <span class="section-tag">LIVE MARKET LISTINGS</span>
                        <h2>FEATURED CAMPUS TOKENS</h2>
                    </div>
                    <a href="#/marketplace" class="cyber-btn secondary-glass">
                        <span>View All Listings</span>
                        <i data-lucide="arrow-right"></i>
                    </a>
                </div>

                <div class="featured-carousel" id="landingFeaturedGrid">
                    <!-- Populated dynamically -->
                </div>
            </section>

            <!-- Site Footer -->
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-top">
                        <div class="footer-brand">
                            <h4>NEXUS // DIGITAL TOKEN MARKETPLACE</h4>
                            <p>
                                Developed for Sri Eshwar College of Engineering (Autonomous), Coimbatore.<br>
                                DBMS Mini Project by <strong>Hari Prasath</strong> (Roll No: 23CS101, Dept of CSE).
                            </p>
                        </div>
                        <div class="footer-col">
                            <h5>QUICK NAVIGATION</h5>
                            <ul class="footer-links">
                                <li><a href="#/marketplace">Browse Marketplace</a></li>
                                <li><a href="#/my-tokens">My Token Vault</a></li>
                                <li><a href="#/requests">Transfer Requests</a></li>
                                <li><a href="#/history">Audit Trail</a></li>
                                <li><a href="#/dashboard">Analytics Dashboard</a></li>
                            </ul>
                        </div>
                        <div class="footer-col">
                            <h5>SYSTEM STATUS</h5>
                            <ul class="footer-links">
                                <li><span class="status-indicator online"></span> MySQL 8 InnoDB: Connected</li>
                                <li><span class="status-indicator online"></span> Spring Boot 3 Engine: Active</li>
                                <li><span class="status-indicator online"></span> Expiry Sweep Job: 60s Interval</li>
                                <li><span class="status-indicator online"></span> Isolation: Read Committed / Row Locks</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <span>&copy; 2026 Sri Eshwar College of Engineering. All rights reserved.</span>
                        <span>Built with Vanilla HTML5, CSS3, ES Modules, Three.js and GSAP.</span>
                    </div>
                </div>
            </footer>
        </div>
    `;

    refreshIcons();

    // 1. Initialize Three.js Hero Canvas
    const canvas = container.querySelector('#landingThreeCanvas');
    if (canvas) {
        destroyHeroScene = initThreeHero(canvas);
    }

    // 2. Animate Counter numbers
    animateCounters(container);

    // 3. Render Featured Tokens
    renderFeaturedTokens(container);

    // 4. Staggered GSAP reveals & Card Tilt
    initScrollReveals();
    initCardTilt(container);

    return () => {
        if (destroyHeroScene) destroyHeroScene();
    };
}

function renderFeaturedTokens(container) {
    const grid = container.querySelector('#landingFeaturedGrid');
    if (!grid) return;

    const available = state.tokens.filter(t => t.status === 'AVAILABLE').slice(0, 3);
    const tokensToShow = available.length > 0 ? available : state.tokens.slice(0, 3);

    if (tokensToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state-view" style="grid-column: 1 / -1;">
                <p>No tokens listed yet. Be the first student to list a spare token!</p>
                <a href="#/my-tokens" class="cyber-btn primary-glow">List a Token Now</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = tokensToShow.map(token => {
        const cat = (token.activityCategory || 'EVENT').toLowerCase();
        const bannerImg = getCardImage(token);
        const venue = token.activityVenue || token.venue || 'SECE Campus';
        const expiry = token.expiryDate || token.expiresAt;

        return `
            <div class="token-card" onclick="window.location.hash = '#/token/${token.tokenId}'" tabindex="0">
                <div class="token-card-shine"></div>

                <div class="token-banner-wrap">
                    <img src="${bannerImg}" alt="${token.activityTitle || 'Token'}" class="token-card-banner" loading="lazy" width="380" height="214">
                    <div class="token-banner-overlay"></div>
                    <span class="token-category-badge ${cat}">${token.activityCategory || 'ACTIVITY'}</span>
                    <div class="token-banner-ring">
                        ${createCountdownRing(expiry, 42, 3)}
                    </div>
                </div>

                <div class="token-card-body">
                    <div class="token-card-code">
                        <i data-lucide="hash"></i>
                        <span>${token.tokenCode || 'TKN-000'}</span>
                    </div>

                    <h3 class="token-card-title">${token.activityTitle || 'Campus Activity'}</h3>

                    <div class="token-card-meta">
                        <div class="meta-row">
                            <i data-lucide="map-pin"></i>
                            <span class="meta-venue-text">${venue}</span>
                        </div>
                        <div class="meta-row">
                            <i data-lucide="clock"></i>
                            <span>Expires: ${formatDateTime(expiry)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="token-owner-strip">
                        <div class="owner-chip">
                            <div class="owner-avatar">${getInitials(token.ownerName)}</div>
                            <span class="owner-text">${token.ownerName || 'Verified Student'}</span>
                        </div>
                        ${renderBadge(token.status)}
                    </div>

                    <div class="token-card-footer">
                        <button type="button" class="cyber-btn primary-glow btn-sm" style="width: 100%;">
                            <i data-lucide="external-link"></i>
                            <span>View Token Details</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    refreshIcons();
}

export default renderLanding;
