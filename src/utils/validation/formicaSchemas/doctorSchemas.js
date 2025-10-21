import { createFormicaSchema, FormicaValidators } from '../formica';
import { z } from 'zod';

// Doctor profile update validation schema using Formica
export const doctorProfileUpdateSchema = createFormicaSchema()
  .string('firstName', { required: true, min: 2, max: 50 })
  .string('lastName', { required: true, min: 2, max: 50 })
  .string('email', { required: true, email: true })
  .custom('phone', 
    FormicaValidators.phone().safeParse,
    'Please enter a valid phone number'
  )
  .string('specialty', { required: true, min: 2, max: 100 })
  .string('licenseNumber', { required: true, min: 5, max: 20 })
  .number('experience', { required: true, min: 0, max: 50 })
  .string('bio', { required: true, min: 50, max: 1000 })
  .number('consultationFee', { required: true, min: 0, max: 10000 })
  .array('languages', z.string(), { required: true, min: 1 })
  .build();

// Doctor schedule validation schema using Formica
export const doctorScheduleSchema = createFormicaSchema()
  .object('monday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('tuesday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('wednesday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('thursday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('friday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('saturday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .object('sunday', {
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional()
  })
  .build();

// Prescription validation schema using Formica
export const prescriptionSchema = createFormicaSchema()
  .string('patientId', { required: true })
  .string('medicationName', { required: true, min: 2, max: 100 })
  .string('dosage', { required: true, min: 1, max: 50 })
  .string('frequency', { required: true, min: 1, max: 50 })
  .string('duration', { required: true, min: 1, max: 50 })
  .string('instructions', { required: true, min: 10, max: 500 })
  .date('startDate', { required: true, future: true })
  .custom('endDate', 
    (value, formData) => formData && formData.startDate ? value >= formData.startDate : true,
    'End date must be after start date'
  )
  .build();

// Medical record validation schema using Formica
export const medicalRecordSchema = createFormicaSchema()
  .string('patientId', { required: true })
  .enum('recordType', ['diagnosis', 'treatment', 'lab_result', 'imaging', 'surgery', 'other'], { required: true })
  .string('title', { required: true, min: 5, max: 200 })
  .string('description', { required: true, min: 20, max: 2000 })
  .date('date', { required: true, past: true })
  .array('attachments', z.string(), { max: 10 })
  .build();

// Message validation schema using Formica
export const messageSchema = createFormicaSchema()
  .string('recipientId', { required: true })
  .string('subject', { required: true, min: 5, max: 200 })
  .string('message', { required: true, min: 10, max: 2000 })
  .enum('priority', ['low', 'normal', 'high', 'urgent'], { required: true })
  .build();

// Doctor settings validation schema using Formica
export const doctorSettingsSchema = createFormicaSchema()
  .number('consultationFee', { required: true, min: 0, max: 10000 })
  .number('appointmentDuration', { required: true, min: 15, max: 240 })
  .number('bufferTime', { required: true, min: 0, max: 60 })
  .boolean('autoConfirmAppointments')
  .boolean('sendReminders')
  .number('reminderTime', { min: 1, max: 168 })
  .string('timezone', { required: true })
  .string('language', { required: true })
  .build();

// Doctor registration validation schema using Formica
export const doctorRegistrationSchema = createFormicaSchema()
  .string('firstName', { required: true, min: 2, max: 50 })
  .string('lastName', { required: true, min: 2, max: 50 })
  .string('email', { required: true, email: true })
  .string('password', { required: true, min: 6 })
  .custom('confirmPassword', 
    (value, formData) => formData && formData.password ? value === formData.password : true,
    'Passwords must match'
  )
  .string('specialty', { required: true, min: 2, max: 100 })
  .string('licenseNumber', { required: true, min: 5, max: 20 })
  .string('phone', { required: true, min: 10 })
  .number('experience', { required: false, min: 0, max: 50 })
  .string('bio', { required: false, min: 10, max: 500 })
  .enum('consultationType', ['online', 'in-person', 'both'], { required: false })
  .number('consultationFee', { required: false, min: 0, max: 10000 })
  .number('appointmentDuration', { required: false, min: 15, max: 240 })
  .array('availability', z.string(), { required: false, min: 0 })
  .array('languages', z.string(), { required: false, min: 0 })
  .build();

// Export all schemas
export const doctorFormicaSchemas = {
  doctorRegistration: doctorRegistrationSchema,
  doctorProfileUpdate: doctorProfileUpdateSchema,
  doctorSchedule: doctorScheduleSchema,
  prescription: prescriptionSchema,
  medicalRecord: medicalRecordSchema,
  message: messageSchema,
  doctorSettings: doctorSettingsSchema
};
