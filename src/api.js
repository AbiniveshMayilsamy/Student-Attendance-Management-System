const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('sams_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  // Auth
  login: (email, password) =>
    handle(fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) })),
  me: () =>
    handle(fetch(`${BASE}/auth/me`, { headers: headers() })),

  // Students
  getStudents: () => handle(fetch(`${BASE}/students`, { headers: headers() })),
  getStudent:  (id) => handle(fetch(`${BASE}/students/${id}`, { headers: headers() })),
  addStudent:  (data) => handle(fetch(`${BASE}/students`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  updateStudent: (id, data) => handle(fetch(`${BASE}/students/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  deleteStudent: (id) => handle(fetch(`${BASE}/students/${id}`, { method: 'DELETE', headers: headers() })),

  // Teachers
  getTeachers: () => handle(fetch(`${BASE}/teachers`, { headers: headers() })),
  addTeacher:  (data) => handle(fetch(`${BASE}/teachers`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  updateTeacher: (id, data) => handle(fetch(`${BASE}/teachers/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  deleteTeacher: (id) => handle(fetch(`${BASE}/teachers/${id}`, { method: 'DELETE', headers: headers() })),

  // Classes
  getClasses: () => handle(fetch(`${BASE}/classes`, { headers: headers() })),
  addClass:   (data) => handle(fetch(`${BASE}/classes`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  updateClass: (id, data) => handle(fetch(`${BASE}/classes/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  deleteClass: (id) => handle(fetch(`${BASE}/classes/${id}`, { method: 'DELETE', headers: headers() })),

  // Subjects
  getSubjects: () => handle(fetch(`${BASE}/subjects`, { headers: headers() })),
  addSubject:  (data) => handle(fetch(`${BASE}/subjects`, { method: 'POST', headers: headers(), body: JSON.stringify(data) })),
  updateSubject: (id, data) => handle(fetch(`${BASE}/subjects/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
  deleteSubject: (id) => handle(fetch(`${BASE}/subjects/${id}`, { method: 'DELETE', headers: headers() })),

  // Attendance
  getAttendance: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return handle(fetch(`${BASE}/attendance${q ? '?' + q : ''}`, { headers: headers() }));
  },
  saveAttendance: (records) =>
    handle(fetch(`${BASE}/attendance/bulk`, { method: 'POST', headers: headers(), body: JSON.stringify({ records }) })),
  updateAttendance: (id, data) =>
    handle(fetch(`${BASE}/attendance/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),

  // Settings
  getSettings: () => handle(fetch(`${BASE}/settings`, { headers: headers() })),
  updateSettings: (data) => handle(fetch(`${BASE}/settings`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) })),
};
