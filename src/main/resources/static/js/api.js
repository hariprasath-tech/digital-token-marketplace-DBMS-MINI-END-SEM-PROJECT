/**
 * NEXUS API Client - Plain REST Wrapper (ES Module)
 * Sri Eshwar College of Engineering - Digital Token Marketplace
 * Author: Hari Prasath
 */

const BASE_URL = window.location.origin;

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const activeStudentId = localStorage.getItem('nexus_student_id');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (activeStudentId) {
        defaultHeaders['X-Student-Id'] = activeStudentId;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok || (data && data.success === false)) {
            const message = (data && data.message) || `HTTP error! Status: ${response.status}`;
            throw new Error(message);
        }

        return data;
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    // Students
    getStudents: () => request('/api/students'),
    getStudent: (id) => request(`/api/students/${id}`),
    registerStudent: (studentData) => request('/api/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
    }),
    loginStudent: (email, password) => request('/api/students/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),

    // Activities
    getActivities: (category, search) => {
        const params = new URLSearchParams();
        if (category && category !== 'ALL') params.append('category', category);
        if (search) params.append('search', search);
        const q = params.toString();
        return request(`/api/activities${q ? '?' + q : ''}`);
    },
    createActivity: (activityData) => request('/api/activities', {
        method: 'POST',
        body: JSON.stringify(activityData)
    }),
    updateActivity: (id, activityData) => request(`/api/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(activityData)
    }),
    deleteActivity: (id) => request(`/api/activities/${id}`, {
        method: 'DELETE'
    }),

    // Tokens
    getTokens: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.activityId) params.append('activityId', filters.activityId);
        if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
        if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters.venue) params.append('venue', filters.venue);
        if (filters.search) params.append('search', filters.search);
        const q = params.toString();
        return request(`/api/tokens${q ? '?' + q : ''}`);
    },
    getToken: (id) => request(`/api/tokens/${id}`),
    getMyTokens: (studentId) => request(`/api/tokens/student/${studentId}`),
    createToken: (tokenData) => request('/api/tokens', {
        method: 'POST',
        body: JSON.stringify(tokenData)
    }),
    markTokenUsed: (tokenId, studentId) => request(`/api/tokens/${tokenId}/use`, {
        method: 'PUT',
        body: JSON.stringify({ studentId })
    }),

    // Transfers
    requestTransfer: (transferData) => request('/api/transfers', {
        method: 'POST',
        body: JSON.stringify(transferData)
    }),
    getIncomingRequests: (studentId) => request(`/api/transfers/incoming/${studentId}`),
    getOutgoingRequests: (studentId) => request(`/api/transfers/outgoing/${studentId}`),
    approveTransfer: (requestId, studentId, note) => request(`/api/transfers/${requestId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ studentId, responseNote: note })
    }),
    rejectTransfer: (requestId, studentId, note) => request(`/api/transfers/${requestId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ studentId, responseNote: note })
    }),
    cancelTransfer: (requestId, studentId) => request(`/api/transfers/${requestId}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ studentId })
    }),

    // Audit History
    getHistory: (search, studentId) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (studentId) params.append('studentId', studentId);
        const q = params.toString();
        return request(`/api/history${q ? '?' + q : ''}`);
    },

    // Analytics
    getStats: () => request('/api/stats'),
    runExpirySweep: () => request('/api/stats/run-expiry', {
        method: 'POST'
    })
};

// Global fallback for dev console or legacy script tags
if (typeof window !== 'undefined') {
    window.API = api;
}

export default api;
