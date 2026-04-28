import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard, Badge } from '../../components/UI';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { students, attendance, subjects, classes } = useData();

  const me = students.find(s => s.email === user.email);
  if (!me) return <p className="text-white/40">Student profile not found.</p>;

  const myRecords = attendance.filter(r => r.studentId === me.id);
  const present = myRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const pct = myRecords.length ? Math.round((present / myRecords.length) * 100) : 0;
  const myClass = classes.find(c => c.id === me.classId);
  const mySubjects = subjects.filter(s => s.classId === me.classId);

  const subjectStats = mySubjects.map(sub => {
    const recs = myRecords.filter(r => r.subjectId === sub.id);
    const p = recs.filter(r => r.status === 'present' || r.status === 'late').length;
    return { ...sub, pct: recs.length ? Math.round((p / recs.length) * 100) : 0 };
  });

  const recent = [...myRecords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Hello, {user.name}! Here's your attendance overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Overall Attendance" value={`${pct}%`} icon="📊" color={pct >= 75 ? 'green' : 'red'} />
        <StatCard label="Classes Present" value={present} icon="✅" color="green" />
        <StatCard label="Classes Absent" value={myRecords.filter(r => r.status === 'absent').length} icon="❌" color="red" />
        <StatCard label="My Class" value={myClass?.name || '—'} icon="🏫" color="indigo" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4">Subject-wise Attendance</h2>
          <div className="space-y-3">
            {subjectStats.map(s => (
              <div key={s.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{s.name}</span>
                  <span className={`font-semibold ${s.pct >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{s.pct}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${s.pct >= 75 ? 'bg-emerald-400' : 'bg-red-400'}`}
                    style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold text-white mb-4">Recent Attendance</h2>
          <div className="space-y-2">
            {recent.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/60">{r.date}</span>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
