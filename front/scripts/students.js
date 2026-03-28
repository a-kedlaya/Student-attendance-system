document.addEventListener('DOMContentLoaded', initStudents);

async function initStudents() {
  // Check authentication
  const teacher = checkAuth();
  if (!teacher) return;

  // Display teacher name
  const teacherNameEl = document.getElementById('teacherName');
  if (teacherNameEl) {
    teacherNameEl.textContent = `Welcome, ${teacher.name}`;
  }
  const branchAdd = document.getElementById('branchAdd');
  const branchFilter = document.getElementById('branchFilter');
  const nameInput = document.getElementById('nameInput');
  const rollInput = document.getElementById('rollInput');
  const yearAdd = document.getElementById('yearAdd');
  const addBtn = document.getElementById('addBtn');
  const showBtn = document.getElementById('showBtn');
  const tableBody = document.querySelector('#studentsTable tbody');

  const branches = await fetchJson(API('/students/branches'));
  branchAdd.innerHTML = branchFilter.innerHTML = branches.map(b => `<option value="${b.BranchCode}">${b.BranchName}</option>`).join('');

  addBtn.addEventListener('click', async () => {
    const payload = {
      Name: nameInput.value.trim(),
      RollNo: rollInput.value.trim(),
      BranchCode: branchAdd.value,
      Year: parseInt(yearAdd.value)
    };
    if (!payload.Name || !payload.RollNo) return alert('Enter name and roll');
    try {
      await fetchJson(API('/students'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert('Added');
      nameInput.value = ''; rollInput.value = '';
      showBtn.click();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });

  showBtn.addEventListener('click', async () => {
    const branch = branchFilter.value;
    const year = document.getElementById('yearFilter').value;
    const q = new URLSearchParams();
    if (branch) q.set('branch', branch);
    if (year) q.set('year', year);
    const rows = await fetchJson(API('/students?' + q.toString()));
    tableBody.innerHTML = rows.map(r => `<tr><td>${r.StudentID}</td><td>${r.Name}</td><td>${r.RollNo}</td><td>${r.BranchCode}</td><td>${r.Year}</td></tr>`).join('');
  });

  // initial show all
  showBtn.click();
}
