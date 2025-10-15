import { createFormicaSchema, FormicaValidators } from '../formica';
import { z } from 'zod';

// Patient profile update validation schema using Formica
export const patientProfileUpdateSchema = createFormicaSchema()
  .string('firstName', { required: true, min: 2, max: 50 })
  .string('lastName', { required: true, min: 2, max: 50 })
  .string('email', { required: true, email: true })
  .custom('phone', 
    FormicaValidators.phone().safeParse,
    'Please enter a valid phone number'
  )
  .date('dateOfBirth', { required: true, past: true })
  .enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'], { required: true })
  .object('address', {
    street: z.string().min(5, 'Street address must be at least 5 characters').max(100, 'Street address must be less than 100 characters'),
    city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City must be less than 50 characters'),
    state: z.string().min(2, 'State must be at least 2 characters').max(50, 'State must be less than 50 characters'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
    country: z.string().min(2, 'Country must be at least 2 characters').max(50, 'Country must be less than 50 characters')
  }, { required: true })
  .object('emergencyContact', {
    name: z.string().min(2, 'Emergency contact name must be at least 2 characters').max(50, 'Emergency contact name must be less than 50 characters'),
    relationship: z.string().min(2, 'Relationship must be at least 2 characters').max(50, 'Relationship must be less than 50 characters'),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  }, { required: true })
  .string('medicalHistory', { max: 2000 })
  .string('allergies', { max: 500 })
  .string('currentMedications', { max: 1000 })
  .build();

// Appointment booking validation schema using Formica
export const appointmentBookingSchema = createFormicaSchema()
  .string('doctorId', { required: true })
  .date('appointmentDate', { required: true, future: true })
  .string('appointmentTime', { required: true })
  .enum('type', ['consultation', 'follow-up', 'check-up', 'emergency'], { required: true })
  .string('reason', { required: true, min: 10, max: 500 })
  .string('symptoms', { required: true, min: 10, max: 1000 })
  .enum('urgency', ['low', 'normal', 'high', 'urgent'], { required: true })
  .enum('preferredContactMethod', ['phone', 'email', 'sms'], { required: true })
  .build();

// Medical record request validation schema using Formica
export const medicalRecordRequestSchema = createFormicaSchema()
  .enum('recordType', ['all', 'diagnosis', 'treatment', 'lab_result', 'imaging', 'surgery', 'other'], { required: true })
  .date('dateFrom', { required: true, past: true })
  .custom('dateTo', 
    (value, formData) => value >= formData.dateFrom,
    'End date must be after start date'
  )
  .string('reason', { required: true, min: 10, max: 500 })
  .enum('deliveryMethod', ['email', 'mail', 'pickup'], { required: true })
  .build();

// Prescription refill request validation schema using Formica
export const prescriptionRefillSchema = createFormicaSchema()
  .string('prescriptionId', { required: true })
  .number('quantity', { required: true, min: 1, max: 10 })
  .string('reason', { required: true, min: 10, max: 500 })
  .object('pharmacy', {
    name: z.string().min(2, 'Pharmacy name must be at least 2 characters').max(100, 'Pharmacy name must be less than 100 characters'),
    address: z.string().min(5, 'Pharmacy address must be at least 5 characters').max(200, 'Pharmacy address must be less than 200 characters'),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  }, { required: true })
  .build();

// Message to doctor validation schema using Formica
export const messageToDoctorSchema = createFormicaSchema()
  .string('doctorId', { required: true })
  .string('subject', { required: true, min: 5, max: 200 })
  .string('message', { required: true, min: 10, max: 2000 })
  .enum('priority', ['low', 'normal', 'high', 'urgent'], { required: true })
  .array('attachments', z.string(), { max: 5 })
  .build();

// Patient settings validation schema using Formica
export const patientSettingsSchema = createFormicaSchema()
  .boolean('emailNotifications')
  .boolean('smsNotifications')
  .boolean('appointmentReminders')
  .number('reminderTime', { min: 1, max: 168 })
  .enum('preferredContactMethod', ['phone', 'email', 'sms'], { required: true })
  .string('timezone', { required: true })
  .string('language', { required: true })
  .object('privacySettings', {
    shareDataWithDoctors: z.boolean(),
    allowMarketingEmails: z.boolean(),
    allowDataAnalytics: z.boolean()
  })
  .build();

// Insurance information validation schema using Formica
export const insuranceSchema = createFormicaSchema()
  .string('providerName', { required: true, min: 2, max: 100 })
  .string('policyNumber', { required: true, min: 5, max: 50 })
  .string('groupNumber', { max: 50 })
  .date('effectiveDate', { required: true, past: true })
  .custom('expirationDate', 
    (value, formData) => value >= formData.effectiveDate,
    'Expiration date must be after effective date'
  )
  .number('copayAmount', { min: 0, max: 1000 })
  .number('deductibleAmount', { min: 0, max: 10000 })
  .build();

// Export all schemas
export const patientFormicaSchemas = {
  patientProfileUpdate: patientProfileUpdateSchema,
  appointmentBooking: appointmentBookingSchema,
  medicalRecordRequest: medicalRecordRequestSchema,
  prescriptionRefill: prescriptionRefillSchema,
  messageToDoctor: messageToDoctorSchema,
  patientSettings: patientSettingsSchema,
  insurance: insuranceSchema
};
