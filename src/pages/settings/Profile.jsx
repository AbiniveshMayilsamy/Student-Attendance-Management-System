import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { PageHeader, Input, Btn } from '../../components/UI';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const handleProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Passwords do not match'); return; }
    if (pwForm.newPw.length < 6) { setPwMsg('Password must be at least 6 characters'); return; }
    setPwMsg('Password updated successfully!');
    setPwForm({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 3000);
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user.name[0]}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <form onSubmit={handleProfile} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            <div className="flex items-center gap-3">
              <Btn type="submit">Save Changes</Btn>
              {saved && <span className="text-sm text-green-600">✓ Saved!</span>}
            </div>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Change Password</h2>
          <form onSubmit={handlePassword} className="space-y-4">
            <Input label="Current Password" type="password" required value={pwForm.current}
              onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
            <Input label="New Password" type="password" required value={pwForm.newPw}
              onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))} />
            <Input label="Confirm New Password" type="password" required value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
            {pwMsg && (
              <p className={`text-sm px-3 py-2 rounded-lg ${pwMsg.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {pwMsg}
              </p>
            )}
            <Btn type="submit">Update Password</Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
