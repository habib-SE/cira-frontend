import { createFormicaSchema, FormicaValidators } from '../formica';
import { commonFormSchemas } from './commonSchemas';

// Login validation schema using Formica
export const loginSchema = createFormicaSchema()
  .string('email', { required: true, email: true })
  .string('password', { required: true, min: 6 })
  .enum('role', ['admin', 'doctor', 'patient'], { required: true })
  .build();

// Registration validation schema using Formica - optimized with common patterns
export const registerSchema = createFormicaSchema()
  .string('firstName', { required: true, min: 2, max: 50 })
  .string('lastName', { required: true, min: 2, max: 50 })
  .string('email', { required: true, email: true })
  .custom('password', 
    FormicaValidators.password().safeParse,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
  .custom('confirmPassword', 
    (value, formData) => value === formData.password,
    'Passwords must match'
  )
  .enum('role', ['admin', 'doctor', 'patient'], { required: true })
  .custom('phone', 
    FormicaValidators.phone().safeParse,
    'Please enter a valid phone number'
  )
  .date('dateOfBirth', { required: true, max: new Date() })
  .boolean('terms', { required: true, message: 'You must accept the terms and conditions' })
  .build();

// Password reset validation schema using Formica
export const passwordResetSchema = createFormicaSchema()
  .string('email', { required: true, email: true })
  .build();

// New password validation schema using Formica - using common pattern
export const newPasswordSchema = createFormicaSchema()
  .custom('password', 
    FormicaValidators.password().safeParse,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
  .custom('confirmPassword', 
    (value, formData) => value === formData.password,
    'Passwords must match'
  )
  .build();

// Email verification schema using Formica
export const emailVerificationSchema = createFormicaSchema()
  .string('verificationCode', { 
    required: true, 
    regex: /^\d{6}$/,
    message: 'Verification code must be 6 digits'
  })
  .build();

// Export all schemas
export const authFormicaSchemas = {
  login: loginSchema,
  register: registerSchema,
  passwordReset: passwordResetSchema,
  newPassword: newPasswordSchema,
  emailVerification: emailVerificationSchema,
  // Re-export common schemas for convenience
  ...commonFormSchemas
};
