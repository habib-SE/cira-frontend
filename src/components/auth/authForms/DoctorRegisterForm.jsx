import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { FormicaForm } from '../../../components/forms';
import { doctorFormicaSchemas } from '../../../utils/validation/formicaSchemas';

/**
 * Specialized Doctor Registration Form Component
 * Includes doctor-specific fields like specialty and license number
 */
const DoctorRegisterForm = ({ 
  onSubmit, 
  onError, 
  defaultValues = {},
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'hematology', label: 'Hematology' },
    { value: 'infectious_disease', label: 'Infectious Disease' },
    { value: 'internal_medicine', label: 'Internal Medicine' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'pulmonology', label: 'Pulmonology' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'urology', label: 'Urology' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <FormicaForm
      schema={doctorFormicaSchemas.doctorRegistration}
      onSubmit={onSubmit}
      onError={onError}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialty: '',
        licenseNumber: '',
        phone: '',
        ...defaultValues
      }}
      className={`auth-form ${className}`}
      {...props}
    >
      {({ Field, Select, isSubmitting, isValid }) => (
        <>
          {/* Name Fields */}
          <div className="auth-form-row">
            <div className="auth-field">
              <Field
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                required
                className="auth-input"
              />
            </div>
            <div className="auth-field">
              <Field
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="auth-field">
            <Field
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              className="auth-input"
            />
          </div>

          {/* Specialty Selection */}
          <div className="auth-field">
            <Select
              label="Medical Specialty"
              name="specialty"
              placeholder="Select your medical specialty"
              options={specialtyOptions}
              required
              className="auth-input"
            />
          </div>

          {/* License Number */}
          <div className="auth-field">
            <Field
              label="Medical License Number"
              name="licenseNumber"
              placeholder="Enter your medical license number"
              required
              className="auth-input"
            />
          </div>

          {/* Phone Number */}
          <div className="auth-field">
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              className="auth-input"
            />
          </div>

          {/* Password Fields */}
          <div className="auth-form-row">
            <div className="auth-field auth-password-field">
              <Field
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="auth-field auth-password-field">
              <Field
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                required
                className="auth-input"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`auth-button ${isSubmitting ? 'auth-button-loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span>Creating Doctor Account...</span>
              </>
            ) : (
              'Create Doctor Account'
            )}
          </button>

          {/* Login Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <a href="/doctor/login" className="text-pink-600 hover:text-pink-500">
                Sign in
              </a>
            </p>
          </div>
        </>
      )}
    </FormicaForm>
  );
};

export default DoctorRegisterForm;
