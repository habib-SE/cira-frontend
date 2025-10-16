import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Check, X, AlertCircle } from 'lucide-react';
import logo from '../../../assets/Logo.png';
import loginLogo from '../../../assets/LoginLogo.png';
import PhoneNumberInput from '../admincomponents/PhoneNumberInput';
import { 
  FormicaValidatedForm, 
  FormicaFormField 
} from '../../../components/forms';
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';
import '../../../styles/banner.css';

const RegisterPage = () => {
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


  const handleSubmit = (data) => {
    // If validation passes, show success and navigate to email confirmation
    setBannerMessage('Account created successfully! Please check your email for verification code.');
    setShowSuccessBanner(true);
    setShowErrorBanner(false);
    
    // Navigate to email confirmation after a short delay
    setTimeout(() => {
      navigate('/email-confirm');
    }, 2000);
  };

  const handleError = (error) => {
    setBannerMessage('Please fix the errors below');
    setShowErrorBanner(true);
    setShowSuccessBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-5 overflow-hidden relative" style={{
      background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)'
    }}>
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{bannerMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="flex-shrink-0 text-white hover:text-green-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {showErrorBanner && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{bannerMessage}</p>
            </div>
            <button
              onClick={() => setShowErrorBanner(false)}
              className="flex-shrink-0 text-white hover:text-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Header - Fixed at top */}
      <div className="w-full flex justify-start items-center mb-4">
                <div className="flex items-center pl-4">
                    <img src={logo} alt="Cira Logo" className="h-7 w-auto" />
                </div>
            </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xs text-center">
          {/* Profile Icon */}
          <div className="flex justify-center mb-3">
            <img 
              src={loginLogo} 
              alt="Login Logo" 
              className="w-28 h-28"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create new account
          </h1>
          
          {/* Form */}
          <FormicaValidatedForm
            schema={authFormicaSchemas.register}
            onSubmit={handleSubmit}
            onError={handleError}
            defaultValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'patient',
              phone: '',
              dateOfBirth: '',
              terms: false
            }}
          >
            {({ 
              register, 
              errors, 
              isSubmitting, 
              isValid, 
              getFieldProps, 
              getFieldError, 
              hasFieldError 
            }) => (
              <div className="space-y-3">
                {/* First Name */}
                <FormicaFormField
                  label=""
                  name="firstName"
                  type="text"
                  register={register}
                  errors={errors}
                  getFieldProps={getFieldProps}
                  getFieldError={getFieldError}
                  hasFieldError={hasFieldError}
                  placeholder="First Name"
                  required
                  className="rounded-3xl"
                />
                
                {/* Last Name */}
                <FormicaFormField
                  label=""
                  name="lastName"
                  type="text"
                  register={register}
                  errors={errors}
                  getFieldProps={getFieldProps}
                  getFieldError={getFieldError}
                  hasFieldError={hasFieldError}
                  placeholder="Last Name"
                  required
                  className="rounded-3xl"
                />
                
                {/* Email */}
                <FormicaFormField
                  label=""
                  name="email"
                  type="email"
                  register={register}
                  errors={errors}
                  getFieldProps={getFieldProps}
                  getFieldError={getFieldError}
                  hasFieldError={hasFieldError}
                  placeholder="Email"
                  required
                  className="rounded-3xl"
                />
                
                {/* Phone Number */}
                <FormicaFormField
                  label=""
                  name="phone"
                  type="tel"
                  register={register}
                  errors={errors}
                  getFieldProps={getFieldProps}
                  getFieldError={getFieldError}
                  hasFieldError={hasFieldError}
                  placeholder="Phone Number"
                  required
                  className="rounded-3xl"
                />
                
                {/* Password */}
                <div>
                  <div className="relative">
                    <FormicaFormField
                      label=""
                      name="password"
                      type={showPassword ? "text" : "password"}
                      register={register}
                      errors={errors}
                      getFieldProps={getFieldProps}
                      getFieldError={getFieldError}
                      hasFieldError={hasFieldError}
                      placeholder="Password"
                      required
                      className="rounded-3xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeClosed className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <FormicaFormField
                      label=""
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      register={register}
                      errors={errors}
                      getFieldProps={getFieldProps}
                      getFieldError={getFieldError}
                      hasFieldError={hasFieldError}
                      placeholder="Confirm Password"
                      required
                      className="rounded-3xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeClosed className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register('terms')}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <a href="#" className="text-pink-600 hover:text-pink-500">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.terms.message}</p>
                )}
                
                {/* Register Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="w-full py-3 px-6 rounded-3xl font-semibold text-base bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Register'}
                  </button>
                </div>
              </div>
            )}
          </FormicaValidatedForm>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Login
              </button>
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

