import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { FormicaForm } from '../../../components/forms';
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';

/**
 * Reusable Login Form Component
 * Handles login for all user types (admin, doctor, patient)
 */
const LoginForm = ({ 
  onSubmit, 
  onError, 
  defaultValues = {},
  showRoleSelection = true,
  allowedRoles = ['admin', 'doctor', 'patient'],
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = allowedRoles.map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1)
  }));

  return (
    <FormicaForm
      schema={authFormicaSchemas.login}
      onSubmit={onSubmit}
      onError={onError}
      defaultValues={{
        email: '',
        password: '',
        role: allowedRoles[0],
        ...defaultValues
      }}
      className={`auth-form ${className}`}
      {...props}
    >
      {({ Field, Select, isSubmitting, isValid }) => (
        <>
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

          {/* Password Field */}
          <div className="auth-field auth-password-field">
            <Field
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`auth-button ${isSubmitting ? 'auth-button-loading' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="auth-footer">
            <a href="/forgot-password" className="text-pink-600 hover:text-pink-500">
              Forgot your password?
            </a>
          </div>
        </>
      )}
    </FormicaForm>
  );
};

export default LoginForm;
