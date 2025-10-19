import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { FormicaForm } from '../../forms
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';

/**
 * Reusable Registration Form Component
 * Handles registration for all user types (admin, doctor, patient)
 */
const RegisterForm = ({ 
  onSubmit, 
  onError, 
  defaultValues = {},
  showRoleSelection = true,
  allowedRoles = ['admin', 'doctor', 'patient'],
  requirePhone = true,
  requireDateOfBirth = true,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = allowedRoles.map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1)
  }));

  return (
    <FormicaForm
      schema={authFormicaSchemas.register}
      onSubmit={onSubmit}
      onError={onError}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: allowedRoles[0],
        phone: '',
        dateOfBirth: '',
        terms: false,
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

          {/* Role Selection */}
          {showRoleSelection && (
            <div className="auth-field">
              <Select
                label="Account Type"
                name="role"
                placeholder="Select your account type"
                options={roleOptions}
                required
                className="auth-input"
              />
            </div>
          )}

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

          {/* Phone Number Field */}
          {requirePhone && (
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
          )}

          {/* Date of Birth Field */}
          {requireDateOfBirth && (
            <div className="auth-field">
              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                className="auth-input"
              />
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="auth-field">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="auth-label">
                  I agree to the{' '}
                  <a href="/terms" className="text-pink-600 hover:text-pink-500">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-pink-600 hover:text-pink-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
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
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-pink-600 hover:text-pink-500">
                Sign in
              </a>
            </p>
          </div>
        </>
      )}
    </FormicaForm>
  );
};

export default RegisterForm;
