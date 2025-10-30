import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import logo from '../../../assets/Logo.png';
import loginLogo from '../../../assets/LoginLogo.png';

const PlusUnlockedPage = () => {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        // Mark plus unlocked and go to subscription plans
        localStorage.setItem('plusUnlocked', 'true');
        navigate('/subscription-plans');
    };

    return (
        <div
            className="min-h-screen flex flex-col px-4 py-5 overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #FFFBFD 0%, #FDE4F8 28%, #FFF7EA 100%)' }}
        >
            {/* Header - Logo in top left */}
            <div className="w-full flex justify-start items-center mb-4">
                <div className="flex items-center pl-4">
                    <img src={logo} alt="Cira Logo" className="h-7 w-auto" />
                </div>
            </div>


            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full text-center">
                    {/* Main Logo */}
                    <div className="flex justify-center mb-4">
                        <img
                            src={loginLogo}
                            alt="Login Logo"
                            className="w-28 h-28"
                        />
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        Chatia Plus Unlocked
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-base mb-6 leading-relaxed">
                        Exclusive perks await with premium Chatia Plus subscriptions today.
                    </p>

                    {/* Feature Card */}
                    <div className="bg-white/40 rounded-2xl p-4 shadow-lg border border-gray-100 mb-8 max-w-sm mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Feature 1 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mb-2">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Seamless AI Assistance</h3>
                                <p className="text-gray-600 text-xs" style={{ lineHeight: '1.4' }}>Get instant, smart, and personalized responses anytime you need them.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mb-2">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Unlimited Access</h3>
                                <p className="text-gray-600 text-xs" style={{ lineHeight: '1.4' }}>Enjoy unlimited chat and assistance without restrictions on usage.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mb-2">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm">24/7 Availability</h3>
                                <p className="text-gray-600 text-xs" style={{ lineHeight: '1.4' }}>Connect with Chatia at any time of day, ensuring you're never without support.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mb-2">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-sm">Adaptive Learning</h3>
                                <p className="text-gray-600 text-xs" style={{ lineHeight: '1.4' }}>Chatia improves over time, getting smarter with every interaction to better meet your needs.</p>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Button */}
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-3 px-6 rounded-3xl font-bold text-lg bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 transform active:scale-95 transition-all duration-200 shadow-lg max-w-sm mx-auto"
                    >
                        Upgrade to Plus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlusUnlockedPage;
