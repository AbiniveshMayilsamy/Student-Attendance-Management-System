import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { ok, message } = await login(form.email, form.password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError(message || 'Invalid email or password');
  };

  const demoLogin = (email, password) => setForm({ email, password });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 drop-shadow-lg">🎓</div>
          <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">SAMS</h1>
          <p className="text-cyan-300 text-sm mt-2 font-medium tracking-widest uppercase">Student Attendance Management System</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
          <p className="text-white/40 text-sm mb-6">Welcome back — enter your credentials</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-1">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-1">Password</label>
              <input type="password" required value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                placeholder="Enter your password" />
            </div>
            {error && (
              <p className="text-sm text-red-300 bg-red-500/15 border border-red-500/30 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-400/50 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-right">
            <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</Link>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-white/30 mb-3 text-center uppercase tracking-widest">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'Admin', email: 'admin@school.com', password: 'admin123' },
                { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
                { role: 'Student', email: 'student@school.com', password: 'student123' },
              ].map(d => (
                <button key={d.role} onClick={() => demoLogin(d.email, d.password)}
                  className="text-xs border border-white/15 text-cyan-300 hover:text-white hover:bg-white/10 rounded-lg py-2 transition-all font-medium">
                  {d.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
