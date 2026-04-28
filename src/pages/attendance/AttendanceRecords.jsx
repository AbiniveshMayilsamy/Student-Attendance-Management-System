import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader, Badge, Table } from '../../components/UI';

export default function AttendanceRecords() {
  const { user } = useAuth();
  const { attendance, students, classes, subjects } = useData();

  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  let records = attendance;

  if (user.role === 'student') {
    const me = students.find(s => s.email === user.email);
    records = me ? attendance.filter(r => r.studentId === me.id) : [];
  } else if (user.role === 'teacher') {
    const mySubjectIds = subjects.filter(s => s.teacherId === user.id).map(s => s.id);
    const myClassIds = subjects.filter(s => s.teacherId === user.id).map(s => s.classId);
    records = attendance.filter(r => myClassIds.includes(r.classId));
  }

  const filtered = records.filter(r => {
    if (filterClass && r.classId !== Number(filterClass)) return false;
    if (filterDate && r.date !== filterDate) return false;
    if (filterSubject && r.subjectId !== Number(filterSubject)) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 100);

  return (
    <div>
      <PageHeader title="Attendance Records" subtitle="View and filter attendance history" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {user.role !== 'student' && (
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>
      <Table headers={user.role === 'student' ? ['Date', 'Subject', 'Status'] : ['Student', 'Class', 'Date', 'Subject', 'Status']}>
        {filtered.map(r => {
          const student = students.find(s => s.id === r.studentId);
          const cls = classes.find(c => c.id === r.classId);
          const sub = subjects.find(s => s.id === r.subjectId);
          return (
            <tr key={r.id} className="hover:bg-gray-50">
              {user.role !== 'student' && (
                <>
                  <td className="px-4 py-3 text-sm text-gray-700">{student?.name || `#${r.studentId}`}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{cls?.name || '—'}</td>
                </>
              )}
              <td className="px-4 py-3 text-sm text-gray-600">{r.date}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{sub?.name || '—'}</td>
              <td className="px-4 py-3"><Badge status={r.status} /></td>
            </tr>
          );
        })}
      </Table>
      <p className="text-xs text-gray-400 mt-2">Showing {filtered.length} records</p>
    </div>
  );
}
