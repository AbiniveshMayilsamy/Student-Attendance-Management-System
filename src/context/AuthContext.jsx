import { createContext, useContext, useState } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sams_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) return false;
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem('sams_user', JSON.stringify(safe));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sams_user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
