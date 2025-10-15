import { createFormicaSchema, FormicaValidators } from '../formica';
import { z } from 'zod';

// User management validation schema using Formica
export const userSchema = createFormicaSchema()
  .string('firstName', { required: true, min: 2, max: 50 })
  .string('lastName', { required: true, min: 2, max: 50 })
  .string('email', { required: true, email: true })
  .custom('phone', 
    FormicaValidators.phone().safeParse,
    'Please enter a valid phone number'
  )
  .enum('role', ['admin', 'doctor', 'patient'], { required: true })
  .enum('status', ['active', 'inactive', 'pending', 'suspended'], { required: true })
  .date('dateOfBirth', { required: true, past: true })
  .build();

// Doctor profile validation schema using Formica
export const doctorProfileSchema = createFormicaSchema()
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
  .string('education', { required: true, min: 10, max: 500 })
  .string('bio', { required: true, min: 50, max: 1000 })
  .number('consultationFee', { required: true, min: 0, max: 10000 })
  .array('languages', z.string(), { required: true, min: 1 })
  .object('availability', {
    monday: z.object({
      start: z.string({ required_error: 'Monday start time is required' }),
      end: z.string({ required_error: 'Monday end time is required' })
    }),
    tuesday: z.object({
      start: z.string({ required_error: 'Tuesday start time is required' }),
      end: z.string({ required_error: 'Tuesday end time is required' })
    }),
    wednesday: z.object({
      start: z.string({ required_error: 'Wednesday start time is required' }),
      end: z.string({ required_error: 'Wednesday end time is required' })
    }),
    thursday: z.object({
      start: z.string({ required_error: 'Thursday start time is required' }),
      end: z.string({ required_error: 'Thursday end time is required' })
    }),
    friday: z.object({
      start: z.string({ required_error: 'Friday start time is required' }),
      end: z.string({ required_error: 'Friday end time is required' })
    }),
    saturday: z.object({
      start: z.string({ required_error: 'Saturday start time is required' }),
      end: z.string({ required_error: 'Saturday end time is required' })
    }),
    sunday: z.object({
      start: z.string({ required_error: 'Sunday start time is required' }),
      end: z.string({ required_error: 'Sunday end time is required' })
    })
  }, { required: true })
  .build();

// Appointment validation schema using Formica
export const appointmentSchema = createFormicaSchema()
  .string('patientId', { required: true })
  .string('doctorId', { required: true })
  .date('appointmentDate', { required: true, future: true })
  .string('appointmentTime', { required: true })
  .number('duration', { required: true, min: 15, max: 240 })
  .enum('type', ['consultation', 'follow-up', 'check-up', 'emergency'], { required: true })
  .string('reason', { required: true, min: 10, max: 500 })
  .string('notes', { max: 1000 })
  .build();

// Payment validation schema using Formica
export const paymentSchema = createFormicaSchema()
  .number('amount', { required: true, min: 0.01, max: 100000 })
  .enum('paymentMethod', ['credit_card', 'debit_card', 'bank_transfer', 'paypal'], { required: true })
  .string('description', { required: true, min: 5, max: 200 })
  .string('patientId', { required: true })
  .string('doctorId', { required: true })
  .build();

// Settings validation schema using Formica
export const settingsSchema = createFormicaSchema()
  .string('platformName', { required: true, min: 2, max: 100 })
  .string('platformEmail', { required: true, email: true })
  .custom('platformPhone', 
    FormicaValidators.phone().safeParse,
    'Please enter a valid phone number'
  )
  .string('timezone', { required: true })
  .enum('currency', ['USD', 'EUR', 'GBP', 'CAD', 'AUD'], { required: true })
  .number('maxAppointmentDuration', { required: true, min: 15, max: 480 })
  .number('appointmentBufferTime', { required: true, min: 0, max: 60 })
  .build();

// Export all schemas
export const adminFormicaSchemas = {
  user: userSchema,
  doctorProfile: doctorProfileSchema,
  appointment: appointmentSchema,
  payment: paymentSchema,
  settings: settingsSchema
};
