import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Check, X } from 'lucide-react';
import Stars from '../../../assets/stars.svg';
import '../../../styles/banner.css';

const EmailConfirmPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Check if a field can be focused (all previous fields must be filled)
  const canFocusField = (index) => {
    if (index === 0) return true; // First field is always accessible
    // Check if all previous fields are filled
    for (let i = 0; i < index; i++) {
      if (!code[i] || code[i] === '') {
        return false;
      }
    }
    return true;
  };

  // Handle input change - sequential entry with auto-advance
  const handleInputChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;
    
    // Prevent entering value if previous fields are not filled
    if (index > 0) {
      for (let i = 0; i < index; i++) {
        if (!code[i] || code[i] === '') {
          // Focus the first empty field
          inputRefs.current[i]?.focus();
          return;
        }
      }
    }
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-advance to next field when a digit is entered
    if (value && index < 3) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
    
    // If deleting (empty value), focus previous field
    if (!value && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
    }
  };

  // Handle keyboard navigation - sequential only
  const handleKeyDown = (index, e) => {
    // Handle backspace - go to previous field if current is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select(); // Select text in previous field
    }
    
    // Handle backspace when field has value - clear and stay
    if (e.key === 'Backspace' && code[index] && index > 0) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      // Don't move focus, just clear the current field
    }
    
    // Handle arrow keys - only allow navigation to filled or accessible fields
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      // Only move right if current field has a value
      if (code[index]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Handle delete key
    if (e.key === 'Delete' && code[index]) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
  };

  // Handle focus - prevent focusing if previous fields are empty
  const handleFocus = (index, e) => {
    // If trying to focus a field that shouldn't be accessible, prevent it
    if (!canFocusField(index)) {
      e.preventDefault();
      // Find and focus the first empty field
      for (let i = 0; i < index; i++) {
        if (!code[i] || code[i] === '') {
          inputRefs.current[i]?.focus();
          break;
        }
      }
      return;
    }
    // Select text when focusing an accessible field
    e.target.select();
  };

  // Handle click - prevent clicking on inaccessible fields
  const handleInputClick = (index) => {
    // If field is not accessible, focus the first empty field instead
    if (!canFocusField(index)) {
      for (let i = 0; i < index; i++) {
        if (!code[i] || code[i] === '') {
          inputRefs.current[i]?.focus();
          break;
        }
      }
      return;
    }
    // Focus and select if accessible
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // Validate and submit code
  const handleContinue = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call to verify the code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark email as confirmed and show success alert
      localStorage.setItem('emailConfirmed', 'true');
      // Show alert in top-left corner
      setShowAlert(true);
      
      // Wait a moment to show the alert, then navigate based on user role
      setTimeout(() => {
        // Check user role - admin should go directly to admin panel
        const userRole = user?.role || localStorage.getItem('userRole');
        
        if (userRole === 'admin') {
          // Admin users skip the plus-unlocked page and go directly to admin panel
          navigate('/admin');
        } else {
          // Other users go to plus-unlocked page
          navigate('/plus-unlocked');
        }
      }, 2000);
      
    } catch {
      setError('Verification failed. Please try again.');
      setCode(['', '', '', '']); // Clear fields on error
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const handleResend = () => {
    setCountdown(10);
    setCanResend(false);
    setCode(['', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    
    // Simulate resending code
  };

  return (
    <div 
      className="min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-5 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
    >
    {/* Header - Logo in center */}
    <div className="w-full flex justify-start items-center mb-3 sm:mb-4">
                <div className="flex items-center pl-2 sm:pl-4">
                    <div className="flex-shrink-0 flex gap-2 items-center">
                        <img src={Stars} alt="stars logo" className="w-[20%]"/>
                        <span className="text-xl font-semibold text-gray-900">Cira</span>
                    </div>
                </div>
            </div>

    {/* Success Banner */}
    {showAlert && (
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
          <div className="flex-shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Email verified successfully!</p>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="flex-shrink-0 text-white hover:text-green-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    )}

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-0">
        <div className="w-full max-w-sm text-center">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
          Confirm your Email
        </h1>

        {/* Instructions */}
        <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 leading-relaxed px-2">
          Please enter the 4-digit code we sent to your email to continue
        </p>

        {/* Code Input Fields */}
        <div className="flex gap-2 sm:gap-3 mb-3 justify-center">
          {code.map((digit, index) => {
            const isAccessible = canFocusField(index);
            return (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onClick={() => handleInputClick(index)}
                onFocus={(e) => handleFocus(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                autoComplete="one-time-code"
                tabIndex={isAccessible ? 0 : -1}
                disabled={!isAccessible}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border rounded-xl sm:rounded-2xl transition-all duration-200 ${
                  isAccessible
                    ? 'border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent cursor-text'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                }`}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Resend Code */}
        <div className="mb-6 sm:mb-8 lg:mb-20 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-gray-500 text-xs sm:text-sm hover:text-gray-700 transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm">
              Resend in {countdown}s
            </p>
          )}
        </div>

                 {/* Continue Button */}
         <button
           onClick={handleContinue}
           disabled={isLoading || code.join('').length !== 4}
           className={`w-full py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl font-semibold text-base sm:text-lg transition-all duration-200 ${
             isLoading || code.join('').length !== 4
               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
               : 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transform active:scale-95'
           }`}
         >
           {isLoading ? (
             <div className="flex items-center justify-center">
               <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
               <span className="text-sm sm:text-base">Verifying...</span>
             </div>
           ) : (
             'Continue'
           )}
         </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmPage;
