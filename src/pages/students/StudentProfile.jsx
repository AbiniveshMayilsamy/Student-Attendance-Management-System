import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Badge, PageHeader } from '../../components/UI';

export default function StudentProfile() {
  const { id } = useParams();
  const { students, classes, attendance } = useData();
  const student = students.find(s => s.id === Number(id));

  if (!student) return <div className="text-white/40">Student not found.</div>;

  const cls = classes.find(c => c.id === student.classId);
  const records = attendance.filter(r => r.studentId === student.id).sort((a, b) => b.date.localeCompare(a.date));
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div>
      <PageHeader title="Student Profile"
        action={<Link to="/students" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">← Back to Students</Link>} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl font-bold text-indigo-300 mb-3">
              {student.name[0]}
            </div>
            <h2 className="text-lg font-bold text-white">{student.name}</h2>
            <p className="text-sm text-cyan-400 font-mono">{student.rollNo}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-white/40">Class</span><span className="font-medium text-white">{cls?.name || '—'}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Email</span><span className="font-medium text-white/80 truncate ml-2">{student.email}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Phone</span><span className="font-medium text-white/80">{student.phone}</span></div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Attendance</span>
              <span className={`font-bold ${pct >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-white/30 mt-1">{present} / {records.length} classes attended</p>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Attendance History</h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#030308]/80 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white/40 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-white/40 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-white/5">
                    <td className="px-4 py-2.5 text-white/60">{r.date}</td>
                    <td className="px-4 py-2.5"><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
