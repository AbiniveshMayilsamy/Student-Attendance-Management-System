import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader, Btn } from '../../components/UI';

export default function MarkAttendance() {
  const { user } = useAuth();
  const { students, classes, subjects, saveAttendance, fetchAttendance } = useData();

  const mySubjects = subjects.filter(s => (s.teacherId?._id || s.teacherId) === user._id);
  const myClassIds = [...new Set(mySubjects.map(s => s.classId?._id || s.classId))];

  const [selectedClass,   setSelectedClass]   = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date,  setDate]  = useState(new Date().toISOString().split('T')[0]);
  const [marks, setMarks] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const classStudents    = students.filter(s => (s.classId?._id || s.classId) === selectedClass);
  const filteredSubjects = mySubjects.filter(s => (s.classId?._id || s.classId) === selectedClass);

  const loadExisting = async (cid, d) => {
    const existing = await fetchAttendance({ classId: cid, date: d });
    const init = {};
    students.filter(s => (s.classId?._id || s.classId) === cid).forEach(s => {
      const rec = existing.find(r => (r.studentId?._id || r.studentId) === s._id);
      init[s._id] = rec?.status || 'present';
    });
    setMarks(init);
  };

  const handleClassChange = (cid) => {
    setSelectedClass(cid); setSelectedSubject(''); setSaved(false);
    if (cid) loadExisting(cid, date);
  };

  const handleDateChange = (d) => {
    setDate(d); setSaved(false);
    if (selectedClass) loadExisting(selectedClass, d);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAttendance(classStudents.map(s => ({
      studentId: s._id,
      classId:   selectedClass,
      subjectId: selectedSubject || selectedClass,
      date,
      status: marks[s._id] || 'present',
    })));
    setSaving(false);
    setSaved(true);
  };

  const statusColors = {
    present: { active: 'bg-emerald-500 text-white border-emerald-500', idle: 'border-white/15 text-white/40 hover:bg-white/10' },
    absent:  { active: 'bg-red-500 text-white border-red-500',         idle: 'border-white/15 text-white/40 hover:bg-white/10' },
    late:    { active: 'bg-yellow-500 text-white border-yellow-500',   idle: 'border-white/15 text-white/40 hover:bg-white/10' },
  };

  const sel = 'w-full bg-[#0d0d1a] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40';

  return (
    <div>
      <PageHeader title="Mark Attendance" subtitle="Select class and date to mark attendance" />
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-1">Class</label>
            <select value={selectedClass} onChange={e => handleClassChange(e.target.value)} className={sel}>
              <option value="">Select class</option>
              {classes.filter(c => myClassIds.includes(c._id)).map(c =>
                <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-1">Subject</label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className={sel} disabled={!selectedClass}>
              <option value="">Select subject</option>
              {filteredSubjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
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
              <Btn size="sm" variant="secondary" onClick={() => setMarks(Object.fromEntries(classStudents.map(s => [s._id, 'present'])))}>All Present</Btn>
              <Btn size="sm" variant="secondary" onClick={() => setMarks(Object.fromEntries(classStudents.map(s => [s._id, 'absent'])))}>All Absent</Btn>
            </div>
            <span className="text-sm text-white/40">{classStudents.length} students</span>
          </div>
          <div className="space-y-2">
            {classStudents.map(s => (
              <div key={s._id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-cyan-400 font-mono">{s.rollNo}</p>
                </div>
                <div className="flex gap-2">
                  {['present', 'absent', 'late'].map(st => (
                    <button key={st} onClick={() => setMarks(p => ({ ...p, [s._id]: st }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-all
                        ${marks[s._id] === st ? statusColors[st].active : statusColors[st].idle}`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Attendance'}</Btn>
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
