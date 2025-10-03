import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Stethoscope, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    UserPlus,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Shield,
    Award,
    Clock,
    Heart,
    User,
    FileText,
    X,
    Star
} from 'lucide-react';

const DoctorLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        specialty: '',
        licenseNumber: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showProfileCompletionPrompt, setShowProfileCompletionPrompt] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login logic with doctor branding
                await login(formData.email, formData.password, 'doctor');
                setLoginSuccess(true);
                
                // Simulate profile completion check
                const profileCompletion = Math.floor(Math.random() * 100); // 0-99%
                setProfileCompletionPercentage(profileCompletion);
                
                if (profileCompletion < 80) {
                    // Show profile completion prompt
                    setShowProfileCompletionPrompt(true);
                    setSuccess('Welcome back, Doctor! Your profile needs completion.');
                } else {
                    setSuccess('Login successful! Redirecting to your dashboard...');
                    setTimeout(() => {
                        navigate('/doctor');
                    }, 1500);
                }
            } else {
                // Registration logic
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }

                // Simulate registration API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                setSuccess('Registration successful! Please complete your profile.');
                setTimeout(() => {
                    navigate('/doctor/profile');
                }, 2000);
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const specialties = [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
        'Hematology', 'Infectious Disease', 'Nephrology', 'Neurology',
        'Oncology', 'Pediatrics', 'Psychiatry', 'Pulmonology',
        'Rheumatology', 'Urology', 'Other'
    ];

    const handleCompleteProfile = () => {
        navigate('/doctor/profile');
    };

    const handleSkipProfileCompletion = () => {
        setShowProfileCompletionPrompt(false);
        setSuccess('Redirecting to dashboard...');
        setTimeout(() => {
            navigate('/doctor');
        }, 1000);
    };

    const getProfileCompletionColor = (percentage) => {
        if (percentage < 30) return 'bg-red-500';
        if (percentage < 60) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isLogin ? 'Welcome Back, Doctor' : 'Join CIRA Medical'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin 
                            ? 'Access your medical practice dashboard' 
                            : 'Start your journey as a verified medical professional'
                        }
                    </p>
                    
                    {/* Doctor Benefits */}
                    {!isLogin && (
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1 text-green-600">
                                <Shield className="h-3 w-3" />
                                <span>Verified</span>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-600">
                                <Award className="h-3 w-3" />
                                <span>Professional</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required={!isLogin}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                {/* Specialty */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medical Specialty
                                    </label>
                                    <select
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="">Select your specialty</option>
                                        {specialties.map(specialty => (
                                            <option key={specialty} value={specialty}>
                                                {specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* License Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        License Number
                                    </label>
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="MD12345"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="doctor@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Registration only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required={!isLogin}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-xl">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white py-3 px-4 rounded-xl hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Registration */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setSuccess('');
                            }}
                            className="mt-2 text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-1 mx-auto"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>{isLogin ? 'Register as Doctor' : 'Sign In Instead'}</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>

            {/* Profile Completion Prompt Modal */}
            {showProfileCompletionPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            {/* Close Button */}
                            <button
                                onClick={handleSkipProfileCompletion}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Icon */}
                            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                                <User className="h-8 w-8 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Complete Your Profile
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4">
                                Your profile is {profileCompletionPercentage}% complete. Complete it to unlock all features and build patient trust.
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-gray-600 mb-2">
                                    <span>Profile Completion</span>
                                    <span>{profileCompletionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${getProfileCompletionColor(profileCompletionPercentage)} transition-all duration-500`}
                                        style={{ width: `${profileCompletionPercentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Complete your profile to:</h4>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Heart className="h-4 w-4 text-pink-500" />
                                        <span>Build patient trust and credibility</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span>Get featured in search results</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span>Access premium features</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleCompleteProfile}
                                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                                >
                                    Complete Profile Now
                                </button>
                                <button
                                    onClick={handleSkipProfileCompletion}
                                    className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorLogin;

