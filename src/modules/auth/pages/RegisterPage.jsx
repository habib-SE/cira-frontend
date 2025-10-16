import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo.png';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../forms/RegisterForm';

/**
 * Unified Registration Page
 * Handles registration for all user types
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState('success');
  const [bannerMessage, setBannerMessage] = useState('');

  // Auto-hide banners after 5 seconds
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
        setBannerMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  const handleSubmit = async (data) => {
    try {
      console.log('Registration data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBannerType('success');
      setBannerMessage('Registration successful! Please check your email for verification.');
      setShowBanner(true);
      
      // Navigate to email confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/email-confirm');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setBannerType('error');
      setBannerMessage('Registration failed. Please try again.');
      setShowBanner(true);
    }
  };

  const handleError = (error) => {
    console.error('Form validation error:', error);
    setBannerType('error');
    setBannerMessage('Please fix the validation errors and try again.');
    setShowBanner(true);
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    setBannerMessage('');
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the future of healthcare"
      showBanner={showBanner}
      bannerType={bannerType}
      bannerMessage={bannerMessage}
      onCloseBanner={handleCloseBanner}
    >
      {/* Logo */}
      <div className="text-center mb-6">
        <img src={logo} alt="CIRA Logo" className="h-16 mx-auto mb-4" />
      </div>

      {/* Registration Form */}
      <RegisterForm
        onSubmit={handleSubmit}
        onError={handleError}
        showRoleSelection={true}
        allowedRoles={['admin', 'doctor', 'patient']}
        requirePhone={true}
        requireDateOfBirth={true}
      />

      {/* Footer */}
      <div className="auth-footer mt-8">
        <p>© 2024 CIRA. All rights reserved.</p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
