import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Check } from 'lucide-react';
import { Logo } from '../../../components/shared';

const 
SubscriptionPlansPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleContinue = async () => {
        if (!selectedPlan) return;
        
        setIsProcessing(true);
        
        // Store selected plan
        localStorage.setItem('selectedPlan', selectedPlan);
        localStorage.setItem('hasSubscription', 'true');
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate to user's dashboard based on role
        if (user) {
            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'user':
                    navigate('/user');
                    break;
                case 'doctor':
                    navigate('/doctor');
                    break;
                case 'company':
                    navigate('/company');
                    break;
                default:
                    navigate('/login');
            }
        } else {
            navigate('/login');
        }
        
        setIsProcessing(false);
    };

    const subscriptionPlans = [
        {
            id: 'basic',
            title: 'Basic Plan',
            description: 'Perfect for personal use with basic features and 100 monthly messages.',
            price: '$9.99/month',
            isPopular: true
        },
        {
            id: 'standard',
            title: 'Standard Plan',
            description: 'Ideal for growing teams with enhanced features and 250 monthly messages.',
            price: '$19.99/month',
            isPopular: false
        },
        {
            id: 'pro',
            title: 'Pro Plan',
            description: 'Designed for small businesses with team features, analytics, and 500 messages per month.',
            price: '$29.99/month',
            isPopular: false
        },
       
    ];

    return (
        <div
            className="min-h-screen flex flex-col px-3 sm:px-4 py-4 sm:py-5 overflow-x-hidden relative"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
        
            {/* Header - Logo in top left */}
            <div className="w-full flex justify-start items-center mb-2 sm:mb-2">
                <div className="flex items-center pl-2 sm:pl-4">
                    <Logo variant="default" alt="Cira Logo" className="h-6 sm:h-7 w-auto" />
                </div>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-0">
                <div className="w-full max-w-6xl text-center px-2">
                 {/* Main Logo */}
                 <div className="flex justify-center mb-3 sm:mb-1">
                        <Logo
                            variant="login"
                            alt="Login Logo"
                            className="w-20 h-20 sm:w-28 sm:h-28"
                        />
                    </div>
                    {/* Main Title */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-1 leading-tight">
                        Choose Your Plan
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-2 leading-relaxed px-4">
                        Unlock premium features and enhance your Chatia experience
                    </p>

                                     {/* Subscription Plans */}
                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 mb-4 sm:mb-3">
                         {subscriptionPlans.map((plan) => {
                             const isSelected = selectedPlan === plan.id;
                             return (
                             <div
                                 key={plan.id}
                                 onClick={() => handlePlanSelect(plan.id)}
                                className={`bg-white/60 backdrop-blur-sm rounded-3xl p-5 sm:p-6 shadow-lg border-2 relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full max-w-sm sm:w-80 min-h-[320px] sm:h-80 cursor-pointer ${
                                    isSelected
                                        ? 'border-pink-500 ring-4 ring-pink-200 shadow-2xl scale-[1.03]'
                                        : plan.isPopular 
                                        ? 'border-pink-300 ring-2 ring-pink-100' 
                                        : 'border-gray-200 hover:border-pink-200'
                                }`}
                             >
                                 {/* Selection Indicator */}
                                 {isSelected && (
                                    <div className="absolute top-4 right-4 w-6 h-6 sm:w-7 sm:h-7 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                 )}
                                 
                                 {/* Popular Badge */}
                                 {plan.isPopular && !isSelected && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                        ⭐ Most Popular
                                     </div>
                                 )}
                                 
                                <div className="text-center">
                                    <h2 className="font-bold text-gray-900 mb-2 sm:mb-3 text-lg sm:text-xl">{plan.title}</h2>
                                    <div className="text-2xl sm:text-3xl font-bold text-pink-500 mb-3 sm:mb-4">{plan.price}</div>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{plan.description}</p>
                                    
                                    {/* Features for each plan */}
                                    <div className="space-y-1.5 sm:space-y-1 text-left">
                                        {plan.id === 'basic' && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>100 messages/month</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Basic AI features</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Email support</span>
                                                </div>
                                            </>
                                        )}
                                        {plan.id === 'standard' && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>250 messages/month</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Enhanced AI features</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Priority support</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Basic analytics</span>
                                                </div>
                                            </>
                                        )}
                                        {plan.id === 'pro' && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>500 messages/month</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Advanced AI features</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Team collaboration</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full flex-shrink-0"></span>
                                                    <span>Analytics dashboard</span>
                                                </div>
                                            </>
                                        )}
                                      
                                    </div>
                                 </div>
                             </div>
                             );
                         })}
                     </div>

                    {/* Continue Button */}
                    <div className="w-full max-w-md mx-auto px-2">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPlan || isProcessing}
                            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg transform active:scale-95 transition-all duration-200 shadow-xl ${
                                selectedPlan && !isProcessing
                                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 hover:shadow-2xl cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                            {isProcessing ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </div>
                            ) : selectedPlan ? (
                                'Continue'
                            ) : (
                                'Select a Plan to Continue'
                            )}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlansPage;
