import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Ensure loader shows for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Hide loader only when both auth is done AND minimum time has elapsed
  useEffect(() => {
    if (!loading && minTimeElapsed) {
      setShowLoader(false);
    }
  }, [loading, minTimeElapsed]);

  // Wait for authentication check to complete before redirecting
  if (showLoader) {
    return (
      <div className="relative">
        {/* Render children normally in background */}
        <div className="blur-[1px]">
          {children}
        </div>
        {/* Blur overlay with loader */}
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-[9999]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500"></div>
            <p className="text-gray-700 font-medium text-lg">Authenticating...</p>
          </div>
        </div>
      </div>
    );
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

