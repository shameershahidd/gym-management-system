// Standard utility to handle global authentication logic on every page
function getAuthToken() {
    return localStorage.getItem('gym_token');
}

function getUserRole() {
    return localStorage.getItem('gym_role');
}

function getUsername() {
    return localStorage.getItem('gym_username');
}

function logout() {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_role');
    localStorage.removeItem('gym_username');
    window.location.href = 'login.html';
}

function checkAuthAndFetch(url, options = {}) {
    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html';
        return Promise.reject("No token found");
    }

    if (!options.headers) {
        options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${token}`;
    
    return fetch(url, options);
}

// Ensure the page runs access control on load
window.addEventListener('DOMContentLoaded', () => {
    if (!getAuthToken()) {
        window.location.href = 'login.html';
    }

    // Attempt to inject user profile and logout onto existing sidebars automatically
    const sidebar = document.querySelector('.sidebar ul');
    if (sidebar) {
        let authRow = `
            <li style="margin-top: 50px;">
                <span style="color: #bdc3c7; font-size:0.9rem;">Logged in as: <strong>${getUsername()}</strong> (${getUserRole()})</span>
            </li>
            <li><a href="#" onclick="logout(); return false;" style="color: var(--secondary-color);">Logout</a></li>
        `;
        sidebar.innerHTML += authRow;
    }
});