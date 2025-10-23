import { createFormicaSchema, FormicaValidators } from '../formica';

// Common field schemas for reusability
export const commonFieldSchemas = {
  // Basic personal info fields
  firstName: () => createFormicaSchema().string('firstName', { required: true, min: 2, max: 50 }).build().shape.firstName,
  lastName: () => createFormicaSchema().string('lastName', { required: true, min: 2, max: 50 }).build().shape.lastName,
  fullName: () => createFormicaSchema().string('fullName', { required: true, min: 2, max: 100 }).build().shape.fullName,
  
  // Contact fields
  email: () => createFormicaSchema().string('email', { required: true, email: true }).build().shape.email,
  phone: () => createFormicaSchema().custom('phone', FormicaValidators.phone().safeParse, 'Please enter a valid phone number').build().shape.phone,
  
  // Authentication fields
  password: () => createFormicaSchema().custom('password', FormicaValidators.password().safeParse, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').build().shape.password,
  confirmPassword: (originalPasswordField = 'password') => createFormicaSchema().custom('confirmPassword', (value, formData) => value === formData[originalPasswordField], 'Passwords must match').build().shape.confirmPassword,
  
  // Role and status fields
  userRole: () => createFormicaSchema().enum('role', ['admin', 'doctor', 'patient'], { required: true }).build().shape.role,
  userStatus: () => createFormicaSchema().enum('status', ['active', 'inactive', 'pending', 'suspended'], { required: true }).build().shape.status,
  
  // Date fields
  dateOfBirth: () => createFormicaSchema().date('dateOfBirth', { required: true, max: new Date() }).build().shape.dateOfBirth,
  appointmentDate: () => createFormicaSchema().date('appointmentDate', { required: true, min: new Date() }).build().shape.appointmentDate,
  
  // Common validation patterns
  requiredString: (fieldName, min = 1, max = 255) => createFormicaSchema().string(fieldName, { required: true, min, max }).build().shape[fieldName],
  optionalString: (fieldName, max = 255) => createFormicaSchema().string(fieldName, { max }).build().shape[fieldName],
  requiredNumber: (fieldName, min = 0, max = 999999) => createFormicaSchema().number(fieldName, { required: true, min, max }).build().shape[fieldName],
  optionalNumber: (fieldName, min = 0, max = 999999) => createFormicaSchema().number(fieldName, { min, max }).build().shape[fieldName],
};

// Common object schemas
export const commonObjectSchemas = {
  // Address object
  address: () => createFormicaSchema().object('address', {
    street: commonFieldSchemas.requiredString('street', 5, 100),
    city: commonFieldSchemas.requiredString('city', 2, 50),
    state: commonFieldSchemas.requiredString('state', 2, 50),
    zipCode: createFormicaSchema().string('zipCode', { required: true, pattern: /^\d{5}(-\d{4})?$/, patternMessage: 'Please enter a valid ZIP code' }).build().shape.zipCode,
    country: commonFieldSchemas.requiredString('country', 2, 50),
  }).build().shape.address,
  
  // Emergency contact object
  emergencyContact: () => createFormicaSchema().object('emergencyContact', {
    name: commonFieldSchemas.requiredString('name', 2, 50),
    relationship: commonFieldSchemas.requiredString('relationship', 2, 50),
    phone: commonFieldSchemas.phone(),
  }).build().shape.emergencyContact,
  
  // Pharmacy object
  pharmacy: () => createFormicaSchema().object('pharmacy', {
    name: commonFieldSchemas.requiredString('name', 2, 100),
    address: commonFieldSchemas.requiredString('address', 5, 200),
    phone: commonFieldSchemas.phone(),
  }).build().shape.pharmacy,
};

// Pre-built common form schemas
export const commonFormSchemas = {
  // Basic user profile (reusable across all user types)
  basicUserProfile: createFormicaSchema()
    .string('firstName', { required: true, min: 2, max: 50 })
    .string('lastName', { required: true, min: 2, max: 50 })
    .string('email', { required: true, email: true })
    .custom('phone', FormicaValidators.phone().safeParse, 'Please enter a valid phone number')
    .date('dateOfBirth', { required: true, max: new Date() })
    .build(),
  
  // Contact information
  contactInfo: createFormicaSchema()
    .string('email', { required: true, email: true })
    .custom('phone', FormicaValidators.phone().safeParse, 'Please enter a valid phone number')
    .build(),
  
  // Password change
  passwordChange: createFormicaSchema()
    .custom('currentPassword', FormicaValidators.password().safeParse, 'Current password is invalid')
    .custom('newPassword', FormicaValidators.password().safeParse, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .custom('confirmPassword', (value, formData) => formData && formData.newPassword ? value === formData.newPassword : true, 'Passwords must match')
    .build(),
};
