import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserInfo = localStorage.getItem('userInfo');

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUserInfo && savedUserInfo !== 'undefined' && savedUserInfo !== 'null') {
      try {
        setUser(JSON.parse(savedUserInfo));
      } catch (e) {
        console.error('AuthContext: Failed to parse userInfo from localStorage', e);
        localStorage.removeItem('userInfo'); // clear corrupt data
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setToken(null);
    setUser(null);
  };

  // Sync state with localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      const info = localStorage.getItem('userInfo');
      if (info && info !== 'undefined' && info !== 'null') {
        try {
          setUser(JSON.parse(info));
        } catch (e) {
          console.error('AuthContext: Failed to parse userInfo on storage event', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
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
