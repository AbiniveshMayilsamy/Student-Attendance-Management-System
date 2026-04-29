import { createContext, useContext, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sams_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('sams_token', token);
      localStorage.setItem('sams_user', JSON.stringify(user));
      setUser(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sams_token');
    localStorage.removeItem('sams_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
