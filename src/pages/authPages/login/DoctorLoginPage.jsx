import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/Logo.png';
import { 
    Stethoscope, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    UserPlus,
    ArrowLeft,
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
import { 
  FormicaValidatedForm, 
  FormicaFormField, 
  FormicaFormSelect 
} from '../../../components/forms';
import { authFormicaSchemas, doctorFormicaSchemas } from '../../../utils/validation/formicaSchemas';

const DoctorLoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showProfileCompletionPrompt, setShowProfileCompletionPrompt] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
    const [registrationStep, setRegistrationStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Debug: Log modal state changes
    useEffect(() => {
        console.log('Modal state changed:', showSuccessModal);
    }, [showSuccessModal]);

    const handleLoginSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            await login(data.email, data.password, 'doctor');
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
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
                    setLoading(false);
                }
    };

    const handleRegistrationSubmit = async (data) => {
        console.log('=== FORM SUBMITTED ===');
        console.log('Form data:', data);
        console.log('Password:', data.password);
        console.log('Confirm Password:', data.confirmPassword);
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
                // Validate passwords match
                if (data.password !== data.confirmPassword) {
                    console.log('❌ Passwords do not match');
                    setError('Passwords do not match!');
                    setLoading(false);
                    return;
                }
                
                console.log('✅ Passwords match, proceeding with registration...');
                
                // Simulate registration API call
                console.log('⏳ Simulating API call...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log('✅ API call completed');
                
                // Create doctor object with Pending status
                const newDoctor = {
                    id: Date.now(), // Generate unique ID
                    name: `Dr. ${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone,
                    specialty: data.specialty,
                    licenseNumber: data.licenseNumber,
                    experience: data.experience || '0 years',
                    bio: data.bio || '',
                    consultationType: data.consultationType,
                    consultationFee: data.consultationFee,
                    appointmentDuration: data.appointmentDuration,
                    availability: data.availability || [],
                    languages: data.languages || [],
                    status: 'Pending', // IMPORTANT: Set status to Pending
                    verificationStatus: 'Under Review',
                    joinDate: new Date().toISOString().split('T')[0],
                    avatar: `${data.firstName[0]}${data.lastName[0]}`,
                    documents: [],
                    totalPatients: 0,
                    totalAppointments: 0,
                    rating: 0,
                    createdAt: new Date().toISOString()
                };
                
                // Get existing doctors from localStorage
                const existingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
                
                // Add new doctor to the list
                existingDoctors.push(newDoctor);
                
                // Save back to localStorage
                localStorage.setItem('pendingDoctors', JSON.stringify(existingDoctors));
                
                console.log('✅ Doctor registered successfully:', newDoctor);
                console.log('✅ Saved to localStorage');
                
                setLoading(false);
                
                // Show success modal
                console.log('🎉 Showing success modal...');
                setShowSuccessModal(true);
                console.log('✅ Success modal state set to true');
                
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setIsLogin(true);
        setRegistrationStep(1);
    };

    const handleFormError = (error) => {
        console.error('Formica validation error:', error);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        if (value && confirmPassword) {
            setPasswordsMatch(value === confirmPassword);
        } else {
            setPasswordsMatch(false);
        }
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        if (password && value) {
            setPasswordsMatch(password === value);
        } else {
            setPasswordsMatch(false);
        }
    };

    const handleNextStep = () => {
        if (registrationStep < 4) {
            setRegistrationStep(registrationStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (registrationStep > 1) {
            setRegistrationStep(registrationStep - 1);
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
            <div className={`w-full space-y-8 ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}>
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
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
                    {isLogin ? (
                        <FormicaValidatedForm
                            schema={authFormicaSchemas.login}
                            onSubmit={handleLoginSubmit}
                            onError={handleFormError}
                            defaultValues={{
                                email: '',
                                password: '',
                                role: 'doctor'
                            }}
                        >
                            {({ 
                                register, 
                                errors, 
                                isSubmitting, 
                                isValid, 
                                getFieldProps, 
                                getFieldError, 
                                hasFieldError 
                            }) => (
                                <div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="form-input-with-icon">
                                            <Mail className="icon-left h-5 w-5 text-gray-400" />
                                            <FormicaFormField
                                                label=""
                                                name="email"
                                                type="email"
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="doctor@example.com"
                                                required
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="form-input-with-icon">
                                            <Lock className="icon-left h-5 w-5 text-gray-400" />
                                            <FormicaFormField
                                                label=""
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="Enter your password"
                                                required
                                                className="w-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="icon-right p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

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
                                        disabled={loading || isSubmitting || !isValid}
                                        className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white py-3 px-4 rounded-xl hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {loading || isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </FormicaValidatedForm>
                    ) : (
                        <FormicaValidatedForm
                            schema={doctorFormicaSchemas.doctorRegistration}
                            onSubmit={handleRegistrationSubmit}
                            onError={(error) => {
                                console.log('Form validation error:', error);
                                handleFormError(error);
                            }}
                            defaultValues={{
                                firstName: '',
                                lastName: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                specialty: '',
                                licenseNumber: '',
                                phone: '',
                                consultationType: '',
                                consultationFee: '',
                                appointmentDuration: 30,
                                availability: [],
                                languages: []
                            }}
                        >
                            {({ 
                                register, 
                                errors, 
                                isSubmitting, 
                                isValid, 
                                getFieldProps, 
                                getFieldError, 
                                hasFieldError 
                            }) => (
                                <div className="space-y-6">
                                    {/* Admin Approval Notice */}
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <Shield className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-blue-700 font-medium">
                                                    Get admin approval before activation
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Your account will be reviewed by our admin team. You'll receive an email once approved.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step Indicator */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between">
                                            {[1, 2, 3, 4].map((step, index) => (
                                                <React.Fragment key={step}>
                                                    <div className="flex flex-col items-center flex-1 relative z-10">
                                                        <div
                                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                                                                registrationStep === step
                                                                    ? 'bg-pink-500 text-white ring-4 ring-pink-200 scale-110'
                                                                    : registrationStep > step
                                                                    ? 'bg-green-500 text-white ring-2 ring-green-200'
                                                                    : 'bg-gray-200 text-gray-500'
                                                            }`}
                                                        >
                                                            {registrationStep > step ? (
                                                                <CheckCircle className="w-7 h-7" />
                                                            ) : (
                                                                <span className="text-base">{step}</span>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 text-center">
                                                            <p className={`text-sm font-semibold ${
                                                                registrationStep >= step ? 'text-pink-600' : 'text-gray-500'
                                                            }`}>
                                                                {step === 1 && 'Personal'}
                                                                {step === 2 && 'Professional'}
                                                                {step === 3 && 'Consultation'}
                                                                {step === 4 && 'Security'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < 3 && (
                                                        <div
                                                            className={`flex-1 h-1 mx-4 transition-all duration-300 rounded-full ${
                                                                registrationStep > step ? 'bg-green-500' : 'bg-gray-200'
                                                            }`}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Step 1: Personal Information */}
                                    {registrationStep === 1 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                                                <p className="text-gray-600">Let's start with your basic details</p>
                                            </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormicaFormField
                                            label="First Name"
                                            name="firstName"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            getFieldProps={getFieldProps}
                                            getFieldError={getFieldError}
                                            hasFieldError={hasFieldError}
                                            placeholder="John"
                                            required
                                        />
                                        <FormicaFormField
                                            label="Last Name"
                                            name="lastName"
                                            type="text"
                                            register={register}
                                            errors={errors}
                                            getFieldProps={getFieldProps}
                                            getFieldError={getFieldError}
                                            hasFieldError={hasFieldError}
                                            placeholder="Doe"
                                            required
                                        />
                                </div>
                                            <FormicaFormField
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="doctor@example.com"
                                                required
                                            />
                                            <FormicaFormField
                                                label="Phone Number"
                                                name="phone"
                                                type="tel"
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="+1 (555) 123-4567"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Step 2: Professional Details */}
                                    {registrationStep === 2 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Details</h3>
                                                <p className="text-gray-600">Your medical credentials and experience</p>
                                            </div>
                                    <FormicaFormSelect
                                        label="Medical Specialty"
                                        name="specialty"
                                        register={register}
                                        errors={errors}
                                        getFieldProps={getFieldProps}
                                        getFieldError={getFieldError}
                                        hasFieldError={hasFieldError}
                                        options={specialties.map(s => ({ value: s, label: s }))}
                                        placeholder="Select your specialty"
                                        required
                                    />
                                    <FormicaFormField
                                        label="License Number"
                                        name="licenseNumber"
                                        type="text"
                                        register={register}
                                        errors={errors}
                                        getFieldProps={getFieldProps}
                                        getFieldError={getFieldError}
                                        hasFieldError={hasFieldError}
                                        placeholder="MD12345"
                                        required
                                    />
                                        </div>
                                    )}

                                    {/* Step 3: Consultation Settings */}
                                    {registrationStep === 3 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Consultation Settings</h3>
                                                <p className="text-gray-600">Set up your consultation preferences</p>
                                            </div>

                                            {/* Consultation Type */}
                                            <FormicaFormSelect
                                                label="Consultation Type"
                                                name="consultationType"
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                options={[
                                                    { value: 'online', label: 'Online Consultation' },
                                                    { value: 'in-person', label: 'In-Person Consultation' },
                                                    { value: 'both', label: 'Both Online & In-Person' }
                                                ]}
                                                placeholder="Select consultation type"
                                        required
                                    />

                                            {/* Consultation Fee */}
                                    <FormicaFormField
                                                label="Consultation Fee (USD)"
                                                name="consultationFee"
                                                type="number"
                                        register={register}
                                        errors={errors}
                                        getFieldProps={getFieldProps}
                                        getFieldError={getFieldError}
                                        hasFieldError={hasFieldError}
                                                placeholder="150"
                                        required
                                    />

                                            {/* Appointment Duration */}
                                            <FormicaFormField
                                                label="Appointment Duration (minutes)"
                                                name="appointmentDuration"
                                                type="number"
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="30"
                                    required
                                            />

                                            {/* Availability Days */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Available Days <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                                                        <label key={day} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                name="availability"
                                                                value={day}
                                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                            />
                                                            <span className="text-sm text-gray-700 capitalize">{day}</span>
                                                        </label>
                                                    ))}
                            </div>
                        </div>

                                            {/* Languages */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Languages Spoken <span className="text-red-500">*</span>
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Hindi', 'Portuguese'].map((lang) => (
                                                        <label key={lang} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                name="languages"
                                                                value={lang.toLowerCase()}
                                                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                                                            />
                                                            <span className="text-sm text-gray-700">{lang}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Account Security */}
                                    {registrationStep === 4 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h3>
                                                <p className="text-gray-600">Create a secure password for your account</p>
                                            </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                                                <div className="form-input-with-icon">
                                                    <Lock className="icon-left h-5 w-5 text-gray-400" />
                                            <FormicaFormField
                                                label=""
                                                name="password"
                                    type={showPassword ? 'text' : 'password'}
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                                placeholder="Enter your password"
                                    required
                                                        className="w-full"
                                                onChange={(e) => handlePasswordChange(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                                        className="icon-right p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                                <div className="form-input-with-icon">
                                                    <Lock className="icon-left h-5 w-5 text-gray-400" />
                                            <FormicaFormField
                                                label=""
                                                name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                                register={register}
                                                errors={errors}
                                                getFieldProps={getFieldProps}
                                                getFieldError={getFieldError}
                                                hasFieldError={hasFieldError}
                                        placeholder="Confirm your password"
                                                required
                                                        className="w-full"
                                                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="icon-right p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {!passwordsMatch && registrationStep === 4 && (
                                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                                )}
                                {passwordsMatch && registrationStep === 4 && (
                                    <p className="text-green-500 text-xs mt-1 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Passwords match
                                    </p>
                                )}
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
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                                            Registration Successful!
                                        </h3>
                                        <p className="text-sm text-green-700 mb-2">
                                            {success}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            Please wait for admin approval. You'll receive an email notification once your account is activated.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {!success && (
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                disabled={registrationStep === 1}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    registrationStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-pink-300'
                                }`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Previous</span>
                            </button>

                            {registrationStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="flex items-center space-x-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                        <button
                            type="submit"
                                        disabled={loading || isSubmitting || !passwordsMatch}
                                    className="flex items-center space-x-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => console.log('Button clicked!', { loading, isSubmitting, passwordsMatch })}
                        >
                                        {loading || isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                                <span>Create Account</span>
                                            <CheckCircle className="w-5 h-5" />
                                </>
                            )}
                        </button>
                            )}
                        </div>
                        )}
                                </div>
                            )}
                        </FormicaValidatedForm>
                    )}

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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => console.log('Modal clicked:', e.target)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Registration Successful!
                            </h3>
                            
                            {/* Message */}
                            <p className="text-gray-600 mb-6">
                                Your account has been created and sent for admin approval.
                            </p>
                            
                            {/* Info Box */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 text-left">
                                <div className="flex items-start">
                                    <Shield className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800 mb-1">
                                            Get admin approval before activation
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Your account will be reviewed by our admin team. You'll receive an email notification once your account is activated.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Button */}
                            <button
                                onClick={handleCloseSuccessModal}
                                className="w-full bg-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-pink-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorLoginPage;

