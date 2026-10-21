/**
 * NEXUS Hash-Based Client SPA Router (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */
import { state, isUserAdmin } from './state.js';
import { showToast } from './ui.js';
import { updateSlidingIndicator, closeProfileMenu, closeMobileDrawer } from './main.js';
import { renderLanding } from './pages/landing.js';
import { renderAuth } from './pages/auth.js';
import { renderMarketplace } from './pages/marketplace.js';
import { renderTokenDetail } from './pages/token-detail.js';
import { renderMyTokens } from './pages/my-tokens.js';
import { renderRequests } from './pages/requests.js';
import { renderActivities } from './pages/activities.js';
import { renderHistory } from './pages/history.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderStyleguide } from './pages/styleguide.js';
import { renderNotFound } from './pages/not-found.js';

let appContainer = null;
let currentCleanup = null;
let isInitialLoad = true;

const routes = [
    { pattern: /^#\/?$/, name: 'landing', handler: renderLanding, requiresAuth: false },
    { pattern: /^#\/landing\/?$/, name: 'landing', handler: renderLanding, requiresAuth: false },
    { pattern: /^#\/auth\/?$/, name: 'auth', handler: renderAuth, requiresAuth: false },
    { pattern: /^#\/marketplace\/?$/, name: 'marketplace', handler: renderMarketplace, requiresAuth: false },
    { pattern: /^#\/token\/(\d+)/, name: 'token-detail', handler: (c, match) => renderTokenDetail(c, { id: match[1] }), requiresAuth: false },
    { pattern: /^#\/my-tokens\/?$/, name: 'my-tokens', handler: renderMyTokens, requiresAuth: true },
    { pattern: /^#\/requests\/?$/, name: 'requests', handler: renderRequests, requiresAuth: true },
    { pattern: /^#\/activities\/?$/, name: 'activities', handler: renderActivities, requiresAdmin: true },
    { pattern: /^#\/history\/?$/, name: 'history', handler: renderHistory, requiresAuth: false },
    { pattern: /^#\/dashboard\/?$/, name: 'dashboard', handler: renderDashboard, requiresAuth: false },
    { pattern: /^#\/styleguide\/?$/, name: 'styleguide', handler: renderStyleguide, requiresAuth: false }
];

export function initRouter(container) {
    appContainer = container;

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);

    // Initial load
    handleRouteChange();
}

export function navigateTo(hash) {
    window.location.hash = hash;
}

async function handleRouteChange() {
    if (!appContainer) return;

    // Close any open popovers / drawers on navigation
    closeProfileMenu();
    closeMobileDrawer();

    let hash = window.location.hash || '#/';

    // 1. Check if user is not signed in
    if (!state.activeStudent) {
        // If no user is signed in, show the full-screen Login/Register page first (allow landing, auth, and styleguide)
        if (hash !== '#/auth' && hash !== '#/' && hash !== '#/landing' && hash !== '#/styleguide') {
            window.location.hash = '#/auth';
            return;
        }
    } else {
        // If already signed in and on auth page, redirect to marketplace
        if (hash === '#/auth') {
            window.location.hash = '#/marketplace';
            return;
        }
    }

    // 2. Cleanup previous page resources
    if (typeof currentCleanup === 'function') {
        try {
            currentCleanup();
        } catch (err) {
            console.error('Error during route cleanup:', err);
        }
        currentCleanup = null;
    }

    // 3. Find matching route
    let matchedRoute = null;
    let matchResult = null;

    for (const r of routes) {
        const m = hash.match(r.pattern);
        if (m) {
            matchedRoute = r;
            matchResult = m;
            break;
        }
    }

    // 4. Check route permissions
    if (matchedRoute) {
        if (matchedRoute.requiresAuth && !state.activeStudent) {
            showToast('Please sign in to access this page.', 'warning');
            window.location.hash = '#/auth';
            return;
        }

        if (matchedRoute.requiresAdmin && !isUserAdmin()) {
            showToast('Access restricted: Administrator role required.', 'error');
            window.location.hash = '#/marketplace';
            return;
        }
    }

    // 5. Update Top Navbar Active Links & Drawer
    updateNavLinks(matchedRoute ? matchedRoute.name : '404');
    requestAnimationFrame(updateSlidingIndicator);

    // 6. Smooth Transition Animation (Fast, 60fps transform & opacity)
    if (isInitialLoad) {
        isInitialLoad = false;
        if (matchedRoute) {
            currentCleanup = await matchedRoute.handler(appContainer, matchResult);
        } else {
            currentCleanup = await renderNotFound(appContainer);
        }
        updateSlidingIndicator();
        return;
    }

    appContainer.classList.add('route-exit');

    setTimeout(async () => {
        window.scrollTo({ top: 0, behavior: 'instant' });

        if (matchedRoute) {
            currentCleanup = await matchedRoute.handler(appContainer, matchResult);
        } else {
            currentCleanup = await renderNotFound(appContainer);
        }

        appContainer.classList.remove('route-exit');
        appContainer.classList.add('route-enter');

        setTimeout(() => {
            appContainer.classList.remove('route-enter');
            updateSlidingIndicator();
        }, 250);
    }, 120);
}

function updateNavLinks(routeName) {
    const navLinks = document.querySelectorAll('.nav-links .nav-item, .drawer-nav-item');
    navLinks.forEach(link => {
        const navTarget = link.getAttribute('data-nav');
        if (navTarget === routeName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

export default { initRouter, navigateTo };
