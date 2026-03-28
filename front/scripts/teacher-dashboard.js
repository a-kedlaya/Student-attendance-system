document.addEventListener('DOMContentLoaded', initTeacherDashboard);

let myChart;
let autoUpdateInterval;

async function initTeacherDashboard() {
    // Check authentication
    const teacher = checkAuth();
    if (!teacher) return;

    // Display teacher name and department
    const teacherNameEl = document.getElementById('teacherName');
    if (teacherNameEl) {
        teacherNameEl.textContent = `${teacher.name} (${teacher.department})`;
    }

    const classSelect = document.getElementById('classSelect');
    const searchBtn = document.getElementById('searchBtn');
    const attendanceTableBody = document.querySelector('#attendanceTable tbody');
    const subjectsList = document.getElementById('subjectsList');
    const ctx = document.getElementById('attendanceChart').getContext('2d');

    // Load teacher's classes
    try {
        const classes = await fetchJson(API(`/teacher-dashboard/${teacher.id}/my-classes`));

        if (classes.length === 0) {
            classSelect.innerHTML = '<option value="">No subjects assigned</option>';
            subjectsList.innerHTML = '<li>No subjects assigned yet</li>';
            return;
        }

        // Populate class dropdown with subject and branch info
        classSelect.innerHTML = '<option value="">-- Select a Subject --</option>' +
            classes.map(c =>
                `<option value="${c.ClassID}">${c.CourseName} - ${c.BranchName} (Year ${c.Year})</option>`
            ).join('');

        // Display subjects list with branch info
        subjectsList.innerHTML = classes.map(c =>
            `<li>
                <strong>${c.CourseName}</strong><br>
                <small>${c.BranchName} (${c.BranchCode}) - Year ${c.Year}</small>
            </li>`
        ).join('');

        // Restore previous selection if exists and auto-load
        const savedClassId = sessionStorage.getItem('dashboard_selectedClass');
        if (savedClassId) {
            classSelect.value = savedClassId;
            // Auto-load data silently
            await loadAttendanceData(true);
        }

    } catch (err) {
        console.error('Error loading classes:', err);
        showNotification('Error loading your subjects', 'error');
    }

    // Load attendance data function
    async function loadAttendanceData(silent = false) {
        const classId = classSelect.value;

        if (!classId) {
            if (!silent) showNotification('Please select a subject', 'warning');
            return;
        }

        // Save selection to sessionStorage
        sessionStorage.setItem('dashboard_selectedClass', classId);

        // Show loading state
        if (!silent) {
            attendanceTableBody.innerHTML = '<tr><td colspan="5"><div class="loading-spinner"><div class="spinner"></div><p>Loading data...</p></div></td></tr>';
        }

        try {
            const data = await fetchJson(
                API(`/teacher-dashboard/${teacher.id}/attendance-summary?classId=${classId}`)
            );

            if (data.length === 0) {
                attendanceTableBody.innerHTML = `
                    <tr><td colspan="5">
                        <div class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <h3>No Attendance Data</h3>
                            <p>No attendance records found for this subject</p>
                        </div>
                    </td></tr>`;
                if (myChart) myChart.destroy();
                return;
            }

            // Populate table with fade-in animation
            attendanceTableBody.innerHTML = data.map(row => `
                <tr class="fade-in">
                    <td>${row.RollNo}</td>
                    <td>${row.Name}</td>
                    <td><span class="badge badge-success">${row.PresentDays || 0}</span></td>
                    <td><span class="badge badge-info">${row.TotalDays || 0}</span></td>
                    <td><strong>${row.AttendancePercent || 0}%</strong></td>
                </tr>
            `).join('');

            // Update chart
            const labels = data.map(r => r.RollNo);
            const percentages = data.map(r => r.AttendancePercent || 0);

            if (myChart) myChart.destroy();

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
                            title: { display: true, text: 'Roll Number' }
                        }
                    }
                }
            });

            if (!silent) showNotification('Data loaded successfully', 'success');

        } catch (err) {
            console.error('Error loading attendance:', err);
            attendanceTableBody.innerHTML = `
                <tr><td colspan="5">
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h3>Error Loading Data</h3>
                        <p>Please try again later</p>
                    </div>
                </td></tr>`;
            if (!silent) showNotification('Error loading attendance data', 'error');
        }
    }

    // Search button click
    searchBtn.addEventListener('click', () => loadAttendanceData(false));

    // Auto-reload when class selection changes
    classSelect.addEventListener('change', () => {
        if (classSelect.value) {
            loadAttendanceData(false);
        }
    });

    // Check for updates from other pages and auto-reload
    const checkForUpdates = () => {
        const needsRefresh = sessionStorage.getItem('dashboard_needsRefresh');
        if (needsRefresh === 'true' && classSelect.value) {
            sessionStorage.removeItem('dashboard_needsRefresh');
            loadAttendanceData(true); // Silent reload
        }
    };

    // Check for updates every 2 seconds when page is visible
    autoUpdateInterval = setInterval(checkForUpdates, 2000);

    // Clear interval when leaving page
    window.addEventListener('beforeunload', () => {
        if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    });
}

// Function to reload dashboard (called from other pages after updates)
function reloadDashboard() {
    if (window.location.pathname.includes('teacher-dashboard.html')) {
        location.reload();
    }
}
