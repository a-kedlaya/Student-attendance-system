document.addEventListener('DOMContentLoaded', initTeacherStudents);

let allStudents = [];

async function initTeacherStudents() {
    // Check authentication
    const teacher = checkAuth();
    if (!teacher) return;

    // Display teacher info
    const teacherNameEl = document.getElementById('teacherName');
    if (teacherNameEl) {
        teacherNameEl.textContent = `${teacher.name} (${teacher.department})`;
    }

    const departmentInfo = document.getElementById('departmentInfo');
    departmentInfo.textContent = `Managing students in ${teacher.department} department`;

    const nameInput = document.getElementById('nameInput');
    const rollInput = document.getElementById('rollInput');
    const yearInput = document.getElementById('yearInput');
    const addBtn = document.getElementById('addBtn');
    const yearFilter = document.getElementById('yearFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const tableBody = document.querySelector('#studentsTable tbody');

    // Load students
    async function loadStudents() {
        tableBody.innerHTML = `<tr><td colspan="4">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading students...</p>
            </div>
        </td></tr>`;
        try {
            const students = await fetchJson(API(`/teacher-dashboard/${teacher.id}/my-students`));
            allStudents = students;
            displayStudents();
        } catch (err) {
            console.error('Error loading students:', err);
            tableBody.innerHTML = `<tr><td colspan="4">
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error Loading Students</h3>
                    <p>Please try again later</p>
                </div>
            </td></tr>`;
            showNotification('Error loading students', 'error');
        }
    }

    // Display students with filter
    function displayStudents() {
        const yearFilterValue = yearFilter.value;
        const filtered = yearFilterValue
            ? allStudents.filter(s => s.Year == yearFilterValue)
            : allStudents;

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3>No Students Found</h3>
                    <p>Try adjusting your filters or add new students</p>
                </div>
            </td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(s => `
      <tr class="fade-in">
        <td>${s.RollNo}</td>
        <td>${s.Name}</td>
        <td><span class="badge badge-info">Year ${s.Year}</span></td>
        <td>
          <button class="delete-btn" data-id="${s.StudentID}" data-name="${s.Name}">🗑️ Delete</button>
        </td>
      </tr>
    `).join('');

        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const studentId = e.target.dataset.id;
                const studentName = e.target.dataset.name;

                showConfirmDialog(
                    `Are you sure you want to delete ${studentName}? This will also delete all attendance records.`,
                    async () => {
                        try {
                            await fetchJson(API(`/teacher-dashboard/${teacher.id}/student/${studentId}`), {
                                method: 'DELETE'
                            });
                            showNotification('Student deleted successfully', 'success');
                            loadStudents();

                            // Mark that dashboard needs refresh
                            sessionStorage.setItem('dashboard_needsRefresh', 'true');
                        } catch (err) {
                            console.error('Error deleting student:', err);
                            showNotification('Error deleting student: ' + err.message, 'error');
                        }
                    }
                );
            });
        });
    }

    // Add student
    addBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const rollNo = rollInput.value.trim();
        const year = yearInput.value;

        if (!name || !rollNo || !year) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }

        try {
            await fetchJson(API(`/teacher-dashboard/${teacher.id}/student`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Name: name, RollNo: rollNo, Year: parseInt(year) })
            });

            showNotification('Student added successfully', 'success');
            nameInput.value = '';
            rollInput.value = '';
            yearInput.value = '';
            loadStudents();

            // Mark that dashboard needs refresh
            sessionStorage.setItem('dashboard_needsRefresh', 'true');
        } catch (err) {
            console.error('Error adding student:', err);
            showNotification('Error adding student: ' + err.message, 'error');
        }
    });

    // Filter and refresh
    yearFilter.addEventListener('change', displayStudents);
    refreshBtn.addEventListener('click', loadStudents);

    // Initial load
    loadStudents();
}
