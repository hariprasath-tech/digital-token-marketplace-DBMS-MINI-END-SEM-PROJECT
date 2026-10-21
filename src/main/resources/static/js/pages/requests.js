/**
 * NEXUS Requests Page Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, loadRequests, loadMarketplaceTokens, loadMyTokens, loadHistory } from '../state.js';
import { renderBadge, refreshIcons, formatDateTime, getInitials, showToast, triggerConfetti, openModal, closeModal } from '../ui.js';

export function renderRequests(container) {
    if (!state.activeStudent) {
        container.innerHTML = `
            <div class="requests-page-wrapper container">
                <div class="empty-state-view">
                    <i data-lucide="lock" class="empty-state-icon"></i>
                    <h3>Authentication Required</h3>
                    <p>Please log in or select an active student profile to review transfer requests.</p>
                    <a href="#/auth" class="cyber-btn primary-glow">Authenticate Now</a>
                </div>
            </div>
        `;
        refreshIcons();
        return;
    }

    container.innerHTML = `
        <div class="requests-page-wrapper container">
            <!-- Header -->
            <div class="page-title-row gsap-reveal">
                <div>
                    <span class="section-tag">PEER TRANSACTIONS</span>
                    <h1 class="page-main-title">TRANSFER REQUESTS</h1>
                    <p class="page-subtitle">Approve or reject requests for your tokens, and monitor reservations you requested.</p>
                </div>
            </div>

            <!-- Tab Switcher -->
            <div class="requests-tab-switch gsap-reveal">
                <button type="button" class="category-chip ${state.requestsTab === 'incoming' ? 'active' : ''}" id="incomingTabBtn">
                    <i data-lucide="arrow-down-left"></i>
                    <span>Incoming Requests</span>
                    <span class="tab-count" id="incomingBadgeCount">${state.incomingRequests.length}</span>
                </button>
                <button type="button" class="category-chip ${state.requestsTab === 'outgoing' ? 'active' : ''}" id="outgoingTabBtn">
                    <i data-lucide="arrow-up-right"></i>
                    <span>Outgoing Requests</span>
                    <span class="tab-count" id="outgoingBadgeCount">${state.outgoingRequests.length}</span>
                </button>
            </div>

            <!-- Content Containers -->
            <div id="incomingContainer" class="${state.requestsTab === 'incoming' ? '' : 'hidden'}">
                <div id="incomingList" class="requests-list">
                    <!-- Populated dynamically -->
                </div>
            </div>

            <div id="outgoingContainer" class="${state.requestsTab === 'outgoing' ? '' : 'hidden'}">
                <div id="outgoingList" class="requests-list">
                    <!-- Populated dynamically -->
                </div>
            </div>

            <!-- Response Note Modal (for Approve/Reject) -->
            <div class="modal-backdrop hidden" id="requestActionModalBackdrop">
                <div class="cyber-modal">
                    <div class="modal-header">
                        <div class="modal-title-group">
                            <i data-lucide="message-square" class="modal-icon"></i>
                            <div>
                                <h3 class="modal-title" id="actionModalTitle">Transfer Response</h3>
                                <p class="modal-sub" id="actionModalSub">Provide an optional response note</p>
                            </div>
                        </div>
                        <button type="button" class="modal-close-btn" id="closeActionModalBtn"><i data-lucide="x"></i></button>
                    </div>

                    <form id="actionResponseForm" class="modal-form">
                        <input type="hidden" id="actionRequestId">
                        <input type="hidden" id="actionType">

                        <div class="form-group">
                            <label for="actionNoteInput">Response Note</label>
                            <textarea id="actionNoteInput" class="cyber-textarea" rows="3" placeholder="e.g. Approved! Enjoy the workshop session..."></textarea>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="cancelActionBtn">Cancel</button>
                            <button type="submit" class="cyber-btn primary-glow" id="confirmActionSubmitBtn">
                                <span>Confirm</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
    setupRequestsListeners(container);
    renderIncomingList(container);
    renderOutgoingList(container);
}

function setupRequestsListeners(container) {
    const inTab = container.querySelector('#incomingTabBtn');
    const outTab = container.querySelector('#outgoingTabBtn');
    const inBox = container.querySelector('#incomingContainer');
    const outBox = container.querySelector('#outgoingContainer');

    inTab.addEventListener('click', () => {
        inTab.classList.add('active');
        outTab.classList.remove('active');
        inBox.classList.remove('hidden');
        outBox.classList.add('hidden');
        state.requestsTab = 'incoming';
    });

    outTab.addEventListener('click', () => {
        outTab.classList.add('active');
        inTab.classList.remove('active');
        outBox.classList.remove('hidden');
        inBox.classList.add('hidden');
        state.requestsTab = 'outgoing';
    });

    // Action Modal Listeners
    const closeBtn = container.querySelector('#closeActionModalBtn');
    const cancelBtn = container.querySelector('#cancelActionBtn');
    const form = container.querySelector('#actionResponseForm');

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('requestActionModalBackdrop'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('requestActionModalBackdrop'));

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const requestId = parseInt(container.querySelector('#actionRequestId').value, 10);
            const actionType = container.querySelector('#actionType').value;
            const note = container.querySelector('#actionNoteInput').value.trim();
            const submitBtn = container.querySelector('#confirmActionSubmitBtn');

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="loading-spinner-sm"></span> Processing...`;

            try {
                if (actionType === 'APPROVE') {
                    await api.approveTransfer(requestId, state.activeStudent.studentId, note || 'Transfer approved by owner');
                    triggerConfetti();
                    showToast('Transfer APPROVED! Row-locked ACID transaction executed.', 'success');
                } else if (actionType === 'REJECT') {
                    await api.rejectTransfer(requestId, state.activeStudent.studentId, note || 'Transfer declined by owner');
                    showToast('Transfer request rejected.', 'info');
                }

                closeModal('requestActionModalBackdrop');
                await loadRequests();
                await loadMarketplaceTokens();
                await loadMyTokens();
                await loadHistory();

                renderIncomingList(container);
                renderOutgoingList(container);

                const inCount = container.querySelector('#incomingBadgeCount');
                if (inCount) inCount.textContent = state.incomingRequests.length;
            } catch (err) {
                showToast(err.message || 'Operation failed', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Confirm</span>`;
            }
        });
    }
}

function renderIncomingList(container) {
    const listEl = container.querySelector('#incomingList');
    if (!listEl) return;

    const list = state.incomingRequests || [];

    if (list.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state-view">
                <i data-lucide="inbox" class="empty-state-icon"></i>
                <h3>No Incoming Requests</h3>
                <p>You have no pending transfer requests for your listed tokens at the moment.</p>
            </div>
        `;
        refreshIcons();
        return;
    }

    listEl.innerHTML = list.map(req => `
        <div class="request-item-card" id="req-card-${req.requestId}">
            <div class="request-main-col">
                <div class="request-badge-row">
                    <span class="token-code-tag">${req.tokenCode || 'TKN'}</span>
                    ${renderBadge('TRANSFER_PENDING')}
                    <span class="request-time">${formatDateTime(req.requestedAt)}</span>
                </div>

                <h3 class="request-activity-title">${req.activityTitle || 'Campus Activity'}</h3>

                <div class="requester-info-strip">
                    <div class="requester-avatar">${getInitials(req.requesterName)}</div>
                    <div>
                        <span class="requester-name">Requested by: <strong>${req.requesterName}</strong> (${req.requesterRollNo})</span>
                        <div class="request-note-box">
                            <i data-lucide="quote"></i>
                            <span>${req.requestNote || 'No specific note provided.'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="request-actions-col">
                <button type="button" class="cyber-btn primary-glow btn-sm approve-req-btn" data-req-id="${req.requestId}">
                    <i data-lucide="check"></i> Approve (ACID Lock)
                </button>
                <button type="button" class="cyber-btn ghost-btn btn-sm reject-req-btn" data-req-id="${req.requestId}" style="color:var(--status-expired);">
                    <i data-lucide="x"></i> Reject
                </button>
            </div>
        </div>
    `).join('');

    refreshIcons();

    // Attach listeners
    listEl.querySelectorAll('.approve-req-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.reqId;
            openActionModal(container, id, 'APPROVE', 'Approve Token Transfer', 'Atomically transfers token ownership using MySQL row-locking.');
        });
    });

    listEl.querySelectorAll('.reject-req-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.reqId;
            openActionModal(container, id, 'REJECT', 'Decline Transfer Request', 'Reject this transfer request with a reason.');
        });
    });
}

function renderOutgoingList(container) {
    const listEl = container.querySelector('#outgoingList');
    if (!listEl) return;

    const list = state.outgoingRequests || [];

    if (list.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state-view">
                <i data-lucide="send" class="empty-state-icon"></i>
                <h3>No Outgoing Requests</h3>
                <p>You haven't requested any tokens yet. Explore the marketplace to find available listings.</p>
                <a href="#/marketplace" class="cyber-btn primary-glow">Browse Marketplace</a>
            </div>
        `;
        refreshIcons();
        return;
    }

    listEl.innerHTML = list.map(req => {
        const isPending = req.status === 'PENDING';
        return `
            <div class="request-item-card" id="out-card-${req.requestId}">
                <div class="request-main-col">
                    <div class="request-badge-row">
                        <span class="token-code-tag">${req.tokenCode || 'TKN'}</span>
                        ${renderBadge(req.status)}
                        <span class="request-time">${formatDateTime(req.requestedAt)}</span>
                    </div>

                    <h3 class="request-activity-title">${req.activityTitle || 'Campus Activity'}</h3>

                    <div class="requester-info-strip">
                        <div>
                            <span class="requester-name">Token Owner: <strong>${req.ownerName || 'Student'}</strong></span>
                            <div class="request-note-box">
                                <i data-lucide="message-square"></i>
                                <span>Your note: "${req.requestNote || 'Requested'}"</span>
                            </div>
                            ${req.responseNote ? `
                                <div class="response-note-box">
                                    <strong>Owner response:</strong> ${req.responseNote}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="request-actions-col">
                    ${isPending ? `
                        <button type="button" class="cyber-btn secondary-glass btn-sm cancel-req-btn" data-req-id="${req.requestId}">
                            <i data-lucide="x-circle"></i> Cancel Request
                        </button>
                    ` : `
                        <a href="#/token/${req.tokenId}" class="cyber-btn ghost-btn btn-sm">
                            <i data-lucide="external-link"></i> View Token
                        </a>
                    `}
                </div>
            </div>
        `;
    }).join('');

    refreshIcons();

    // Attach cancel listeners
    listEl.querySelectorAll('.cancel-req-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.reqId, 10);
            if (!confirm('Cancel this transfer request?')) return;

            try {
                await api.cancelTransfer(id, state.activeStudent.studentId);
                showToast('Transfer request cancelled', 'info');

                // Animate card slide out
                const card = container.querySelector(`#out-card-${id}`);
                if (card) {
                    card.style.transform = 'translateX(-100%)';
                    card.style.opacity = '0';
                    card.style.transition = 'all 0.3s ease-out';
                    setTimeout(async () => {
                        await loadRequests();
                        renderOutgoingList(container);
                    }, 300);
                }
            } catch (err) {
                showToast(err.message || 'Could not cancel request', 'error');
            }
        });
    });
}

function openActionModal(container, reqId, actionType, title, sub) {
    container.querySelector('#actionRequestId').value = reqId;
    container.querySelector('#actionType').value = actionType;
    container.querySelector('#actionModalTitle').textContent = title;
    container.querySelector('#actionModalSub').textContent = sub;
    container.querySelector('#actionNoteInput').value = '';

    const submitBtn = container.querySelector('#confirmActionSubmitBtn');
    submitBtn.className = actionType === 'APPROVE' ? 'cyber-btn primary-glow' : 'cyber-btn ghost-btn';
    submitBtn.innerHTML = actionType === 'APPROVE' ? `<i data-lucide="check"></i> Confirm Approval` : `<i data-lucide="x"></i> Confirm Rejection`;

    refreshIcons();
    openModal('requestActionModalBackdrop');
}

export default renderRequests;
