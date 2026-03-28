// force use backend server address
const API = (path) => 'http://localhost:4000/api' + path;

// Check if teacher is logged in
function checkAuth() {
  const teacher = sessionStorage.getItem('teacher');
  if (!teacher && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
    return null;
  }
  return teacher ? JSON.parse(teacher) : null;
}

// Logout function
function logout() {
  sessionStorage.removeItem('teacher');
  window.location.href = 'login.html';
}

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}
