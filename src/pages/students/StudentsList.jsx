import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { PageHeader, Table, Btn, Modal, Input, Select } from '../../components/UI';

function StudentForm({ initial, onSave, onClose, classes }) {
  const [form, setForm] = useState(initial || { name: '', rollNo: '', classId: '', email: '', phone: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" required value={form.name} onChange={e => set('name', e.target.value)} />
        <Input label="Roll No" required value={form.rollNo} onChange={e => set('rollNo', e.target.value)} />
      </div>
      <Select label="Class" required value={form.classId} onChange={e => set('classId', Number(e.target.value))}>
        <option value="">Select class</option>
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
      <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
      <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
      <div className="flex gap-3 justify-end pt-2">
        <Btn variant="secondary" type="button" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save Student</Btn>
      </div>
    </form>
  );
}

export default function StudentsList() {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useData();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [modal, setModal] = useState(null);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.classId === Number(filterClass);
    return matchSearch && matchClass;
  });

  const handleSave = (data) => {
    if (modal === 'add') addStudent(data);
    else updateStudent(modal.id, data);
    setModal(null);
  };

  return (
    <div>
      <PageHeader title="Students" subtitle={`${students.length} total students`}
        action={<Btn onClick={() => setModal('add')}>+ Add Student</Btn>} />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or roll no..."
          className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 flex-1 min-w-48" />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          className="bg-[#0d0d1a] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Table headers={['Roll No', 'Name', 'Class', 'Email', 'Phone', 'Actions']}>
        {filtered.map(s => {
          const cls = classes.find(c => c.id === s.classId);
          return (
            <tr key={s.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-sm font-mono text-cyan-300">{s.rollNo}</td>
              <td className="px-4 py-3">
                <Link to={`/students/${s.id}`} className="text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:underline">{s.name}</Link>
              </td>
              <td className="px-4 py-3 text-sm text-white/60">{cls?.name || '—'}</td>
              <td className="px-4 py-3 text-sm text-white/50">{s.email}</td>
              <td className="px-4 py-3 text-sm text-white/50">{s.phone}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Btn size="sm" variant="outline" onClick={() => setModal(s)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteStudent(s.id)}>Delete</Btn>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Student' : 'Edit Student'} onClose={() => setModal(null)}>
          <StudentForm initial={modal !== 'add' ? modal : null} onSave={handleSave} onClose={() => setModal(null)} classes={classes} />
        </Modal>
      )}
    </div>
  );
}
