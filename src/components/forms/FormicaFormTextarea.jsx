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
        className={`form-textarea ${hasError ? 'error' : ''}`}
        {...fieldProps}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      />
      
      {/* Error message removed - shown at top level instead */}
    </div>
  );
});

FormicaFormTextarea.displayName = 'FormicaFormTextarea';

export default FormicaFormTextarea;
