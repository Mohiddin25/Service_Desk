import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('servicedesk_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('servicedesk_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('servicedesk_user');
    localStorage.removeItem('servicedesk_token');
  };

  const role = user?.role || 'employee';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
