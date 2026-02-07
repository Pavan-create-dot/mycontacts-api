// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Set token in localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('token');
}

// Make API request with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// API Functions
const api = {
    // Auth endpoints
    register: async (username, email, password) => {
        return apiRequest('/user/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },

    login: async (email, password) => {
        const data = await apiRequest('/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.accessToken) {
            setToken(data.accessToken);
        }
        return data;
    },

    getCurrentUser: async () => {
        return apiRequest('/user/current');
    },

    // Contact endpoints
    getContacts: async () => {
        return apiRequest('/contacts');
    },

    getContact: async (id) => {
        return apiRequest(`/contacts/${id}`);
    },

    createContact: async (name, email, phone) => {
        return apiRequest('/contacts', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone }),
        });
    },

    updateContact: async (id, name, email, phone) => {
        return apiRequest(`/contacts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, email, phone }),
        });
    },

    deleteContact: async (id) => {
        return apiRequest(`/contacts/${id}`, {
            method: 'DELETE',
        });
    },
};
