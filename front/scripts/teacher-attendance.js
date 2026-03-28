document.addEventListener('DOMContentLoaded', initTeacherAttendance);

async function initTeacherAttendance() {
    // Check authentication
    const teacher = checkAuth();
    if (!teacher) return;

    // Display teacher name and department
    const teacherNameEl = document.getElementById('teacherName');
    if (teacherNameEl) {
        teacherNameEl.textContent = `${teacher.name} (${teacher.department})`;
    }

    const classSelect = document.getElementById('classSelect');
    const attDate = document.getElementById('attDate');
    const loadStudentsBtn = document.getElementById('loadStudentsBtn');
    const studentsList = document.getElementById('studentsList');
    const attendanceForm = document.getElementById('attendanceForm');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const historyContainer = document.getElementById('historyContainer');

    // Set today's date as default
    attDate.valueAsDate = new Date();

    // Load teacher's classes
    try {
        const classes = await fetchJson(API(`/teacher-dashboard/${teacher.id}/my-classes`));

        if (classes.length === 0) {
            classSelect.innerHTML = '<option value="">No subjects assigned</option>';
            return;
        }

        // Show subject with branch info
        classSelect.innerHTML = '<option value="">-- Select Subject --</option>' +
            classes.map(c =>
                `<option value="${c.ClassID}">${c.CourseName} - ${c.BranchName} (Year ${c.Year})</option>`
            ).join('');
    } catch (err) {
        console.error('Error loading classes:', err);
        showNotification('Error loading your subjects', 'error');
    }

    // Track if students have been loaded at least once
    let studentsLoadedOnce = false;

    // Function to load students for selected class
    async function loadStudents() {
        const classId = classSelect.value;

        if (!classId) {
            showNotification('Please select a subject', 'warning');
            return;
        }

        studentsList.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading students...</p>
            </div>`;

        try {
            const res = await fetchJson(API(`/attendance/class/${classId}/students`));

            if (!res.students || res.students.length === 0) {
                studentsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <h3>No Students Found</h3>
                        <p>No students enrolled in this class</p>
                    </div>`;
                return;
            }

            studentsList.innerHTML = res.students.map(s => `
        <div class="student-item fade-in">
          <div class="attendance-options">
            <label><input type="radio" name="stu_${s.StudentID}" value="P" checked> P</label>
            <label><input type="radio" name="stu_${s.StudentID}" value="A"> A</label>
          </div>
          <span class="student-name">${s.RollNo} - ${s.Name}</span>
        </div>
      `).join('');
            showNotification('Students loaded successfully', 'success');
            studentsLoadedOnce = true;
        } catch (err) {
            console.error('Error loading students:', err);
            studentsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error Loading Students</h3>
                    <p>Please try again later</p>
                </div>`;
            showNotification('Error loading students', 'error');
        }
    }

    // Load students button click
    loadStudentsBtn.addEventListener('click', loadStudents);

    // Auto-load students when subject changes (after first load)
    classSelect.addEventListener('change', () => {
        if (studentsLoadedOnce && classSelect.value) {
            loadStudents();
        }
    });

    // Submit attendance
    attendanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const classId = classSelect.value;
        const date = attDate.value;

        if (!classId || !date) {
            showNotification('Please select subject and date', 'warning');
            return;
        }

        // Collect attendance records
        const records = [];
        const studentItems = studentsList.querySelectorAll('.student-item');

        studentItems.forEach(item => {
            const checkedRadio = item.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                const studentId = parseInt(checkedRadio.name.split('_')[1]);
                records.push({
                    studentId: studentId,
                    status: checkedRadio.value
                });
            }
        });

        if (records.length === 0) {
            showNotification('No students to mark attendance for', 'warning');
            return;
        }

        try {
            await fetchJson(API('/attendance/mark'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId: teacher.id,
                    classId: parseInt(classId),
                    date: date,
                    records: records
                })
            });

            showNotification('Attendance submitted successfully!', 'success');
            studentsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✓</div>
                    <h3>Attendance Saved</h3>
                    <p>Select another date or subject to continue</p>
                </div>`;

            // Mark that dashboard needs refresh
            sessionStorage.setItem('dashboard_needsRefresh', 'true');
        } catch (err) {
            console.error('Error submitting attendance:', err);
            showNotification('Error submitting attendance: ' + err.message, 'error');
        }
    });

    // View attendance history
    viewHistoryBtn.addEventListener('click', async () => {
        const classId = classSelect.value;

        if (!classId) {
            showNotification('Please select a subject first', 'warning');
            return;
        }

        historyContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading history...</p>
            </div>`;

        try {
            const history = await fetchJson(
                API(`/teacher-dashboard/${teacher.id}/class/${classId}/attendance-history`)
            );

            if (history.length === 0) {
                historyContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <h3>No History Found</h3>
                        <p>No attendance records for this subject yet</p>
                    </div>`;
                return;
            }

            // Group by date
            const byDate = {};
            history.forEach(record => {
                if (!byDate[record.Date]) {
                    byDate[record.Date] = [];
                }
                byDate[record.Date].push(record);
            });

            // Display grouped by date
            let html = '<div class="history-list">';
            Object.keys(byDate).sort().reverse().forEach(date => {
                const records = byDate[date];
                const presentCount = records.filter(r => r.Status === 'P').length;
                const totalCount = records.length;
                const teacherName = records[0].TeacherName || 'Unknown';

                html += `
          <div class="history-date-group">
            <h4>${date} - ${presentCount}/${totalCount} Present</h4>
            <p style="color: #666; font-size: 14px; margin: 5px 0 10px;">
                <strong>Marked by:</strong> ${teacherName}
            </p>
            <table class="striped">
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${records.map(r => `
                  <tr>
                    <td>${r.RollNo}</td>
                    <td>${r.Name}</td>
                    <td><span class="status-${r.Status}">${r.Status === 'P' ? 'Present' : 'Absent'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
            });
            html += '</div>';

            historyContainer.innerHTML = html;
            showNotification('History loaded successfully', 'success');
        } catch (err) {
            console.error('Error loading history:', err);
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error Loading History</h3>
                    <p>Please try again later</p>
                </div>`;
            showNotification('Error loading attendance history', 'error');
        }
    });
}
