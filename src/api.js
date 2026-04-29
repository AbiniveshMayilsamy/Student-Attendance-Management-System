const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('sams_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const handle = async (promise) => {
  const res = await promise;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const req = (url, options = {}) => handle(fetch(`${BASE}${url}`, { ...options, headers: headers(options.headers) }));
const get  = (url)        => req(url);
const post = (url, body)  => req(url, { method: 'POST',   body: JSON.stringify(body) });
const put  = (url, body)  => req(url, { method: 'PUT',    body: JSON.stringify(body) });
const del  = (url)        => req(url, { method: 'DELETE' });

export const api = {
  // Auth
  login: (email, password) => post('/auth/login', { email, password }),
  me:    ()                => get('/auth/me'),

  // Students
  getStudents:   ()        => get('/students'),
  getStudent:    (id)      => get(`/students/${id}`),
  addStudent:    (data)    => post('/students', data),
  updateStudent: (id, data)=> put(`/students/${id}`, data),
  deleteStudent: (id)      => del(`/students/${id}`),

  // Teachers
  getTeachers:   ()        => get('/teachers'),
  addTeacher:    (data)    => post('/teachers', data),
  updateTeacher: (id, data)=> put(`/teachers/${id}`, data),
  deleteTeacher: (id)      => del(`/teachers/${id}`),

  // Classes
  getClasses:   ()         => get('/classes'),
  addClass:     (data)     => post('/classes', data),
  updateClass:  (id, data) => put(`/classes/${id}`, data),
  deleteClass:  (id)       => del(`/classes/${id}`),

  // Subjects
  getSubjects:   ()        => get('/subjects'),
  addSubject:    (data)    => post('/subjects', data),
  updateSubject: (id, data)=> put(`/subjects/${id}`, data),
  deleteSubject: (id)      => del(`/subjects/${id}`),

  // Attendance
  getAttendance: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/attendance${q ? '?' + q : ''}`);
  },
  saveAttendance:   (records)  => post('/attendance/bulk', { records }),
  updateAttendance: (id, data) => put(`/attendance/${id}`, data),

  // Settings
  getSettings:    ()     => get('/settings'),
  updateSettings: (data) => put('/settings', data),
};
