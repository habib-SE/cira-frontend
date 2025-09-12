import React from 'react';

const InputField = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  prefix,
  showDropdown = false,
  ...props 
}) => {
  return (
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <span className="text-gray-500 text-sm font-medium">{prefix}</span>
          {showDropdown && (
            <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-4 rounded-xl border border-gray-200 
          bg-white text-gray-900 placeholder-gray-400 text-base
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
          transition-all duration-200 ease-in-out
          ${prefix ? 'pl-16' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default InputField;
