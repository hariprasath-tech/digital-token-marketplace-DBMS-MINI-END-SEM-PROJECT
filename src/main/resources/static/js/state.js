/**
 * NEXUS Application State & PubSub (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

import { api } from './api.js';

export const state = {
    activeStudent: null,
    students: [],
    activities: [],
    tokens: [],
    myTokens: [],
    incomingRequests: [],
    outgoingRequests: [],
    history: [],
    stats: {
        totalTokens: 0,
        availableTokens: 0,
        transferredTokens: 0,
        usedTokens: 0,
        expiredTokens: 0,
        totalTransfers: 0,
        pendingTransfers: 0,
        activeStudents: 0
    },
    filters: {
        category: 'ALL',
        status: 'ALL',
        venue: 'ALL',
        search: '',
        sortBy: 'expiry-asc'
    },
    vaultTab: 'ALL',
    requestsTab: 'incoming',
    activitiesTab: 'all',
    historyFilter: {
        search: '',
        onlyMine: false
    }
};

const listeners = new Map();

export function subscribe(event, callback) {
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(callback);
    return () => listeners.get(event)?.delete(callback);
}

export function emit(event, data) {
    if (listeners.has(event)) {
        listeners.get(event).forEach(cb => {
            try {
                cb(data);
            } catch (err) {
                console.error(`Error in event listener for ${event}:`, err);
            }
        });
    }
}

export async function loadStudents() {
    try {
        const res = await api.getStudents();
        state.students = res.data || [];

        // Check localStorage for saved session
        const savedId = localStorage.getItem('nexus_student_id');
        if (savedId) {
            const found = state.students.find(s => s.studentId === parseInt(savedId, 10));
            state.activeStudent = found || null;
            if (!found) {
                localStorage.removeItem('nexus_student_id');
            }
        } else {
            state.activeStudent = null;
        }

        emit('studentChanged', state.activeStudent);
        return state.students;
    } catch (err) {
        console.error('Failed to load students:', err);
        return [];
    }
}

export function setActiveStudent(student) {
    state.activeStudent = student;
    if (student && student.studentId) {
        localStorage.setItem('nexus_student_id', student.studentId);
    } else {
        localStorage.removeItem('nexus_student_id');
    }
    emit('studentChanged', state.activeStudent);
}

export function signOut() {
    state.activeStudent = null;
    state.myTokens = [];
    state.incomingRequests = [];
    state.outgoingRequests = [];
    localStorage.removeItem('nexus_student_id');
    emit('studentChanged', null);
}

export function isUserAdmin() {
    if (!state.activeStudent) return false;
    return state.activeStudent.role === 'ADMIN' || state.activeStudent.isAdmin === true;
}

export async function refreshAllData() {
    const promises = [
        loadMarketplaceTokens(),
        loadActivities(),
        loadStats()
    ];
    if (state.activeStudent) {
        promises.push(loadMyTokens());
        promises.push(loadRequests());
        promises.push(loadHistory());
    }
    await Promise.allSettled(promises);
    emit('dataRefreshed', state);
}

export async function loadMarketplaceTokens() {
    try {
        const filters = {
            category: state.filters.category,
            status: state.filters.status,
            venue: state.filters.venue !== 'ALL' ? state.filters.venue : '',
            search: state.filters.search
        };
        const res = await api.getTokens(filters);
        state.tokens = res.data || [];
        emit('tokensUpdated', state.tokens);
        return state.tokens;
    } catch (err) {
        console.error('Failed to load marketplace tokens:', err);
        return [];
    }
}

export async function loadActivities() {
    try {
        const res = await api.getActivities('ALL', '');
        state.activities = res.data || [];
        emit('activitiesUpdated', state.activities);
        return state.activities;
    } catch (err) {
        console.error('Failed to load activities:', err);
        return [];
    }
}

export async function loadMyTokens() {
    if (!state.activeStudent) return [];
    try {
        const res = await api.getMyTokens(state.activeStudent.studentId);
        state.myTokens = res.data || [];
        emit('myTokensUpdated', state.myTokens);
        return state.myTokens;
    } catch (err) {
        console.error('Failed to load my tokens:', err);
        return [];
    }
}

export async function loadRequests() {
    if (!state.activeStudent) return { incoming: [], outgoing: [] };
    try {
        const [incomingRes, outgoingRes] = await Promise.all([
            api.getIncomingRequests(state.activeStudent.studentId),
            api.getOutgoingRequests(state.activeStudent.studentId)
        ]);
        state.incomingRequests = incomingRes.data || [];
        state.outgoingRequests = outgoingRes.data || [];
        emit('requestsUpdated', {
            incoming: state.incomingRequests,
            outgoing: state.outgoingRequests
        });
        return { incoming: state.incomingRequests, outgoing: state.outgoingRequests };
    } catch (err) {
        console.error('Failed to load requests:', err);
        return { incoming: [], outgoing: [] };
    }
}

export async function loadHistory() {
    try {
        const studentId = state.historyFilter.onlyMine && state.activeStudent ? state.activeStudent.studentId : null;
        const res = await api.getHistory(state.historyFilter.search, studentId);
        state.history = res.data || [];
        emit('historyUpdated', state.history);
        return state.history;
    } catch (err) {
        console.error('Failed to load history:', err);
        return [];
    }
}

export async function loadStats() {
    try {
        const res = await api.getStats();
        state.stats = res.data || state.stats;
        emit('statsUpdated', state.stats);
        return state.stats;
    } catch (err) {
        console.error('Failed to load stats:', err);
        return state.stats;
    }
}

// Global reference for debugging
if (typeof window !== 'undefined') {
    window.nexusState = state;
}

export default state;
