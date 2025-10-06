import * as yup from 'yup';

// Doctor profile update validation schema
export const doctorProfileUpdateSchema = yup.object().shape({
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
    .required('Languages are required')
});

// Doctor schedule validation schema
export const doctorScheduleSchema = yup.object().shape({
  monday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Monday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Monday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  tuesday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Tuesday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Tuesday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  wednesday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Wednesday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Wednesday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  thursday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Thursday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Thursday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  friday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Friday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Friday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  saturday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Saturday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Saturday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  }),
  sunday: yup.object().shape({
    isAvailable: yup.boolean(),
    startTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Sunday start time is required'),
      otherwise: yup.string()
    }),
    endTime: yup.string().when('isAvailable', {
      is: true,
      then: yup.string().required('Sunday end time is required'),
      otherwise: yup.string()
    }),
    breakStart: yup.string(),
    breakEnd: yup.string()
  })
});

// Prescription validation schema
export const prescriptionSchema = yup.object().shape({
  patientId: yup
    .string()
    .required('Patient is required'),
  medicationName: yup
    .string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(100, 'Medication name must be less than 100 characters')
    .required('Medication name is required'),
  dosage: yup
    .string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must be less than 50 characters')
    .required('Dosage is required'),
  frequency: yup
    .string()
    .min(1, 'Frequency is required')
    .max(50, 'Frequency must be less than 50 characters')
    .required('Frequency is required'),
  duration: yup
    .string()
    .min(1, 'Duration is required')
    .max(50, 'Duration must be less than 50 characters')
    .required('Duration is required'),
  instructions: yup
    .string()
    .min(10, 'Instructions must be at least 10 characters')
    .max(500, 'Instructions must be less than 500 characters')
    .required('Instructions are required'),
  startDate: yup
    .date()
    .min(new Date(), 'Start date cannot be in the past')
    .required('Start date is required'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required')
});

// Medical record validation schema
export const medicalRecordSchema = yup.object().shape({
  patientId: yup
    .string()
    .required('Patient is required'),
  recordType: yup
    .string()
    .oneOf(['diagnosis', 'treatment', 'lab_result', 'imaging', 'surgery', 'other'], 'Please select a valid record type')
    .required('Record type is required'),
  title: yup
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .required('Description is required'),
  date: yup
    .date()
    .max(new Date(), 'Date cannot be in the future')
    .required('Date is required'),
  attachments: yup
    .array()
    .of(yup.string())
    .max(10, 'Maximum 10 attachments allowed')
});

// Message validation schema
export const messageSchema = yup.object().shape({
  recipientId: yup
    .string()
    .required('Recipient is required'),
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
    .required('Priority is required')
});

// Doctor settings validation schema
export const doctorSettingsSchema = yup.object().shape({
  consultationFee: yup
    .number()
    .min(0, 'Consultation fee cannot be negative')
    .max(10000, 'Consultation fee cannot exceed $10,000')
    .required('Consultation fee is required'),
  appointmentDuration: yup
    .number()
    .min(15, 'Appointment duration must be at least 15 minutes')
    .max(240, 'Appointment duration cannot exceed 4 hours')
    .required('Appointment duration is required'),
  bufferTime: yup
    .number()
    .min(0, 'Buffer time cannot be negative')
    .max(60, 'Buffer time cannot exceed 60 minutes')
    .required('Buffer time is required'),
  autoConfirmAppointments: yup
    .boolean(),
  sendReminders: yup
    .boolean(),
  reminderTime: yup
    .number()
    .min(1, 'Reminder time must be at least 1 hour')
    .max(168, 'Reminder time cannot exceed 1 week')
    .when('sendReminders', {
      is: true,
      then: yup.number().required('Reminder time is required when reminders are enabled'),
      otherwise: yup.number()
    }),
  timezone: yup
    .string()
    .required('Timezone is required'),
  language: yup
    .string()
    .required('Language is required')
});
