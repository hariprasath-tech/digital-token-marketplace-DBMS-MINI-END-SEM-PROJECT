/**
 * NEXUS Digital Token Marketplace - Master Application Entry Point (ES Module)
 * Sri Eshwar College of Engineering - Coimbatore
 * Author: Hari Prasath (Roll No: 23CS101)
 */

import { api } from './api.js';
import { state, loadStudents, refreshAllData, signOut, isUserAdmin, subscribe } from './state.js';
import { initRouter } from './router.js';
import { initCursor, showToast, refreshIcons, getInitials } from './ui.js';
import { initLenis, initMagneticButtons } from './animations.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Visual Infrastructure
    initLenis();
    refreshIcons();
    initCursor();

    // 2. Setup Top Header Navigation, Profile Menu & Mobile Drawer
    setupHeader();
    setupMobileDrawer();

    // 3. Load Active Students and Data
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('demo_student')) {
            localStorage.setItem('nexus_student_id', urlParams.get('demo_student'));
        }
        await loadStudents();
        await refreshAllData();
    } catch (err) {
        console.error('Initialization data fetch error:', err);
    }

    // 4. Initialize Hash SPA Router
    const appEl = document.getElementById('app');
    if (appEl) {
        initRouter(appEl);
    }

    // 5. Periodic Synchronization (Every 25s)
    setInterval(async () => {
        if (state.activeStudent) {
            try {
                const reqRes = await api.getIncomingRequests(state.activeStudent.studentId);
                const count = (reqRes.data || []).length;
                updateIncomingBadge(count);
            } catch (e) {
                // background poll silent
            }
        }
    }, 25000);

    // Initial Badge Check
    updateIncomingBadge((state.incomingRequests || []).length);

    // 6. Magnetic Button Physics
    setTimeout(() => {
        initMagneticButtons();
        updateSlidingIndicator();
    }, 400);
});

// Setup Top Header Navigation & User Profile Menu
function setupHeader() {
    const profileBtn = document.getElementById('userProfileBtn');
    const profileMenu = document.getElementById('userProfileMenu');
    const signOutBtn = document.getElementById('headerSignOutBtn');

    // Toggle User Profile Dropdown
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = profileMenu.classList.contains('visible');
            if (isExpanded) {
                closeProfileMenu();
            } else {
                openProfileMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (profileMenu.classList.contains('visible') && !profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                closeProfileMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProfileMenu();
                closeMobileDrawer();
            }
        });
    }

    // Sign Out Handler
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            closeProfileMenu();
            signOut();
            showToast('Signed out successfully.', 'info');
            window.location.hash = '#/auth';
        });
    }

    // Subscribe to Student Session Changes
    subscribe('studentChanged', (student) => {
        updateAuthDisplay(student);
        updateSlidingIndicator();
    });

    subscribe('requestsUpdated', ({ incoming }) => {
        updateIncomingBadge(incoming.length);
    });

    // Initial Auth State Rendering
    updateAuthDisplay(state.activeStudent);
}

export function openProfileMenu() {
    const profileBtn = document.getElementById('userProfileBtn');
    const profileMenu = document.getElementById('userProfileMenu');
    if (!profileMenu) return;

    profileMenu.classList.remove('hidden');
    // Force reflow for scale animation
    void profileMenu.offsetWidth;
    profileMenu.classList.add('visible');
    if (profileBtn) profileBtn.setAttribute('aria-expanded', 'true');
}

export function closeProfileMenu() {
    const profileBtn = document.getElementById('userProfileBtn');
    const profileMenu = document.getElementById('userProfileMenu');
    if (!profileMenu) return;

    profileMenu.classList.remove('visible');
    profileMenu.classList.add('hidden');
    if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
}

function updateAuthDisplay(student) {
    const chipWrap = document.getElementById('userProfileChipWrap');
    const signInBtn = document.getElementById('navSignInBtn');
    const authOnlyItems = document.querySelectorAll('.auth-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');

    if (student) {
        // Logged In
        if (chipWrap) chipWrap.classList.remove('hidden');
        if (signInBtn) signInBtn.classList.add('hidden');

        // Update Avatar and User Names
        const avatar = document.getElementById('userAvatar');
        const displayName = document.getElementById('userDisplayName');
        const displayRoll = document.getElementById('userDisplayRoll');
        const menuAvatar = document.getElementById('menuAvatar');
        const menuFullName = document.getElementById('menuFullName');
        const menuRegNo = document.getElementById('menuRegNo');
        const menuDept = document.getElementById('menuDept');
        const adminWrap = document.getElementById('menuAdminBadgeWrap');

        const initials = getInitials(student.name);
        if (avatar) avatar.textContent = initials;
        if (displayName) displayName.textContent = student.name;
        if (displayRoll) displayRoll.textContent = student.rollNo;

        if (menuAvatar) menuAvatar.textContent = initials;
        if (menuFullName) menuFullName.textContent = student.name;
        if (menuRegNo) menuRegNo.textContent = student.rollNo;
        if (menuDept) menuDept.textContent = student.department || 'SECE Engineering';

        const admin = isUserAdmin();
        if (adminWrap) {
            adminWrap.innerHTML = admin ? `
                <span class="admin-badge-pill">
                    <i data-lucide="shield-check"></i>
                    <span>ADMINISTRATOR</span>
                </span>
            ` : '';
        }

        // Show/hide Auth-only & Admin-only links
        authOnlyItems.forEach(el => el.classList.remove('hidden'));
        adminOnlyItems.forEach(el => {
            if (admin) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        updateDrawerUser(student);
    } else {
        // Logged Out
        if (chipWrap) chipWrap.classList.add('hidden');
        if (signInBtn) signInBtn.classList.remove('hidden');

        authOnlyItems.forEach(el => el.classList.add('hidden'));
        adminOnlyItems.forEach(el => el.classList.add('hidden'));

        updateDrawerUser(null);
    }

    refreshIcons();
}

// Mobile Drawer Setup
function setupMobileDrawer() {
    const toggle = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const drawerSignOut = document.getElementById('drawerSignOutBtn');

    if (toggle) {
        toggle.addEventListener('click', () => {
            openMobileDrawer();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
    if (overlay) overlay.addEventListener('click', closeMobileDrawer);

    if (drawerSignOut) {
        drawerSignOut.addEventListener('click', () => {
            closeMobileDrawer();
            signOut();
            showToast('Signed out successfully.', 'info');
            window.location.hash = '#/auth';
        });
    }

    // Close on navigation link click
    document.querySelectorAll('.drawer-nav-item').forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });
}

export function openMobileDrawer() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const toggle = document.getElementById('mobileMenuToggle');

    if (drawer) {
        drawer.classList.remove('hidden');
        void drawer.offsetWidth;
        drawer.classList.add('open');
    }
    if (overlay) {
        overlay.classList.remove('hidden');
        void overlay.offsetWidth;
        overlay.classList.add('open');
    }
    if (toggle) toggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function closeMobileDrawer() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const toggle = document.getElementById('mobileMenuToggle');

    if (drawer) {
        drawer.classList.remove('open');
        setTimeout(() => drawer.classList.add('hidden'), 300);
    }
    if (overlay) {
        overlay.classList.remove('open');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';
}

function updateDrawerUser(student) {
    const box = document.getElementById('drawerUserBox');
    const signoutBtn = document.getElementById('drawerSignOutBtn');
    if (!box) return;

    if (student) {
        box.innerHTML = `
            <div class="drawer-user-card">
                <div class="avatar-circle">${getInitials(student.name)}</div>
                <div class="drawer-user-info">
                    <strong>${student.name}</strong>
                    <span>${student.rollNo} • ${student.department || 'SECE'}</span>
                </div>
            </div>
        `;
        if (signoutBtn) signoutBtn.classList.remove('hidden');
    } else {
        box.innerHTML = `
            <div class="drawer-auth-prompt">
                <a href="#/auth" class="cyber-btn primary-glow btn-sm" style="width:100%;">
                    <i data-lucide="log-in"></i>
                    <span>Sign In to Your Account</span>
                </a>
            </div>
        `;
        if (signoutBtn) signoutBtn.classList.add('hidden');
    }
    refreshIcons();
}

// Sliding Pill Indicator on Navbar Links
export function updateSlidingIndicator() {
    const nav = document.getElementById('mainNavLinks');
    const indicator = document.getElementById('navSlidingIndicator');
    if (!nav || !indicator) return;

    const activeLink = nav.querySelector('.nav-item.active:not(.hidden)');
    if (activeLink && activeLink.offsetWidth > 0) {
        indicator.style.width = `${activeLink.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
        indicator.style.opacity = '1';
    } else {
        indicator.style.opacity = '0';
    }
}

function updateIncomingBadge(count) {
    const badge = document.getElementById('incomingReqBadge');
    if (!badge) return;

    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

export default {};
