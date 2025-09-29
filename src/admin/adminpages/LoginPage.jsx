import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, Check, X, AlertCircle } from 'lucide-react';
import logo from '../../assets/Logo.png';
import loginLogo from '../../assets/LoginLogo.png';

import '../../styles/banner.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
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
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

    // If validation passes, show success
    setErrors({});
    setBannerMessage('Login successful! Welcome back! 🎉');
    setShowSuccessBanner(true);
    setShowErrorBanner(false);
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        username: '',
        password: '',
        rememberMe: false
      });
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Login to your account
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
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 text-left">{errors.username}</p>
              )}
            </div>
            
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
            

            {/* Remember Me & Forget Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a 
                href="#" 
                className="text-sm text-gray-700 hover:text-pink-500 transition-colors duration-200"
              >
                Forget password?
              </a>
            </div>
            
            {/* Sign In Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-3xl font-semibold text-base bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </form>
          
          {/* Separator */}
          <div className="flex justify-center text-sm my-5">
            <span className="text-gray-500">or Login with</span>
          </div>
          
          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <button className="w-full py-3 px-4 rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 text-sm">Login with Google</span>
            </button>
            
            {/* Apple Login */}
            <button className="w-full py-3 px-4 rounded-3xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-gray-700 text-sm">Login with Apple</span>
            </button>
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Create an Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
