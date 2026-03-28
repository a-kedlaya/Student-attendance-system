document.addEventListener('DOMContentLoaded', initAttendance);

async function initAttendance() {
  // Check authentication
  const teacher = checkAuth();
  if (!teacher) return;

  // Display teacher name
  const teacherNameEl = document.getElementById('teacherName');
  if (teacherNameEl) {
    teacherNameEl.textContent = `Welcome, ${teacher.name}`;
  }
  const teacherSelect = document.getElementById('teacherSelect');
  const classSelect = document.getElementById('classSelect');
  const loadStudentsBtn = document.getElementById('loadStudentsBtn');
  const studentsList = document.getElementById('studentsList');
  const attDate = document.getElementById('attDate');

  const teachers = await fetchJson(API('/teachers'));
  teacherSelect.innerHTML = teachers.map(t => `<option value="${t.TeacherID}">${t.Name} (${t.Department})</option>`).join('');

  teacherSelect.addEventListener('change', async () => {
    classSelect.innerHTML = '<option>Loading…</option>';
    const teacherId = teacherSelect.value;
    const classes = await fetchJson(API(`/teachers/${teacherId}/classes`));
    classSelect.innerHTML = classes.map(c => `<option value="${c.ClassID}">${c.CourseName} (Year ${c.Year})</option>`).join('');
  });
  // trigger change to load classes
  teacherSelect.dispatchEvent(new Event('change'));

  loadStudentsBtn.addEventListener('click', async () => {
    const classId = classSelect.value;
    studentsList.innerHTML = 'Loading…';
    try {
      const res = await fetchJson(API(`/attendance/class/${classId}/students`));
      if (!res.students) { studentsList.innerHTML = 'No students'; return; }
      studentsList.innerHTML = res.students.map(s => {
        return `<div class="student-item">
          <div class="attendance-options">
            <label><input type="radio" name="stu_${s.StudentID}" value="P" checked> P</label>
            <label><input type="radio" name="stu_${s.StudentID}" value="A"> A</label>
          </div>
          <span class="student-name">${s.RollNo} - ${s.Name}</span>
        </div>`;
      }).join('');
    } catch (e) {
      studentsList.innerHTML = 'Error loading students';
    }
  });

  document.getElementById('attendanceForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const teacherId = teacherSelect.value;
    const classId = classSelect.value;
    const date = attDate.value;
    if (!date) return alert('Select a date');
    // collect records
    const inputs = studentsList.querySelectorAll('div');
    const records = [];
    inputs.forEach(div => {
      const txt = div.querySelector('input[type="radio"]:checked');
      // extract studentId from radio name
      const name = div.querySelector('input[type="radio"]').name; // e.g. stu_12
      const studentId = parseInt(name.split('_')[1]);
      records.push({ studentId, status: txt.value });
    });
    try {
      await fetchJson(API('/attendance/mark'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: parseInt(teacherId), classId: parseInt(classId), date, records })
      });
      alert('Attendance submitted');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });
}
