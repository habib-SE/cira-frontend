import React from 'react';

const FormicaFormSelect = React.memo(({ 
  label, 
  name, 
  register, 
  errors, 
  options = [], 
  placeholder = 'Select an option',
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
    <div className={`formica-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={name}
        className={`form-select ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-pink-500 focus:ring-pink-500'}`}
        {...fieldProps}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p id={`${name}-error`} className="formica-error text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

FormicaFormSelect.displayName = 'FormicaFormSelect';

export default FormicaFormSelect;
