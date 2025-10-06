import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Check, X, AlertCircle } from 'lucide-react';
import logo from '../../../assets/Logo.png';
import loginLogo from '../../../assets/LoginLogo.png';
import PhoneNumberInput from '../admincomponents/PhoneNumberInput';
import '../../../styles/banner.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation - Strong validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Additional email validation
      const emailDomain = formData.email.split('@')[1];
      const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
      
      if (!validDomains.includes(emailDomain.toLowerCase())) {
        newErrors.email = 'Please use a valid email provider (Gmail, Yahoo, Hotmail, Outlook, iCloud)';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // More comprehensive phone validation
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = 'Please enter a valid phone number';
      } else if (!/^\+?[\d\s\-()]{7,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number format';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setBannerMessage('Please fix the errors below');
      setShowErrorBanner(true);
      setShowSuccessBanner(false);
      return;
    }

    // If validation passes, show success and navigate to email confirmation
    setErrors({});
    setBannerMessage('Account created successfully! Please check your email for verification code.');
    setShowSuccessBanner(true);
    setShowErrorBanner(false);
    
    // Navigate to email confirmation after a short delay
    setTimeout(() => {
      navigate('/email-confirm');
    }, 2000);
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
          <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Username */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    className={`w-full pl-6 pr-3 py-2 rounded-3xl border bg-white text-gray-900 placeholder-gray-400 placeholder:text-sm text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.username 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-pink-500'
                    }`}
                    style={{ boxShadow: 'none' }}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1 text-left">{errors.username}</p>
                  )}
                </div>
            
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`w-full pl-6 pr-3 py-2 rounded-3xl border bg-white text-gray-900 placeholder-gray-400 placeholder:text-sm text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-200 focus:ring-pink-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <PhoneNumberInput
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={errors.phone}
              placeholder="Phone Number"
            />
            
            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`w-full pl-6 pr-12 py-2 rounded-3xl border bg-white text-gray-900 placeholder-gray-400 placeholder:text-sm text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-pink-500'
                  }`}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className={`w-full pl-6 pr-12 py-2 rounded-3xl border bg-white text-gray-900 placeholder-gray-400 placeholder:text-sm text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-pink-500'
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Register Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-3xl font-semibold text-base bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          </form>
          
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

