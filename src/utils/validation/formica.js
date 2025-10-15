/**
 * Formica-like validation library for React
 * Provides a consistent validation API across the application
 */

import { z } from 'zod';

// Custom validation error class
export class FormicaValidationError extends Error {
  constructor(message, field, code) {
    super(message);
    this.name = 'FormicaValidationError';
    this.field = field;
    this.code = code;
  }
}

// Formica validation schema builder
export class FormicaSchema {
  constructor() {
    this.schema = {};
    this.fields = new Map();
  }

  // String field validation
  string(name, options = {}) {
    let schema = z.string();
    
    if (options.required) {
      schema = schema.min(1, `${name} is required`);
    }
    
    if (options.min) {
      schema = schema.min(options.min, `${name} must be at least ${options.min} characters`);
    }
    
    if (options.max) {
      schema = schema.max(options.max, `${name} must be less than ${options.max} characters`);
    }
    
    if (options.email) {
      schema = schema.email(`Please enter a valid email address for ${name}`);
    }
    
    if (options.pattern) {
      schema = schema.regex(options.pattern, options.patternMessage || `${name} format is invalid`);
    }
    
    this.fields.set(name, { type: 'string', schema, options });
    return this;
  }

  // Number field validation
  number(name, options = {}) {
    let schema = z.number();
    
    if (options.required) {
      schema = schema.min(0.01, `${name} is required`);
    }
    
    if (options.min !== undefined) {
      schema = schema.min(options.min, `${name} must be at least ${options.min}`);
    }
    
    if (options.max !== undefined) {
      schema = schema.max(options.max, `${name} cannot exceed ${options.max}`);
    }
    
    if (options.positive) {
      schema = schema.positive(`${name} must be positive`);
    }
    
    this.fields.set(name, { type: 'number', schema, options });
    return this;
  }

  // Date field validation
  date(name, options = {}) {
    let schema = z.date();
    
    if (options.required) {
      schema = schema.refine(date => date instanceof Date, `${name} is required`);
    }
    
    if (options.future) {
      schema = schema.refine(date => date > new Date(), `${name} must be in the future`);
    }
    
    if (options.past) {
      schema = schema.refine(date => date < new Date(), `${name} must be in the past`);
    }
    
    if (options.min) {
      schema = schema.refine(date => date >= options.min, `${name} must be after ${options.min.toDateString()}`);
    }
    
    if (options.max) {
      schema = schema.refine(date => date <= options.max, `${name} must be before ${options.max.toDateString()}`);
    }
    
    this.fields.set(name, { type: 'date', schema, options });
    return this;
  }

  // Boolean field validation
  boolean(name, options = {}) {
    let schema = z.boolean();
    
    if (options.required) {
      schema = schema.refine(val => val === true, options.requiredMessage || `${name} is required`);
    }
    
    this.fields.set(name, { type: 'boolean', schema, options });
    return this;
  }

  // Array field validation
  array(name, itemSchema, options = {}) {
    let schema = z.array(itemSchema);
    
    if (options.min) {
      schema = schema.min(options.min, `${name} must have at least ${options.min} items`);
    }
    
    if (options.max) {
      schema = schema.max(options.max, `${name} cannot have more than ${options.max} items`);
    }
    
    if (options.required) {
      schema = schema.min(1, `${name} is required`);
    }
    
    this.fields.set(name, { type: 'array', schema, options });
    return this;
  }

  // Object field validation
  object(name, nestedSchema, options = {}) {
    let schema = z.object(nestedSchema);
    
    if (options.required) {
      schema = schema.refine(obj => obj !== null && obj !== undefined, `${name} is required`);
    }
    
    this.fields.set(name, { type: 'object', schema, options });
    return this;
  }

  // Enum field validation
  enum(name, values, options = {}) {
    let schema = z.enum(values, {
      errorMap: () => ({ message: options.message || `${name} must be one of: ${values.join(', ')}` })
    });
    
    if (options.required) {
      schema = schema.refine(val => val !== undefined, `${name} is required`);
    }
    
    this.fields.set(name, { type: 'enum', schema, options });
    return this;
  }

  // Custom validation
  custom(name, validator, message) {
    let schema = z.any().refine(validator, message);
    this.fields.set(name, { type: 'custom', schema, options: { validator, message } });
    return this;
  }

  // Build the final schema
  build() {
    const schemaObject = {};
    
    for (const [name, field] of this.fields) {
      if (field.type === 'object') {
        schemaObject[name] = field.schema;
      } else {
        schemaObject[name] = field.schema;
      }
    }
    
    return z.object(schemaObject);
  }

  // Validate data against schema
  validate(data) {
    const schema = this.build();
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data, errors: {} };
    } else {
      const errors = {};
      result.error.errors.forEach(error => {
        const path = error.path.join('.');
        errors[path] = error.message;
      });
      
      return { success: false, data: null, errors };
    }
  }
}

// Formica form hook for React Hook Form integration
export const useFormicaForm = (formicaSchema, defaultValues = {}) => {
  const schema = formicaSchema.build();
  
  return {
    schema,
    validate: (data) => formicaSchema.validate(data),
    getFieldError: (fieldName, errors) => errors[fieldName],
    getFieldProps: (fieldName, register, errors) => ({
      ...register(fieldName),
      className: errors[fieldName] ? 'border-red-500' : 'border-gray-300',
      'aria-invalid': !!errors[fieldName],
      'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined
    })
  };
};

// Utility functions for common validations
export const FormicaValidators = {
  email: (message) => z.string().email(message || 'Please enter a valid email address'),
  phone: (message) => z.string().regex(/^\+?[\d\s\-\(\)]+$/, message || 'Please enter a valid phone number'),
  password: (message) => z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message || 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  ),
  zipCode: (message) => z.string().regex(/^\d{5}(-\d{4})?$/, message || 'Please enter a valid ZIP code'),
  url: (message) => z.string().url(message || 'Please enter a valid URL'),
  uuid: (message) => z.string().uuid(message || 'Please enter a valid UUID')
};

// Formica schema factory
export const createFormicaSchema = () => new FormicaSchema();

// Export default Formica
export default {
  createSchema: createFormicaSchema,
  useForm: useFormicaForm,
  validators: FormicaValidators,
  ValidationError: FormicaValidationError
};
