import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft, CreditCard, Shield, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const ReferralCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [checkoutState, setCheckoutState] = useState('loading'); // loading, checkout, success, error
  const [referralId, setReferralId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Mock checkout provider configuration
  const CHECKOUT_PROVIDER_URL = 'https://checkout.example.com/payment';
  const SUCCESS_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=success`;
  const ERROR_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=error`;

  useEffect(() => {
    // Get referral ID from URL params
    const refId = searchParams.get('referralId') || searchParams.get('ref');
    const status = searchParams.get('status');
    
    if (refId) {
      setReferralId(refId);
      
      if (status === 'success') {
        handleSuccessCallback();
      } else if (status === 'error') {
        handleErrorCallback();
      } else {
        // Start checkout process
        initiateCheckout(refId);
      }
    } else {
      setCheckoutState('error');
      setErrorMessage('No referral ID provided');
    }
  }, [searchParams]);

  const initiateCheckout = async (refId) => {
    try {
      setCheckoutState('loading');
      setIsRedirecting(true);
      
      // Simulate API call to get checkout session
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, you would:
      // 1. Call your backend API to create a checkout session
      // 2. Get the checkout URL from the provider
      // 3. Redirect to the provider's checkout page
      
      const checkoutUrl = `${CHECKOUT_PROVIDER_URL}?referralId=${refId}&success_url=${encodeURIComponent(SUCCESS_CALLBACK_URL)}&cancel_url=${encodeURIComponent(ERROR_CALLBACK_URL)}`;
      
      // For demo purposes, we'll simulate the checkout process
      setTimeout(() => {
        setCheckoutState('checkout');
        // In real app, redirect to external provider:
        // window.location.href = checkoutUrl;
      }, 2000);
      
    } catch (error) {
      setCheckoutState('error');
      setErrorMessage('Failed to initialize checkout process');
      setIsRedirecting(false);
    }
  };

  const handleSuccessCallback = () => {
    // In real implementation, verify the payment with your backend
    setOrderDetails({
      orderId: `ORD-${Date.now()}`,
      referralId: referralId,
      amount: '$299.00',
      paymentMethod: 'Credit Card',
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toLocaleString(),
      status: 'completed'
    });
    setCheckoutState('success');
    setIsRedirecting(false);
  };

  const handleErrorCallback = () => {
    setErrorMessage('Payment was cancelled or failed. Please try again.');
    setCheckoutState('error');
    setIsRedirecting(false);
  };

  const retryCheckout = () => {
    if (referralId) {
      initiateCheckout(referralId);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const redirectToProvider = () => {
    const checkoutUrl = `${CHECKOUT_PROVIDER_URL}?referralId=${referralId}&success_url=${encodeURIComponent(SUCCESS_CALLBACK_URL)}&cancel_url=${encodeURIComponent(ERROR_CALLBACK_URL)}`;
    window.open(checkoutUrl, '_blank');
  };

  // Loading State
  if (checkoutState === 'loading') {
    return (
      <div className="h-screen bg-pink-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Checkout</h2>
            <p className="text-gray-600 mb-6">Setting up your payment session...</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Checkout State
  if (checkoutState === 'checkout') {
    return (
      <div className="min-h-screen bg-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Referrals</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Referral Payment</h1>
            <p className="text-gray-600 mt-2">Referral ID: {referralId}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Referral Service</span>
                  <span className="font-semibold">$299.00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="font-semibold">$8.97</span>
                </div>
                <div className="flex justify-between items-center py-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">$307.97</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Secure Payment</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                </p>
              </div>
            </Card>

            {/* Checkout Integration */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="h-6 w-6 text-gray-600" />
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={redirectToProvider}
                disabled={isRedirecting}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isRedirecting ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to our secure payment partner to complete your transaction.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (checkoutState === 'success') {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <Card className="p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your referral payment has been successfully processed.
            </p>

            {orderDetails && (
              <div className="bg-pink-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referral ID:</span>
                    <span className="font-medium">{orderDetails.referralId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-green-600">{orderDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-sm">{orderDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{orderDetails.timestamp}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/patient')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error State
  if (checkoutState === 'error') {
    return (
      <div className=" bg-pink-50 flex items-center justify-center">
        <Card className="p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Payment Made</h1>
            <p className="text-lg text-gray-600 mb-8">
              {errorMessage || 'We encountered an error processing your payment. Please try again.'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

export default ReferralCheckout;
