/**
 * NEXUS Campus Activities Admin Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, loadActivities } from '../state.js';
import { refreshIcons, formatDateTime, showToast, openModal, closeModal, getActivityCardArt } from '../ui.js';

export function renderActivities(container) {
    container.innerHTML = `
        <div class="activities-page-wrapper container">
            <!-- Header -->
            <div class="page-title-row gsap-reveal">
                <div>
                    <span class="section-tag">CAMPUS DIRECTORY</span>
                    <h1 class="page-main-title">CAMPUS ACTIVITIES</h1>
                    <p class="page-subtitle">Configure approved workshops, symposiums, lab sessions, and facility slots for token generation.</p>
                </div>
                <div class="header-action-group">
                    <button type="button" class="cyber-btn primary-glow" id="openNewActivityModalBtn">
                        <i data-lucide="plus-circle"></i>
                        <span>New Campus Activity</span>
                    </button>
                </div>
            </div>

            <!-- Filter Controls -->
            <div class="marketplace-sticky-bar gsap-reveal" style="margin-bottom: 24px;">
                <div class="filter-search-row">
                    <div class="search-input-wrap">
                        <i data-lucide="search"></i>
                        <input type="text" id="activitySearchInput" placeholder="Filter activities by title, venue, or description...">
                    </div>
                </div>

                <div class="filter-controls-row">
                    <div class="category-chips" id="activityCategoryChips">
                        <button type="button" class="category-chip active" data-cat="ALL">All Categories</button>
                        <button type="button" class="category-chip" data-cat="WORKSHOP">Workshop</button>
                        <button type="button" class="category-chip" data-cat="EVENT">Event</button>
                        <button type="button" class="category-chip" data-cat="LAB">Lab Session</button>
                        <button type="button" class="category-chip" data-cat="SPORTS">Sports</button>
                        <button type="button" class="category-chip" data-cat="CLUB">Club Meet</button>
                    </div>

                    <div class="view-toggle-group">
                        <button type="button" class="view-toggle-btn active" id="viewModeCards" title="Grid View">
                            <i data-lucide="grid"></i>
                        </button>
                        <button type="button" class="view-toggle-btn" id="viewModeTable" title="Table View">
                            <i data-lucide="list"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- View Modes -->
            <div id="activitiesGridContainer" class="token-grid">
                <!-- Rendered dynamically -->
            </div>

            <div id="activitiesTableContainer" class="activities-table-wrapper hidden">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CATEGORY</th>
                            <th>ACTIVITY TITLE</th>
                            <th>VENUE</th>
                            <th>STARTS AT</th>
                            <th>CAPACITY</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody id="activitiesTableBody">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
            </div>

            <!-- Create / Edit Activity Modal -->
            <div class="modal-backdrop hidden" id="activityModalBackdrop">
                <div class="cyber-modal">
                    <div class="modal-header">
                        <div class="modal-title-group">
                            <i data-lucide="calendar-plus" class="modal-icon"></i>
                            <div>
                                <h3 class="modal-title" id="activityModalTitle">Create Campus Activity</h3>
                                <p class="modal-sub">Add a new event or lab session to enable student tokens</p>
                            </div>
                        </div>
                        <button type="button" class="modal-close-btn" id="closeActivityModalBtn"><i data-lucide="x"></i></button>
                    </div>

                    <form id="activityForm" class="modal-form">
                        <input type="hidden" id="actEditId">

                        <div class="form-group">
                            <label for="actTitleInput">Activity Title <span class="req-star">*</span></label>
                            <input type="text" id="actTitleInput" class="cyber-input" placeholder="e.g. AI & Generative Agents Hands-on Workshop" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group col">
                                <label for="actCategorySelect">Category <span class="req-star">*</span></label>
                                <select id="actCategorySelect" class="cyber-select" required>
                                    <option value="WORKSHOP">Workshop</option>
                                    <option value="EVENT">Event</option>
                                    <option value="LAB">Lab Session</option>
                                    <option value="SPORTS">Sports Facility</option>
                                    <option value="CLUB">Club Meet</option>
                                </select>
                            </div>
                            <div class="form-group col">
                                <label for="actVenueInput">Campus Venue <span class="req-star">*</span></label>
                                <input type="text" id="actVenueInput" class="cyber-input" placeholder="e.g. Turing Hall / Mech Lab 3" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="actDescInput">Description</label>
                            <textarea id="actDescInput" class="cyber-textarea" rows="2" placeholder="Brief outline of the activity..."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="actOrganizerInput">Organizer / Department <span class="req-star">*</span></label>
                            <input type="text" id="actOrganizerInput" class="cyber-input" placeholder="e.g. SECE AI Research Club" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group col">
                                <label for="actActivityDate">Activity Date &amp; Time <span class="req-star">*</span></label>
                                <input type="datetime-local" id="actActivityDate" class="cyber-input" required>
                            </div>
                            <div class="form-group col">
                                <label for="actTotalCapacity">Total Seat Capacity <span class="req-star">*</span></label>
                                <input type="number" id="actTotalCapacity" class="cyber-input" value="50" min="1" max="500" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="actImageUrl">Banner Image URL (Optional - Leave blank for unique generated art)</label>
                            <input type="text" id="actImageUrl" class="cyber-input" placeholder="e.g. assets/images/activity_custom.jpg">
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="cancelActivityBtn">Cancel</button>
                            <button type="submit" class="cyber-btn primary-glow" id="saveActivityBtn">
                                <i data-lucide="check"></i> Save Activity
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
    setupActivitiesListeners(container);
    renderActivitiesList(container);
}

let activeCatFilter = 'ALL';
let activeSearchFilter = '';
let viewMode = 'cards'; // 'cards' | 'table'

function setupActivitiesListeners(container) {
    const searchInput = container.querySelector('#activitySearchInput');
    const chips = container.querySelectorAll('#activityCategoryChips .category-chip');
    const btnCards = container.querySelector('#viewModeCards');
    const btnTable = container.querySelector('#viewModeTable');
    const gridBox = container.querySelector('#activitiesGridContainer');
    const tableBox = container.querySelector('#activitiesTableContainer');

    const openBtn = container.querySelector('#openNewActivityModalBtn');
    const closeBtn = container.querySelector('#closeActivityModalBtn');
    const cancelBtn = container.querySelector('#cancelActivityBtn');
    const form = container.querySelector('#activityForm');

    // Search
    let timer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            activeSearchFilter = e.target.value.trim().toLowerCase();
            renderActivitiesList(container);
        }, 200);
    });

    // Chips
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCatFilter = chip.dataset.cat;
            renderActivitiesList(container);
        });
    });

    // View Mode Toggle
    btnCards.addEventListener('click', () => {
        btnCards.classList.add('active');
        btnTable.classList.remove('active');
        gridBox.classList.remove('hidden');
        tableBox.classList.add('hidden');
        viewMode = 'cards';
    });

    btnTable.addEventListener('click', () => {
        btnTable.classList.add('active');
        btnCards.classList.remove('active');
        gridBox.classList.add('hidden');
        tableBox.classList.remove('hidden');
        viewMode = 'table';
    });

    // Modal open
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            container.querySelector('#actEditId').value = '';
            container.querySelector('#activityModalTitle').textContent = 'Create Campus Activity';
            container.querySelector('#actTitleInput').value = '';
            container.querySelector('#actDescInput').value = '';
            container.querySelector('#actVenueInput').value = '';
            container.querySelector('#actOrganizerInput').value = '';
            container.querySelector('#actTotalCapacity').value = '50';

            const now = new Date();
            const formatIso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            container.querySelector('#actActivityDate').value = formatIso(now);

            openModal('activityModalBackdrop');
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('activityModalBackdrop'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('activityModalBackdrop'));

    // Save Form
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = container.querySelector('#actEditId').value;
            const title = container.querySelector('#actTitleInput').value.trim();
            const category = container.querySelector('#actCategorySelect').value;
            const venue = container.querySelector('#actVenueInput').value.trim();
            const desc = container.querySelector('#actDescInput').value.trim();
            const organizer = container.querySelector('#actOrganizerInput').value.trim();
            const activityDate = container.querySelector('#actActivityDate').value;
            const totalCapacity = parseInt(container.querySelector('#actTotalCapacity').value, 10) || 50;
            const imageUrl = container.querySelector('#actImageUrl')?.value?.trim() || null;

            const payload = {
                title,
                category,
                venue,
                description: desc,
                organizer: organizer || 'SECE Department',
                activityDate: activityDate ? activityDate.replace('T', ' ') + ':00' : null,
                totalCapacity,
                imageUrl
            };

            const saveBtn = container.querySelector('#saveActivityBtn');
            saveBtn.disabled = true;

            try {
                if (editId) {
                    await api.updateActivity(parseInt(editId, 10), payload);
                    showToast(`Activity "${title}" updated!`, 'success');
                } else {
                    await api.createActivity(payload);
                    showToast(`Activity "${title}" created!`, 'success');
                }

                closeModal('activityModalBackdrop');
                await loadActivities();
                renderActivitiesList(container);
            } catch (err) {
                showToast(err.message || 'Failed to save activity', 'error');
            } finally {
                saveBtn.disabled = false;
            }
        });
    }
}

function renderActivitiesList(container) {
    const grid = container.querySelector('#activitiesGridContainer');
    const tbody = container.querySelector('#activitiesTableBody');

    let list = state.activities || [];

    if (activeCatFilter !== 'ALL') {
        list = list.filter(a => (a.category || '').toUpperCase() === activeCatFilter);
    }

    if (activeSearchFilter) {
        list = list.filter(a =>
            (a.title && a.title.toLowerCase().includes(activeSearchFilter)) ||
            (a.venue && a.venue.toLowerCase().includes(activeSearchFilter)) ||
            (a.description && a.description.toLowerCase().includes(activeSearchFilter))
        );
    }

    // Render Cards
    if (grid) {
        if (list.length === 0) {
            grid.innerHTML = `
                <div class="empty-state-view" style="grid-column: 1 / -1;">
                    <i data-lucide="calendar-x" class="empty-state-icon"></i>
                    <h3>No Activities Found</h3>
                    <p>No campus activities match the selected category or search filter.</p>
                </div>
            `;
        } else {
            grid.innerHTML = list.map(act => {
                const cat = (act.category || 'EVENT').toLowerCase();
                const actDate = act.activityDate || act.startTime;
                const capacity = act.totalCapacity || act.maxTokens || 50;
                const bannerArt = getActivityCardArt({ activityId: act.activityId, category: act.category, title: act.title, imageUrl: act.imageUrl });
                return `
                    <div class="token-card" style="cursor: default;">
                        <div class="token-banner-wrap" style="height: 120px; margin-bottom: 12px; border-radius: var(--radius-sm); overflow: hidden; position: relative;">
                            <img src="${bannerArt}" alt="${act.title}" class="token-card-banner" style="width: 100%; height: 100%; object-fit: cover;">
                            <span class="token-category-badge ${cat}" style="position: absolute; top: 10px; left: 10px;">${act.category || 'EVENT'}</span>
                        </div>

                        <div class="token-card-top" style="margin-top: 4px;">
                            <span class="meta-tag"><i data-lucide="users"></i> Cap: ${capacity}</span>
                            <span class="meta-tag"><i data-lucide="hash"></i> ACT-${act.activityId}</span>
                        </div>

                        <h3 class="token-card-title">${act.title}</h3>

                        <div class="token-card-meta">
                            <div class="meta-row">
                                <i data-lucide="map-pin"></i>
                                <span>${act.venue || 'Campus Venue'}</span>
                            </div>
                            <div class="meta-row">
                                <i data-lucide="calendar"></i>
                                <span>Starts: ${formatDateTime(actDate)}</span>
                            </div>
                            <div class="meta-row">
                                <i data-lucide="user-check"></i>
                                <span>${act.organizer || 'SECE Campus'}</span>
                            </div>
                        </div>

                        ${act.description ? `<p class="activity-desc-snippet">${act.description}</p>` : ''}

                        <div class="token-card-footer" style="margin-top: 16px;">
                            <button type="button" class="cyber-btn secondary-glass btn-sm edit-act-btn" data-act-id="${act.activityId}">
                                <i data-lucide="edit"></i> Edit
                            </button>
                            <button type="button" class="cyber-btn ghost-btn btn-sm delete-act-btn" data-act-id="${act.activityId}" style="color:var(--status-expired);">
                                <i data-lucide="trash-2"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Render Table Rows
    if (tbody) {
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px;"><div class="empty-state-view" style="padding:16px 0;"><i data-lucide="calendar-x" class="empty-state-icon"></i><h3>No Activities Found</h3><p>No campus activities match your criteria.</p></div></td></tr>`;
        } else {
            tbody.innerHTML = list.map(act => {
                const actDate = act.activityDate || act.startTime;
                const capacity = act.totalCapacity || act.maxTokens || 50;
                return `
                <tr>
                    <td>#${act.activityId}</td>
                    <td><span class="token-category-badge ${(act.category || '').toLowerCase()}">${act.category}</span></td>
                    <td><strong>${act.title}</strong></td>
                    <td>${act.venue || 'Campus'}</td>
                    <td>${formatDateTime(actDate)}</td>
                    <td>${capacity}</td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="cyber-btn secondary-glass btn-xs edit-act-btn" data-act-id="${act.activityId}">Edit</button>
                            <button type="button" class="cyber-btn ghost-btn btn-xs delete-act-btn" data-act-id="${act.activityId}" style="color:var(--status-expired);">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
            }).join('');
        }
    }

    refreshIcons();
    attachItemListeners(container);
}

function attachItemListeners(container) {
    // Edit button
    container.querySelectorAll('.edit-act-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.actId, 10);
            const found = state.activities.find(a => a.activityId === id);
            if (!found) return;

            container.querySelector('#actEditId').value = found.activityId;
            container.querySelector('#activityModalTitle').textContent = 'Edit Campus Activity';
            container.querySelector('#actTitleInput').value = found.title;
            container.querySelector('#actCategorySelect').value = found.category;
            container.querySelector('#actVenueInput').value = found.venue || '';
            container.querySelector('#actDescInput').value = found.description || '';
            container.querySelector('#actOrganizerInput').value = found.organizer || '';
            container.querySelector('#actTotalCapacity').value = found.totalCapacity || found.maxTokens || 50;
            container.querySelector('#actImageUrl').value = found.imageUrl || '';

            const formatIso = d => new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            const actDate = found.activityDate || found.startTime;
            if (actDate) container.querySelector('#actActivityDate').value = formatIso(actDate);

            openModal('activityModalBackdrop');
        });
    });

    // Delete button
    container.querySelectorAll('.delete-act-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.actId, 10);
            const found = state.activities.find(a => a.activityId === id);
            if (!confirm(`Delete activity "${found ? found.title : id}"? Any associated tokens will remain referenced in the database.`)) return;

            try {
                await api.deleteActivity(id);
                showToast('Activity deleted', 'info');
                await loadActivities();
                renderActivitiesList(container);
            } catch (err) {
                showToast(err.message || 'Could not delete activity', 'error');
            }
        });
    });
}

export default renderActivities;
