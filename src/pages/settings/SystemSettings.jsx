import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PageHeader, Input, Btn } from '../../components/UI';

export default function SystemSettings() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({ ...form, lowAttendanceThreshold: Number(form.lowAttendanceThreshold) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Configure school-wide settings" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="School Name" required value={form.schoolName} onChange={e => set('schoolName', e.target.value)} />
          <Input label="Academic Year" required value={form.academicYear} onChange={e => set('academicYear', e.target.value)}
            placeholder="e.g. 2024-25" />
          <div>
            <Input label="Low Attendance Threshold (%)" type="number" min="1" max="100" required
              value={form.lowAttendanceThreshold} onChange={e => set('lowAttendanceThreshold', e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">Students below this % will be flagged in reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Btn type="submit">Save Settings</Btn>
            {saved && <span className="text-sm text-green-600">✓ Settings saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
