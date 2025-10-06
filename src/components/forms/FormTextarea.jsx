import React from 'react';

const FormTextarea = ({ 
  label, 
  name, 
  register, 
  errors, 
  placeholder, 
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`form-textarea ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-pink-500 focus:ring-pink-500'}`}
        {...register(name)}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      />
      
      {hasError && (
        <p id={`${name}-error`} className="error-message text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
