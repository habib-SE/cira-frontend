import * as yup from 'yup';

// User management validation schemas
export const userSchema = yup.object().shape({
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
  role: yup
    .string()
    .oneOf(['admin', 'doctor', 'patient'], 'Please select a valid role')
    .required('Role is required'),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'pending', 'suspended'], 'Please select a valid status')
    .required('Status is required'),
  dateOfBirth: yup
    .date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required')
});

// Doctor profile validation schema
export const doctorProfileSchema = yup.object().shape({
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
  specialty: yup
    .string()
    .min(2, 'Specialty must be at least 2 characters')
    .max(100, 'Specialty must be less than 100 characters')
    .required('Specialty is required'),
  licenseNumber: yup
    .string()
    .min(5, 'License number must be at least 5 characters')
    .max(20, 'License number must be less than 20 characters')
    .required('License number is required'),
  experience: yup
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years')
    .required('Experience is required'),
  education: yup
    .string()
    .min(10, 'Education must be at least 10 characters')
    .max(500, 'Education must be less than 500 characters')
    .required('Education is required'),
  bio: yup
    .string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must be less than 1000 characters')
    .required('Bio is required'),
  consultationFee: yup
    .number()
    .min(0, 'Consultation fee cannot be negative')
    .max(10000, 'Consultation fee cannot exceed $10,000')
    .required('Consultation fee is required'),
  languages: yup
    .array()
    .min(1, 'Please select at least one language')
    .required('Languages are required'),
  availability: yup
    .object().shape({
      monday: yup.object().shape({
        start: yup.string().required('Monday start time is required'),
        end: yup.string().required('Monday end time is required')
      }),
      tuesday: yup.object().shape({
        start: yup.string().required('Tuesday start time is required'),
        end: yup.string().required('Tuesday end time is required')
      }),
      wednesday: yup.object().shape({
        start: yup.string().required('Wednesday start time is required'),
        end: yup.string().required('Wednesday end time is required')
      }),
      thursday: yup.object().shape({
        start: yup.string().required('Thursday start time is required'),
        end: yup.string().required('Thursday end time is required')
      }),
      friday: yup.object().shape({
        start: yup.string().required('Friday start time is required'),
        end: yup.string().required('Friday end time is required')
      }),
      saturday: yup.object().shape({
        start: yup.string().required('Saturday start time is required'),
        end: yup.string().required('Saturday end time is required')
      }),
      sunday: yup.object().shape({
        start: yup.string().required('Sunday start time is required'),
        end: yup.string().required('Sunday end time is required')
      })
    })
    .required('Availability is required')
});

// Appointment validation schema
export const appointmentSchema = yup.object().shape({
  patientId: yup
    .string()
    .required('Patient is required'),
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
  duration: yup
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours')
    .required('Duration is required'),
  type: yup
    .string()
    .oneOf(['consultation', 'follow-up', 'check-up', 'emergency'], 'Please select a valid appointment type')
    .required('Appointment type is required'),
  reason: yup
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .required('Reason is required'),
  notes: yup
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
});

// Payment validation schema
export const paymentSchema = yup.object().shape({
  amount: yup
    .number()
    .min(0.01, 'Amount must be greater than 0')
    .max(100000, 'Amount cannot exceed $100,000')
    .required('Amount is required'),
  paymentMethod: yup
    .string()
    .oneOf(['credit_card', 'debit_card', 'bank_transfer', 'paypal'], 'Please select a valid payment method')
    .required('Payment method is required'),
  description: yup
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(200, 'Description must be less than 200 characters')
    .required('Description is required'),
  patientId: yup
    .string()
    .required('Patient is required'),
  doctorId: yup
    .string()
    .required('Doctor is required')
});

// Settings validation schema
export const settingsSchema = yup.object().shape({
  platformName: yup
    .string()
    .min(2, 'Platform name must be at least 2 characters')
    .max(100, 'Platform name must be less than 100 characters')
    .required('Platform name is required'),
  platformEmail: yup
    .string()
    .email('Please enter a valid email address')
    .required('Platform email is required'),
  platformPhone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .required('Platform phone is required'),
  timezone: yup
    .string()
    .required('Timezone is required'),
  currency: yup
    .string()
    .oneOf(['USD', 'EUR', 'GBP', 'CAD', 'AUD'], 'Please select a valid currency')
    .required('Currency is required'),
  maxAppointmentDuration: yup
    .number()
    .min(15, 'Maximum appointment duration must be at least 15 minutes')
    .max(480, 'Maximum appointment duration cannot exceed 8 hours')
    .required('Maximum appointment duration is required'),
  appointmentBufferTime: yup
    .number()
    .min(0, 'Buffer time cannot be negative')
    .max(60, 'Buffer time cannot exceed 60 minutes')
    .required('Appointment buffer time is required')
});
