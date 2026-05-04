import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { teachers } from '../data/initialData';

// Admin credentials
const ADMIN_USER = {
  id: 'admin',
  role: 'admin',
  name: 'Admin Principal',
  initials: 'AP',
  username: 'admin',
  password: 'admin@123',
  bg: '#1e1b4b',
  text: '#ffffff',
};

const SESSION_KEY = 'smarttt_session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginError, setLoginError] = useState('');

  const login = useCallback((username, password) => {
    setLoginError('');

    // Check admin
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const user = { ...ADMIN_USER, password: undefined };
      setCurrentUser(user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    }

    // Check teachers
    const teacher = teachers.find(
      t => t.username === username && t.password === password
    );
    if (teacher) {
      const user = { ...teacher, role: 'teacher', password: undefined };
      setCurrentUser(user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    }

    setLoginError('Invalid username or password. Please try again.');
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
