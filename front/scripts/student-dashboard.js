const API_BASE = 'http://localhost:4000/api';
let myChart;

// Check student authentication
function checkStudentAuth() {
    const student = sessionStorage.getItem('student');
    if (!student && !window.location.pathname.includes('student-login.html')) {
        window.location.href = 'student-login.html';
        return null;
    }
    return student ? JSON.parse(student) : null;
}

// Logout function
function logoutStudent() {
    sessionStorage.removeItem('student');
    window.location.href = 'student-login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    const student = checkStudentAuth();
    if (!student) return;

    // Display student info
    const studentNameEl = document.getElementById('studentName');
    if (studentNameEl) {
        studentNameEl.textContent = `${student.name} (${student.rollNo})`;
    }

    const studentDetails = document.getElementById('studentDetails');
    studentDetails.innerHTML = `
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Roll No:</strong> ${student.rollNo}</p>
        <p><strong>Branch:</strong> ${student.branch}</p>
        <p><strong>Year:</strong> ${student.year}</p>
    `;

    // Load attendance data
    const tableBody = document.querySelector('#attendanceTable tbody');
    const ctx = document.getElementById('attendanceChart').getContext('2d');

    try {
        tableBody.innerHTML = `<tr><td colspan="4">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading your attendance...</p>
            </div>
        </td></tr>`;

        const response = await fetch(`${API_BASE}/students/${student.id}/attendance`);
        const data = await response.json();

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <h3>No Attendance Records</h3>
                    <p>Your attendance will appear here once recorded</p>
                </div>
            </td></tr>`;
            return;
        }

        // Populate table
        tableBody.innerHTML = data.map(row => `
            <tr class="fade-in">
                <td>${row.CourseName}</td>
                <td><span class="badge badge-success">${row.PresentDays || 0}</span></td>
                <td><span class="badge badge-info">${row.TotalDays || 0}</span></td>
                <td><strong>${row.AttendancePercent || 0}%</strong></td>
            </tr>
        `).join('');

        // Create chart
        const labels = data.map(r => r.CourseName);
        const percentages = data.map(r => r.AttendancePercent || 0);

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Attendance %',
                    data: percentages,
                    backgroundColor: 'rgba(44, 111, 183, 0.6)',
                    borderColor: 'rgba(44, 111, 183, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Attendance %' }
                    },
                    x: {
                        title: { display: true, text: 'Subjects' }
                    }
                }
            }
        });

        showNotification('Attendance loaded successfully', 'success');

    } catch (err) {
        console.error('Error loading attendance:', err);
        tableBody.innerHTML = `<tr><td colspan="4">
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error Loading Data</h3>
                <p>Please try again later</p>
            </div>
        </td></tr>`;
        showNotification('Error loading attendance', 'error');
    }
});
