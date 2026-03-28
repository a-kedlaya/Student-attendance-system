const API_BASE = 'http://localhost:4000/api';

let selectedSubjects = [];

// Load departments
async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE}/students/branches`);
        const branches = await response.json();

        const departmentSelect = document.getElementById('department');
        departmentSelect.innerHTML = '<option value="">-- Select Department --</option>' +
            branches.map(b => `<option value="${b.BranchCode}">${b.BranchName}</option>`).join('');
    } catch (err) {
        console.error('Error loading departments:', err);
    }
}

// Load subjects for selected department
async function loadSubjects(branchCode) {
    const subjectsContainer = document.getElementById('subjectsContainer');

    if (!branchCode) {
        subjectsContainer.innerHTML = '<p style="font-size: 13px; color: #666;">Select department first to see available subjects</p>';
        selectedSubjects = [];
        return;
    }

    try {
        // Get all courses for this branch
        const response = await fetch(`${API_BASE}/views/subjects?branch=${branchCode}&year=1`);
        const year1Subjects = await response.json();

        const response2 = await fetch(`${API_BASE}/views/subjects?branch=${branchCode}&year=2`);
        const year2Subjects = await response2.json();

        const response3 = await fetch(`${API_BASE}/views/subjects?branch=${branchCode}&year=3`);
        const year3Subjects = await response3.json();

        const response4 = await fetch(`${API_BASE}/views/subjects?branch=${branchCode}&year=4`);
        const year4Subjects = await response4.json();

        // Combine all subjects
        const allSubjects = [
            ...year1Subjects.map(s => ({ ...s, Year: 1 })),
            ...year2Subjects.map(s => ({ ...s, Year: 2 })),
            ...year3Subjects.map(s => ({ ...s, Year: 3 })),
            ...year4Subjects.map(s => ({ ...s, Year: 4 }))
        ];

        if (allSubjects.length === 0) {
            subjectsContainer.innerHTML = '<p style="font-size: 13px; color: #666;">No subjects available for this department</p>';
            return;
        }

        // Display as checkboxes grouped by year
        let html = '';

        for (let year = 1; year <= 4; year++) {
            const yearSubjects = allSubjects.filter(s => s.Year === year);
            if (yearSubjects.length > 0) {
                html += `<strong>Year ${year}</strong>`;
                yearSubjects.forEach(subject => {
                    html += `
                        <label>
                            <input type="checkbox" class="subject-checkbox" 
                                   value="${subject.CourseName}" 
                                   data-year="${year}">
                            ${subject.CourseName}
                        </label>`;
                });
            }
        }

        subjectsContainer.innerHTML = html;

        // Add event listeners to checkboxes
        document.querySelectorAll('.subject-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedSubjects.push({
                        name: e.target.value,
                        year: parseInt(e.target.dataset.year)
                    });
                } else {
                    selectedSubjects = selectedSubjects.filter(s => s.name !== e.target.value);
                }
            });
        });

    } catch (err) {
        console.error('Error loading subjects:', err);
        subjectsContainer.innerHTML = '<p style="color: red;">Error loading subjects</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();

    // Load subjects when department changes
    document.getElementById('department').addEventListener('change', (e) => {
        loadSubjects(e.target.value);
    });
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const department = document.getElementById('department').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMsg = document.getElementById('errorMsg');

    errorMsg.textContent = '';

    // Validation
    if (!name || !email || !department || !password) {
        errorMsg.textContent = 'All fields are required';
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters';
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match';
        return;
    }

    if (selectedSubjects.length === 0) {
        errorMsg.textContent = 'Please select at least one subject you will teach';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/teachers/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                department,
                password,
                subjects: selectedSubjects
            })
        });

        const data = await response.json();

        if (response.ok) {
            showModal('Success', 'Registration successful! Please login.', () => {
                window.location.href = 'login.html';
            });
        } else {
            errorMsg.textContent = data.error || 'Registration failed';
        }
    } catch (err) {
        errorMsg.textContent = 'Connection error. Please try again.';
        console.error('Signup error:', err);
    }
});


// Custom Modal Function
function showModal(title, message, onClose) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalBtn = document.getElementById('modalBtn');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');

    // Focus the button for better accessibility
    setTimeout(() => modalBtn.focus(), 100);

    const closeModal = () => {
        modal.classList.remove('show');
        document.removeEventListener('keydown', handleKeyPress);
        if (onClose) onClose();
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            closeModal();
        }
    };

    modalBtn.onclick = closeModal;

    // Close on overlay click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    // Add keyboard listener
    document.addEventListener('keydown', handleKeyPress);
}
