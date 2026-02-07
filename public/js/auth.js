// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/contacts.html';
    }
});

// Switch between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    clearErrors();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    clearErrors();
});

// Handle login
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await api.login(email, password);
        window.location.href = '/contacts.html';
    } catch (error) {
        showError(loginError, error.message || 'Login failed. Please check your credentials.');
    }
});

// Handle register
registerFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await api.register(username, email, password);
        showSuccess(registerError, 'Registration successful! Please login.');
        setTimeout(() => {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            document.getElementById('loginEmail').value = email;
        }, 1500);
    } catch (error) {
        showError(registerError, error.message || 'Registration failed. Please try again.');
    }
});

// Helper functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function showSuccess(element, message) {
    element.textContent = message;
    element.style.color = '#28a745';
    element.style.background = '#d4edda';
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
        element.style.color = '';
        element.style.background = '';
    }, 5000);
}

function clearErrors() {
    loginError.classList.remove('show');
    registerError.classList.remove('show');
    loginError.textContent = '';
    registerError.textContent = '';
}
