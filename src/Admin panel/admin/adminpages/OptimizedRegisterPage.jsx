import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Check, X, AlertCircle } from 'lucide-react';
import Stars from '../../../assets/stars.svg';
import PhoneNumberInput from '../admincomponents/PhoneNumberInput';
import { FormicaForm } from '../../../components/forms';
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';
import '../../../styles/banner.css';

/**
 * Optimized Register Page using unified FormicaForm
 * Demonstrates best practices for form implementation
 */
const OptimizedRegisterPage = () => {
  const navigate = useNavigate();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-hide banners after 5 seconds
  useEffect(() => {
    if (showSuccessBanner || showErrorBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
        setShowErrorBanner(false);
        setBannerMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner, showErrorBanner]);

  const handleSubmit = async (data) => {
    try {
      console.log('Registration data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBannerMessage('Registration successful! Please check your email for verification.');
      setShowSuccessBanner(true);
      
      // Navigate to email confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/email-confirm');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setBannerMessage('Registration failed. Please try again.');
      setShowErrorBanner(true);
    }
  };

  const handleError = (error) => {
    console.error('Form validation error:', error);
    setBannerMessage('Please fix the validation errors and try again.');
    setShowErrorBanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
            <div className="flex-shrink-0">
              <Check className="w-5 h-5 text-pink-500" />
            </div>
            <span className="text-pink-700 font-medium flex-1">{bannerMessage}</span>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="flex-shrink-0 text-pink-500 hover:text-pink-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {showErrorBanner && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-red-700 font-medium flex-1">{bannerMessage}</span>
            <button
              onClick={() => setShowErrorBanner(false)}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join the future of healthcare</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <FormicaForm
            schema={authFormicaSchemas.register}
            onSubmit={handleSubmit}
            onError={handleError}
            defaultValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: '',
              phone: '',
              dateOfBirth: '',
              terms: false
            }}
            className="space-y-6"
          >
            {({ Field, Select, isSubmitting, isValid }) => (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                  />
                  <Field
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                {/* Email */}
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />

                {/* Role Selection */}
                <Select
                  label="Account Type"
                  name="role"
                  placeholder="Select your role"
                  options={[
                    { value: 'admin', label: 'Administrator' },
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'patient', label: 'Patient' }
                  ]}
                  required
                />

                {/* Password Fields */}
                <div className="space-y-4">
                  <div className="relative">
                    <Field
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Field
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneNumberInput />
                </div>

                {/* Date of Birth */}
                <Field
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  required
                />

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-pink-600 hover:text-pink-500">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-pink-600 hover:text-pink-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-pink-600 hover:text-pink-500 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}
          </FormicaForm>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 CIRA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OptimizedRegisterPage;
