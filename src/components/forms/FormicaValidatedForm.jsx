import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormicaValidatedForm = ({ 
  schema, 
  onSubmit, 
  onError, 
  defaultValues = {}, 
  children, 
  className = '',
  mode = 'onChange',
  ...props 
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    trigger
  } = form;

  const handleFormSubmit = (data) => {
    try {
      onSubmit(data);
    } catch (error) {
      onError?.(error);
    }
  };

  // Optimized helper functions with memoization
  const getFieldProps = React.useCallback((fieldName, options = {}) => {
    const hasError = !!errors[fieldName];
    
    return {
      ...register(fieldName, options),
      className: `form-input ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-pink-500 focus:ring-pink-500'}`,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `${fieldName}-error` : undefined
    };
  }, [register, errors]);

  const getFieldError = React.useCallback((fieldName) => {
    return errors[fieldName]?.message;
  }, [errors]);

  const hasFieldError = React.useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  // Memoized form context to prevent unnecessary re-renders
  const formContext = React.useMemo(() => ({
    register,
    errors,
    isSubmitting,
    isValid,
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    trigger,
    getFieldProps,
    getFieldError,
    hasFieldError
  }), [
    register,
    errors,
    isSubmitting,
    isValid,
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    trigger,
    getFieldProps,
    getFieldError,
    hasFieldError
  ]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`formica-validated-form ${className}`}
      {...props}
    >
      {children(formContext)}
    </form>
  );
};

export default FormicaValidatedForm;
