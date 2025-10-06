import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// Custom validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return passwordRegex.test(password);
};

export const validateDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const validateFutureDate = (date) => {
  return validateDate(date) && date > new Date();
};

export const validatePastDate = (date) => {
  return validateDate(date) && date < new Date();
};

// Form validation hook
export const useFormValidation = (schema, defaultValues = {}) => {
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

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isValid,
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    trigger
  };
};

// Error message formatter
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An error occurred';
};

// Field validation status
export const getFieldStatus = (fieldName, errors) => {
  if (errors[fieldName]) {
    return 'error';
  }
  return 'default';
};

// Form validation status
export const getFormStatus = (errors, isSubmitting) => {
  if (isSubmitting) {
    return 'submitting';
  }
  if (Object.keys(errors).length > 0) {
    return 'error';
  }
  return 'valid';
};

// Custom validation rules
export const validationRules = {
  required: (message = 'This field is required') => ({
    required: { value: true, message }
  }),
  email: (message = 'Please enter a valid email address') => ({
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message
    }
  }),
  phone: (message = 'Please enter a valid phone number') => ({
    pattern: {
      value: /^\+?[\d\s\-\(\)]+$/,
      message
    }
  }),
  minLength: (min, message) => ({
    minLength: { value: min, message }
  }),
  maxLength: (max, message) => ({
    maxLength: { value: max, message }
  }),
  min: (min, message) => ({
    min: { value: min, message }
  }),
  max: (max, message) => ({
    max: { value: max, message }
  }),
  pattern: (pattern, message) => ({
    pattern: { value: pattern, message }
  })
};

// Async validation helpers
export const asyncValidation = {
  checkEmailExists: async (email) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: some emails are taken
        const takenEmails = ['admin@example.com', 'doctor@example.com', 'patient@example.com'];
        resolve(!takenEmails.includes(email));
      }, 1000);
    });
  },
  
  checkUsernameExists: async (username) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: some usernames are taken
        const takenUsernames = ['admin', 'doctor', 'patient'];
        resolve(!takenUsernames.includes(username));
      }, 1000);
    });
  },
  
  validateLicenseNumber: async (licenseNumber) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: license numbers must be 6+ characters
        resolve(licenseNumber.length >= 6);
      }, 1000);
    });
  }
};

// Form field props generator
export const getFieldProps = (fieldName, register, errors, options = {}) => {
  const hasError = !!errors[fieldName];
  
  return {
    ...register(fieldName, options),
    className: `form-input ${hasError ? 'error' : ''}`,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${fieldName}-error` : undefined
  };
};

// Validation error display component props
export const getErrorProps = (fieldName, errors) => {
  const error = errors[fieldName];
  
  return {
    id: `${fieldName}-error`,
    role: 'alert',
    className: 'error-message',
    children: error ? formatErrorMessage(error) : null
  };
};

// Form submission handler
export const createSubmitHandler = (onSubmit, onError) => {
  return (data) => {
    try {
      onSubmit(data);
    } catch (error) {
      onError?.(error);
    }
  };
};

// Validation debounce helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Form reset helper
export const resetForm = (form, defaultValues = {}) => {
  form.reset(defaultValues);
  form.clearErrors();
};

// Form validation summary
export const getValidationSummary = (errors) => {
  const errorCount = Object.keys(errors).length;
  const errorFields = Object.keys(errors);
  
  return {
    hasErrors: errorCount > 0,
    errorCount,
    errorFields,
    summary: errorCount > 0 
      ? `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`
      : 'Form is valid'
  };
};
