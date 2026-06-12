import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import api from '../services/api'; // using direct api call for /auth/me for now, or we can add it to authService

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount or tab focus
  const validateSession = useCallback(async () => {
    const token = authService.getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // We verify the token by fetching the user profile
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data);
      } else {
        throw new Error('Invalid session');
      }
    } catch (error) {
      console.warn('Session validation failed:', error);
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();

    // Listen for cross-tab or interceptor auth events
    const handleLogin = () => validateSession();
    const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
    };
    const handleUnauthorized = () => {
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [validateSession]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      setIsAuthenticated(true);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data.token) {
      // Automatically log the user in by saving the token
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      setUser(res.data.user);
      window.dispatchEvent(new Event('auth:login'));
    }
    return res;
  };

  const logout = () => {
    authService.logout(); // This dispatches auth:logout, which our listener catches
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
