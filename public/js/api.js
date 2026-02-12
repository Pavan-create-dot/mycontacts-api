// API Configuration
// - When running locally from Express (http://localhost:5000) → use that origin
// - When deployed on Render (mycontacts-api-7y8k.onrender.com) → use the Render origin
// - If the HTML is opened directly from the filesystem (file://) → also target the Render API
let API_BASE_URL;

if (window.location.origin === 'null' || window.location.origin.startsWith('file://')) {
    // Opened directly from the file system – point to deployed API
    API_BASE_URL = 'https://mycontacts-api-7y8k.onrender.com/api';
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development – assume backend is running on the same origin
    API_BASE_URL = `${window.location.origin}/api`;
} else {
    // Deployed environment – use current origin (works on Render)
    API_BASE_URL = `${window.location.origin}/api`;
}

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
