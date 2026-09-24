import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('servicedesk_user');
      if (saved) return JSON.parse(saved);
      // No user saved – use a demo mock user for development
      return { name: 'Demo User', email: 'demo@example.com', role: 'employee' };
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('servicedesk_token') || null;
  });

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('servicedesk_user', JSON.stringify(res.user));
      if (res.token) {
        localStorage.setItem('servicedesk_token', res.token);
      }
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('servicedesk_user');
    localStorage.removeItem('servicedesk_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
