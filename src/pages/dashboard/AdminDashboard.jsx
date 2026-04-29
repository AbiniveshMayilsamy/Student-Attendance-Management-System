import { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { StatCard, Table, Badge } from '../../components/UI';

export default function AdminDashboard() {
  const { students, teachers, classes, attendance, fetchAttendance } = useData();

  useEffect(() => {
    fetchAttendance({ date: new Date().toISOString().split('T')[0] });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter(r => r.date === today);
  const presentToday = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const totalToday = todayRecords.length;
  const overallPct = totalToday ? Math.round((presentToday / totalToday) * 100) : 0;
  const recent = [...attendance].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Welcome back! Here's what's happening today.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={students.length} icon="👨🎓" color="indigo" />
        <StatCard label="Total Teachers" value={teachers.length} icon="👨🏫" color="blue" />
        <StatCard label="Classes" value={classes.length} icon="🏫" color="green" />
        <StatCard label="Today's Attendance" value={`${overallPct}%`} icon="📋"
          color={overallPct >= 75 ? 'green' : 'red'} sub={`${presentToday}/${totalToday} present`} />
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
        <h2 className="font-semibold text-white mb-4">Recent Attendance Activity</h2>
        <Table headers={['Student', 'Date', 'Status']}>
          {recent.map(r => (
            <tr key={r._id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white/70">{r.studentId?.name || '—'}</td>
              <td className="px-4 py-3 text-white/70">{r.date}</td>
              <td className="px-4 py-3"><Badge status={r.status} /></td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
