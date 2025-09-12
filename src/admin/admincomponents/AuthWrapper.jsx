import React from 'react';

const AuthWrapper = ({ children }) => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
