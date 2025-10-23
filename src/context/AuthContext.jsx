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

  const login = async (email, password, role) => {
    try {
      // In production, this would be an API call to your backend
      // For now, we'll simulate authentication
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user validation (replace with actual API call)
      const mockUsers = {
        admin: { email: 'admin@cira.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        patient: { email: 'patient@cira.com', password: 'patient123', role: 'patient', name: 'John Doe' },
        doctor: { email: 'doctor@cira.com', password: 'doctor123', role: 'doctor', name: 'Dr. Smith' },
        company: { email: 'company@example.com', password: 'password', role: 'company', name: 'Company Admin' },
      };

      const mockUser = mockUsers[role];
      
      if (mockUser && mockUser.email === email && mockUser.password === password) {
        // Generate mock token (in production, this comes from backend)
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

        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'patient':
            navigate('/patient');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'company':
            navigate('/company');
            break;
          default:
            navigate('/login');
        }

        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
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

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
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

