import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader, Table, Btn, Modal, Input, Select } from '../../components/UI';

function ClassForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', batch: '', strength: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, strength: Number(form.strength) }); }} className="space-y-4">
      <Input label="Class Name" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Class 10-A" />
      <Input label="Batch / Year" required value={form.batch} onChange={e => set('batch', e.target.value)} placeholder="e.g. 2024-25" />
      <Input label="Strength" type="number" required value={form.strength} onChange={e => set('strength', e.target.value)} />
      <div className="flex gap-3 justify-end pt-2">
        <Btn variant="secondary" type="button" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save</Btn>
      </div>
    </form>
  );
}

function SubjectForm({ initial, onSave, onClose, classes, teachers }) {
  const [form, setForm] = useState(initial || { name: '', classId: '', teacherId: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, classId: Number(form.classId), teacherId: Number(form.teacherId) }); }} className="space-y-4">
      <Input label="Subject Name" required value={form.name} onChange={e => set('name', e.target.value)} />
      <Select label="Class" required value={form.classId} onChange={e => set('classId', e.target.value)}>
        <option value="">Select class</option>
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
      <Select label="Teacher" required value={form.teacherId} onChange={e => set('teacherId', e.target.value)}>
        <option value="">Select teacher</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </Select>
      <div className="flex gap-3 justify-end pt-2">
        <Btn variant="secondary" type="button" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save</Btn>
      </div>
    </form>
  );
}

export default function ClassesPage() {
  const { classes, subjects, teachers, addClass, updateClass, deleteClass, addSubject, updateSubject, deleteSubject } = useData();
  const [classModal, setClassModal] = useState(null);
  const [subjectModal, setSubjectModal] = useState(null);

  return (
    <div>
      <PageHeader title="Classes & Subjects" subtitle="Manage class groups and subject assignments" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700">Classes & Batches</h2>
            <Btn size="sm" onClick={() => setClassModal('add')}>+ Add Class</Btn>
          </div>
          <Table headers={['Name', 'Batch', 'Strength', 'Actions']}>
            {classes.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-700">{c.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.batch}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.strength}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Btn size="sm" variant="outline" onClick={() => setClassModal(c)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => deleteClass(c.id)}>Del</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700">Subjects</h2>
            <Btn size="sm" onClick={() => setSubjectModal('add')}>+ Add Subject</Btn>
          </div>
          <Table headers={['Subject', 'Class', 'Teacher', 'Actions']}>
            {subjects.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              const teacher = teachers.find(t => t.id === s.teacherId);
              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{cls?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{teacher?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Btn size="sm" variant="outline" onClick={() => setSubjectModal(s)}>Edit</Btn>
                      <Btn size="sm" variant="danger" onClick={() => deleteSubject(s.id)}>Del</Btn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
        </div>
      </div>
      {classModal && (
        <Modal title={classModal === 'add' ? 'Add Class' : 'Edit Class'} onClose={() => setClassModal(null)}>
          <ClassForm initial={classModal !== 'add' ? classModal : null}
            onSave={d => { classModal === 'add' ? addClass(d) : updateClass(classModal.id, d); setClassModal(null); }}
            onClose={() => setClassModal(null)} />
        </Modal>
      )}
      {subjectModal && (
        <Modal title={subjectModal === 'add' ? 'Add Subject' : 'Edit Subject'} onClose={() => setSubjectModal(null)}>
          <SubjectForm initial={subjectModal !== 'add' ? subjectModal : null}
            onSave={d => { subjectModal === 'add' ? addSubject(d) : updateSubject(subjectModal.id, d); setSubjectModal(null); }}
            onClose={() => setSubjectModal(null)} classes={classes} teachers={teachers} />
        </Modal>
      )}
    </div>
  );
}
