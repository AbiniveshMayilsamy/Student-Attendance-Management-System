import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader, Btn } from '../../components/UI';

export default function MarkAttendance() {
  const { user } = useAuth();
  const { students, classes, subjects, attendance, saveAttendance } = useData();

  const mySubjects = subjects.filter(s => s.teacherId === user.id);
  const myClassIds = [...new Set(mySubjects.map(s => s.classId))];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);

  const classStudents = students.filter(s => s.classId === Number(selectedClass));
  const filteredSubjects = mySubjects.filter(s => s.classId === Number(selectedClass));

  const handleClassChange = (cid) => {
    setSelectedClass(cid); setSelectedSubject(''); setMarks({}); setSaved(false);
    const existing = attendance.filter(r => r.date === date && r.classId === Number(cid));
    const init = {};
    students.filter(s => s.classId === Number(cid)).forEach(s => {
      init[s.id] = existing.find(r => r.studentId === s.id)?.status || 'present';
    });
    setMarks(init);
  };

  const handleDateChange = (d) => {
    setDate(d); setSaved(false);
    if (selectedClass) {
      const existing = attendance.filter(r => r.date === d && r.classId === Number(selectedClass));
      const init = {};
      classStudents.forEach(s => { init[s.id] = existing.find(r => r.studentId === s.id)?.status || 'present'; });
      setMarks(init);
    }
  };

  const handleSave = () => {
    saveAttendance(classStudents.map(s => ({
      id: Date.now() + s.id, studentId: s.id,
      classId: Number(selectedClass),
      subjectId: Number(selectedSubject) || Number(selectedClass),
      date, status: marks[s.id] || 'present',
    })));
    setSaved(true);
  };

  const statusColors = {
    present: { active: 'bg-emerald-500 text-white border-emerald-500', idle: 'border-white/15 text-white/40 hover:bg-white/10' },
    absent:  { active: 'bg-red-500 text-white border-red-500',         idle: 'border-white/15 text-white/40 hover:bg-white/10' },
    late:    { active: 'bg-yellow-500 text-white border-yellow-500',   idle: 'border-white/15 text-white/40 hover:bg-white/10' },
  };

  const selectCls = 'w-full bg-[#0d0d1a] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40';

  return (
    <div>
      <PageHeader title="Mark Attendance" subtitle="Select class and date to mark attendance" />
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-1">Class</label>
            <select value={selectedClass} onChange={e => handleClassChange(e.target.value)} className={selectCls}>
              <option value="">Select class</option>
              {classes.filter(c => myClassIds.includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-1">Subject</label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className={selectCls} disabled={!selectedClass}>
              <option value="">Select subject</option>
              {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-1">Date</label>
            <input type="date" value={date} onChange={e => handleDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
          </div>
        </div>
      </div>

      {selectedClass && classStudents.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              <Btn size="sm" variant="secondary" onClick={() => setMarks(Object.fromEntries(classStudents.map(s => [s.id, 'present'])))}>All Present</Btn>
              <Btn size="sm" variant="secondary" onClick={() => setMarks(Object.fromEntries(classStudents.map(s => [s.id, 'absent'])))}>All Absent</Btn>
            </div>
            <span className="text-sm text-white/40">{classStudents.length} students</span>
          </div>
          <div className="space-y-2">
            {classStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-cyan-400 font-mono">{s.rollNo}</p>
                </div>
                <div className="flex gap-2">
                  {['present', 'absent', 'late'].map(st => (
                    <button key={st} onClick={() => setMarks(p => ({ ...p, [s.id]: st }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-all
                        ${marks[s.id] === st ? statusColors[st].active : statusColors[st].idle}`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Btn onClick={handleSave}>Save Attendance</Btn>
            {saved && <span className="text-sm text-emerald-400 font-medium">✓ Attendance saved!</span>}
          </div>
        </div>
      )}
      {selectedClass && classStudents.length === 0 && (
        <p className="text-white/30 text-sm">No students in this class.</p>
      )}
    </div>
  );
}
