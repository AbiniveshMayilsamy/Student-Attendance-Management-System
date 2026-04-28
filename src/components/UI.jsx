export function StatCard({ label, value, icon, color = 'indigo', sub }) {
  const colors = {
    indigo: 'text-indigo-400',
    green: 'text-emerald-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    blue: 'text-cyan-400',
  };
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-white/50">{label}</span>
        <span className={`text-2xl ${colors[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    present: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    absent: 'bg-red-500/20 text-red-400 border border-red-500/30',
    late: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-white/10 text-white/50'}`}>
      {status}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Table({ headers, children, empty = 'No records found' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <table className="w-full text-sm">
        <thead className="border-b border-white/10">
          <tr>{headers.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {children || <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-white/30">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d1a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-white/60 mb-1">{label}</label>}
      <input className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        ${error ? 'border-red-500/50' : 'border-white/10'}`} {...props} />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-white/60 mb-1">{label}</label>}
      <select className={`w-full bg-[#0d0d1a] border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        ${error ? 'border-red-500/50' : 'border-white/10'}`} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function Btn({ variant = 'primary', size = 'md', children, ...props }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
  const variants = {
    primary: 'bg-indigo-600/80 text-white hover:bg-indigo-600 border border-indigo-500/50',
    secondary: 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10',
    danger: 'bg-red-600/70 text-white hover:bg-red-600 border border-red-500/50',
    outline: 'border border-white/20 text-white/70 hover:bg-white/10',
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]}`} {...props}>{children}</button>;
}
