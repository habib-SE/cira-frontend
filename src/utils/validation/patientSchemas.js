import * as yup from 'yup';

// Patient profile update validation schema
export const patientProfileUpdateSchema = yup.object().shape({
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
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender')
    .required('Gender is required'),
  address: yup.object().shape({
    street: yup
      .string()
      .min(5, 'Street address must be at least 5 characters')
      .max(100, 'Street address must be less than 100 characters')
      .required('Street address is required'),
    city: yup
      .string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters')
      .required('City is required'),
    state: yup
      .string()
      .min(2, 'State must be at least 2 characters')
      .max(50, 'State must be less than 50 characters')
      .required('State is required'),
    zipCode: yup
      .string()
      .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
      .required('ZIP code is required'),
    country: yup
      .string()
      .min(2, 'Country must be at least 2 characters')
      .max(50, 'Country must be less than 50 characters')
      .required('Country is required')
  }),
  emergencyContact: yup.object().shape({
    name: yup
      .string()
      .min(2, 'Emergency contact name must be at least 2 characters')
      .max(50, 'Emergency contact name must be less than 50 characters')
      .required('Emergency contact name is required'),
    relationship: yup
      .string()
      .min(2, 'Relationship must be at least 2 characters')
      .max(50, 'Relationship must be less than 50 characters')
      .required('Relationship is required'),
    phone: yup
      .string()
      .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
      .required('Emergency contact phone is required')
  }),
  medicalHistory: yup
    .string()
    .max(2000, 'Medical history must be less than 2000 characters'),
  allergies: yup
    .string()
    .max(500, 'Allergies must be less than 500 characters'),
  currentMedications: yup
    .string()
    .max(1000, 'Current medications must be less than 1000 characters')
});

// Appointment booking validation schema
export const appointmentBookingSchema = yup.object().shape({
  doctorId: yup
    .string()
    .required('Doctor is required'),
  appointmentDate: yup
    .date()
    .min(new Date(), 'Appointment date cannot be in the past')
    .required('Appointment date is required'),
  appointmentTime: yup
    .string()
    .required('Appointment time is required'),
  type: yup
    .string()
    .oneOf(['consultation', 'follow-up', 'check-up', 'emergency'], 'Please select a valid appointment type')
    .required('Appointment type is required'),
  reason: yup
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .required('Reason is required'),
  symptoms: yup
    .string()
    .min(10, 'Symptoms must be at least 10 characters')
    .max(1000, 'Symptoms must be less than 1000 characters')
    .required('Symptoms are required'),
  urgency: yup
    .string()
    .oneOf(['low', 'normal', 'high', 'urgent'], 'Please select a valid urgency level')
    .required('Urgency level is required'),
  preferredContactMethod: yup
    .string()
    .oneOf(['phone', 'email', 'sms'], 'Please select a valid contact method')
    .required('Preferred contact method is required')
});

// Medical record request validation schema
export const medicalRecordRequestSchema = yup.object().shape({
  recordType: yup
    .string()
    .oneOf(['all', 'diagnosis', 'treatment', 'lab_result', 'imaging', 'surgery', 'other'], 'Please select a valid record type')
    .required('Record type is required'),
  dateFrom: yup
    .date()
    .max(new Date(), 'Start date cannot be in the future')
    .required('Start date is required'),
  dateTo: yup
    .date()
    .min(yup.ref('dateFrom'), 'End date must be after start date')
    .max(new Date(), 'End date cannot be in the future')
    .required('End date is required'),
  reason: yup
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .required('Reason is required'),
  deliveryMethod: yup
    .string()
    .oneOf(['email', 'mail', 'pickup'], 'Please select a valid delivery method')
    .required('Delivery method is required')
});

// Prescription refill request validation schema
export const prescriptionRefillSchema = yup.object().shape({
  prescriptionId: yup
    .string()
    .required('Prescription is required'),
  quantity: yup
    .number()
    .min(1, 'Quantity must be at least 1')
    .max(10, 'Quantity cannot exceed 10')
    .required('Quantity is required'),
  reason: yup
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .required('Reason is required'),
  pharmacy: yup.object().shape({
    name: yup
      .string()
      .min(2, 'Pharmacy name must be at least 2 characters')
      .max(100, 'Pharmacy name must be less than 100 characters')
      .required('Pharmacy name is required'),
    address: yup
      .string()
      .min(5, 'Pharmacy address must be at least 5 characters')
      .max(200, 'Pharmacy address must be less than 200 characters')
      .required('Pharmacy address is required'),
    phone: yup
      .string()
      .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
      .required('Pharmacy phone is required')
  })
});

// Message to doctor validation schema
export const messageToDoctorSchema = yup.object().shape({
  doctorId: yup
    .string()
    .required('Doctor is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .required('Message is required'),
  priority: yup
    .string()
    .oneOf(['low', 'normal', 'high', 'urgent'], 'Please select a valid priority')
    .required('Priority is required'),
  attachments: yup
    .array()
    .of(yup.string())
    .max(5, 'Maximum 5 attachments allowed')
});

// Patient settings validation schema
export const patientSettingsSchema = yup.object().shape({
  emailNotifications: yup
    .boolean(),
  smsNotifications: yup
    .boolean(),
  appointmentReminders: yup
    .boolean(),
  reminderTime: yup
    .number()
    .min(1, 'Reminder time must be at least 1 hour')
    .max(168, 'Reminder time cannot exceed 1 week')
    .when('appointmentReminders', {
      is: true,
      then: yup.number().required('Reminder time is required when reminders are enabled'),
      otherwise: yup.number()
    }),
  preferredContactMethod: yup
    .string()
    .oneOf(['phone', 'email', 'sms'], 'Please select a valid contact method')
    .required('Preferred contact method is required'),
  timezone: yup
    .string()
    .required('Timezone is required'),
  language: yup
    .string()
    .required('Language is required'),
  privacySettings: yup.object().shape({
    shareDataWithDoctors: yup.boolean(),
    allowMarketingEmails: yup.boolean(),
    allowDataAnalytics: yup.boolean()
  })
});

// Insurance information validation schema
export const insuranceSchema = yup.object().shape({
  providerName: yup
    .string()
    .min(2, 'Provider name must be at least 2 characters')
    .max(100, 'Provider name must be less than 100 characters')
    .required('Provider name is required'),
  policyNumber: yup
    .string()
    .min(5, 'Policy number must be at least 5 characters')
    .max(50, 'Policy number must be less than 50 characters')
    .required('Policy number is required'),
  groupNumber: yup
    .string()
    .max(50, 'Group number must be less than 50 characters'),
  effectiveDate: yup
    .date()
    .max(new Date(), 'Effective date cannot be in the future')
    .required('Effective date is required'),
  expirationDate: yup
    .date()
    .min(yup.ref('effectiveDate'), 'Expiration date must be after effective date')
    .required('Expiration date is required'),
  copayAmount: yup
    .number()
    .min(0, 'Copay amount cannot be negative')
    .max(1000, 'Copay amount cannot exceed $1,000'),
  deductibleAmount: yup
    .number()
    .min(0, 'Deductible amount cannot be negative')
    .max(10000, 'Deductible amount cannot exceed $10,000')
});
