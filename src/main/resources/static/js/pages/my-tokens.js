/**
 * NEXUS My Tokens Vault & 3-Step Wizard Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, loadMyTokens, loadMarketplaceTokens, loadActivities } from '../state.js';
import { createCountdownRing, renderBadge, refreshIcons, formatDateTime, showToast, triggerConfetti, openModal, closeModal, getActivityCardArt } from '../ui.js';
import { initCardTilt } from '../animations.js';

function getCardImage(token) {
    return getActivityCardArt(token);
}


export function renderMyTokens(container) {
    if (!state.activeStudent) {
        container.innerHTML = `
            <div class="vault-page-wrapper container">
                <div class="empty-state-view">
                    <i data-lucide="lock" class="empty-state-icon"></i>
                    <h3>Authentication Required</h3>
                    <p>Please sign in to access your digital token vault.</p>
                    <a href="#/auth" class="cyber-btn primary-glow">
                        <i data-lucide="log-in"></i>
                        <span>Sign In</span>
                    </a>
                </div>
            </div>
        `;
        refreshIcons();
        return;
    }

    container.innerHTML = `
        <div class="vault-page-wrapper container">
            <!-- Header Strip -->
            <div class="vault-header-strip gsap-reveal">
                <div class="vault-title-group">
                    <span class="section-tag">SECURE HOLDINGS</span>
                    <h1 class="page-main-title">MY TOKEN VAULT</h1>
                    <p class="page-subtitle">Manage reservations owned by ${state.activeStudent.name} (${state.activeStudent.rollNo}).</p>
                </div>

                <div class="vault-actions">
                    <button type="button" class="cyber-btn primary-glow" id="openListTokenWizardBtn">
                        <i data-lucide="plus-circle"></i>
                        <span>List a Token</span>
                    </button>
                </div>
            </div>

            <!-- Tabs Nav -->
            <div class="vault-tabs-nav gsap-reveal">
                <button type="button" class="category-chip ${state.vaultTab === 'ALL' ? 'active' : ''}" data-vault-tab="ALL">
                    <span>All Tokens</span>
                    <span class="tab-count" id="countAll">0</span>
                </button>
                <button type="button" class="category-chip ${state.vaultTab === 'AVAILABLE' ? 'active' : ''}" data-vault-tab="AVAILABLE">
                    <span>Available</span>
                    <span class="tab-count" id="countAvailable">0</span>
                </button>
                <button type="button" class="category-chip ${state.vaultTab === 'TRANSFER_PENDING' ? 'active' : ''}" data-vault-tab="TRANSFER_PENDING">
                    <span>Pending Transfer</span>
                    <span class="tab-count" id="countPending">0</span>
                </button>
                <button type="button" class="category-chip ${state.vaultTab === 'TRANSFERRED' ? 'active' : ''}" data-vault-tab="TRANSFERRED">
                    <span>Transferred</span>
                    <span class="tab-count" id="countTransferred">0</span>
                </button>
                <button type="button" class="category-chip ${state.vaultTab === 'USED' ? 'active' : ''}" data-vault-tab="USED">
                    <span>Used</span>
                    <span class="tab-count" id="countUsed">0</span>
                </button>
                <button type="button" class="category-chip ${state.vaultTab === 'EXPIRED' ? 'active' : ''}" data-vault-tab="EXPIRED">
                    <span>Expired</span>
                    <span class="tab-count" id="countExpired">0</span>
                </button>
            </div>

            <!-- Vault Cards Grid -->
            <div class="token-grid" id="vaultTokensGrid">
                <!-- Populated dynamically -->
            </div>

            <!-- Empty Vault State (Zero Emojis) -->
            <div class="empty-state-view hidden" id="vaultEmptyState">
                <i data-lucide="ticket" class="empty-state-icon"></i>
                <h3 id="vaultEmptyTitle">No Tokens in this Category</h3>
                <p id="vaultEmptySub">You do not have any tokens matching the selected status tab.</p>
                <button type="button" class="cyber-btn primary-glow" id="emptyListTokenBtn">
                    <i data-lucide="plus"></i>
                    <span>List a Token Now</span>
                </button>
            </div>

            <!-- 3-STEP LIST TOKEN WIZARD MODAL -->
            <div class="modal-backdrop hidden" id="listTokenModalBackdrop">
                <div class="cyber-modal wizard-modal">
                    <div class="modal-header">
                        <div class="modal-title-group">
                            <i data-lucide="ticket-plus" class="modal-icon"></i>
                            <div>
                                <h3 class="modal-title">List Token on Marketplace</h3>
                                <p class="modal-sub">3-step guided wizard to create an exchangeable token</p>
                            </div>
                        </div>
                        <button type="button" class="modal-close-btn" id="closeWizardModalBtn"><i data-lucide="x"></i></button>
                    </div>

                    <!-- Wizard Progress Stepper -->
                    <div class="wizard-steps-indicator">
                        <div class="wizard-step-node active" id="stepNode1">
                            <span class="step-num">1</span>
                            <span>Select Activity</span>
                        </div>
                        <div class="step-divider"></div>
                        <div class="wizard-step-node" id="stepNode2">
                            <span class="step-num">2</span>
                            <span>Set Timestamps</span>
                        </div>
                        <div class="step-divider"></div>
                        <div class="wizard-step-node" id="stepNode3">
                            <span class="step-num">3</span>
                            <span>Confirm and List</span>
                        </div>
                    </div>

                    <!-- WIZARD STEP 1: ACTIVITY SELECTION -->
                    <div class="wizard-step-pane" id="wizardStep1">
                        <div class="form-group">
                            <label class="form-label">Choose Campus Activity <span class="req-star">*</span></label>
                            <p class="form-help-text">Select the activity for which you hold an unused slot or pass:</p>
                            <div class="wizard-activity-list" id="wizardActivityList">
                                <!-- Populated dynamically from state.activities -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="wizardCancelBtn">Cancel</button>
                            <button type="button" class="cyber-btn primary-glow" id="wizardNextToStep2">
                                <span>Continue to Timestamps</span>
                                <i data-lucide="arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- WIZARD STEP 2: TIMESTAMPS -->
                    <div class="wizard-step-pane hidden" id="wizardStep2">
                        <div class="form-group">
                            <label for="wizardValidFrom" class="form-label">Valid From <span class="req-star">*</span></label>
                            <input type="datetime-local" id="wizardValidFrom" class="cyber-input" required>
                        </div>

                        <div class="form-group">
                            <label for="wizardExpiresAt" class="form-label">Expiry Deadline <span class="req-star">*</span></label>
                            <input type="datetime-local" id="wizardExpiresAt" class="cyber-input" required>
                            <p class="form-help-text">The scheduled engine sweeps and marks the token expired if unredeemed after this timestamp.</p>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="wizardBackToStep1">
                                <i data-lucide="arrow-left"></i>
                                <span>Back</span>
                            </button>
                            <button type="button" class="cyber-btn primary-glow" id="wizardNextToStep3">
                                <span>Review Listing</span>
                                <i data-lucide="arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- WIZARD STEP 3: CONFIRMATION -->
                    <div class="wizard-step-pane hidden" id="wizardStep3">
                        <div class="wizard-review-box">
                            <div class="review-row">
                                <span class="review-label">Activity:</span>
                                <span class="review-val" id="reviewActivityTitle">--</span>
                            </div>
                            <div class="review-row">
                                <span class="review-label">Category:</span>
                                <span class="review-val" id="reviewActivityCategory">--</span>
                            </div>
                            <div class="review-row">
                                <span class="review-label">Venue:</span>
                                <span class="review-val" id="reviewVenue">--</span>
                            </div>
                            <div class="review-row">
                                <span class="review-label">Valid From:</span>
                                <span class="review-val" id="reviewValidFrom">--</span>
                            </div>
                            <div class="review-row">
                                <span class="review-label">Expiry Deadline:</span>
                                <span class="review-val" id="reviewExpiresAt">--</span>
                            </div>
                            <div class="review-row">
                                <span class="review-label">Owner:</span>
                                <span class="review-val">${state.activeStudent.name} (${state.activeStudent.rollNo})</span>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="wizardBackToStep2">
                                <i data-lucide="arrow-left"></i>
                                <span>Back</span>
                            </button>
                            <button type="button" class="cyber-btn primary-glow" id="wizardSubmitBtn">
                                <i data-lucide="check-circle-2"></i>
                                <span>Confirm and Publish Listing</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
    setupVaultTabs(container);
    setupWizard(container);
    renderVaultCards(container);
    updateVaultCounts(container);
}

function updateVaultCounts(container) {
    const tokens = state.myTokens || [];
    const setT = (id, count) => {
        const el = container.querySelector(id);
        if (el) el.textContent = count;
    };

    setT('#countAll', tokens.length);
    setT('#countAvailable', tokens.filter(t => t.status === 'AVAILABLE').length);
    setT('#countPending', tokens.filter(t => t.status === 'TRANSFER_PENDING').length);
    setT('#countTransferred', tokens.filter(t => t.status === 'TRANSFERRED').length);
    setT('#countUsed', tokens.filter(t => t.status === 'USED').length);
    setT('#countExpired', tokens.filter(t => t.status === 'EXPIRED').length);
}

function setupVaultTabs(container) {
    const tabs = container.querySelectorAll('[data-vault-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.vaultTab = tab.dataset.vaultTab;
            renderVaultCards(container);
        });
    });
}

function renderVaultCards(container) {
    const grid = container.querySelector('#vaultTokensGrid');
    const emptyState = container.querySelector('#vaultEmptyState');
    if (!grid) return;

    let list = state.myTokens || [];
    if (state.vaultTab !== 'ALL') {
        list = list.filter(t => (t.status || '').toUpperCase() === state.vaultTab);
    }

    if (list.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = list.map(token => {
        const isAvailable = token.status === 'AVAILABLE';
        const isPending = token.status === 'TRANSFER_PENDING';
        const cat = (token.activityCategory || 'EVENT').toLowerCase();
        const bannerImg = getCardImage(token);
        const venue = token.activityVenue || token.venue || 'SECE Campus';
        const expiry = token.expiryDate || token.expiresAt;

        return `
            <div class="token-card" data-token-id="${token.tokenId}" tabindex="0">
                <div class="token-card-shine"></div>

                <div class="token-banner-wrap">
                    <img src="${bannerImg}" alt="${token.activityTitle || 'Token'}" class="token-card-banner" loading="lazy" width="380" height="214">
                    <div class="token-banner-overlay"></div>
                    <span class="token-category-badge ${cat}">${token.activityCategory || 'ACTIVITY'}</span>
                    <div class="token-banner-ring">
                        ${createCountdownRing(expiry, 44, 3.5)}
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

                    <div class="token-owner-strip">
                        <span class="owner-text" style="font-size:0.8rem; color:var(--text-secondary);">Listing Status</span>
                        ${renderBadge(token.status)}
                    </div>
                </div>

                <div class="token-card-footer">
                    <a href="#/token/${token.tokenId}" class="cyber-btn secondary-glass btn-sm">
                        <i data-lucide="eye"></i>
                        <span>Details</span>
                    </a>

                    ${isAvailable ? `
                        <button type="button" class="cyber-btn primary-glow btn-sm mark-used-btn" data-token-id="${token.tokenId}" data-code="${token.tokenCode}">
                            <i data-lucide="check-circle"></i>
                            <span>Mark Used</span>
                        </button>
                    ` : isPending ? `
                        <a href="#/requests" class="cyber-btn primary-glow btn-sm">
                            <i data-lucide="arrow-left-right"></i>
                            <span>View Request</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    refreshIcons();
    initCardTilt(grid);

    // Attach mark used listeners
    grid.querySelectorAll('.mark-used-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.tokenId, 10);
            const code = btn.dataset.code;

            if (!confirm(`Mark token ${code} as REDEEMED / USED?`)) return;

            try {
                await api.markTokenUsed(id, state.activeStudent.studentId);
                triggerConfetti();
                showToast(`Token ${code} marked as USED!`, 'success');
                await loadMyTokens();
                await loadMarketplaceTokens();
                renderVaultCards(container);
                updateVaultCounts(container);
            } catch (err) {
                showToast(err.message || 'Failed to update token.', 'error');
            }
        });
    });
}

// 3-Step Listing Wizard Logic
function setupWizard(container) {
    const openBtn = container.querySelector('#openListTokenWizardBtn');
    const emptyOpenBtn = container.querySelector('#emptyListTokenBtn');
    const closeBtn = container.querySelector('#closeWizardModalBtn');
    const cancelBtn = container.querySelector('#wizardCancelBtn');

    const step1 = container.querySelector('#wizardStep1');
    const step2 = container.querySelector('#wizardStep2');
    const step3 = container.querySelector('#wizardStep3');

    const node1 = container.querySelector('#stepNode1');
    const node2 = container.querySelector('#stepNode2');
    const node3 = container.querySelector('#stepNode3');

    const nextTo2 = container.querySelector('#wizardNextToStep2');
    const backTo1 = container.querySelector('#wizardBackToStep1');
    const nextTo3 = container.querySelector('#wizardNextToStep3');
    const backTo2 = container.querySelector('#wizardBackToStep2');
    const submitBtn = container.querySelector('#wizardSubmitBtn');

    let selectedActivity = null;

    const showWizardModal = () => {
        selectedActivity = null;
        renderWizardActivities(container, (act) => {
            selectedActivity = act;
        });

        const now = new Date();
        const future = new Date(Date.now() + 72 * 60 * 60 * 1000);

        const formatIso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        container.querySelector('#wizardValidFrom').value = formatIso(now);
        container.querySelector('#wizardExpiresAt').value = formatIso(future);

        goToStep(1);
        openModal('listTokenModalBackdrop');
    };

    if (openBtn) openBtn.addEventListener('click', showWizardModal);
    if (emptyOpenBtn) emptyOpenBtn.addEventListener('click', showWizardModal);
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('listTokenModalBackdrop'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('listTokenModalBackdrop'));

    function goToStep(stepNum) {
        step1.classList.toggle('hidden', stepNum !== 1);
        step2.classList.toggle('hidden', stepNum !== 2);
        step3.classList.toggle('hidden', stepNum !== 3);

        node1.classList.toggle('active', stepNum === 1);
        node1.classList.toggle('completed', stepNum > 1);

        node2.classList.toggle('active', stepNum === 2);
        node2.classList.toggle('completed', stepNum > 2);

        node3.classList.toggle('active', stepNum === 3);
    }

    nextTo2.addEventListener('click', () => {
        if (!selectedActivity) {
            showToast('Please select a campus activity first.', 'warning');
            return;
        }
        goToStep(2);
    });

    backTo1.addEventListener('click', () => goToStep(1));

    nextTo3.addEventListener('click', () => {
        const validFrom = container.querySelector('#wizardValidFrom').value;
        const expiresAt = container.querySelector('#wizardExpiresAt').value;

        if (!validFrom || !expiresAt) {
            showToast('Please provide both valid from and expiry timestamps.', 'warning');
            return;
        }

        if (new Date(expiresAt) <= new Date(validFrom)) {
            showToast('Expiry deadline must be later than the valid from timestamp.', 'warning');
            return;
        }

        container.querySelector('#reviewActivityTitle').textContent = selectedActivity.title;
        container.querySelector('#reviewActivityCategory').textContent = selectedActivity.category;
        container.querySelector('#reviewVenue').textContent = selectedActivity.venue || 'Campus Venue';
        container.querySelector('#reviewValidFrom').textContent = formatDateTime(validFrom);
        container.querySelector('#reviewExpiresAt').textContent = formatDateTime(expiresAt);

        goToStep(3);
    });

    backTo2.addEventListener('click', () => goToStep(2));

    submitBtn.addEventListener('click', async () => {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="loading-spinner-sm"></span> Publishing...`;

        const validFrom = container.querySelector('#wizardValidFrom').value;
        const expiresAt = container.querySelector('#wizardExpiresAt').value;

        try {
            const tokenData = {
                activityId: selectedActivity.activityId,
                ownerStudentId: state.activeStudent.studentId,
                validFrom: validFrom,
                expiresAt: expiresAt
            };

            await api.createToken(tokenData);
            closeModal('listTokenModalBackdrop');
            triggerConfetti();
            showToast(`Token for "${selectedActivity.title}" published!`, 'success');

            await loadMyTokens();
            await loadMarketplaceTokens();
            renderVaultCards(container);
            updateVaultCounts(container);
        } catch (err) {
            showToast(err.message || 'Failed to list token.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="check-circle-2"></i><span>Confirm and Publish Listing</span>`;
            refreshIcons();
        }
    });
}

function renderWizardActivities(container, onSelect) {
    const list = container.querySelector('#wizardActivityList');
    if (!list) return;

    if (state.activities.length === 0) {
        list.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">No campus activities available. Contact administration.</p>`;
        return;
    }

    list.innerHTML = state.activities.map((act, idx) => `
        <div class="wizard-activity-item ${idx === 0 ? 'selected' : ''}" data-act-id="${act.activityId}">
            <div class="item-radio-circle"></div>
            <div class="item-meta-col">
                <span class="item-title">${act.title}</span>
                <span class="item-sub">${act.category} • ${act.venue || 'Campus'}</span>
            </div>
        </div>
    `).join('');

    if (state.activities.length > 0) {
        onSelect(state.activities[0]);
    }

    list.querySelectorAll('.wizard-activity-item').forEach(item => {
        item.addEventListener('click', () => {
            list.querySelectorAll('.wizard-activity-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            const actId = parseInt(item.dataset.actId, 10);
            const found = state.activities.find(a => a.activityId === actId);
            onSelect(found);
        });
    });
}

export default renderMyTokens;
