import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginLogo from '../../assets/LoginLogo.png';
import logo from '../../assets/Logo.png';

const EmailConfirmPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Auto-focus next input
  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
      
      // Strong validation - only accept specific valid codes
      // In production, this should be validated against your backend/database
      const validCodes = ['1234', '5678', '9999', '0000']; // Add your valid codes here
      
      // TODO: Replace with real API call to verify code
      // const response = await fetch('/api/verify-email-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: userEmail, code: fullCode })
      // });
      // const result = await response.json();
      
      if (validCodes.includes(fullCode)) {
        // Code is valid - proceed to next step
        navigate('/enable-permission');
      } else {
        // Code is invalid - show error and clear fields
        setError('Invalid verification code. Please check your email and try again.');
        setCode(['', '', '', '']); // Clear the input fields
        inputRefs.current[0]?.focus(); // Focus first input
      }
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
    console.log('Resending verification code...');
  };

  return (
    <div 
      className="min-h-screen flex flex-col px-4 py-5 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
    >
    {/* Header - Logo in center */}
    <div className="w-full flex justify-start items-center mb-4">
                <div className="flex items-center pl-4">
                    <img src={logo} alt="Cira Logo" className="h-7 w-auto" />
                </div>
            </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-3 flex justify-center items-center">
          <img 
            src={LoginLogo} 
            alt="Cira Logo" 
            className="w-28 h-28 mb-3"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Confirm your Email
        </h1>

        {/* Instructions */}
        <p className="text-gray-600 text-center mb-4 leading-relaxed">
          Please enter the 4-digit code we sent to your email to continue
        </p>

        {/* Code Input Fields */}
        <div className="flex gap-3 mb-3 justify-center">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-14 h-14 text-center text-xl font-semibold border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Resend Code */}
        <div className="mb-20 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend in {countdown}s
            </p>
          )}
        </div>

                 {/* Continue Button */}
         <button
           onClick={handleContinue}
           disabled={isLoading || code.join('').length !== 4}
           className={`w-full py-3 rounded-3xl font-semibold text-lg transition-all duration-200 ${
             isLoading || code.join('').length !== 4
               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
               : 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transform active:scale-95'
           }`}
         >
           {isLoading ? (
             <div className="flex items-center justify-center">
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
               Verifying...
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
