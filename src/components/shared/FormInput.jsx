import React from 'react';

const FormInput = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  icon: Icon,
  className = "",
  inputClassName = "",
  ...props
}) => {
  const baseInputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500";
  const inputClasses = Icon ? `pl-10 pr-4 ${baseInputClasses}` : baseInputClasses;
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClasses} ${inputClassName}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;

