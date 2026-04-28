import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader, Btn } from '../../components/UI';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function Reports() {
  const { attendance, students, classes, settings } = useData();
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  const filtered = attendance.filter(r => r.date >= dateFrom && r.date <= dateTo);

  // Daily attendance trend
  const dateMap = {};
  filtered.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date, present: 0, absent: 0, late: 0, total: 0 };
    dateMap[r.date][r.status]++;
    dateMap[r.date].total++;
  });
  const dailyData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date)).map(d => ({
    ...d,
    pct: d.total ? Math.round(((d.present + d.late) / d.total) * 100) : 0,
  }));

  // Class-wise attendance
  const classData = classes.map(c => {
    const recs = filtered.filter(r => r.classId === c.id);
    const present = recs.filter(r => r.status === 'present' || r.status === 'late').length;
    return { name: c.name, pct: recs.length ? Math.round((present / recs.length) * 100) : 0, total: recs.length };
  });

  // Low attendance students
  const lowAttendance = students.map(s => {
    const recs = filtered.filter(r => r.studentId === s.id);
    const present = recs.filter(r => r.status === 'present' || r.status === 'late').length;
    const pct = recs.length ? Math.round((present / recs.length) * 100) : 0;
    return { ...s, pct, total: recs.length };
  }).filter(s => s.pct < settings.lowAttendanceThreshold && s.total > 0).sort((a, b) => a.pct - b.pct);

  const exportCSV = () => {
    const rows = [['Student', 'Date', 'Status', 'Class']];
    filtered.forEach(r => {
      const s = students.find(st => st.id === r.studentId);
      const c = classes.find(cl => cl.id === r.classId);
      rows.push([s?.name || r.studentId, r.date, r.status, c?.name || r.classId]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance.csv'; a.click();
  };

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Attendance insights and trends"
        action={<Btn onClick={exportCSV} variant="outline">⬇ Export CSV</Btn>} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Daily Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2} dot={false} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Class-wise Attendance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={classData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" fill="#6366f1" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {lowAttendance.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
          <h2 className="font-semibold text-red-600 mb-3">⚠ Low Attendance Alerts (below {settings.lowAttendanceThreshold}%)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  {['Student', 'Roll No', 'Class', 'Attendance %'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-red-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {lowAttendance.map(s => {
                  const cls = classes.find(c => c.id === s.classId);
                  return (
                    <tr key={s.id} className="hover:bg-red-50">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{s.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{s.rollNo}</td>
                      <td className="px-4 py-2.5 text-gray-500">{cls?.name || '—'}</td>
                      <td className="px-4 py-2.5 font-bold text-red-500">{s.pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
