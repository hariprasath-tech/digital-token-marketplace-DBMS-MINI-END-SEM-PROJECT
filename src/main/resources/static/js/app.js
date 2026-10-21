/**
 * NEXUS DIGITAL TOKEN MARKETPLACE - MASTER APPLICATION LOGIC
 * Author: Hari Prasath (Sri Eshwar College of Engineering)
 */

(function () {
    'use strict';

    // State Management
    let state = {
        activeStudent: null,
        students: [],
        activities: [],
        tokens: [],
        myTokens: [],
        incomingRequests: [],
        outgoingRequests: [],
        history: [],
        stats: null,
        currentCategory: 'ALL',
        currentStatus: 'AVAILABLE',
        searchQuery: '',
        vaultFilter: 'ALL',
        myHistoryOnly: false
    };

    // Smooth Scrolling with Lenis
    let lenis = null;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true
            });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (e) {
        console.warn('Lenis not available, native smooth scroll active.');
    }

    // Refresh Icons Helper
    function refreshIcons() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    // Date/Time Format Helpers
    function formatDate(dtString) {
        if (!dtString) return 'N/A';
        const d = new Date(dtString);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function formatDateTime(dtString) {
        if (!dtString) return 'N/A';
        const d = new Date(dtString);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getCountdown(expiryString) {
        if (!expiryString) return 'No expiry';
        const now = new Date().getTime();
        const expiry = new Date(expiryString).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
            return '<span class="text-rose">Expired</span>';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m left`;
        } else {
            return `${minutes}m left`;
        }
    }

    function getInitials(name) {
        if (!name) return '??';
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    // Toast Notification System
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `cyber-toast ${type}`;

        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle-2';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon ${type}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        refreshIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ========================================================
    // INITIALIZATION & STUDENT AUTHENTICATION
    // ========================================================
    async function initApp() {
        setupNavigation();
        setupModals();
        setupEventListeners();

        await loadStudents();
        await loadAllData();

        // Periodic background poll for countdown timers & live requests
        setInterval(() => {
            updateCountdowns();
        }, 15000);

        setInterval(() => {
            loadRequests(false);
        }, 30000);
    }

    async function loadStudents() {
        try {
            const res = await API.getStudents();
            state.students = res.data || [];

            // Retrieve saved student or default to ID 1 (Hari Prasath)
            const savedId = localStorage.getItem('nexus_student_id');
            if (savedId) {
                const found = state.students.find(s => s.studentId === parseInt(savedId));
                state.activeStudent = found || state.students[0];
            } else {
                state.activeStudent = state.students[0] || null;
            }

            renderStudentSwitcher();
        } catch (e) {
            console.error('Failed to load students:', e);
            showToast('Could not load registered students', 'error');
        }
    }

    function renderStudentSwitcher() {
        if (!state.activeStudent) return;

        localStorage.setItem('nexus_student_id', state.activeStudent.studentId);

        // Update Top Bar
        const avatar = document.getElementById('studentAvatar');
        const nameEl = document.getElementById('studentName');
        const rollEl = document.getElementById('studentRoll');
        const vaultName = document.getElementById('vaultStudentName');

        if (avatar) avatar.textContent = getInitials(state.activeStudent.name);
        if (nameEl) nameEl.textContent = state.activeStudent.name;
        if (rollEl) rollEl.textContent = state.activeStudent.rollNo;
        if (vaultName) vaultName.textContent = state.activeStudent.name;

        // Render Dropdown List
        const listContainer = document.getElementById('studentListContainer');
        if (!listContainer) return;

        listContainer.innerHTML = state.students.map(s => {
            const isActive = s.studentId === state.activeStudent.studentId;
            return `
                <div class="student-list-item ${isActive ? 'active' : ''}" data-student-id="${s.studentId}">
                    <div class="item-avatar">${getInitials(s.name)}</div>
                    <div class="item-info">
                        <span class="item-name">${s.name}</span>
                        <span class="item-meta">${s.rollNo} • ${s.department}</span>
                    </div>
                    ${isActive ? '<span class="item-badge">ACTIVE</span>' : ''}
                </div>
            `;
        }).join('');

        // Attach clicks
        listContainer.querySelectorAll('.student-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.studentId);
                switchActiveStudent(id);
            });
        });
    }

    function switchActiveStudent(studentId) {
        const student = state.students.find(s => s.studentId === studentId);
        if (!student) return;

        state.activeStudent = student;
        renderStudentSwitcher();
        document.getElementById('studentMenu').classList.add('hidden');

        showToast(`Active student switched to ${student.name} (${student.rollNo})`, 'info');

        // Refresh student-specific data
        loadMyTokens();
        loadRequests();
        loadHistory();
        renderMarketplace(); // Update ownership tags on cards
    }

    // ========================================================
    // LOAD ALL CORE DATA
    // ========================================================
    async function loadAllData() {
        await Promise.all([
            loadMarketplaceTokens(),
            loadActivities(),
            loadMyTokens(),
            loadRequests(),
            loadHistory(),
            loadStats()
        ]);
    }

    // Load Marketplace Tokens
    async function loadMarketplaceTokens() {
        try {
            const filters = {
                category: state.currentCategory,
                status: state.currentStatus,
                search: state.searchQuery
            };
            const res = await API.getTokens(filters);
            state.tokens = res.data || [];
            renderMarketplace();
        } catch (e) {
            console.error('Failed to load marketplace tokens:', e);
        }
    }

    function renderMarketplace() {
        const grid = document.getElementById('tokensGrid');
        const empty = document.getElementById('emptyMarketplace');
        const countLabel = document.getElementById('marketplaceCountLabel');
        if (!grid) return;

        let displayTokens = state.tokens;

        if (countLabel) {
            countLabel.textContent = `${displayTokens.length} Listings Active`;
        }

        if (displayTokens.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = displayTokens.map(token => {
            const isMine = state.activeStudent && token.ownerStudentId === state.activeStudent.studentId;
            const isAvailable = token.status === 'AVAILABLE';
            const isPending = token.status === 'TRANSFER_PENDING';
            const isExpired = token.status === 'EXPIRED';
            const isUsed = token.status === 'USED';

            const catClass = (token.activityCategory || 'EVENT').toLowerCase();
            const statusClass = (token.status || 'AVAILABLE').toLowerCase();

            return `
                <div class="token-card" data-token-id="${token.tokenId}">
                    <div>
                        <div class="token-card-header">
                            <span class="token-category-badge ${catClass}">${token.activityCategory || 'ACTIVITY'}</span>
                            <span class="token-status-pill ${statusClass}">
                                <span class="pulse-dot"></span> ${token.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div class="token-code-row">
                            <span class="token-code">${token.tokenCode}</span>
                            <span class="expiry-countdown-pill" data-expiry="${token.expiryDate}">
                                <i data-lucide="clock"></i> ${getCountdown(token.expiryDate)}
                            </span>
                        </div>

                        <h3 class="token-title">${token.activityTitle || 'Campus Activity'}</h3>

                        <div class="token-meta-list">
                            <div class="token-meta-item">
                                <i data-lucide="map-pin"></i>
                                <span>${token.activityVenue || 'Main Campus'}</span>
                            </div>
                            <div class="token-meta-item">
                                <i data-lucide="calendar"></i>
                                <span>${formatDateTime(token.activityDate)}</span>
                            </div>
                            <div class="token-meta-item">
                                <i data-lucide="layout"></i>
                                <span><strong>Slot:</strong> ${token.seatOrSlot || 'General Access'}</span>
                            </div>
                        </div>

                        <div class="token-owner-row">
                            <div class="token-owner-info">
                                <div class="owner-avatar">${getInitials(token.ownerName)}</div>
                                <div>
                                    <div class="owner-name">${token.ownerName || 'Student'}</div>
                                    <div class="token-meta">${token.ownerRollNo || ''} • ${token.ownerDepartment || ''}</div>
                                </div>
                            </div>
                            ${isMine ? '<span class="item-badge">YOU OWN THIS</span>' : ''}
                        </div>
                    </div>

                    <div class="token-card-footer">
                        <button class="cyber-btn secondary-glass small view-detail-btn" data-token-id="${token.tokenId}">
                            <i data-lucide="eye"></i> Details
                        </button>
                        ${isMine ? `
                            ${(isAvailable || token.status === 'TRANSFERRED') ? `
                                <button class="cyber-btn success small redeem-token-btn" data-token-id="${token.tokenId}">
                                    <i data-lucide="check-check"></i> Redeem
                                </button>
                            ` : `
                                <button class="cyber-btn ghost small" disabled>
                                    ${token.status}
                                </button>
                            `}
                        ` : `
                            ${(isAvailable || isPending) && !isExpired ? `
                                <button class="cyber-btn primary-glow small request-transfer-btn" data-token-id="${token.tokenId}" data-token-code="${token.tokenCode}" data-activity="${token.activityTitle}">
                                    <i data-lucide="arrow-right-left"></i> Request Transfer
                                </button>
                            ` : `
                                <button class="cyber-btn ghost small" disabled>
                                    Unavailable
                                </button>
                            `}
                        `}
                    </div>
                </div>
            `;
        }).join('');

        refreshIcons();
        attachCardListeners();
    }

    function updateCountdowns() {
        document.querySelectorAll('.expiry-countdown-pill').forEach(el => {
            const exp = el.dataset.expiry;
            if (exp) {
                el.innerHTML = `<i data-lucide="clock"></i> ${getCountdown(exp)}`;
            }
        });
        refreshIcons();
    }

    function attachCardListeners() {
        // View Details
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tokenId = parseInt(btn.dataset.tokenId);
                openTokenDetailModal(tokenId);
            });
        });

        // Request Transfer
        document.querySelectorAll('.request-transfer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tokenId = parseInt(btn.dataset.tokenId);
                const code = btn.dataset.tokenCode;
                const act = btn.dataset.activity;
                openRequestModal(tokenId, code, act);
            });
        });

        // Redeem / Mark as used
        document.querySelectorAll('.redeem-token-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const tokenId = parseInt(btn.dataset.tokenId);
                await handleRedeemToken(tokenId);
            });
        });
    }

    // ========================================================
    // CAMPUS ACTIVITIES
    // ========================================================
    async function loadActivities() {
        try {
            const res = await API.getActivities();
            state.activities = res.data || [];
            renderActivities();
            populateActivityDropdown();
        } catch (e) {
            console.error('Failed to load activities:', e);
        }
    }

    function renderActivities() {
        const grid = document.getElementById('activitiesGrid');
        if (!grid) return;

        grid.innerHTML = state.activities.map(act => {
            const catClass = (act.category || 'EVENT').toLowerCase();
            return `
                <div class="activity-card" data-activity-id="${act.activityId}">
                    <div>
                        <div class="activity-card-header">
                            <span class="token-category-badge ${catClass}">${act.category}</span>
                            <span class="activity-tokens-badge">
                                <i data-lucide="ticket"></i> ${act.availableTokenCount || 0} Available Tokens
                            </span>
                        </div>
                        <h3 class="activity-title">${act.title}</h3>
                        <p class="activity-desc">${act.description || 'Hands-on campus session with practical training and certificate.'}</p>

                        <div class="activity-meta-list">
                            <div class="activity-meta-item">
                                <i data-lucide="map-pin"></i>
                                <span>${act.venue}</span>
                            </div>
                            <div class="activity-meta-item">
                                <i data-lucide="calendar"></i>
                                <span>${formatDateTime(act.activityDate)}</span>
                            </div>
                            <div class="activity-meta-item">
                                <i data-lucide="users"></i>
                                <span>Organized by <strong>${act.organizer || 'Campus Dept'}</strong> (Capacity: ${act.totalCapacity})</span>
                            </div>
                        </div>
                    </div>

                    <div class="activity-footer">
                        <button class="cyber-btn secondary-glass small list-for-activity-btn" data-activity-id="${act.activityId}" data-activity-title="${act.title}">
                            <i data-lucide="plus-circle"></i> List Token for This
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        refreshIcons();

        // Attach quick list button
        grid.querySelectorAll('.list-for-activity-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const actId = btn.dataset.activityId;
                openListTokenModal(actId);
            });
        });
    }

    function populateActivityDropdown() {
        const select = document.getElementById('listActivitySelect');
        if (!select) return;

        select.innerHTML = '<option value="">-- Choose Activity --</option>' +
            state.activities.map(a => `<option value="${a.activityId}">${a.title} (${a.category}) - ${formatDate(a.activityDate)}</option>`).join('');
    }

    // ========================================================
    // MY TOKENS VAULT
    // ========================================================
    async function loadMyTokens() {
        if (!state.activeStudent) return;
        try {
            const res = await API.getMyTokens(state.activeStudent.studentId);
            state.myTokens = res.data || [];
            updateVaultCounts();
            renderVault();
        } catch (e) {
            console.error('Failed to load student tokens:', e);
        }
    }

    function updateVaultCounts() {
        const total = state.myTokens.length;
        const avail = state.myTokens.filter(t => t.status === 'AVAILABLE').length;
        const pending = state.myTokens.filter(t => t.status === 'TRANSFER_PENDING').length;
        const used = state.myTokens.filter(t => t.status === 'USED').length;
        const exp = state.myTokens.filter(t => t.status === 'EXPIRED').length;

        const elAll = document.getElementById('countVaultAll');
        const elAvail = document.getElementById('countVaultAvail');
        const elPending = document.getElementById('countVaultPending');
        const elUsed = document.getElementById('countVaultUsed');
        const elExp = document.getElementById('countVaultExpired');
        const elBadge = document.getElementById('myTokensCount');

        if (elAll) elAll.textContent = total;
        if (elAvail) elAvail.textContent = avail;
        if (elPending) elPending.textContent = pending;
        if (elUsed) elUsed.textContent = used;
        if (elExp) elExp.textContent = exp;
        if (elBadge) elBadge.textContent = total;
    }

    function renderVault() {
        const grid = document.getElementById('myTokensGrid');
        const empty = document.getElementById('emptyVault');
        if (!grid) return;

        let filtered = state.myTokens;
        if (state.vaultFilter === 'AVAILABLE') {
            filtered = filtered.filter(t => t.status === 'AVAILABLE');
        } else if (state.vaultFilter === 'PENDING') {
            filtered = filtered.filter(t => t.status === 'TRANSFER_PENDING');
        } else if (state.vaultFilter === 'USED') {
            filtered = filtered.filter(t => t.status === 'USED');
        } else if (state.vaultFilter === 'EXPIRED') {
            filtered = filtered.filter(t => t.status === 'EXPIRED');
        }

        if (filtered.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = filtered.map(token => {
            const isRedeemable = token.status === 'AVAILABLE' || token.status === 'TRANSFERRED';
            const catClass = (token.activityCategory || 'EVENT').toLowerCase();
            const statusClass = (token.status || 'AVAILABLE').toLowerCase();

            return `
                <div class="token-card" data-token-id="${token.tokenId}">
                    <div>
                        <div class="token-card-header">
                            <span class="token-category-badge ${catClass}">${token.activityCategory || 'ACTIVITY'}</span>
                            <span class="token-status-pill ${statusClass}">
                                <span class="pulse-dot"></span> ${token.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div class="token-code-row">
                            <span class="token-code">${token.tokenCode}</span>
                            <span class="expiry-countdown-pill" data-expiry="${token.expiryDate}">
                                <i data-lucide="clock"></i> ${getCountdown(token.expiryDate)}
                            </span>
                        </div>

                        <h3 class="token-title">${token.activityTitle}</h3>

                        <div class="token-meta-list">
                            <div class="token-meta-item">
                                <i data-lucide="map-pin"></i>
                                <span>${token.activityVenue}</span>
                            </div>
                            <div class="token-meta-item">
                                <i data-lucide="calendar"></i>
                                <span>${formatDateTime(token.activityDate)}</span>
                            </div>
                            <div class="token-meta-item">
                                <i data-lucide="layout"></i>
                                <span><strong>Slot:</strong> ${token.seatOrSlot || 'General Access'}</span>
                            </div>
                            <div class="token-meta-item">
                                <i data-lucide="clock"></i>
                                <span><strong>Valid Until:</strong> ${formatDateTime(token.expiryDate)}</span>
                            </div>
                        </div>

                        ${token.pendingRequestCount > 0 ? `
                            <div class="panel-hint" style="margin-bottom: 12px; padding: 8px 12px; font-size: 0.78rem;">
                                <i data-lucide="alert-circle"></i>
                                <span><strong>${token.pendingRequestCount} student(s)</strong> have requested this token! Check the Requests tab.</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="token-card-footer">
                        <button class="cyber-btn secondary-glass small view-detail-btn" data-token-id="${token.tokenId}">
                            <i data-lucide="eye"></i> Details
                        </button>
                        ${isRedeemable ? `
                            <button class="cyber-btn success small redeem-token-btn" data-token-id="${token.tokenId}">
                                <i data-lucide="check-check"></i> Redeem / Mark Used
                            </button>
                        ` : `
                            <button class="cyber-btn ghost small" disabled>
                                ${token.status}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        refreshIcons();
        attachCardListeners();
    }

    async function handleRedeemToken(tokenId) {
        if (!state.activeStudent) return;
        const confirmRedeem = confirm("Are you sure you want to redeem and mark this token as USED? This action cannot be reversed.");
        if (!confirmRedeem) return;

        try {
            await API.markTokenUsed(tokenId, state.activeStudent.studentId);
            showToast('Token redeemed and successfully marked as USED!', 'success');
            await loadMyTokens();
            await loadMarketplaceTokens();
            await loadStats();
        } catch (e) {
            showToast(e.message || 'Failed to redeem token', 'error');
        }
    }

    // ========================================================
    // TRANSFER REQUESTS HUB
    // ========================================================
    async function loadRequests(showFeedback = true) {
        if (!state.activeStudent) return;
        try {
            const [inRes, outRes] = await Promise.all([
                API.getIncomingRequests(state.activeStudent.studentId),
                API.getOutgoingRequests(state.activeStudent.studentId)
            ]);

            state.incomingRequests = inRes.data || [];
            state.outgoingRequests = outRes.data || [];

            renderIncomingRequests();
            renderOutgoingRequests();

            // Incoming alert badge
            const pendingIncoming = state.incomingRequests.filter(r => r.requestStatus === 'PENDING').length;
            const badge = document.getElementById('incomingReqBadge');
            if (badge) {
                badge.textContent = pendingIncoming;
                if (pendingIncoming > 0) {
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }

            const inCount = document.getElementById('incomingCount');
            const outCount = document.getElementById('outgoingCount');
            if (inCount) inCount.textContent = state.incomingRequests.length;
            if (outCount) outCount.textContent = state.outgoingRequests.length;
        } catch (e) {
            console.error('Failed to load transfer requests:', e);
        }
    }

    function renderIncomingRequests() {
        const container = document.getElementById('incomingRequestsList');
        if (!container) return;

        if (state.incomingRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="inbox" class="empty-icon"></i>
                    <h3>No Incoming Requests</h3>
                    <p>No other students have requested transfers for your listed tokens at this moment.</p>
                </div>
            `;
            refreshIcons();
            return;
        }

        container.innerHTML = state.incomingRequests.map(req => {
            const isPending = req.requestStatus === 'PENDING';
            const statusClass = req.requestStatus.toLowerCase();

            return `
                <div class="request-card" data-request-id="${req.requestId}">
                    <div class="request-main-info">
                        <div class="req-header-line">
                            <span class="req-token-code">${req.tokenCode}</span>
                            <span class="req-activity-title">${req.activityTitle}</span>
                            <span class="token-status-pill ${statusClass}">${req.requestStatus}</span>
                        </div>
                        <div class="req-student-line">
                            <i data-lucide="user"></i>
                            <span>Requested by <strong>${req.requesterName}</strong> (${req.requesterRollNo} • ${req.requesterDepartment})</span>
                            <span>• ${formatDateTime(req.requestedAt)}</span>
                        </div>
                        <div class="req-reason-box">
                            <strong>Reason:</strong> "${req.requestReason || 'No reason specified'}"
                        </div>
                        ${req.responseNote ? `
                            <div class="req-response-box">
                                <strong>Your Decision Note:</strong> "${req.responseNote}" (at ${formatDateTime(req.respondedAt)})
                            </div>
                        ` : ''}
                    </div>

                    ${isPending ? `
                        <div class="req-actions">
                            <button class="cyber-btn success small approve-req-btn" data-request-id="${req.requestId}">
                                <i data-lucide="check"></i> Approve Transfer
                            </button>
                            <button class="cyber-btn danger small reject-req-btn" data-request-id="${req.requestId}">
                                <i data-lucide="x"></i> Reject
                            </button>
                        </div>
                    ` : `
                        <div class="req-actions">
                            <span class="token-status-pill ${statusClass}">${req.requestStatus}</span>
                        </div>
                    `}
                </div>
            `;
        }).join('');

        refreshIcons();

        // Attach action handlers
        container.querySelectorAll('.approve-req-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reqId = parseInt(btn.dataset.requestId);
                handleApproveRequest(reqId);
            });
        });

        container.querySelectorAll('.reject-req-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reqId = parseInt(btn.dataset.requestId);
                handleRejectRequest(reqId);
            });
        });
    }

    function renderOutgoingRequests() {
        const container = document.getElementById('outgoingRequestsList');
        if (!container) return;

        if (state.outgoingRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="send" class="empty-icon"></i>
                    <h3>No Outgoing Requests</h3>
                    <p>You have not requested any tokens from other students yet. Explore the marketplace to find open workshops or events.</p>
                </div>
            `;
            refreshIcons();
            return;
        }

        container.innerHTML = state.outgoingRequests.map(req => {
            const isPending = req.requestStatus === 'PENDING';
            const statusClass = req.requestStatus.toLowerCase();

            return `
                <div class="request-card" data-request-id="${req.requestId}">
                    <div class="request-main-info">
                        <div class="req-header-line">
                            <span class="req-token-code">${req.tokenCode}</span>
                            <span class="req-activity-title">${req.activityTitle}</span>
                            <span class="token-status-pill ${statusClass}">${req.requestStatus}</span>
                        </div>
                        <div class="req-student-line">
                            <i data-lucide="user-check"></i>
                            <span>Listed by <strong>${req.ownerName}</strong> (${req.ownerRollNo})</span>
                            <span>• Requested on ${formatDateTime(req.requestedAt)}</span>
                        </div>
                        <div class="req-reason-box">
                            <strong>Your Request Reason:</strong> "${req.requestReason}"
                        </div>
                        ${req.responseNote ? `
                            <div class="req-response-box">
                                <strong>Owner Note:</strong> "${req.responseNote}"
                            </div>
                        ` : ''}
                    </div>

                    ${isPending ? `
                        <div class="req-actions">
                            <button class="cyber-btn ghost small cancel-req-btn" data-request-id="${req.requestId}">
                                <i data-lucide="x-circle"></i> Cancel Request
                            </button>
                        </div>
                    ` : `
                        <div class="req-actions">
                            <span class="token-status-pill ${statusClass}">${req.requestStatus}</span>
                        </div>
                    `}
                </div>
            `;
        }).join('');

        refreshIcons();

        // Attach cancel handlers
        container.querySelectorAll('.cancel-req-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reqId = parseInt(btn.dataset.requestId);
                handleCancelRequest(reqId);
            });
        });
    }

    async function handleApproveRequest(requestId) {
        if (!state.activeStudent) return;
        const note = prompt("Enter an approval message or instructions for the student (optional):", "Approved! Hope you enjoy the session.");
        if (note === null) return; // User cancelled prompt

        try {
            await API.approveTransfer(requestId, state.activeStudent.studentId, note);
            showToast('Transfer APPROVED! Database row lock applied & ownership transferred securely.', 'success');
            await loadRequests();
            await loadMyTokens();
            await loadMarketplaceTokens();
            await loadHistory();
            await loadStats();
        } catch (e) {
            showToast(e.message || 'Approval failed', 'error');
        }
    }

    async function handleRejectRequest(requestId) {
        if (!state.activeStudent) return;
        const note = prompt("Enter a reason for declining this request (optional):", "Unable to transfer token at this time.");
        if (note === null) return;

        try {
            await API.rejectTransfer(requestId, state.activeStudent.studentId, note);
            showToast('Request declined.', 'info');
            await loadRequests();
            await loadMarketplaceTokens();
        } catch (e) {
            showToast(e.message || 'Rejection failed', 'error');
        }
    }

    async function handleCancelRequest(requestId) {
        if (!state.activeStudent) return;
        if (!confirm("Are you sure you want to cancel this transfer request?")) return;

        try {
            await API.cancelTransfer(requestId, state.activeStudent.studentId);
            showToast('Request cancelled.', 'info');
            await loadRequests();
            await loadMarketplaceTokens();
        } catch (e) {
            showToast(e.message || 'Cancel failed', 'error');
        }
    }

    // ========================================================
    // AUDIT TRAIL / TRANSFER HISTORY
    // ========================================================
    async function loadHistory() {
        try {
            const studentIdFilter = state.myHistoryOnly && state.activeStudent ? state.activeStudent.studentId : null;
            const searchFilter = document.getElementById('historySearchInput')?.value?.trim() || null;
            const res = await API.getHistory(searchFilter, studentIdFilter);
            state.history = res.data || [];
            renderHistory();
        } catch (e) {
            console.error('Failed to load audit history:', e);
        }
    }

    function renderHistory() {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;

        if (state.history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        No transfer history records found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = state.history.map(h => {
            return `
                <tr>
                    <td><span class="history-tx-id">#TX-${String(h.historyId).padStart(4, '0')}</span></td>
                    <td><span class="history-code">${h.tokenCode}</span></td>
                    <td><strong style="color: var(--text-primary);">${h.activityTitle}</strong></td>
                    <td>
                        <span class="student-tag">
                            ${h.fromStudentName} <small style="color: var(--text-muted);">(${h.fromStudentRollNo})</small>
                        </span>
                    </td>
                    <td><i data-lucide="arrow-right" class="arrow-icon"></i></td>
                    <td>
                        <span class="student-tag">
                            ${h.toStudentName} <small style="color: var(--text-muted);">(${h.toStudentRollNo})</small>
                        </span>
                    </td>
                    <td>${formatDateTime(h.transferredAt)}</td>
                    <td>
                        <span class="verified-pill">
                            <i data-lucide="check-circle-2"></i> Verified Row-Lock
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        refreshIcons();
    }

    // ========================================================
    // ANALYTICS & DASHBOARD METRICS
    // ========================================================
    async function loadStats() {
        try {
            const res = await API.getStats();
            state.stats = res.data || {};
            renderStats();
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    }

    function renderStats() {
        const s = state.stats;
        if (!s) return;

        // Hero Metrics
        const mTotal = document.getElementById('metricTotalTokens');
        const mAvail = document.getElementById('metricAvailTokens');
        const mTrans = document.getElementById('metricTransfers');
        const mActs = document.getElementById('metricActivities');

        if (mTotal) mTotal.textContent = s.totalTokens || 0;
        if (mAvail) mAvail.textContent = s.availableTokens || 0;
        if (mTrans) mTrans.textContent = s.completedTransfers || 0;
        if (mActs) mActs.textContent = s.totalActivities || 0;

        // Status Meters
        const statusList = document.getElementById('statusMeterList');
        if (statusList && s.tokensByStatus) {
            const total = s.totalTokens || 1;
            const entries = Object.entries(s.tokensByStatus);

            statusList.innerHTML = entries.map(([status, count]) => {
                const pct = Math.round((count / total) * 100);
                let colorClass = 'cyan';
                if (status === 'AVAILABLE') colorClass = 'emerald';
                if (status === 'TRANSFER_PENDING') colorClass = 'amber';
                if (status === 'USED') colorClass = 'purple';
                if (status === 'EXPIRED') colorClass = 'rose';

                return `
                    <div class="meter-item">
                        <div class="meter-labels">
                            <span class="meter-name">${status}</span>
                            <span class="meter-val">${count} tokens (${pct}%)</span>
                        </div>
                        <div class="meter-track">
                            <div class="meter-fill ${colorClass}" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Category Breakdown
        const catList = document.getElementById('categoryBarsList');
        if (catList && s.tokensByCategory) {
            const total = s.totalTokens || 1;
            const entries = Object.entries(s.tokensByCategory);

            catList.innerHTML = entries.map(([cat, count]) => {
                const pct = Math.round((count / total) * 100);
                return `
                    <div class="meter-item">
                        <div class="meter-labels">
                            <span class="meter-name">${cat}</span>
                            <span class="meter-val">${count} listings (${pct}%)</span>
                        </div>
                        <div class="meter-track">
                            <div class="meter-fill cyan" style="width: ${pct}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // ========================================================
    // MODAL DIALOGS
    // ========================================================
    function setupModals() {
        // Modal backdrops click to close
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    backdrop.classList.add('hidden');
                }
            });
        });

        // Close Buttons
        document.getElementById('closeRequestModalBtn')?.addEventListener('click', () => {
            document.getElementById('requestModalBackdrop').classList.add('hidden');
        });
        document.getElementById('cancelRequestBtn')?.addEventListener('click', () => {
            document.getElementById('requestModalBackdrop').classList.add('hidden');
        });

        document.getElementById('closeDetailModalBtn')?.addEventListener('click', () => {
            document.getElementById('tokenDetailModalBackdrop').classList.add('hidden');
        });

        document.getElementById('closeListTokenModalBtn')?.addEventListener('click', () => {
            document.getElementById('listTokenModalBackdrop').classList.add('hidden');
        });
        document.getElementById('cancelListTokenBtn')?.addEventListener('click', () => {
            document.getElementById('listTokenModalBackdrop').classList.add('hidden');
        });

        document.getElementById('closeActivityModalBtn')?.addEventListener('click', () => {
            document.getElementById('addActivityModalBackdrop').classList.add('hidden');
        });
        document.getElementById('cancelActivityModalBtn')?.addEventListener('click', () => {
            document.getElementById('addActivityModalBackdrop').classList.add('hidden');
        });

        document.getElementById('closeRegisterModalBtn')?.addEventListener('click', () => {
            document.getElementById('registerModalBackdrop').classList.add('hidden');
        });
        document.getElementById('cancelRegisterBtn')?.addEventListener('click', () => {
            document.getElementById('registerModalBackdrop').classList.add('hidden');
        });

        // Open List Token Modal
        document.getElementById('openListTokenBtn')?.addEventListener('click', () => openListTokenModal());
        document.getElementById('heroListTokenBtn')?.addEventListener('click', () => openListTokenModal());
        document.getElementById('vaultListTokenBtn')?.addEventListener('click', () => openListTokenModal());
        document.getElementById('vaultCreateFirstBtn')?.addEventListener('click', () => openListTokenModal());
        document.getElementById('emptyListBtn')?.addEventListener('click', () => openListTokenModal());

        // Open Add Activity Modal
        document.getElementById('openAddActivityModalBtn')?.addEventListener('click', () => {
            document.getElementById('addActivityModalBackdrop').classList.remove('hidden');
            // Default date to 1 week from now
            const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
            const dtInput = document.getElementById('actDateTimeInput');
            if (dtInput) dtInput.value = defaultDate;
        });

        // Open Register Modal
        document.getElementById('openRegisterModalBtn')?.addEventListener('click', () => {
            document.getElementById('studentMenu').classList.add('hidden');
            document.getElementById('registerModalBackdrop').classList.remove('hidden');
        });
    }

    function openRequestModal(tokenId, code, activityTitle) {
        if (!state.activeStudent) {
            showToast('Please select or register an active student first', 'error');
            return;
        }

        const backdrop = document.getElementById('requestModalBackdrop');
        const tokenInput = document.getElementById('reqTokenId');
        const sub = document.getElementById('requestModalSubtitle');
        const preview = document.getElementById('requestTokenPreview');

        if (tokenInput) tokenInput.value = tokenId;
        if (sub) sub.textContent = `Token: ${code} • ${activityTitle}`;

        const token = state.tokens.find(t => t.tokenId === tokenId);
        if (preview && token) {
            preview.innerHTML = `
                <div style="font-family: var(--font-mono); color: var(--neon-cyan); font-weight: 700;">${token.tokenCode}</div>
                <div style="font-weight: 700; color: #fff;">${token.activityTitle}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${token.activityVenue} • ${token.seatOrSlot || 'General'}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                    Owned by <strong>${token.ownerName}</strong> (${token.ownerRollNo})
                </div>
            `;
        }

        backdrop.classList.remove('hidden');
    }

    async function openTokenDetailModal(tokenId) {
        const backdrop = document.getElementById('tokenDetailModalBackdrop');
        const body = document.getElementById('tokenDetailContent');
        const footer = document.getElementById('detailModalFooter');
        const title = document.getElementById('detailModalTitle');
        const code = document.getElementById('detailModalCode');

        backdrop.classList.remove('hidden');
        body.innerHTML = '<div style="text-align: center; padding: 30px;"><div class="pulse-dot"></div> Loading token details...</div>';

        try {
            const res = await API.getToken(tokenId);
            const token = res.data;

            if (title) title.textContent = token.activityTitle;
            if (code) code.textContent = token.tokenCode;

            const isMine = state.activeStudent && token.ownerStudentId === state.activeStudent.studentId;
            const isAvailable = token.status === 'AVAILABLE';

            body.innerHTML = `
                <div class="detail-banner">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="token-category-badge ${(token.activityCategory || 'EVENT').toLowerCase()}">${token.activityCategory}</span>
                        <span class="token-status-pill ${token.status.toLowerCase()}">${token.status}</span>
                    </div>
                    <div class="detail-headline">${token.activityTitle}</div>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">
                        <i data-lucide="map-pin" style="width: 14px; height: 14px; display: inline;"></i> ${token.activityVenue} • Organized by ${token.activityOrganizer || 'SECE'}
                    </div>
                </div>

                <div class="detail-grid">
                    <div class="detail-cell">
                        <span class="detail-label">Token Code</span>
                        <span class="detail-value" style="font-family: var(--font-mono); color: var(--neon-cyan);">${token.tokenCode}</span>
                    </div>
                    <div class="detail-cell">
                        <span class="detail-label">Seat / Slot Allocation</span>
                        <span class="detail-value">${token.seatOrSlot || 'Open Admission'}</span>
                    </div>
                    <div class="detail-cell">
                        <span class="detail-label">Activity Date</span>
                        <span class="detail-value">${formatDateTime(token.activityDate)}</span>
                    </div>
                    <div class="detail-cell">
                        <span class="detail-label">Token Expiry</span>
                        <span class="detail-value">${formatDateTime(token.expiryDate)} (${getCountdown(token.expiryDate)})</span>
                    </div>
                    <div class="detail-cell">
                        <span class="detail-label">Current Owner</span>
                        <span class="detail-value">${token.ownerName} (${token.ownerRollNo})</span>
                    </div>
                    <div class="detail-cell">
                        <span class="detail-label">Owner Department</span>
                        <span class="detail-value">${token.ownerDepartment || 'Engineering'}</span>
                    </div>
                </div>

                ${token.remarks ? `
                    <div class="form-notice">
                        <i data-lucide="info"></i>
                        <span><strong>Listing Remarks:</strong> ${token.remarks}</span>
                    </div>
                ` : ''}
            `;

            footer.innerHTML = `
                <button type="button" class="cyber-btn secondary-glass" id="closeDetailInnerBtn">Close</button>
                ${!isMine && isAvailable ? `
                    <button type="button" class="cyber-btn primary-glow" id="requestFromDetailBtn">
                        <i data-lucide="arrow-right-left"></i> Request Transfer
                    </button>
                ` : ''}
            `;

            refreshIcons();

            document.getElementById('closeDetailInnerBtn')?.addEventListener('click', () => {
                backdrop.classList.add('hidden');
            });

            document.getElementById('requestFromDetailBtn')?.addEventListener('click', () => {
                backdrop.classList.add('hidden');
                openRequestModal(token.tokenId, token.tokenCode, token.activityTitle);
            });
        } catch (e) {
            body.innerHTML = `<div class="empty-state"><h3>Error</h3><p>${e.message}</p></div>`;
        }
    }

    function openListTokenModal(preselectedActivityId = null) {
        if (!state.activeStudent) {
            showToast('Please select or register an active student first', 'error');
            return;
        }

        const backdrop = document.getElementById('listTokenModalBackdrop');
        const select = document.getElementById('listActivitySelect');
        const expInput = document.getElementById('listExpiryInput');

        if (preselectedActivityId && select) {
            select.value = preselectedActivityId;
        }

        // Default expiry to 5 days from now
        if (expInput) {
            const defaultExp = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
            expInput.value = defaultExp;
        }

        backdrop.classList.remove('hidden');
    }

    // ========================================================
    // EVENT LISTENERS & FORMS
    // ========================================================
    function setupEventListeners() {
        // Student Switcher Button
        const currentStudentBtn = document.getElementById('currentStudentBtn');
        const studentMenu = document.getElementById('studentMenu');

        currentStudentBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            studentMenu?.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            studentMenu?.classList.add('hidden');
        });

        // Search Filter in Marketplace
        const searchInput = document.getElementById('marketplaceSearchInput');
        const clearBtn = document.getElementById('clearSearchBtn');

        searchInput?.addEventListener('input', () => {
            state.searchQuery = searchInput.value.trim();
            if (state.searchQuery) {
                clearBtn?.classList.remove('hidden');
            } else {
                clearBtn?.classList.add('hidden');
            }
            loadMarketplaceTokens();
        });

        clearBtn?.addEventListener('click', () => {
            searchInput.value = '';
            state.searchQuery = '';
            clearBtn.classList.add('hidden');
            loadMarketplaceTokens();
        });

        // Category Filter Pills
        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                state.currentCategory = pill.dataset.category;
                loadMarketplaceTokens();
            });
        });

        // Status Filter Select
        const statusSelect = document.getElementById('statusFilterSelect');
        statusSelect?.addEventListener('change', () => {
            state.currentStatus = statusSelect.value;
            loadMarketplaceTokens();
        });

        // Vault Tabs
        document.querySelectorAll('.vault-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.vault-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.vaultFilter = tab.dataset.vfilter;
                renderVault();
            });
        });

        // Request Tabs (Incoming vs Outgoing)
        const tabIn = document.getElementById('tabIncomingRequests');
        const tabOut = document.getElementById('tabOutgoingRequests');
        const panelIn = document.getElementById('incomingPanel');
        const panelOut = document.getElementById('outgoingPanel');

        tabIn?.addEventListener('click', () => {
            tabIn.classList.add('active');
            tabOut.classList.remove('active');
            panelIn.classList.remove('hidden');
            panelOut.classList.add('hidden');
        });

        tabOut?.addEventListener('click', () => {
            tabOut.classList.add('active');
            tabIn.classList.remove('active');
            panelOut.classList.remove('hidden');
            panelIn.classList.add('hidden');
        });

        // Audit Trail Controls
        const historySearch = document.getElementById('historySearchInput');
        historySearch?.addEventListener('input', () => {
            loadHistory();
        });

        const filterMyHistBtn = document.getElementById('filterMyHistoryBtn');
        filterMyHistBtn?.addEventListener('click', () => {
            state.myHistoryOnly = !state.myHistoryOnly;
            filterMyHistBtn.classList.toggle('active', state.myHistoryOnly);
            filterMyHistBtn.innerHTML = state.myHistoryOnly
                ? '<i data-lucide="check"></i> Showing My Transfers'
                : '<i data-lucide="user"></i> My Transfers Only';
            refreshIcons();
            loadHistory();
        });

        // Trigger Expiry Sweep Buttons
        const sweepBtns = [
            document.getElementById('triggerExpirySweepBtn'),
            document.getElementById('manualSweepBtn')
        ];

        sweepBtns.forEach(btn => {
            btn?.addEventListener('click', async () => {
                try {
                    btn.disabled = true;
                    const res = await API.runExpirySweep();
                    const count = res.data?.expiredTokensCount || 0;
                    showToast(`Expiry engine sweep executed: ${count} tokens expired`, 'success');
                    await loadAllData();
                } catch (e) {
                    showToast('Failed to run sweep: ' + e.message, 'error');
                } finally {
                    btn.disabled = false;
                }
            });
        });

        // Form 1: Submit Transfer Request
        const transferForm = document.getElementById('transferRequestForm');
        transferForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tokenId = parseInt(document.getElementById('reqTokenId').value);
            const reason = document.getElementById('reqReasonInput').value.trim();

            if (!tokenId || !state.activeStudent) return;

            try {
                await API.requestTransfer({
                    tokenId: tokenId,
                    requesterStudentId: state.activeStudent.studentId,
                    requestReason: reason
                });

                document.getElementById('requestModalBackdrop').classList.add('hidden');
                transferForm.reset();
                showToast('Transfer request submitted! Current owner has been notified.', 'success');

                await loadMarketplaceTokens();
                await loadRequests();
                await loadStats();
            } catch (err) {
                showToast(err.message || 'Request submission failed', 'error');
            }
        });

        // Form 2: Create Token Listing
        const createTokenForm = document.getElementById('createTokenForm');
        createTokenForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const actId = parseInt(document.getElementById('listActivitySelect').value);
            const slot = document.getElementById('listSeatSlotInput').value.trim();
            const exp = document.getElementById('listExpiryInput').value;
            const remarks = document.getElementById('listRemarksInput').value.trim();

            if (!actId || !exp || !state.activeStudent) return;

            try {
                await API.createToken({
                    activityId: actId,
                    ownerStudentId: state.activeStudent.studentId,
                    validFrom: new Date().toISOString().slice(0, 19),
                    expiryDate: exp.replace('T', ' ') + ':00',
                    seatOrSlot: slot,
                    remarks: remarks
                });

                document.getElementById('listTokenModalBackdrop').classList.add('hidden');
                createTokenForm.reset();
                showToast('Token listed successfully on marketplace!', 'success');

                await loadMarketplaceTokens();
                await loadMyTokens();
                await loadActivities();
                await loadStats();
            } catch (err) {
                showToast(err.message || 'Listing creation failed', 'error');
            }
        });

        // Form 3: Add Campus Activity
        const addActivityForm = document.getElementById('addActivityForm');
        addActivityForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('actTitleInput').value.trim();
            const category = document.getElementById('actCategorySelect').value;
            const venue = document.getElementById('actVenueInput').value.trim();
            const organizer = document.getElementById('actOrganizerInput').value.trim();
            const dt = document.getElementById('actDateTimeInput').value;
            const desc = document.getElementById('actDescInput').value.trim();
            const cap = parseInt(document.getElementById('actCapacityInput').value) || 50;

            try {
                await API.createActivity({
                    title: title,
                    category: category,
                    venue: venue,
                    organizer: organizer,
                    activityDate: dt.replace('T', ' ') + ':00',
                    description: desc,
                    totalCapacity: cap
                });

                document.getElementById('addActivityModalBackdrop').classList.add('hidden');
                addActivityForm.reset();
                showToast('Campus Activity registered successfully!', 'success');

                await loadActivities();
                await loadStats();
            } catch (err) {
                showToast(err.message || 'Failed to create activity', 'error');
            }
        });

        // Form 4: Register Student
        const registerForm = document.getElementById('registerStudentForm');
        registerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regNameInput').value.trim();
            const roll = document.getElementById('regRollInput').value.trim();
            const email = document.getElementById('regEmailInput').value.trim();
            const dept = document.getElementById('regDeptSelect').value;
            const year = parseInt(document.getElementById('regYearSelect').value);
            const contact = document.getElementById('regContactInput').value.trim();

            try {
                const res = await API.registerStudent({
                    name: name,
                    rollNo: roll,
                    email: email,
                    department: dept,
                    yearOfStudy: year,
                    contactNo: contact,
                    passwordHash: 'pass123'
                });

                document.getElementById('registerModalBackdrop').classList.add('hidden');
                registerForm.reset();

                const newStudent = res.data;
                showToast(`Student registered: ${newStudent.name}! Switching account now.`, 'success');

                await loadStudents();
                switchActiveStudent(newStudent.studentId);
            } catch (err) {
                showToast(err.message || 'Registration failed', 'error');
            }
        });
    }

    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.screen-section, .hero-section');

        // Scroll listener to update active tab
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.nav === current) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Start on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
