/**
 * NEXUS Authentication Module (ES Module)
 * Full-Screen Animated Login & Registration Portal
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from '../api.js';
import { state, setActiveStudent, loadStudents, refreshAllData } from '../state.js';
import { showToast, refreshIcons } from '../ui.js';

export function renderAuth(container) {
    container.innerHTML = `
        <div class="auth-page-wrapper">
            <div class="auth-card">
                <!-- Branding Header -->
                <div class="auth-header">
                    <div class="logo-core" style="width: 52px; height: 52px; margin: 0 auto 18px;">
                        <span class="core-hexagon"></span>
                        <i data-lucide="shield-check" class="logo-icon" style="width: 26px; height: 26px;"></i>
                    </div>
                    <h1 class="auth-title">NEXUS IDENTITY ACCESS</h1>
                    <p class="auth-sub">Sri Eshwar College of Engineering Student Portal</p>
                </div>

                <!-- Tab Switcher (No Emojis) -->
                <div class="auth-tab-bar" role="tablist">
                    <button type="button" class="auth-tab-btn active" id="tabLoginBtn" role="tab" aria-selected="true">
                        <i data-lucide="log-in"></i>
                        <span>Student Login</span>
                    </button>
                    <button type="button" class="auth-tab-btn" id="tabRegisterBtn" role="tab" aria-selected="false">
                        <i data-lucide="user-plus"></i>
                        <span>Register Student</span>
                    </button>
                </div>

                <!-- 1. LOGIN FORM -->
                <form id="authLoginForm" class="auth-form-view">
                    <div class="form-group">
                        <label for="loginEmailInput" class="form-label">
                            <span>SECE Email Address</span>
                            <span class="req-star">*</span>
                        </label>
                        <div class="input-with-icon">
                            <i data-lucide="mail"></i>
                            <input type="email" id="loginEmailInput" class="cyber-input" placeholder="e.g. student@sece.ac.in" required autocomplete="email">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="loginPasswordInput" class="form-label">
                            <span>Security Password</span>
                            <span class="req-star">*</span>
                        </label>
                        <div class="input-with-icon">
                            <i data-lucide="key"></i>
                            <input type="password" id="loginPasswordInput" class="cyber-input" placeholder="Enter your password" required autocomplete="current-password">
                        </div>
                        <span class="form-help-text">For project demo: pass123 (or any registered password)</span>
                    </div>

                    <button type="submit" class="cyber-btn primary-glow" id="submitLoginBtn" style="width: 100%; margin-top: 10px;">
                        <i data-lucide="unlock"></i>
                        <span>Authenticate and Enter</span>
                    </button>
                </form>

                <!-- 2. REGISTRATION FORM (Hidden by default) -->
                <form id="authRegisterForm" class="auth-form-view hidden">
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="authRegName" class="form-label">Full Name *</label>
                            <input type="text" id="authRegName" class="cyber-input" placeholder="e.g. Barath Maruthu" required autocomplete="name">
                        </div>
                        <div class="form-group col">
                            <label for="authRegRoll" class="form-label">Roll Number *</label>
                            <input type="text" id="authRegRoll" class="cyber-input" placeholder="e.g. 23CS150" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="authRegEmail" class="form-label">SECE Email Address *</label>
                        <input type="email" id="authRegEmail" class="cyber-input" placeholder="e.g. student@sece.ac.in" required autocomplete="email">
                    </div>

                    <div class="form-row">
                        <div class="form-group col">
                            <label for="authRegDept" class="form-label">Department *</label>
                            <select id="authRegDept" class="cyber-select" required>
                                <option value="Computer Science and Engineering">Computer Science &amp; Engg</option>
                                <option value="Artificial Intelligence & Data Science">AI &amp; Data Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics and Communication">Electronics &amp; Comm</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                            </select>
                        </div>
                        <div class="form-group col">
                            <label for="authRegYear" class="form-label">Year of Study *</label>
                            <select id="authRegYear" class="cyber-select" required>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3" selected>3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="authRegContact" class="form-label">Phone Number</label>
                        <input type="tel" id="authRegContact" class="cyber-input" placeholder="+91 98765 43210" autocomplete="tel">
                    </div>

                    <div class="form-group">
                        <label for="authRegPassword" class="form-label">Password *</label>
                        <input type="password" id="authRegPassword" class="cyber-input" placeholder="Create a secure password" required autocomplete="new-password">
                    </div>

                    <button type="submit" class="cyber-btn primary-glow" id="submitRegBtn" style="width: 100%; margin-top: 10px;">
                        <i data-lucide="user-check"></i>
                        <span>Complete Student Registration</span>
                    </button>
                </form>
            </div>
        </div>
    `;

    refreshIcons();
    setupAuthListeners(container);
}

function setupAuthListeners(container) {
    const tabLogin = container.querySelector('#tabLoginBtn');
    const tabRegister = container.querySelector('#tabRegisterBtn');
    const formLogin = container.querySelector('#authLoginForm');
    const formRegister = container.querySelector('#authRegisterForm');

    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegister.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'false');
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabRegister.setAttribute('aria-selected', 'true');
        tabLogin.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'false');
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
    });

    // Handle Login Submit
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = container.querySelector('#loginEmailInput').value.trim();
        const password = container.querySelector('#loginPasswordInput').value.trim();
        const btn = container.querySelector('#submitLoginBtn');

        btn.disabled = true;
        btn.innerHTML = `<span class="loading-spinner-sm"></span> Authenticating...`;

        try {
            const res = await api.loginStudent(email, password);
            if (res.data) {
                setActiveStudent(res.data);
                showToast(`Authenticated as ${res.data.name} (${res.data.rollNo})`, 'success');
                await refreshAllData();
                window.location.hash = '#/marketplace';
                return;
            }
        } catch (err) {
            // Check student list as demo fallback
            const existing = state.students.find(s => s.email.toLowerCase() === email.toLowerCase());
            if (existing) {
                setActiveStudent(existing);
                showToast(`Authenticated as ${existing.name} (${existing.rollNo})`, 'success');
                await refreshAllData();
                window.location.hash = '#/marketplace';
                return;
            } else {
                showToast(err.message || 'Invalid student credentials.', 'error');
            }
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="unlock"></i><span>Authenticate and Enter</span>`;
            refreshIcons();
        }
    });

    // Handle Registration Submit
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = container.querySelector('#submitRegBtn');
        btn.disabled = true;
        btn.innerHTML = `<span class="loading-spinner-sm"></span> Creating Account...`;

        const studentData = {
            name: container.querySelector('#authRegName').value.trim(),
            rollNo: container.querySelector('#authRegRoll').value.trim(),
            email: container.querySelector('#authRegEmail').value.trim(),
            department: container.querySelector('#authRegDept').value,
            yearOfStudy: parseInt(container.querySelector('#authRegYear').value, 10),
            contactNumber: container.querySelector('#authRegContact').value.trim(),
            password: container.querySelector('#authRegPassword').value.trim()
        };

        try {
            const res = await api.registerStudent(studentData);
            showToast('Registration successful! Welcome to NEXUS.', 'success');
            await loadStudents();
            if (res.data) {
                setActiveStudent(res.data);
            }
            await refreshAllData();
            window.location.hash = '#/marketplace';
        } catch (err) {
            showToast(err.message || 'Registration failed. Check roll number and email.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="user-check"></i><span>Complete Student Registration</span>`;
            refreshIcons();
        }
    });
}

export default renderAuth;
