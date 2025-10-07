import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // Wait for authentication check to complete before redirecting
  if (loading) {
    return null; // or a minimal loading indicator
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'patient':
        return <Navigate to="/patient" replace />;
      case 'doctor':
        return <Navigate to="/doctor" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

