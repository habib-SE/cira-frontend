import React from 'react';

const PageHeader = ({ 
  title, 
  description, 
  actionButton,
  className = ""
}) => {
  return (
    <div className={`mb-6 ${className} pl-12 pr-7 pt-6`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 text-sm lg:text-base">{description}</p>
          )}
        </div>
        {actionButton && (
          <div className="flex items-center justify-center lg:justify-end">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

