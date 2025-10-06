import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const ValidatedForm = ({ 
  schema, 
  onSubmit, 
  onError, 
  defaultValues = {}, 
  children, 
  className = '',
  ...props 
}) => {
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
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const handleFormSubmit = (data) => {
    try {
      onSubmit(data);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`validated-form ${className}`}
      {...props}
    >
      {children({
        register,
        errors,
        isSubmitting,
        isValid,
        watch,
        setValue,
        reset,
        clearErrors,
        setError,
        trigger
      })}
    </form>
  );
};

export default ValidatedForm;
