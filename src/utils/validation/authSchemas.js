import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['admin', 'doctor', 'patient'], 'Please select a valid role')
    .required('Role is required')
});

// Registration validation schema
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['admin', 'doctor', 'patient'], 'Please select a valid role')
    .required('Role is required'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions')
});

// Password reset validation schema
export const passwordResetSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
});

// New password validation schema
export const newPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

// Email verification schema
export const emailVerificationSchema = yup.object().shape({
  verificationCode: yup
    .string()
    .length(6, 'Verification code must be 6 digits')
    .matches(/^\d{6}$/, 'Verification code must contain only numbers')
    .required('Verification code is required')
});
