const API_BASE = 'http://localhost:4000/api';

document.getElementById('studentLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const rollNo = document.getElementById('rollNo').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.textContent = '';

    if (!name || !rollNo) {
        errorMsg.textContent = 'Please enter both name and roll number';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/students/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rollNo })
        });

        const data = await response.json();

        if (response.ok) {
            // Store student info in session storage
            sessionStorage.setItem('student', JSON.stringify(data.student));
            // Redirect to student dashboard
            window.location.href = 'student-dashboard.html';
        } else {
            errorMsg.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        errorMsg.textContent = 'Connection error. Please try again.';
        console.error('Login error:', err);
    }
});
