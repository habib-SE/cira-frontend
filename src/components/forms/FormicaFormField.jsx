import React from 'react';

const FormicaFormField = React.memo(({ 
  label, 
  name, 
  type = 'text', 
  register, 
  errors, 
  placeholder, 
  required = false,
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
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`form-input ${hasError ? 'error' : ''}`}
        {...fieldProps}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      />
      
      {/* Error message removed - shown at top level instead */}
    </div>
  );
});

FormicaFormField.displayName = 'FormicaFormField';

export default FormicaFormField;
