import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/students', label: 'Students', icon: '👨‍🎓' },
  { to: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
  { to: '/classes', label: 'Classes & Subjects', icon: '🏫' },
  { to: '/attendance/records', label: 'Attendance', icon: '📋' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const teacherNav = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/attendance/mark', label: 'Mark Attendance', icon: '✅' },
  { to: '/attendance/records', label: 'Records', icon: '📋' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const studentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/attendance/records', label: 'My Attendance', icon: '📋' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const navMap = { admin: adminNav, teacher: teacherNav, student: studentNav };

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = navMap[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 text-white flex flex-col z-30 transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-white/10">
          <h1 className="text-lg font-bold">🎓 SAMS</h1>
          <p className="text-xs text-white/40 mt-1">Student Attendance System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {user?.name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/40 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-sm text-white/50 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-left">
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
