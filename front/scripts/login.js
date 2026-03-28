const API_BASE = 'http://localhost:4000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/teachers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store teacher info in session storage
            sessionStorage.setItem('teacher', JSON.stringify(data.teacher));
            // Redirect to teacher dashboard
            window.location.href = 'teacher-dashboard.html';
        } else {
            errorMsg.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        errorMsg.textContent = 'Connection error. Please try again.';
        console.error('Login error:', err);
    }
});
