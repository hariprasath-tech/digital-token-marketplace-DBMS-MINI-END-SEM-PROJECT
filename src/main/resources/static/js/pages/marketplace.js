/**
 * NEXUS Marketplace Page Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { state, loadMarketplaceTokens } from '../state.js';
import { createCountdownRing, renderBadge, refreshIcons, formatDateTime, getInitials, renderCardSkeletons, getActivityCardArt } from '../ui.js';
import { initCardTilt, initScrollReveals } from '../animations.js';

export function renderMarketplace(container) {
    container.innerHTML = `
        <div class="marketplace-page container">
            <!-- Page Header -->
            <div class="page-title-row gsap-reveal">
                <div>
                    <span class="section-tag">PEER-TO-PEER EXCHANGE</span>
                    <h1 class="page-main-title">CAMPUS TOKEN MARKETPLACE</h1>
                    <p class="page-subtitle">Browse and claim active reservations for labs, sports facilities, and workshops across SECE.</p>
                </div>
                <div class="header-action-group">
                    <a href="#/my-tokens" class="cyber-btn primary-glow">
                        <i data-lucide="plus-circle"></i>
                        <span>List Your Token</span>
                    </a>
                </div>
            </div>

            <!-- Sticky Filter Bar (Custom Components, Blurred Glass Background) -->
            <div class="marketplace-sticky-bar gsap-reveal" id="marketplaceFilterBar">
                <div class="filter-search-row">
                    <!-- Search Input -->
                    <div class="search-input-wrap">
                        <i data-lucide="search"></i>
                        <input type="text" id="marketSearchInput" placeholder="Search tokens by code, activity name, or venue..." value="${state.filters.search}">
                        ${state.filters.search ? '<button type="button" class="clear-input-btn" id="clearSearchInputBtn">&times;</button>' : ''}
                    </div>

                    <!-- Custom Dropdown 1: Status (NO native white select) -->
                    <div class="custom-select-wrap" id="customStatusSelectWrap">
                        <button type="button" class="custom-select-trigger" id="customStatusTrigger" aria-haspopup="listbox" aria-expanded="false">
                            <span class="select-label-text" id="statusSelectedLabel">Status: All Statuses</span>
                            <i data-lucide="chevron-down" class="select-arrow"></i>
                        </button>
                        <div class="custom-select-menu hidden" id="customStatusMenu" role="listbox">
                            <div class="custom-option ${state.filters.status === 'ALL' ? 'active' : ''}" data-val="ALL">All Statuses</div>
                            <div class="custom-option ${state.filters.status === 'AVAILABLE' ? 'active' : ''}" data-val="AVAILABLE">
                                <span class="status-dot emerald"></span>Available
                            </div>
                            <div class="custom-option ${state.filters.status === 'TRANSFER_PENDING' ? 'active' : ''}" data-val="TRANSFER_PENDING">
                                <span class="status-dot amber"></span>Transfer Pending
                            </div>
                            <div class="custom-option ${state.filters.status === 'TRANSFERRED' ? 'active' : ''}" data-val="TRANSFERRED">
                                <span class="status-dot cyan"></span>Transferred
                            </div>
                            <div class="custom-option ${state.filters.status === 'USED' ? 'active' : ''}" data-val="USED">
                                <span class="status-dot grey"></span>Used
                            </div>
                            <div class="custom-option ${state.filters.status === 'EXPIRED' ? 'active' : ''}" data-val="EXPIRED">
                                <span class="status-dot rose"></span>Expired
                            </div>
                        </div>
                    </div>

                    <!-- Custom Dropdown 2: Sort By (NO native white select) -->
                    <div class="custom-select-wrap" id="customSortSelectWrap">
                        <button type="button" class="custom-select-trigger" id="customSortTrigger" aria-haspopup="listbox" aria-expanded="false">
                            <span class="select-label-text" id="sortSelectedLabel">Sort: Expiry (Soonest)</span>
                            <i data-lucide="chevron-down" class="select-arrow"></i>
                        </button>
                        <div class="custom-select-menu hidden" id="customSortMenu" role="listbox">
                            <div class="custom-option ${state.filters.sortBy === 'expiry-asc' ? 'active' : ''}" data-val="expiry-asc">Sort: Expiry (Soonest)</div>
                            <div class="custom-option ${state.filters.sortBy === 'expiry-desc' ? 'active' : ''}" data-val="expiry-desc">Sort: Expiry (Latest)</div>
                            <div class="custom-option ${state.filters.sortBy === 'name-asc' ? 'active' : ''}" data-val="name-asc">Sort: Activity Name (A-Z)</div>
                        </div>
                    </div>
                </div>

                <div class="filter-controls-row">
                    <!-- Activity Category Chips -->
                    <div class="category-chips" id="marketCategoryChips" role="tablist">
                        <button type="button" class="category-chip ${state.filters.category === 'ALL' ? 'active' : ''}" data-category="ALL">
                            <i data-lucide="layers"></i>
                            <span>All Categories</span>
                        </button>
                        <button type="button" class="category-chip ${state.filters.category === 'WORKSHOP' ? 'active' : ''}" data-category="WORKSHOP">
                            <i data-lucide="code-2"></i>
                            <span>Workshop</span>
                        </button>
                        <button type="button" class="category-chip ${state.filters.category === 'EVENT' ? 'active' : ''}" data-category="EVENT">
                            <i data-lucide="calendar"></i>
                            <span>Event</span>
                        </button>
                        <button type="button" class="category-chip ${state.filters.category === 'LAB' || state.filters.category === 'LAB_SESSION' ? 'active' : ''}" data-category="LAB_SESSION">
                            <i data-lucide="cpu"></i>
                            <span>Lab Session</span>
                        </button>
                        <button type="button" class="category-chip ${state.filters.category === 'SPORTS' ? 'active' : ''}" data-category="SPORTS">
                            <i data-lucide="activity"></i>
                            <span>Sports</span>
                        </button>
                        <button type="button" class="category-chip ${state.filters.category === 'CLUB' || state.filters.category === 'CLUB_ACTIVITY' ? 'active' : ''}" data-category="CLUB_ACTIVITY">
                            <i data-lucide="users"></i>
                            <span>Club Meet</span>
                        </button>
                    </div>

                    <div class="active-count-label" id="marketplaceCountLabel">
                        Loading listings...
                    </div>
                </div>

                <!-- Active Filter Tags Strip -->
                <div class="active-filters-strip hidden" id="activeFiltersStrip">
                    <span class="active-filters-title">Active Filters:</span>
                    <div class="active-filter-tags-list" id="activeFilterTagsList"></div>
                    <button type="button" class="clear-all-filters-btn" id="clearAllFiltersBtn">
                        <i data-lucide="rotate-ccw"></i>
                        <span>Clear All</span>
                    </button>
                </div>
            </div>

            <!-- Token Grid -->
            <div class="token-grid" id="marketTokensGrid">
                ${renderCardSkeletons(6)}
            </div>

            <!-- Empty State (Zero Emojis) -->
            <div class="empty-state-view hidden" id="marketEmptyState">
                <i data-lucide="search-x" class="empty-state-icon"></i>
                <h3>No Matching Tokens Found</h3>
                <p>No digital tokens matched your filter criteria. Try clearing search keywords or selecting a different category.</p>
                <button type="button" class="cyber-btn secondary-glass" id="resetMarketFiltersBtn">
                    <i data-lucide="rotate-ccw"></i>
                    <span>Reset All Filters</span>
                </button>
            </div>
        </div>
    `;

    refreshIcons();
    setupMarketplaceListeners(container);
    renderTokenCards(container);
}

// Maps each activity to its own unique generated artwork
function getCardImage(token) {
    return getActivityCardArt(token);
}


function setupMarketplaceListeners(container) {
    const searchInput = container.querySelector('#marketSearchInput');
    const chips = container.querySelectorAll('.category-chip');
    const resetBtn = container.querySelector('#resetMarketFiltersBtn');
    const clearAllBtn = container.querySelector('#clearAllFiltersBtn');

    // Debounced Search Input (200ms)
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.filters.search = e.target.value.trim();
            renderTokenCards(container);
            updateActiveFiltersStrip(container);
        }, 200);
    });

    // Custom Status Dropdown
    setupCustomDropdown(
        container.querySelector('#customStatusTrigger'),
        container.querySelector('#customStatusMenu'),
        (val, text) => {
            state.filters.status = val;
            container.querySelector('#statusSelectedLabel').textContent = `Status: ${text}`;
            renderTokenCards(container);
            updateActiveFiltersStrip(container);
        }
    );

    // Custom Sort Dropdown
    setupCustomDropdown(
        container.querySelector('#customSortTrigger'),
        container.querySelector('#customSortMenu'),
        (val, text) => {
            state.filters.sortBy = val;
            container.querySelector('#sortSelectedLabel').textContent = text;
            renderTokenCards(container);
        }
    );

    // Category Chips
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.filters.category = chip.dataset.category;
            renderTokenCards(container);
            updateActiveFiltersStrip(container);
        });
    });

    // Reset Filters Button
    const resetFn = () => {
        state.filters.category = 'ALL';
        state.filters.status = 'ALL';
        state.filters.search = '';
        state.filters.sortBy = 'expiry-asc';

        searchInput.value = '';
        container.querySelector('#statusSelectedLabel').textContent = 'Status: All Statuses';
        container.querySelector('#sortSelectedLabel').textContent = 'Sort: Expiry (Soonest)';

        chips.forEach(c => c.classList.toggle('active', c.dataset.category === 'ALL'));
        container.querySelectorAll('#customStatusMenu .custom-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.val === 'ALL');
        });

        renderTokenCards(container);
        updateActiveFiltersStrip(container);
    };

    if (resetBtn) resetBtn.addEventListener('click', resetFn);
    if (clearAllBtn) clearAllBtn.addEventListener('click', resetFn);

    updateActiveFiltersStrip(container);
}

// Custom Select Helper (Keyboard Accessible, Esc, Outside Click)
function setupCustomDropdown(trigger, menu, onSelect) {
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other open custom dropdowns
        document.querySelectorAll('.custom-select-menu.visible').forEach(m => {
            if (m !== menu) m.classList.remove('visible');
        });

        menu.classList.toggle('hidden');
        menu.classList.toggle('visible');
        trigger.setAttribute('aria-expanded', menu.classList.contains('visible') ? 'true' : 'false');
    });

    menu.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.querySelectorAll('.custom-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            menu.classList.remove('visible');
            menu.classList.add('hidden');
            trigger.setAttribute('aria-expanded', 'false');

            const val = option.dataset.val;
            const text = option.textContent.trim();
            onSelect(val, text);
        });
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('visible');
            menu.classList.add('hidden');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });
}

function updateActiveFiltersStrip(container) {
    const strip = container.querySelector('#activeFiltersStrip');
    const tagsList = container.querySelector('#activeFilterTagsList');
    if (!strip || !tagsList) return;

    const tags = [];

    if (state.filters.category && state.filters.category !== 'ALL') {
        tags.push({ type: 'category', label: `Category: ${state.filters.category}` });
    }
    if (state.filters.status && state.filters.status !== 'ALL') {
        tags.push({ type: 'status', label: `Status: ${state.filters.status}` });
    }
    if (state.filters.search) {
        tags.push({ type: 'search', label: `Search: "${state.filters.search}"` });
    }

    if (tags.length === 0) {
        strip.classList.add('hidden');
        tagsList.innerHTML = '';
        return;
    }

    strip.classList.remove('hidden');
    tagsList.innerHTML = tags.map(t => `
        <span class="active-filter-tag" data-filter-type="${t.type}">
            <span>${t.label}</span>
            <button type="button" class="remove-tag-btn" data-type="${t.type}" aria-label="Remove filter">&times;</button>
        </span>
    `).join('');

    tagsList.querySelectorAll('.remove-tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            if (type === 'category') {
                state.filters.category = 'ALL';
                container.querySelectorAll('.category-chip').forEach(c => c.classList.toggle('active', c.dataset.category === 'ALL'));
            } else if (type === 'status') {
                state.filters.status = 'ALL';
                container.querySelector('#statusSelectedLabel').textContent = 'Status: All Statuses';
            } else if (type === 'search') {
                state.filters.search = '';
                container.querySelector('#marketSearchInput').value = '';
            }
            renderTokenCards(container);
            updateActiveFiltersStrip(container);
        });
    });

    refreshIcons();
}

function renderTokenCards(container) {
    const grid = container.querySelector('#marketTokensGrid');
    const emptyState = container.querySelector('#marketEmptyState');
    const countLabel = container.querySelector('#marketplaceCountLabel');
    if (!grid) return;

    let list = [...state.tokens];

    // Filter by Category
    if (state.filters.category !== 'ALL') {
        const catFilter = state.filters.category.toUpperCase();
        list = list.filter(t => {
            const c = (t.activityCategory || '').toUpperCase();
            if (catFilter === 'LAB_SESSION') return c.includes('LAB');
            if (catFilter === 'CLUB_ACTIVITY') return c.includes('CLUB');
            return c === catFilter;
        });
    }

    // Filter by Status
    if (state.filters.status !== 'ALL') {
        list = list.filter(t => (t.status || '').toUpperCase() === state.filters.status);
    }

    // Filter by Search Keyword
    if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        list = list.filter(t => {
            const venue = (t.activityVenue || t.venue || '').toLowerCase();
            const code = (t.tokenCode || '').toLowerCase();
            const title = (t.activityTitle || '').toLowerCase();
            const owner = (t.ownerName || '').toLowerCase();
            return code.includes(q) || title.includes(q) || venue.includes(q) || owner.includes(q);
        });
    }

    // Sort tokens
    if (state.filters.sortBy === 'expiry-asc') {
        list.sort((a, b) => new Date(a.expiryDate || a.expiresAt || 0) - new Date(b.expiryDate || b.expiresAt || 0));
    } else if (state.filters.sortBy === 'expiry-desc') {
        list.sort((a, b) => new Date(b.expiryDate || b.expiresAt || 0) - new Date(a.expiryDate || a.expiresAt || 0));
    } else if (state.filters.sortBy === 'name-asc') {
        list.sort((a, b) => (a.activityTitle || '').localeCompare(b.activityTitle || ''));
    }

    if (countLabel) {
        countLabel.textContent = `${list.length} Listings Active`;
    }

    if (list.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    const displayList = list.slice(0, 30);
    grid.innerHTML = displayList.map(token => {
        const isMine = state.activeStudent && token.ownerStudentId === state.activeStudent.studentId;
        const isAvailable = token.status === 'AVAILABLE';
        const cat = (token.activityCategory || 'EVENT').toLowerCase();
        const bannerImg = getCardImage(token);
        const venue = token.activityVenue || token.venue || 'SECE Campus';
        const expiry = token.expiryDate || token.expiresAt;

        return `
            <div class="token-card gsap-reveal" data-token-id="${token.tokenId}" tabindex="0">
                <div class="token-card-shine"></div>

                <!-- 16:9 Image Visual (Object-Fit: Cover) -->
                <div class="token-banner-wrap">
                    <img src="${bannerImg}" alt="${token.activityTitle || 'Activity'}" class="token-card-banner" loading="lazy" decoding="async" width="380" height="214">
                    <div class="token-banner-overlay"></div>
                    <span class="token-category-badge ${cat}">${token.activityCategory || 'ACTIVITY'}</span>
                    <div class="token-banner-ring">
                        ${createCountdownRing(expiry, 44, 3.5)}
                    </div>
                </div>

                <!-- Card Content -->
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

                    <div class="token-owner-strip">
                        <div class="owner-chip">
                            <div class="owner-avatar">${getInitials(token.ownerName)}</div>
                            <div class="owner-info">
                                <span class="owner-name">${token.ownerName || 'Verified Student'}</span>
                                ${isMine ? '<span class="owner-tag">(You)</span>' : ''}
                            </div>
                        </div>
                        ${renderBadge(token.status)}
                    </div>
                </div>

                <!-- Actions -->
                <div class="token-card-footer">
                    <a href="#/token/${token.tokenId}" class="cyber-btn secondary-glass btn-sm">
                        <i data-lucide="eye"></i>
                        <span>Details</span>
                    </a>

                    ${!isMine && isAvailable ? `
                        <button type="button" class="cyber-btn primary-glow btn-sm request-transfer-btn" data-token-id="${token.tokenId}">
                            <i data-lucide="send"></i>
                            <span>Request Transfer</span>
                        </button>
                    ` : isMine ? `
                        <span class="owned-indicator-badge">
                            <i data-lucide="check"></i>
                            <span>Your Token</span>
                        </span>
                    ` : `
                        <span class="locked-indicator-badge">
                            <span>${token.status}</span>
                        </span>
                    `}
                </div>
            </div>
        `;
    }).join('');

    refreshIcons();
    initCardTilt(grid);
    initScrollReveals();

    // Attach "Request Transfer" action buttons
    grid.querySelectorAll('.request-transfer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tokenId = btn.dataset.tokenId;
            window.location.hash = `#/token/${tokenId}?action=request`;
        });
    });
}

export default renderMarketplace;
