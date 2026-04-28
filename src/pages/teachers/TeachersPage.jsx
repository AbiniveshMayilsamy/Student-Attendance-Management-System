import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader, Table, Btn, Modal, Input } from '../../components/UI';

function TeacherForm({ initial, onSave, onClose, subjects, classes }) {
  const [form, setForm] = useState(initial || { name: '', email: '', phone: '', subjects: [], classes: [] });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleSubject = (id) => set('subjects', form.subjects.includes(id) ? form.subjects.filter(s => s !== id) : [...form.subjects, id]);
  const toggleClass = (id) => set('classes', form.classes.includes(id) ? form.classes.filter(c => c !== id) : [...form.classes, id]);

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <Input label="Full Name" required value={form.name} onChange={e => set('name', e.target.value)} />
      <Input label="Email" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
      <Input label="Phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Subjects</label>
        <div className="flex flex-wrap gap-2">
          {subjects.map(s => (
            <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors
                ${form.subjects.includes(s.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Classes</label>
        <div className="flex flex-wrap gap-2">
          {classes.map(c => (
            <button key={c.id} type="button" onClick={() => toggleClass(c.id)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors
                ${form.classes.includes(c.id) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Btn variant="secondary" type="button" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save Teacher</Btn>
      </div>
    </form>
  );
}

export default function TeachersPage() {
  const { teachers, subjects, classes, addTeacher, updateTeacher, deleteTeacher } = useData();
  const [modal, setModal] = useState(null);

  return (
    <div>
      <PageHeader title="Teachers" subtitle={`${teachers.length} teachers`}
        action={<Btn onClick={() => setModal('add')}>+ Add Teacher</Btn>} />
      <Table headers={['Name', 'Email', 'Phone', 'Subjects', 'Classes', 'Actions']}>
        {teachers.map(t => {
          const tSubjects = subjects.filter(s => t.subjects?.includes(s.id));
          const tClasses = classes.filter(c => t.classes?.includes(c.id));
          return (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-700">{t.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{t.email}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{t.phone}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{tSubjects.map(s => s.name).join(', ') || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{tClasses.map(c => c.name).join(', ') || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Btn size="sm" variant="outline" onClick={() => setModal(t)}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => deleteTeacher(t.id)}>Delete</Btn>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Teacher' : 'Edit Teacher'} onClose={() => setModal(null)}>
          <TeacherForm initial={modal !== 'add' ? modal : null}
            onSave={d => { modal === 'add' ? addTeacher(d) : updateTeacher(modal.id, d); setModal(null); }}
            onClose={() => setModal(null)} subjects={subjects} classes={classes} />
        </Modal>
      )}
    </div>
  );
}
