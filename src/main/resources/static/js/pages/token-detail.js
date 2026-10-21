/**
 * NEXUS Token Detail Page Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, loadMarketplaceTokens, loadRequests } from '../state.js';
import { createCountdownRing, renderBadge, refreshIcons, formatDateTime, getInitials, showToast, triggerConfetti, openModal, closeModal, getActivityCardArt } from '../ui.js';
import { initCardTilt } from '../animations.js';

function getDetailBannerImage(token) {
    return getActivityCardArt(token);
}


export async function renderTokenDetail(container, params = {}) {
    const tokenId = parseInt(params.id, 10);

    // Initial loading skeleton
    container.innerHTML = `
        <div class="detail-page-wrapper container">
            <a href="#/marketplace" class="back-nav-btn">
                <i data-lucide="arrow-left"></i>
                <span>Back to Marketplace</span>
            </a>
            <div class="skeleton-shimmer" style="height: 520px; border-radius: var(--radius-lg);"></div>
        </div>
    `;
    refreshIcons();

    let token = null;
    let tokenHistory = [];

    try {
        const res = await api.getToken(tokenId);
        token = res.data;

        // Fetch token audit history
        const histRes = await api.getHistory('', null);
        const allHistory = histRes.data || [];
        tokenHistory = allHistory.filter(h => h.tokenId === tokenId);
    } catch (err) {
        container.innerHTML = `
            <div class="detail-page-wrapper container">
                <a href="#/marketplace" class="back-nav-btn">
                    <i data-lucide="arrow-left"></i>
                    <span>Back to Marketplace</span>
                </a>
                <div class="empty-state-view">
                    <i data-lucide="alert-triangle" class="empty-state-icon" style="color:var(--status-expired);"></i>
                    <h3>Token Record Not Found</h3>
                    <p>The requested digital token ID (${tokenId}) could not be located in the campus ledger.</p>
                    <a href="#/marketplace" class="cyber-btn primary-glow">
                        <i data-lucide="compass"></i>
                        <span>Return to Marketplace</span>
                    </a>
                </div>
            </div>
        `;
        refreshIcons();
        return;
    }

    const isMine = state.activeStudent && token.ownerStudentId === state.activeStudent.studentId;
    const isAvailable = token.status === 'AVAILABLE';
    const cat = (token.activityCategory || 'EVENT').toLowerCase();
    const bannerImg = getDetailBannerImage(token);
    const venue = token.activityVenue || token.venue || 'Campus Venue';
    const expiry = token.expiryDate || token.expiresAt;

    container.innerHTML = `
        <div class="detail-page-wrapper container">
            <a href="#/marketplace" class="back-nav-btn">
                <i data-lucide="arrow-left"></i>
                <span>Back to Marketplace</span>
            </a>

            <div class="detail-main-card">
                <!-- Large Banner Visual -->
                <div class="detail-banner-hero">
                    <img src="${bannerImg}" alt="${token.activityTitle || 'Activity'}" class="detail-hero-image" width="900" height="340">
                    <div class="detail-banner-gradient"></div>
                    <div class="detail-banner-badge-box">
                        <span class="token-category-badge ${cat}">${token.activityCategory || 'ACTIVITY'}</span>
                        ${renderBadge(token.status)}
                    </div>
                </div>

                <!-- Header Info Bar -->
                <div class="detail-header-banner">
                    <div class="detail-header-info">
                        <h1 class="detail-token-title">${token.activityTitle || 'Campus Activity'}</h1>
                        <div class="detail-token-code">
                            <i data-lucide="hash"></i>
                            <span>${token.tokenCode || 'TKN-000'}</span>
                        </div>
                    </div>

                    <div class="detail-visual-group">
                        <div class="detail-qr-visual" title="Digital Verification QR">
                            <i data-lucide="qr-code"></i>
                            <span>${token.tokenCode || 'SECE-TKN'}</span>
                        </div>
                        <div class="detail-countdown-box">
                            ${createCountdownRing(expiry, 68, 5)}
                        </div>
                    </div>
                </div>

                <!-- Meta Data Grid (Real Venues & Timestamps) -->
                <div class="detail-meta-grid">
                    <div class="detail-meta-cell">
                        <span class="detail-meta-label">Campus Venue / Lab</span>
                        <span class="detail-meta-value"><i data-lucide="map-pin"></i> ${venue}</span>
                    </div>
                    <div class="detail-meta-cell">
                        <span class="detail-meta-label">Activity Category</span>
                        <span class="detail-meta-value"><i data-lucide="tag"></i> ${token.activityCategory || 'Event'}</span>
                    </div>
                    <div class="detail-meta-cell">
                        <span class="detail-meta-label">Valid From</span>
                        <span class="detail-meta-value"><i data-lucide="calendar"></i> ${formatDateTime(token.validFrom)}</span>
                    </div>
                    <div class="detail-meta-cell">
                        <span class="detail-meta-label">Expiry Deadline</span>
                        <span class="detail-meta-value text-glow"><i data-lucide="clock"></i> ${formatDateTime(expiry)}</span>
                    </div>
                </div>

                <!-- Owner Information Card -->
                <div class="detail-owner-section">
                    <h3 class="section-subheading"><i data-lucide="user"></i> Token Ownership</h3>
                    <div class="detail-owner-card">
                        <div class="detail-avatar">${getInitials(token.ownerName)}</div>
                        <div class="detail-owner-details">
                            <span class="detail-owner-name">${token.ownerName || 'Verified Student'}</span>
                            <span class="detail-owner-sub">${token.ownerRollNo || '23CS---'} • ${token.ownerDepartment || 'SECE'}</span>
                        </div>
                        <div class="detail-owner-status">
                            ${isMine ? '<span class="status-pill active"><i data-lucide="check"></i> CURRENTLY HELD BY YOU</span>' : '<span class="status-pill verified"><i data-lucide="shield-check"></i> VERIFIED HOLDER</span>'}
                        </div>
                    </div>
                </div>

                <!-- Action CTA Panel -->
                <div class="detail-actions-panel">
                    ${!isMine && isAvailable ? `
                        <div class="transfer-cta-box">
                            <div>
                                <h4>Interested in this reservation?</h4>
                                <p>Submit a peer transfer request to ${token.ownerName}. Once approved, ownership is atomically transferred to your account with ACID row locking.</p>
                            </div>
                            <button type="button" class="cyber-btn primary-glow" id="openRequestModalBtn">
                                <i data-lucide="send"></i>
                                <span>Request Token Transfer</span>
                            </button>
                        </div>
                    ` : isMine && isAvailable ? `
                        <div class="transfer-cta-box">
                            <div>
                                <h4>You own this listed token</h4>
                                <p>This token is currently available in the marketplace. You can also redeem and mark it as used when you attend on campus.</p>
                            </div>
                            <button type="button" class="cyber-btn secondary-glass" id="markUsedBtn">
                                <i data-lucide="check-circle"></i>
                                <span>Mark as Redeemed / Used</span>
                            </button>
                        </div>
                    ` : `
                        <div class="token-locked-banner">
                            <i data-lucide="lock"></i>
                            <span>This token is currently <strong>${token.status}</strong> and is not available for new transfer requests.</span>
                        </div>
                    `}
                </div>

                <!-- Token Transfer History Audit -->
                <div class="detail-history-section">
                    <h3 class="section-subheading"><i data-lucide="history"></i> Transfer Audit Trail for this Token</h3>
                    ${tokenHistory.length === 0 ? `
                        <div class="history-empty-mini">
                            <i data-lucide="check-circle-2"></i>
                            <span>Initial creation record. No transfers recorded yet.</span>
                        </div>
                    ` : `
                        <div class="history-mini-timeline">
                            ${tokenHistory.map(h => `
                                <div class="history-mini-item">
                                    <span class="mini-dot"></span>
                                    <div class="mini-content">
                                        <div class="mini-header">
                                            <span class="transfer-flow">
                                                <strong>${h.fromStudentName}</strong>
                                                <i data-lucide="arrow-right"></i>
                                                <strong>${h.toStudentName}</strong>
                                            </span>
                                            <span class="mini-time">${formatDateTime(h.transferredAt)}</span>
                                        </div>
                                        <div class="mini-tags">
                                            <span class="acid-badge"><i data-lucide="shield-check"></i> ACID Row-Lock Verified</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>

            <!-- Transfer Request Modal -->
            <div class="modal-backdrop hidden" id="requestTransferModalBackdrop">
                <div class="cyber-modal">
                    <div class="modal-header">
                        <div class="modal-title-group">
                            <i data-lucide="send" class="modal-icon"></i>
                            <div>
                                <h3 class="modal-title">Request Token Transfer</h3>
                                <p class="modal-sub">Send a peer transfer request to ${token.ownerName}</p>
                            </div>
                        </div>
                        <button type="button" class="modal-close-btn" id="closeReqModalBtn"><i data-lucide="x"></i></button>
                    </div>

                    <form id="submitTransferRequestForm" class="modal-form">
                        <div class="token-summary-mini">
                            <span class="summary-code">${token.tokenCode}</span>
                            <span class="summary-title">${token.activityTitle}</span>
                        </div>

                        <div class="form-group">
                            <label for="requestNoteInput">Transfer Reason / Priority Note</label>
                            <textarea id="requestNoteInput" class="cyber-textarea" rows="3" placeholder="Explain why you would like this token (e.g., 'Need slot for project testing session')..."></textarea>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="cyber-btn secondary-glass" id="cancelReqBtn">Cancel</button>
                            <button type="submit" class="cyber-btn primary-glow" id="confirmReqBtn">
                                <i data-lucide="send"></i>
                                <span>Confirm &amp; Send Request</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
    initCardTilt(container);
    setupTokenDetailListeners(container, token);

    if (window.location.hash.includes('action=request') && !isMine && isAvailable) {
        openModal('requestTransferModalBackdrop');
    }
}

function setupTokenDetailListeners(container, token) {
    const openBtn = container.querySelector('#openRequestModalBtn');
    const closeBtn = container.querySelector('#closeReqModalBtn');
    const cancelBtn = container.querySelector('#cancelReqBtn');
    const markUsedBtn = container.querySelector('#markUsedBtn');
    const form = container.querySelector('#submitTransferRequestForm');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (!state.activeStudent) {
                showToast('Please sign in to request token transfers.', 'warning');
                window.location.hash = '#/auth';
                return;
            }
            openModal('requestTransferModalBackdrop');
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal('requestTransferModalBackdrop'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal('requestTransferModalBackdrop'));

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!state.activeStudent) return;

            const note = container.querySelector('#requestNoteInput').value.trim();
            const btn = container.querySelector('#confirmReqBtn');
            btn.disabled = true;
            btn.innerHTML = `<span class="loading-spinner-sm"></span> Sending...`;

            try {
                const reqData = {
                    tokenId: token.tokenId,
                    requesterStudentId: state.activeStudent.studentId,
                    requestNote: note || 'Peer transfer request from marketplace'
                };

                await api.requestTransfer(reqData);
                closeModal('requestTransferModalBackdrop');
                triggerConfetti();
                showToast(`Transfer request sent to ${token.ownerName}!`, 'success');

                await loadMarketplaceTokens();
                await loadRequests();
                renderTokenDetail(container, { id: token.tokenId });
            } catch (err) {
                showToast(err.message || 'Failed to submit transfer request.', 'error');
                btn.disabled = false;
                btn.innerHTML = `<i data-lucide="send"></i><span>Confirm &amp; Send Request</span>`;
                refreshIcons();
            }
        });
    }

    if (markUsedBtn) {
        markUsedBtn.addEventListener('click', async () => {
            if (!confirm(`Mark token ${token.tokenCode} as REDEEMED / USED?`)) return;

            try {
                await api.markTokenUsed(token.tokenId, state.activeStudent.studentId);
                triggerConfetti();
                showToast(`Token ${token.tokenCode} marked as USED!`, 'success');
                await loadMarketplaceTokens();
                renderTokenDetail(container, { id: token.tokenId });
            } catch (err) {
                showToast(err.message || 'Could not mark token as used.', 'error');
            }
        });
    }
}

export default renderTokenDetail;
