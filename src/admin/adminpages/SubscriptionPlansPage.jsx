import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import loginLogo from '../../assets/LoginLogo.png';

const 
SubscriptionPlansPage = () => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        // Navigate to login page after upgrade
        navigate('/login');
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
            id: 'pro',
            title: 'Pro Plan',
            description: 'Designed for small businesses with team features, analytics, and 500 messages per month.',
            price: '$29.99/month',
            isPopular: false
        },
       
    ];

    return (
        <div
            className="min-h-screen flex flex-col px-4 py-5 overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Header - Logo in top left */}
            <div className="w-full flex justify-start items-center mb-2">
                <div className="flex items-center pl-4">
                    <img src={logo} alt="Cira Logo" className="h-7 w-auto" />
                </div>
            </div>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-6xl text-center">
                 {/* Main Logo */}
                 <div className="flex justify-center mb-1">
                        <img
                            src={loginLogo}
                            alt="Login Logo"
                            className="w-28 h-28"
                        />
                    </div>
                    {/* Main Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
                        Choose Your Plan
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-base mb-2 leading-relaxed">
                        Unlock premium features and enhance your Chatia experience
                    </p>

                                         {/* Subscription Plans */}
                    <div className="flex justify-center items-start gap-4 mb-3">
                         {subscriptionPlans.map((plan) => (
                             <div
                                 key={plan.id}
                                className={`bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-80 h-80 ${
                                    plan.isPopular 
                                        ? 'border-pink-300 ring-2 ring-pink-100' 
                                        : 'border-gray-200 hover:border-pink-200'
                                }`}
                             >
                                 {/* Popular Badge */}
                                 {plan.isPopular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        ⭐ Most Popular
                                     </div>
                                 )}
                                 
                                <div className="text-center">
                                    <h2 className="font-bold text-gray-900 mb-3 text-xl">{plan.title}</h2>
                                    <div className="text-3xl font-bold text-pink-500 mb-4">{plan.price}</div>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{plan.description}</p>
                                    
                                    {/* Features for each plan */}
                                    <div className="space-y-1 text-left">
                                        {plan.id === 'basic' && (
                                            <>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>100 messages/month</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>Basic AI features</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>Email support</span>
                                                </div>
                                            </>
                                        )}
                                        {plan.id === 'pro' && (
                                            <>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>500 messages/month</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>Advanced AI features</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>Team collaboration</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                                    <span>Analytics dashboard</span>
                                                </div>
                                            </>
                                        )}
                                      
                                    </div>
                                 </div>
                             </div>
                         ))}
                     </div>

                    {/* Upgrade Button */}
                    <div className="w-full max-w-md mx-auto">
                    <button
                        onClick={handleUpgrade}
                            className="w-full py-4 px-6 rounded-3xl font-bold text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 active:from-pink-700 active:to-pink-800 transform active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                            Start Your Journey
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlansPage;
