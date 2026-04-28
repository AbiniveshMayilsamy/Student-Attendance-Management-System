import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 drop-shadow-lg">🎓</div>
          <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">SAMS</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-white/50 text-sm mb-6">
                We've sent a reset link to <span className="text-cyan-300 font-semibold">{email}</span>
              </p>
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">← Back to login</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Forgot Password</h2>
              <p className="text-white/40 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-cyan-300 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                    placeholder="Enter your email" />
                </div>
                <button type="submit"
                  className="w-full bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-400/50 text-white py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20">
                  Send Reset Link
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">← Back to login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
