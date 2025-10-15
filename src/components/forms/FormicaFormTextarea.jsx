import React from 'react';

const FormicaFormTextarea = React.memo(({ 
  label, 
  name, 
  register, 
  errors, 
  placeholder, 
  required = false,
  rows = 4,
  className = '',
  getFieldProps,
  getFieldError,
  hasFieldError,
  ...props 
}) => {
  const hasError = hasFieldError ? hasFieldError(name) : !!errors[name];
  const errorMessage = getFieldError ? getFieldError(name) : errors[name]?.message;
  const fieldProps = getFieldProps ? getFieldProps(name) : register(name);

  return (
    <div className={`formica-field ${className}`}>
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
        {...fieldProps}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      />
      
      {hasError && (
        <p id={`${name}-error`} className="formica-error text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

FormicaFormTextarea.displayName = 'FormicaFormTextarea';

export default FormicaFormTextarea;
