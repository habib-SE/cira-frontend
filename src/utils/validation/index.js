// Export all validation schemas (Yup - Legacy)
export * from './authSchemas';
export * from './adminSchemas';
export * from './doctorSchemas';
export * from './patientSchemas';

// Export all Formica validation schemas (New)
export * from './formicaSchemas';

// Export validation utilities
export * from './validationUtils';

// Re-export commonly used items for convenience
export { yupResolver } from '@hookform/resolvers/yup';
export { useForm } from 'react-hook-form';

// Formica utilities for new forms
export { 
  createFormicaSchema, 
  useFormicaForm, 
  FormicaValidators,
  FormicaValidationError 
} from './formica';
