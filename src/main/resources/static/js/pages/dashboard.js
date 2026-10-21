/**
 * NEXUS Analytics & Engine Dashboard (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Pure Canvas 2D Charts (Zero Heavy Libraries)
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, loadStats, loadMarketplaceTokens } from '../state.js';
import { refreshIcons, showToast, triggerConfetti } from '../ui.js';
import { animateCounters } from '../animations.js';

export function renderDashboard(container) {
    const stats = state.stats || {};

    container.innerHTML = `
        <div class="dashboard-page-wrapper container">
            <!-- Header -->
            <div class="page-title-row gsap-reveal">
                <div>
                    <span class="section-tag">REAL-TIME TELEMETRY</span>
                    <h1 class="page-main-title">ANALYTICS & ENGINE DASHBOARD</h1>
                    <p class="page-subtitle">Live metrics across token generation, peer transfer velocity, and automated expiry operations.</p>
                </div>
                <div class="header-action-group">
                    <button type="button" class="cyber-btn primary-glow" id="manualSweepBtn">
                        <i data-lucide="zap"></i>
                        <span>Run Expiry Sweep</span>
                    </button>
                </div>
            </div>

            <!-- Stats Metric Cards -->
            <div class="stats-counter-strip gsap-reveal" style="margin-bottom: 34px;">
                <div class="stat-counter-card">
                    <span class="stat-counter-number" data-counter="${stats.totalTokens || 0}">0</span>
                    <span class="stat-counter-label">TOTAL LISTINGS</span>
                    <div class="stat-decor cyan"></div>
                </div>
                <div class="stat-counter-card">
                    <span class="stat-counter-number" data-counter="${stats.availableTokens || 0}">0</span>
                    <span class="stat-counter-label">AVAILABLE TOKENS</span>
                    <div class="stat-decor emerald"></div>
                </div>
                <div class="stat-counter-card">
                    <span class="stat-counter-number" data-counter="${stats.totalTransfers || 0}">0</span>
                    <span class="stat-counter-label">TRANSFERS COMPLETED</span>
                    <div class="stat-decor purple"></div>
                </div>
                <div class="stat-counter-card">
                    <span class="stat-counter-number" data-counter="${stats.activeStudents || 0}">0</span>
                    <span class="stat-counter-label">ACTIVE STUDENTS</span>
                    <div class="stat-decor amber"></div>
                </div>
            </div>

            <!-- Two Pure Canvas Charts -->
            <div class="dashboard-grid gsap-reveal">
                <!-- Chart 1: Donut Chart -->
                <div class="chart-card">
                    <div class="chart-header">
                        <div>
                            <h3 class="chart-title">Token Lifecycle Distribution</h3>
                            <p class="chart-sub">Status breakdown of all minted reservations</p>
                        </div>
                    </div>
                    <div class="chart-canvas-wrap">
                        <canvas id="statusDonutCanvas" class="chart-canvas"></canvas>
                    </div>
                    <div class="chart-legend" id="donutLegend">
                        <!-- Rendered dynamically -->
                    </div>
                </div>

                <!-- Chart 2: Category Breakdown Bar Chart -->
                <div class="chart-card">
                    <div class="chart-header">
                        <div>
                            <h3 class="chart-title">Activity Category Volume</h3>
                            <p class="chart-sub">Distribution of token supply across campus venues</p>
                        </div>
                    </div>
                    <div class="chart-canvas-wrap">
                        <canvas id="categoryBarCanvas" class="chart-canvas"></canvas>
                    </div>
                    <div class="chart-legend" id="barLegend">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            </div>

            <!-- Expiry Engine & DB Architecture Panel -->
            <div class="engine-architecture-grid gsap-reveal" style="margin-top: 30px;">
                <div class="engine-card">
                    <div class="engine-card-header">
                        <div class="pulse-dot"></div>
                        <h4>AUTOMATED EXPIRY ENGINE (SCHEDULED DAEMON)</h4>
                    </div>
                    <p class="engine-desc">
                        A Spring Boot background thread executes a 60-second periodic sweep. Any token with status <code>AVAILABLE</code> or <code>TRANSFER_PENDING</code> past its <code>expires_at</code> timestamp is automatically marked <code>EXPIRED</code>, and rival pending requests are cancelled.
                    </p>
                    <div class="engine-stats-row">
                        <div class="engine-stat">
                            <span class="stat-val">${stats.expiredTokens || 0}</span>
                            <span class="stat-lbl">Tokens Expired by Engine</span>
                        </div>
                        <div class="engine-stat">
                            <span class="stat-val">${stats.usedTokens || 0}</span>
                            <span class="stat-lbl">Tokens Redeemed / Used</span>
                        </div>
                        <div class="engine-stat">
                            <span class="stat-val">60s</span>
                            <span class="stat-lbl">Background Sweep Cadence</span>
                        </div>
                    </div>
                </div>

                <div class="engine-card">
                    <div class="engine-card-header">
                        <i data-lucide="shield-check" style="color:var(--neon-cyan);"></i>
                        <h4>TRANSACTION GUARANTEES & ROW-LEVEL LOCKS</h4>
                    </div>
                    <p class="engine-desc">
                        Token transfers utilize MySQL 8 InnoDB <code>SELECT ... FOR UPDATE</code> row-level locking inside Spring <code>@Transactional</code> boundaries. This eliminates race conditions, guarantees zero double-transfers, and writes an atomic record to the audit ledger.
                    </p>
                    <div class="engine-badges-row">
                        <span class="acid-badge"><i data-lucide="lock"></i> InnoDB Row-Locking</span>
                        <span class="acid-badge"><i data-lucide="layers"></i> READ COMMITTED</span>
                        <span class="acid-badge"><i data-lucide="database"></i> HikariCP Pool</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    refreshIcons();
    animateCounters(container);
    setupDashboardListeners(container);

    // Draw the 2 Canvas Charts
    setTimeout(() => {
        drawDonutChart(container, stats);
        drawCategoryBarChart(container);
    }, 100);
}

function setupDashboardListeners(container) {
    const sweepBtn = container.querySelector('#manualSweepBtn');
    if (sweepBtn) {
        sweepBtn.addEventListener('click', async () => {
            sweepBtn.disabled = true;
            sweepBtn.innerHTML = `<span class="loading-spinner-sm"></span> Sweeping...`;

            try {
                const res = await api.runExpirySweep();
                triggerConfetti();
                const count = (res.data && res.data.expiredCount) || 0;
                showToast(`Expiry sweep completed! ${count} tokens transitioned to EXPIRED.`, 'success');

                await loadStats();
                await loadMarketplaceTokens();
                renderDashboard(container);
            } catch (err) {
                showToast(err.message || 'Expiry sweep failed', 'error');
            } finally {
                sweepBtn.disabled = false;
                sweepBtn.innerHTML = `<i data-lucide="zap"></i><span>Run Expiry Sweep</span>`;
                refreshIcons();
            }
        });
    }
}

// 1. Pure HTML5 Canvas 2D Donut Chart
function drawDonutChart(container, stats) {
    const canvas = container.querySelector('#statusDonutCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 260;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const data = [
        { label: 'Available', value: stats.availableTokens || 0, color: '#10b981' },
        { label: 'Pending', value: stats.pendingTransfers || 0, color: '#f59e0b' },
        { label: 'Transferred', value: stats.transferredTokens || 0, color: '#00f0ff' },
        { label: 'Used', value: stats.usedTokens || 0, color: '#64748b' },
        { label: 'Expired', value: stats.expiredTokens || 0, color: '#ef4444' }
    ];

    const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.62;

    let startAngle = -Math.PI / 2;

    data.forEach(segment => {
        const sliceAngle = (segment.value / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        startAngle += sliceAngle;
    });

    // Inner Hole Glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#080b18';
    ctx.fill();

    // Center Total Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${total}`, centerX, centerY - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('TOKENS', centerX, centerY + 14);

    // Render HTML Legend
    const legendEl = container.querySelector('#donutLegend');
    if (legendEl) {
        legendEl.innerHTML = data.map(d => `
            <div class="legend-item">
                <span class="legend-color-dot" style="background:${d.color};"></span>
                <span class="legend-label">${d.label}: <strong>${d.value}</strong></span>
            </div>
        `).join('');
    }
}

// 2. Pure HTML5 Canvas 2D Category Bar Chart
function drawCategoryBarChart(container) {
    const canvas = container.querySelector('#categoryBarCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 260;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    // Calculate category counts from tokens
    const categories = ['WORKSHOP', 'EVENT', 'LAB', 'SPORTS', 'CLUB'];
    const colors = ['#00f0ff', '#8b5cff', '#ff3df2', '#b6ff3c', '#38bdf8'];

    const counts = categories.map(cat => {
        return state.tokens.filter(t => (t.activityCategory || '').toUpperCase() === cat).length;
    });

    const maxCount = Math.max(...counts, 4);

    const paddingLeft = 40;
    const paddingBottom = 40;
    const paddingTop = 20;
    const paddingRight = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barWidth = chartWidth / categories.length - 18;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = paddingTop + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        const val = Math.round(maxCount - (maxCount / 4) * i);
        ctx.fillText(`${val}`, paddingLeft - 8, y + 3);
    }

    // Draw Bars
    categories.forEach((cat, idx) => {
        const val = counts[idx];
        const barHeight = (val / maxCount) * chartHeight;
        const x = paddingLeft + idx * (barWidth + 18) + 8;
        const y = paddingTop + chartHeight - barHeight;

        // Gradient bar fill
        const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
        grad.addColorStop(0, colors[idx]);
        grad.addColorStop(1, 'rgba(13, 16, 35, 0.4)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();

        // Top value
        ctx.fillStyle = colors[idx];
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${val}`, x + barWidth / 2, y - 6);

        // Bottom label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(cat.substring(0, 4), x + barWidth / 2, paddingTop + chartHeight + 18);
    });

    // Render HTML Legend
    const legendEl = container.querySelector('#barLegend');
    if (legendEl) {
        legendEl.innerHTML = categories.map((cat, idx) => `
            <div class="legend-item">
                <span class="legend-color-dot" style="background:${colors[idx]};"></span>
                <span class="legend-label">${cat}: <strong>${counts[idx]}</strong></span>
            </div>
        `).join('');
    }
}

export default renderDashboard;
