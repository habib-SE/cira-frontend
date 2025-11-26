// // import React, { useState, useEffect } from 'react';
// // import { useSearchParams, useNavigate } from 'react-router-dom';
// // import { CheckCircle, AlertCircle, ArrowLeft, CreditCard, Shield, Clock, RefreshCw, ExternalLink } from 'lucide-react';
// // import Card from '../../admin/admincomponents/Card';

// // const ReferralCheckout = () => {
// //   const [searchParams] = useSearchParams();
// //   const navigate = useNavigate();
  
// //   // State management
// //   const [checkoutState, setCheckoutState] = useState('loading'); // loading, checkout, success, error
// //   const [referralId, setReferralId] = useState('');
// //   const [orderDetails, setOrderDetails] = useState(null);
// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [isRedirecting, setIsRedirecting] = useState(false);

// //   // Mock checkout provider configuration
// //   const CHECKOUT_PROVIDER_URL = 'https://checkout.example.com/payment';
// //   const SUCCESS_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=success`;
// //   const ERROR_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=error`;

// //   useEffect(() => {
// //     // Get referral ID from URL params
// //     const refId = searchParams.get('referralId') || searchParams.get('ref');
// //     const status = searchParams.get('status');
    
// //     if (refId) {
// //       setReferralId(refId);
      
// //       if (status === 'success') {
// //         handleSuccessCallback();
// //       } else if (status === 'error') {
// //         handleErrorCallback();
// //       } else {
// //         // Start checkout process
// //         initiateCheckout(refId);
// //       }
// //     } else {
// //       setCheckoutState('error');
// //       setErrorMessage('No referral ID provided');
// //     }
// //   }, [searchParams]);

// //   const initiateCheckout = async (refId) => {
// //     try {
// //       setCheckoutState('loading');
// //       setIsRedirecting(true);
      
// //       // Simulate API call to get checkout session
// //       await new Promise(resolve => setTimeout(resolve, 2000));
      
// //       // In real implementation, you would:
// //       // 1. Call your backend API to create a checkout session
// //       // 2. Get the checkout URL from the provider
// //       // 3. Redirect to the provider's checkout page
      
// //       const checkoutUrl = `${CHECKOUT_PROVIDER_URL}?referralId=${refId}&success_url=${encodeURIComponent(SUCCESS_CALLBACK_URL)}&cancel_url=${encodeURIComponent(ERROR_CALLBACK_URL)}`;
      
// //       // For demo purposes, we'll simulate the checkout process
// //       setTimeout(() => {
// //         setCheckoutState('checkout');
// //         // In real app, redirect to external provider:
// //         // window.location.href = checkoutUrl;
// //       }, 2000);
      
// //     } catch (error) {
// //       setCheckoutState('error');
// //       setErrorMessage('Failed to initialize checkout process');
// //       setIsRedirecting(false);
// //     }
// //   };

// //   const handleSuccessCallback = () => {
// //     // In real implementation, verify the payment with your backend
// //     setOrderDetails({
// //       orderId: `ORD-${Date.now()}`,
// //       referralId: referralId,
// //       amount: '$299.00',
// //       paymentMethod: 'Credit Card',
// //       transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
// //       timestamp: new Date().toLocaleString(),
// //       status: 'completed'
// //     });
// //     setCheckoutState('success');
// //     setIsRedirecting(false);
// //   };

// //   const handleErrorCallback = () => {
// //     setErrorMessage('Payment was cancelled or failed. Please try again.');
// //     setCheckoutState('error');
// //     setIsRedirecting(false);
// //   };

// //   const retryCheckout = () => {
// //     if (referralId) {
// //       initiateCheckout(referralId);
// //     }
// //   };

// //   const goBack = () => {
// //     navigate(-1);
// //   };

// //   const redirectToProvider = () => {
// //     const checkoutUrl = `${CHECKOUT_PROVIDER_URL}?referralId=${referralId}&success_url=${encodeURIComponent(SUCCESS_CALLBACK_URL)}&cancel_url=${encodeURIComponent(ERROR_CALLBACK_URL)}`;
// //     window.open(checkoutUrl, '_blank');
// //   };

// //   // Loading State
// //   if (checkoutState === 'loading') {
// //     return (
// //       <div className="h-screen bg-pink-50 flex items-center justify-center">
// //         <Card className="p-8 max-w-md w-full mx-4">
// //           <div className="text-center">
// //             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
// //             </div>
// //             <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Checkout</h2>
// //             <p className="text-gray-600 mb-6">Setting up your payment session...</p>
// //             <div className="flex items-center justify-center space-x-2">
// //               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
// //               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
// //               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
// //             </div>
// //           </div>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   // Checkout State
// //   if (checkoutState === 'checkout') {
// //     return (
// //       <div className="min-h-screen bg-pink-50">
// //         <div className="max-w-4xl mx-auto px-4 py-8">
// //           {/* Header */}
// //           <div className="mb-8">
// //             <button 
// //               onClick={goBack}
// //               className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
// //             >
// //               <ArrowLeft className="h-5 w-5" />
// //               <span>Back to Referrals</span>
// //             </button>
// //             <h1 className="text-3xl font-bold text-gray-900">Complete Your Referral Payment</h1>
// //             <p className="text-gray-600 mt-2">Referral ID: {referralId}</p>
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //             {/* Payment Details */}
// //             <Card className="p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
              
// //               <div className="space-y-4">
// //                 <div className="flex justify-between items-center py-3 border-b border-gray-200">
// //                   <span className="text-gray-600">Referral Service</span>
// //                   <span className="font-semibold">$299.00</span>
// //                 </div>
// //                 <div className="flex justify-between items-center py-3 border-b border-gray-200">
// //                   <span className="text-gray-600">Processing Fee</span>
// //                   <span className="font-semibold">$8.97</span>
// //                 </div>
// //                 <div className="flex justify-between items-center py-3 text-lg font-bold">
// //                   <span>Total</span>
// //                   <span className="text-green-600">$307.97</span>
// //                 </div>
// //               </div>

// //               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
// //                 <div className="flex items-center space-x-2 mb-2">
// //                   <Shield className="h-5 w-5 text-blue-600" />
// //                   <span className="font-semibold text-blue-900">Secure Payment</span>
// //                 </div>
// //                 <p className="text-sm text-blue-700">
// //                   Your payment information is encrypted and secure. We use industry-standard SSL encryption.
// //                 </p>
// //               </div>
// //             </Card>

// //             {/* Checkout Integration */}
// //             <Card className="p-6">
// //               <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
// //               <div className="space-y-4">
// //                 <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
// //                   <div className="flex items-center space-x-3">
// //                     <CreditCard className="h-6 w-6 text-gray-600" />
// //                     <div>
// //                       <div className="font-medium">Credit/Debit Card</div>
// //                       <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
// //                   <div className="flex items-center space-x-3">
// //                     <ExternalLink className="h-6 w-6 text-gray-600" />
// //                     <div>
// //                       <div className="font-medium">PayPal</div>
// //                       <div className="text-sm text-gray-600">Pay with your PayPal account</div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <button
// //                 onClick={redirectToProvider}
// //                 disabled={isRedirecting}
// //                 className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
// //               >
// //                 {isRedirecting ? (
// //                   <>
// //                     <RefreshCw className="h-5 w-5 animate-spin" />
// //                     <span>Redirecting...</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <CreditCard className="h-5 w-5" />
// //                     <span>Proceed to Payment</span>
// //                   </>
// //                 )}
// //               </button>

// //               <p className="text-xs text-gray-500 text-center mt-4">
// //                 You will be redirected to our secure payment partner to complete your transaction.
// //               </p>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Success State
// //   if (checkoutState === 'success') {
// //     return (
// //       <div className="min-h-screen bg-pink-50 flex items-center justify-center">
// //         <Card className="p-8 max-w-2xl w-full mx-4">
// //           <div className="text-center">
// //             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <CheckCircle className="h-12 w-12 text-green-600" />
// //             </div>
            
// //             <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Confirmed!</h1>
// //             <p className="text-lg text-gray-600 mb-8">
// //               Your referral payment has been successfully processed.
// //             </p>

// //             {orderDetails && (
// //               <div className="bg-pink-50 rounded-lg p-6 mb-8 text-left">
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Order ID:</span>
// //                     <span className="font-medium">{orderDetails.orderId}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Referral ID:</span>
// //                     <span className="font-medium">{orderDetails.referralId}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Amount:</span>
// //                     <span className="font-medium text-green-600">{orderDetails.amount}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Payment Method:</span>
// //                     <span className="font-medium">{orderDetails.paymentMethod}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Transaction ID:</span>
// //                     <span className="font-medium text-sm">{orderDetails.transactionId}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Date:</span>
// //                     <span className="font-medium">{orderDetails.timestamp}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //               <button
// //                 onClick={() => navigate('/patient')}
// //                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //               >
// //                 Go to Dashboard
// //               </button>
// //               <button
// //                 onClick={() => window.print()}
// //                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
// //               >
// //                 Print Receipt
// //               </button>
// //             </div>
// //           </div>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   // Error State
// //   if (checkoutState === 'error') {
// //     return (
// //       <div className=" bg-pink-50 flex items-center justify-center">
// //         <Card className="p-8 max-w-2xl w-full mx-4">
// //           <div className="text-center">
// //             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
// //               <AlertCircle className="h-12 w-12 text-red-600" />
// //             </div>
            
// //             <h1 className="text-3xl font-bold text-gray-900 mb-4">No Payment Made</h1>
// //             <p className="text-lg text-gray-600 mb-8">
// //               {errorMessage || 'We encountered an error processing your payment. Please try again.'}
// //             </p>
// //           </div>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return null;
// // };

// // export default ReferralCheckout;
// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import {
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   CreditCard,
//   Shield,
//   Clock,
//   RefreshCw,
//   ExternalLink
// } from 'lucide-react';
// import Card from '../../admin/admincomponents/Card';

// /** ───────────────────────── DEMO CONFIG ───────────────────────── */
// const DEMO_MODE_DEFAULT_REFERRAL = 'REF-DEMO-001';
// const DEMO_TOTAL = '$307.97';
// const DEMO_BASE = '$299.00';
// const DEMO_FEE = '$8.97';
// const demoTxnId = () => `TXN-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

// const ReferralCheckout = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // State management
//   const [checkoutState, setCheckoutState] = useState('loading'); // 'loading' | 'checkout' | 'success' | 'error'
//   const [referralId, setReferralId] = useState('');
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   // Mock checkout provider configuration
//   const CHECKOUT_PROVIDER_URL = 'https://checkout.example.com/payment';
//   const SUCCESS_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=success`;
//   const ERROR_CALLBACK_URL = `${window.location.origin}/patient/referral-checkout?status=error`;

//   useEffect(() => {
//     const refId = searchParams.get('referralId') || searchParams.get('ref');
//     const status = searchParams.get('status');

//     // DEMO fallback if no referral provided
//     if (!refId) {
//       const demoRef = DEMO_MODE_DEFAULT_REFERRAL;
//       setReferralId(demoRef);
//       setCheckoutState('checkout');
//       setIsRedirecting(false);
//       return;
//     }

//     setReferralId(refId);

//     if (status === 'success') {
//       handleSuccessCallback(refId);
//     } else if (status === 'error') {
//       handleErrorCallback();
//     } else {
//       initiateCheckout(refId);
//     }
//   }, [searchParams]);

//   const initiateCheckout = async (refId) => {
//     try {
//       setCheckoutState('loading');
//       setIsRedirecting(true);

//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // In a real implementation:
//       // 1) Create checkout session on your backend
//       // 2) Get provider's checkout URL
//       // 3) Redirect to provider page (window.location.href = checkoutUrl)

//       // Demo: just show checkout screen
//       setTimeout(() => {
//         setCheckoutState('checkout');
//         setIsRedirecting(false);
//       }, 1000);
//     } catch (error) {
//       setCheckoutState('error');
//       setErrorMessage('Failed to initialize checkout process');
//       setIsRedirecting(false);
//     }
//   };

//   const handleSuccessCallback = (forcedRefId) => {
//     const ref = forcedRefId || referralId || DEMO_MODE_DEFAULT_REFERRAL;
//     setOrderDetails({
//       orderId: `ORD-${Date.now()}`,
//       referralId: ref,
//       amount: DEMO_TOTAL,
//       paymentMethod: 'Credit Card',
//       transactionId: demoTxnId(),
//       timestamp: new Date().toLocaleString(),
//       status: 'completed',
//     });
//     setCheckoutState('success');
//     setIsRedirecting(false);
//   };

//   const handleErrorCallback = () => {
//     setErrorMessage('Payment was cancelled or failed. Please try again.');
//     setCheckoutState('error');
//     setIsRedirecting(false);
//   };

//   const retryCheckout = () => {
//     if (referralId) {
//       initiateCheckout(referralId);
//     }
//   };

//   const goBack = () => navigate(-1);

//   const redirectToProvider = () => {
//     // In demo mode, keep user in-app and simulate success
//     if (referralId === DEMO_MODE_DEFAULT_REFERRAL) {
//       setIsRedirecting(true);
//       setTimeout(() => {
//         setIsRedirecting(false);
//         handleSuccessCallback();
//       }, 1500);
//       return;
//     }

//     const checkoutUrl = `${CHECKOUT_PROVIDER_URL}?referralId=${referralId}&success_url=${encodeURIComponent(
//       SUCCESS_CALLBACK_URL
//     )}&cancel_url=${encodeURIComponent(ERROR_CALLBACK_URL)}`;
//     window.open(checkoutUrl, '_blank');
//   };

//   /** ───────────────────────── RENDER STATES ───────────────────────── */

//   // Loading State
//   if (checkoutState === 'loading') {
//     return (
//       <div className="h-screen bg-pink-50 flex items-center justify-center">
//         <Card className="p-8 max-w-md w-full mx-4">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Clock className="h-8 w-8 text-blue-600 animate-pulse" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Preparing Checkout</h2>
//             <p className="text-gray-600 mb-6">Setting up your payment session...</p>
//             <div className="flex items-center justify-center space-x-2">
//               <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
//               <div
//                 className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
//                 style={{ animationDelay: '0.1s' }}
//               ></div>
//               <div
//                 className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
//                 style={{ animationDelay: '0.2s' }}
//               ></div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   // Checkout State
//   if (checkoutState === 'checkout') {
//     return (
//       <div className="min-h-screen bg-pink-50">
//         <div className="w-full  mx-auto px-6 py-8">
//           {/* Header */}
//           <div className="mb-8">
//             <button
//               onClick={goBack}
//               className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
//             >
//               <ArrowLeft className="h-5 w-5" />
//               <span>Back to Referrals</span>
//             </button>
//             <h1 className="text-3xl font-bold text-gray-900">Complete Your Referral Payment</h1>
//             <p className="text-gray-600 mt-2">Referral ID: {referralId}</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-5">
//             {/* Payment Details */}
//             <Card className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-3 border-b border-gray-200">
//                   <span className="text-gray-600">Referral Service</span>
//                   <span className="font-semibold">{DEMO_BASE}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-3 border-b border-gray-200">
//                   <span className="text-gray-600">Processing Fee</span>
//                   <span className="font-semibold">{DEMO_FEE}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-3 text-lg font-bold">
//                   <span>Total</span>
//                   <span className="text-green-600">{DEMO_TOTAL}</span>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Shield className="h-5 w-5 text-blue-600" />
//                   <span className="font-semibold text-blue-900">Secure Payment</span>
//                 </div>
//                 <p className="text-sm text-blue-700">
//                   Your payment information is encrypted and secure. We use industry-standard HIPPA and JDPR encryption.
//                 </p>
//               </div>
//             </Card>

//             {/* Checkout Integration */}
//             <Card className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

//               <div className="space-y-4">
//                 <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
//                   <div className="flex items-center space-x-3">
//                     <CreditCard className="h-6 w-6 text-gray-600" />
//                     <div>
//                       <div className="font-medium">Credit/Debit Card</div>
//                       <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
//                   <div className="flex items-center space-x-3">
//                     <ExternalLink className="h-6 w-6 text-gray-600" />
//                     <div>
//                       <div className="font-medium">PayPal</div>
//                       <div className="text-sm text-gray-600">Pay with your PayPal account</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={redirectToProvider}
//                 disabled={isRedirecting}
//                 className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isRedirecting ? (
//                   <>
//                     <RefreshCw className="h-5 w-5 animate-spin" />
//                     <span>Redirecting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <CreditCard className="h-5 w-5" />
//                     <span>Proceed to Payment</span>
//                   </>
//                 )}
//               </button>

//               <p className="text-xs text-gray-500 text-center mt-4">
//                 You will be redirected to our secure payment partner to complete your transaction.
//               </p>

//               {/* Demo controls */}
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <button
//                   onClick={() => handleSuccessCallback()}
//                   className="w-full border border-green-200 text-green-700 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors"
//                 >
//                   Simulate Success
//                 </button>
//                 <button
//                   onClick={handleErrorCallback}
//                   className="w-full border border-red-200 text-red-700 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors"
//                 >
//                   Simulate Failure
//                 </button>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success State
//   if (checkoutState === 'success') {
//     return (
//       <div className="min-h-screen bg-pink-50 flex items-center justify-center">
//         <Card className="p-8 max-w-2xl w-full mx-4">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="h-12 w-12 text-green-600" />
//             </div>

//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Confirmed!</h1>
//             <p className="text-lg text-gray-600 mb-8">
//               Your referral payment has been successfully processed.
//             </p>

//             {orderDetails && (
//               <div className="bg-pink-50 rounded-lg p-6 mb-8 text-left">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Order ID:</span>
//                     <span className="font-medium">{orderDetails.orderId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Referral ID:</span>
//                     <span className="font-medium">{orderDetails.referralId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount:</span>
//                     <span className="font-medium text-green-600">{orderDetails.amount}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Payment Method:</span>
//                     <span className="font-medium">{orderDetails.paymentMethod}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Transaction ID:</span>
//                     <span className="font-medium text-sm">{orderDetails.transactionId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Date:</span>
//                     <span className="font-medium">{orderDetails.timestamp}</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => navigate('/patient')}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Go to Dashboard
//               </button>
//               <button
//                 onClick={() => window.print()}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
//               >
//                 Print Receipt
//               </button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   // Error State
//   if (checkoutState === 'error') {
//     return (
//       <div className="bg-pink-50 flex items-center justify-center min-h-screen">
//         <Card className="p-8 max-w-2xl w-full mx-4">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <AlertCircle className="h-12 w-12 text-red-600" />
//             </div>

//             <h1 className="text-3xl font-bold text-gray-900 mb-4">No Payment Made</h1>
//             <p className="text-lg text-gray-600 mb-8">
//               {errorMessage || 'We encountered an error processing your payment. Please try again.'}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={retryCheckout}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Try Again
//               </button>
//               <button
//                 onClick={() => navigate('/patient')}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return null;
// };

// export default ReferralCheckout;
import React, { useMemo, useState, useEffect } from "react";
import {
  HeartHandshake,
  Stethoscope,
  MapPin,
  Star,
  Search,
  Filter,
  X,
  Send,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  BadgeCheck,
  Plus,
} from "lucide-react";
import Card from "../../admin/admincomponents/Card";

/** ───────────────────────── Dummy Data ───────────────────────── */
const DOCTORS = [
  {
    id: "d1",
    name: "Dr. Ayesha Khan",
    speciality: "Cardiologist",
    rating: 4.9,
    reviews: 112,
    city: "Karachi",
    distanceKm: 3.1,
    languages: ["English", "Urdu"],
    fee: 6000,
    slotsToday: 3,
  },
  {
    id: "d2",
    name: "Dr. Rahul Mehta",
    speciality: "Dermatologist",
    rating: 4.7,
    reviews: 87,
    city: "Lahore",
    distanceKm: 2.4,
    languages: ["English", "Hindi"],
    fee: 4500,
    slotsToday: 0,
  },
  {
    id: "d3",
    name: "Dr. Sara Ali",
    speciality: "Pediatrics",
    rating: 4.8,
    reviews: 132,
    city: "Islamabad",
    distanceKm: 6.3,
    languages: ["English", "Urdu"],
    fee: 4000,
    slotsToday: 5,
  },
  {
    id: "d4",
    name: "Dr. Hamza Raza",
    speciality: "Orthopedics",
    rating: 4.6,
    reviews: 59,
    city: "Karachi",
    distanceKm: 4.7,
    languages: ["English", "Urdu"],
    fee: 7000,
    slotsToday: 2,
  },
];

const SPECIALITIES = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrics",
  "Orthopedics",
  "Dentist",
  "Oncologist",
];

const CITIES = ["All", "Karachi", "Lahore", "Islamabad"];

/** ───────────────────────── Small UI bits ───────────────────────── */
const Tag = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-pink-50 text-pink-700 border border-pink-200">
    {children}
  </span>
);

const PillButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition
      ${active ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
  >
    {children}
  </button>
);

/** ───────────────────────── Referral Modal ───────────────────────── */
const ReferralModal = ({ open, onClose, onSubmit, doctor }) => {
  const [form, setForm] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    notes: "",
    urgency: "Normal",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        notes: "",
        urgency: "Normal",
      });
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () => {
    setForm({
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      notes: "",
      urgency: "Normal",
    });
    setSuccess(false);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // simulate API
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSuccess(true);
    onSubmit?.({
      ...form,
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      createdAt: new Date().toISOString(),
      status: "pending",
      id: `ref-${Date.now()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold">Refer Patient {doctor ? `to ${doctor.name}` : ""}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Referral Sent</h4>
            <p className="text-gray-600 mb-6">
              We've shared the patient details with {doctor?.name}. You can track status in <b>My Referrals</b>.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Referral
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Patient Name</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={form.patientName}
                  onChange={(e) => update("patientName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={form.patientPhone}
                  onChange={(e) => update("patientPhone", e.target.value)}
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={form.patientEmail}
                  onChange={(e) => update("patientEmail", e.target.value)}
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Urgency</label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={form.urgency}
                  onChange={(e) => update("urgency", e.target.value)}
                >
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600">Notes</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Describe symptoms, history, or reason for referral…"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.patientName}
                className="px-5 py-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Referral
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** ───────────────────────── Doctor Card ───────────────────────── */
const DoctorCard = ({ d, onRefer }) => (
  <Card className="p-5">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-full bg-pink-100 text-pink-700 grid place-items-center font-semibold">
        {d.name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900">{d.name}</h4>
          <Tag>{d.speciality}</Tag>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" /> {d.rating} ({d.reviews})
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {d.city} • {d.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1">
            <Stethoscope className="h-4 w-4" /> {d.languages.join(", ")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Fee:</span> PKR {d.fee.toLocaleString()}{" "}
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {d.slotsToday > 0 ? `${d.slotsToday} slots today` : "No slots today"}
            </span>
          </div>
          <button
            onClick={() => onRefer(d)}
            className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
          >
            Refer Patient
          </button>
        </div>
      </div>
    </div>
  </Card>
);

/** ───────────────────────── Main Page ───────────────────────── */
const ReferralCheckout = () => {
  const [tab, setTab] = useState("marketplace"); // marketplace | referrals
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");
  const [city, setCity] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [referrals, setReferrals] = useState([]);

  const filtered = useMemo(() => {
    let items = DOCTORS;
    if (spec !== "All") items = items.filter((d) => d.speciality === spec);
    if (city !== "All") items = items.filter((d) => d.city === city);
    if (q.trim()) {
      const s = q.toLowerCase();
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.speciality.toLowerCase().includes(s) ||
          d.city.toLowerCase().includes(s)
      );
    }
    return items;
  }, [q, spec, city]);

  const openRefer = (doc) => {
    setSelectedDoctor(doc);
    setOpenModal(true);
  };

  const onReferralSubmitted = (r) => {
    setReferrals((prev) => [r, ...prev]);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 space-y-6">
      {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-pink-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CareLink</h1>
            </div>
            <p className="text-gray-600">Find doctors and send referrals in one place.</p>
          </div>
          <div className="flex gap-2">
            <PillButton active={tab === "marketplace"} onClick={() => setTab("marketplace")}>
              Marketplace
            </PillButton>
            <PillButton active={tab === "referrals"} onClick={() => setTab("referrals")}>
              My Referrals
            </PillButton>
          </div>
        </div>

        {tab === "marketplace" ? (
          <>
            {/* Search / Filters */}
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="Search doctor, speciality, city…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                  >
                    {SPECIALITIES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Verified Doctors Only</span>
                </div>
              </div>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.length === 0 ? (
                <Card className="p-8 text-center text-gray-600">No doctors found for your filters.</Card>
              ) : (
                filtered.map((d) => <DoctorCard key={d.id} d={d} onRefer={openRefer} />)
              )}
            </div>
          </>
        ) : (
          /* My Referrals */
          <div>
            {referrals.length === 0 ? (
              <Card className="p-8 text-center text-gray-600">
                No referrals yet. Go to <b>Marketplace</b> and click <i>Refer Patient</i>.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {referrals.map((r) => (
                  <Card key={r.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{r.patientName}</div>
                        <div className="text-sm text-gray-600">
                          Referred to <b>{r.doctorName}</b> • <Tag>{r.urgency}</Tag>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-4 w-4" /> {r.patientEmail || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-4 w-4" /> {r.patientPhone || "—"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                        {r.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 line-clamp-3">{r.notes || "No notes"}</div>
                    <div className="mt-4 text-xs text-gray-400">Created: {new Date(r.createdAt).toLocaleString()}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Referral modal */}
      <ReferralModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onReferralSubmitted}
        doctor={selectedDoctor}
      />
    </div>
  );
};

export default ReferralCheckout;
