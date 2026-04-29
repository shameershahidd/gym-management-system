const API_URL = 'http://localhost:3000/api';

// On page load, immediately check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('gym_token');
    if (token) {
        // Already logged in, go to dashboard
        window.location.href = 'index.html';
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    document.getElementById('login-error').style.display = 'none';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save the token and user data locally
            localStorage.setItem('gym_token', data.token);
            localStorage.setItem('gym_role', data.role);
            localStorage.setItem('gym_username', data.username);
            
            // Redirect to main app
            window.location.href = 'index.html';
        } else {
            console.error('Login failed:', data.message);
            const errBox = document.getElementById('login-error');
            errBox.innerText = data.message || 'Login failed';
            errBox.style.display = 'block';
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Server unreachable');
    }
});
