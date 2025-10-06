import React from 'react';

const FormCheckbox = ({ 
  label, 
  name, 
  register, 
  errors, 
  required = false,
  className = '',
  ...props 
}) => {
  const hasError = !!errors[name];
  const errorMessage = errors[name]?.message;

  return (
    <div className={`form-field ${className}`}>
      <div className="flex items-center">
        <input
          id={name}
          type="checkbox"
          className={`form-checkbox ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'}`}
          {...register(name)}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          {...props}
        />
        {label && (
          <label htmlFor={name} className="form-checkbox-label ml-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {hasError && (
        <p id={`${name}-error`} className="error-message text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox;
