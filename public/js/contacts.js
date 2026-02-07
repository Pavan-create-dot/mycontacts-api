// DOM Elements
const contactsList = document.getElementById('contactsList');
const addContactBtn = document.getElementById('addContactBtn');
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const contactError = document.getElementById('contactError');

let contacts = [];
let editingContactId = null;

// Check authentication on page load
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const user = await api.getCurrentUser();
        userEmail.textContent = user.email;
        await loadContacts();
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('authorized')) {
            localStorage.removeItem('token');
            window.location.href = '/index.html';
        } else {
            showError(contactError, 'Failed to load user data.');
        }
    }
});

// Load contacts
async function loadContacts() {
    try {
        contactsList.innerHTML = '<div class="loading">Loading contacts...</div>';
        contacts = await api.getContacts();
        renderContacts();
    } catch (error) {
        contactsList.innerHTML = `<div class="error-message show">Failed to load contacts: ${error.message}</div>`;
    }
}

// Render contacts
function renderContacts() {
    if (contacts.length === 0) {
        contactsList.innerHTML = `
            <div class="empty-state">
                <h3>No contacts yet</h3>
                <p>Click "Add Contact" to create your first contact!</p>
            </div>
        `;
        return;
    }

    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-card">
            <h3>${escapeHtml(contact.name)}</h3>
            <div class="contact-info">
                <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(contact.phone)}</p>
            </div>
            <div class="contact-actions">
                <button class="btn btn-edit" onclick="editContact('${contact._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteContact('${contact._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add contact button
addContactBtn.addEventListener('click', () => {
    editingContactId = null;
    modalTitle.textContent = 'Add Contact';
    contactForm.reset();
    document.getElementById('contactId').value = '';
    contactModal.classList.add('show');
});

// Close modal
closeModal.addEventListener('click', () => {
    contactModal.classList.remove('show');
    clearForm();
});

cancelBtn.addEventListener('click', () => {
    contactModal.classList.remove('show');
    clearForm();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('show');
        clearForm();
    }
});

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;

    try {
        if (editingContactId) {
            await api.updateContact(editingContactId, name, email, phone);
        } else {
            await api.createContact(name, email, phone);
        }
        contactModal.classList.remove('show');
        clearForm();
        await loadContacts();
    } catch (error) {
        showError(contactError, error.message || 'Failed to save contact.');
    }
});

// Edit contact
window.editContact = async function(id) {
    const contact = contacts.find(c => c._id === id);
    if (!contact) return;

    editingContactId = id;
    modalTitle.textContent = 'Edit Contact';
    document.getElementById('contactId').value = id;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactEmail').value = contact.email;
    document.getElementById('contactPhone').value = contact.phone;
    contactModal.classList.add('show');
};

// Delete contact
window.deleteContact = async function(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    try {
        await api.deleteContact(id);
        await loadContacts();
    } catch (error) {
        alert('Failed to delete contact: ' + error.message);
    }
};

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
});

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function clearForm() {
    contactForm.reset();
    document.getElementById('contactId').value = '';
    editingContactId = null;
    clearError();
}

function showError(message) {
    contactError.textContent = message;
    contactError.classList.add('show');
    setTimeout(() => {
        contactError.classList.remove('show');
    }, 5000);
}

function clearError() {
    contactError.classList.remove('show');
    contactError.textContent = '';
}
