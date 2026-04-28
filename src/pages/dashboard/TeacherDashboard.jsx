import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard, Badge, Table } from '../../components/UI';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { classes, subjects, attendance, students } = useData();

  const mySubjects = subjects.filter(s => s.teacherId === user.id);
  const myClassIds = [...new Set(mySubjects.map(s => s.classId))];
  const myClasses = classes.filter(c => myClassIds.includes(c.id));
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendance.filter(r => r.date === today && myClassIds.includes(r.classId));
  const presentToday = todayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const recent = attendance.filter(r => myClassIds.includes(r.classId)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Hello, {user.name}! Here's your overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Classes" value={myClasses.length} icon="🏫" color="indigo" />
        <StatCard label="My Subjects" value={mySubjects.length} icon="📚" color="blue" />
        <StatCard label="Present Today" value={presentToday} icon="✅" color="green" sub="across my classes" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-3">Today's Classes</h2>
          {myClasses.length === 0 ? <p className="text-sm text-white/30">No classes assigned</p> : (
            <div className="space-y-2">
              {myClasses.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-white/40">{c.strength} students</p>
                  </div>
                  <Link to="/attendance/mark"
                    className="text-xs bg-indigo-500/70 hover:bg-indigo-500 border border-indigo-400/40 text-white px-3 py-1.5 rounded-lg transition-colors">
                    Mark
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-3">Recent Submissions</h2>
          <Table headers={['Student', 'Date', 'Status']}>
            {recent.map(r => {
              const s = students.find(st => st.id === r.studentId);
              return (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-4 py-2.5 text-sm text-white/70">{s?.name || `#${r.studentId}`}</td>
                  <td className="px-4 py-2.5 text-sm text-white/50">{r.date}</td>
                  <td className="px-4 py-2.5"><Badge status={r.status} /></td>
                </tr>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
}
