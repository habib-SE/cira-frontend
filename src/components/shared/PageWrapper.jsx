import React from 'react';

const PageWrapper = ({ 
  children, 
  className = "",
  background = "pink-50",
  padding = "p-6",
  minHeight = "min-h-screen"
}) => {
  return (
    <div className={`${padding} space-y-6 bg-${background} ${minHeight} ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;

