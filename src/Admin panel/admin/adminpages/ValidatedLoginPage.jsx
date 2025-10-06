import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import logo from '../../../assets/Logo.png';
import { ValidatedForm, FormField, FormSelect } from '../../../components/forms';
import { loginSchema } from '../../../utils/validation';

const ValidatedLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (data) => {
    try {
      setLoginError('');
      await login(data.email, data.password, data.role);
      
      // Navigate based on role
      switch (data.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleError = (error) => {
    console.error('Form validation error:', error);
  };

  const roleOptions = [
    { value: 'patient', label: 'Patient' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'admin', label: 'Admin' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src={logo}
            alt="CIRA Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <ValidatedForm
            schema={loginSchema}
            onSubmit={handleLogin}
            onError={handleError}
            defaultValues={{
              email: '',
              password: '',
              role: 'patient'
            }}
          >
            {({ register, errors, isSubmitting, isValid }) => (
              <div className="space-y-6">
                {/* Login Error */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{loginError}</p>
                  </div>
                )}

                {/* Role Selection */}
                <FormSelect
                  label="I am a"
                  name="role"
                  register={register}
                  errors={errors}
                  options={roleOptions}
                  placeholder="Select your role"
                  required
                />

                {/* Email Field */}
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  errors={errors}
                  placeholder="Enter your email"
                  required
                />

                {/* Password Field */}
                <div className="relative">
                  <FormField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    register={register}
                    errors={errors}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-pink-600 hover:text-pink-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="form-submit w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="form-spinner mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="font-medium text-pink-600 hover:text-pink-500">
                      Sign up here
                    </a>
                  </p>
                </div>
              </div>
            )}
          </ValidatedForm>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidatedLoginPage;
