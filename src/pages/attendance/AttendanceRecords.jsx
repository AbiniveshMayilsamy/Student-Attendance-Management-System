import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader, Badge, Table } from '../../components/UI';

export default function AttendanceRecords() {
  const { user } = useAuth();
  const { students, classes, subjects, fetchAttendance } = useData();

  const [records,       setRecords]       = useState([]);
  const [filterClass,   setFilterClass]   = useState('');
  const [filterDate,    setFilterDate]    = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus,  setFilterStatus]  = useState('');

  useEffect(() => {
    const params = {};
    if (user.role === 'student') {
      const me = students.find(s => s.email === user.email);
      if (me) params.studentId = me._id;
    }
    if (filterClass)   params.classId   = filterClass;
    if (filterDate)    params.date      = filterDate;
    if (filterSubject) params.subjectId = filterSubject;
    fetchAttendance(params).then(setRecords);
  }, [filterClass, filterDate, filterSubject, students]);

  const filtered = filterStatus ? records.filter(r => r.status === filterStatus) : records;

  const sel = 'bg-[#0d0d1a] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40';

  return (
    <div>
      <PageHeader title="Attendance Records" subtitle="View and filter attendance history" />
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {user.role !== 'student' && (
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className={sel}>
              <option value="">All Classes</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={sel}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={sel}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>
      </div>
      <Table headers={user.role === 'student' ? ['Date', 'Subject', 'Status'] : ['Student', 'Class', 'Date', 'Subject', 'Status']}>
        {filtered.slice(0, 100).map(r => (
          <tr key={r._id} className="hover:bg-white/5">
            {user.role !== 'student' && (
              <>
                <td className="px-4 py-3 text-sm text-white/70">{r.studentId?.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-white/50">{r.classId?.name || '—'}</td>
              </>
            )}
            <td className="px-4 py-3 text-sm text-white/60">{r.date}</td>
            <td className="px-4 py-3 text-sm text-white/50">{r.subjectId?.name || '—'}</td>
            <td className="px-4 py-3"><Badge status={r.status} /></td>
          </tr>
        ))}
      </Table>
      <p className="text-xs text-white/30 mt-2">Showing {Math.min(filtered.length, 100)} records</p>
    </div>
  );
}
