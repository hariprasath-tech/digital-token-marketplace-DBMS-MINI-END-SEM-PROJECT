/**
 * NEXUS Transfer Audit Trail Module (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { state, loadHistory } from '../state.js';
import { refreshIcons, formatDateTime, getInitials } from '../ui.js';
import { initScrollReveals } from '../animations.js';

export function renderHistory(container) {
    container.innerHTML = `
        <div class="history-page-wrapper container">
            <!-- Header -->
            <div class="page-title-row gsap-reveal">
                <div>
                    <span class="section-tag">AUDIT TRAIL</span>
                    <h1 class="page-main-title">TOKEN TRANSFER AUDIT LOG</h1>
                    <p class="page-subtitle">Immutable transaction ledger verifying single-ownership transitions executed with MySQL row-level locking.</p>
                </div>
            </div>

            <!-- Filter Controls -->
            <div class="marketplace-sticky-bar gsap-reveal" style="margin-bottom: 30px;">
                <div class="filter-search-row">
                    <div class="search-input-wrap">
                        <i data-lucide="search"></i>
                        <input type="text" id="historySearchInput" placeholder="Search by student name, roll number, token code, or activity...">
                    </div>

                    <div class="filter-checkbox-wrap">
                        <label class="cyber-checkbox-label">
                            <input type="checkbox" id="historyOnlyMineCheckbox" ${state.historyFilter.onlyMine ? 'checked' : ''}>
                            <span>Only my transfers</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Vertical Timeline -->
            <div class="history-timeline" id="historyTimelineList">
                <!-- Rendered dynamically -->
            </div>

            <!-- Empty State -->
            <div class="empty-state-view hidden" id="historyEmptyState">
                <i data-lucide="history" class="empty-state-icon"></i>
                <h3>No Transfer Events Logged</h3>
                <p>No token transfers matched your query. When a token owner approves a request, an atomic ledger record will appear here.</p>
            </div>
        </div>
    `;

    refreshIcons();
    setupHistoryListeners(container);
    renderTimelineItems(container);
}

function setupHistoryListeners(container) {
    const searchInput = container.querySelector('#historySearchInput');
    const checkbox = container.querySelector('#historyOnlyMineCheckbox');

    let timer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            state.historyFilter.search = e.target.value.trim();
            await loadHistory();
            renderTimelineItems(container);
        }, 220);
    });

    checkbox.addEventListener('change', async (e) => {
        state.historyFilter.onlyMine = e.target.checked;
        await loadHistory();
        renderTimelineItems(container);
    });
}

function renderTimelineItems(container) {
    const timeline = container.querySelector('#historyTimelineList');
    const empty = container.querySelector('#historyEmptyState');
    if (!timeline) return;

    const list = state.history || [];

    if (list.length === 0) {
        timeline.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (empty) empty.classList.add('hidden');

    timeline.innerHTML = list.map(item => `
        <div class="timeline-event-card gsap-reveal">
            <div class="event-header-row">
                <div class="event-code-group">
                    <span class="token-code-tag">${item.tokenCode || 'TKN-000'}</span>
                    <span class="acid-badge"><i data-lucide="shield-check"></i> ACID Row-Lock Verified</span>
                </div>
                <span class="event-timestamp">
                    <i data-lucide="clock"></i>
                    ${formatDateTime(item.transferredAt)}
                </span>
            </div>

            <h3 class="event-activity-title">${item.activityTitle || 'Campus Activity'}</h3>

            <div class="event-transfer-flow">
                <div class="flow-student">
                    <div class="flow-avatar">${getInitials(item.fromStudentName)}</div>
                    <div>
                        <span class="flow-role">Previous Holder</span>
                        <strong class="flow-name">${item.fromStudentName || 'Initial Creator'}</strong>
                        <span class="flow-roll">${item.fromStudentRollNo || ''}</span>
                    </div>
                </div>

                <div class="flow-arrow-box">
                    <i data-lucide="arrow-right"></i>
                    <span class="flow-action">TRANSFERRED TO</span>
                </div>

                <div class="flow-student to-student">
                    <div class="flow-avatar highlight">${getInitials(item.toStudentName)}</div>
                    <div>
                        <span class="flow-role">New Owner</span>
                        <strong class="flow-name">${item.toStudentName || 'Verified Peer'}</strong>
                        <span class="flow-roll">${item.toStudentRollNo || ''}</span>
                    </div>
                </div>
            </div>

            <div class="event-footer-strip">
                <span class="event-id-tag">Ledger Record #${item.historyId}</span>
                <a href="#/token/${item.tokenId}" class="event-inspect-link">
                    <span>Inspect Token</span>
                    <i data-lucide="chevron-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    refreshIcons();
    initScrollReveals();
}

export default renderHistory;
