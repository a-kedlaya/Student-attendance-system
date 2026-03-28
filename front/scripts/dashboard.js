document.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  // Check authentication
  const teacher = checkAuth();
  if (!teacher) return;

  // Display teacher name
  const teacherNameEl = document.getElementById('teacherName');
  if (teacherNameEl) {
    teacherNameEl.textContent = `Welcome, ${teacher.name}`;
  }
  const branchSelect = document.getElementById("branchSelect");
  const yearSelect = document.getElementById("yearSelect");
  const subjectSelect = document.getElementById("subjectSelect");
  const applyBtn = document.getElementById("applyBtn");
  const attendanceTableBody = document.querySelector("#attendanceTable tbody");
  const teacherList = document.getElementById("teacherList");
  const meta = document.getElementById("meta");
  const ctx = document.getElementById("attendanceChart").getContext("2d");

  let chart;

  // ✅ Load saved filters only for same-session navigation (not link open)
  const savedBranch = sessionStorage.getItem("branch");
  const savedYear = sessionStorage.getItem("year");
  const savedSubject = sessionStorage.getItem("subject");
  const fromNavigation = sessionStorage.getItem("fromNavigation") === "true";

  // ✅ Load all branches
  const branches = await fetchJson(API(`/views/branches`));
  branchSelect.innerHTML =
    `<option value="">-- Select Branch --</option>` +
    branches.map(b => `<option value="${b.BranchCode}">${b.BranchName}</option>`).join("");

  // ✅ Load subjects dynamically
  async function loadSubjects() {
    const branch = branchSelect.value;
    const year = yearSelect.value;

    if (!branch || !year) {
      subjectSelect.innerHTML = `<option value="">-- Select Branch & Year first --</option>`;
      return;
    }

    const subjects = await fetchJson(API(`/views/subjects?branch=${branch}&year=${year}`));
    subjectSelect.innerHTML =
      `<option value="">-- Select Subject --</option>` +
      subjects.map(s => `<option value="${s.CourseName}">${s.CourseName}</option>`).join("");
  }

  branchSelect.addEventListener("change", loadSubjects);
  yearSelect.addEventListener("change", loadSubjects);

  // ✅ Load Dashboard
  async function loadDashboard(branch, year, subject) {
    const rows = await fetchJson(
      API(`/views/student_attendance_summary?branch=${branch}&year=${year}&subject=${subject}`)
    );

    attendanceTableBody.innerHTML = rows.length
      ? rows.map(r => `
          <tr>
            <td>${r.StudentName}</td>
            <td>${r.PresentDays || 0}</td>
            <td>${r.TotalDays || 0}</td>
            <td>${r.AttendancePercent || 0}%</td>
          </tr>
        `).join("")
      : `<tr><td colspan="4">No attendance data available</td></tr>`;

    // ✅ Teacher filter
    const tload = await fetchJson(API(`/views/teacher_load`));
    const filtered = tload.filter(t => t.BranchCode === branch && t.Subject === subject);

    teacherList.innerHTML = filtered.length
      ? filtered.map(t => `
          <li>
            <strong>${t.TeacherName}</strong><br>
            <small>${t.Email}</small>
          </li>`).join("")
      : `<li>No teachers found for this subject</li>`;

    // ✅ Chart
    const labels = rows.map(r => r.StudentName);
    const data = rows.map(r => r.AttendancePercent || 0);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Attendance %",
          data,
          backgroundColor: "rgba(0, 123, 255, 0.6)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });

    meta.innerText = `Branch: ${branch} | Year: ${year} | Subject: ${subject}`;
  }

  // ✅ Apply button logic
  applyBtn.addEventListener("click", async () => {
    const branch = branchSelect.value;
    const year = yearSelect.value;
    const subject = subjectSelect.value;

    if (!branch || !year || !subject) {
      alert("Please select Branch, Year, and Subject!");
      return;
    }

    // Save selections for navigation (not persistent)
    sessionStorage.setItem("branch", branch);
    sessionStorage.setItem("year", year);
    sessionStorage.setItem("subject", subject);
    sessionStorage.setItem("fromNavigation", "true");

    await loadDashboard(branch, year, subject);
  });

  // ✅ Behavior control
  if (fromNavigation && savedBranch && savedYear && savedSubject) {
    // Auto-load only if coming from another page
    branchSelect.value = savedBranch;
    yearSelect.value = savedYear;
    await loadSubjects();
    subjectSelect.value = savedSubject;
    await loadDashboard(savedBranch, savedYear, savedSubject);
  } else {
    // If opened fresh (from link), clear everything
    sessionStorage.clear();
    attendanceTableBody.innerHTML = `<tr><td colspan="4">Select filters and click Apply</td></tr>`;
    teacherList.innerHTML = `<li>No data loaded yet</li>`;
    meta.innerText = "";
  }
}

// ✅ Generic fetch helper
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error fetching ${url}: ${res.statusText}`);
  return res.json();
}
