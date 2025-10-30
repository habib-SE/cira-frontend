import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Simple validation - no async, no backend calls
    const mockUsers = {
      admin: { email: 'admin@cira.com', password: 'admin123', role: 'admin', name: 'Admin User' },
      user: { email: 'user@cira.com', password: 'user123', role: 'user', name: 'John Doe' },
      doctor: { email: 'doctor@cira.com', password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
      company: { email: 'company@cira.com', password: 'company123', role: 'company', name: 'Company Admin' },
    };

    const mockUser = mockUsers[role];
    
    if (mockUser && mockUser.email === email && mockUser.password === password) {
      // Generate token
      const token = `mock_token_${Date.now()}_${role}`;
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      };

      // Store in localStorage
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);

      // After login, force onboarding flow (email confirm → plus → plans)
      navigate('/email-confirm');

      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(partial || {}) };
      try {
        localStorage.setItem('userData', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

