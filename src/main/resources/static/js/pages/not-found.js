/**
 * NEXUS 404 Glitch Error Page Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { refreshIcons } from '../ui.js';

export function renderNotFound(container) {
    container.innerHTML = `
        <div class="glitch-wrapper container">
            <div class="glitch-title" data-text="404">404</div>
            <div class="hero-pill" style="margin-bottom: 20px;">
                <span class="pulse-dot"></span>
                <span>ERROR CODE // NEXUS_ROUTE_UNRESOLVED</span>
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 14px; font-family: var(--font-heading);">
                SIGNAL DEVIATION: SECTOR DOES NOT EXIST
            </h2>
            <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 30px; font-size: 1rem;">
                The coordinates or token resource you requested have been deprecated, expired, or relocated within the campus ledger.
            </p>
            <div class="hero-actions" style="justify-content: center;">
                <a href="#/marketplace" class="cyber-btn primary-glow">
                    <i data-lucide="compass"></i>
                    <span>Return to Marketplace</span>
                </a>
                <a href="#/" class="cyber-btn secondary-glass">
                    <i data-lucide="home"></i>
                    <span>Launch Portal</span>
                </a>
            </div>
        </div>
    `;

    refreshIcons();
}

export default renderNotFound;
