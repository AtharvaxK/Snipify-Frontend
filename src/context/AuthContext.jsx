import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // null = loading, false = not logged in, object = user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authAPI.me();
      setUser(res.data); // { id, username, email, roles, subdomain, needsOnboarding }
    } catch {
      setUser(false); // not logged in
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    setUser(false);
  }, []);

  const isAdmin = user && user.roles?.includes('ADMIN');
  const isPro   = user && user.roles?.includes('PRO');
  const needsOnboarding = user && user.needsOnboarding;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe, logout, isAdmin, isPro, needsOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
