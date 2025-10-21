import React, { useState } from 'react';
import { Eye, EyeClosed, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { FormicaForm } from '../../../components/forms';
import { doctorFormicaSchemas } from '../../../utils/validation/formicaSchemas';

/**
 * Specialized Doctor Registration Form Component
 * Multi-step wizard for doctor registration
 */
const DoctorRegisterForm = ({ 
  onSubmit, 
  onError, 
  defaultValues = {},
  className = '',
  ...props 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'hematology', label: 'Hematology' },
    { value: 'infectious_disease', label: 'Infectious Disease' },
    { value: 'internal_medicine', label: 'Internal Medicine' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'pulmonology', label: 'Pulmonology' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'urology', label: 'Urology' },
    { value: 'other', label: 'Other' }
  ];

  const consultationTypeOptions = [
    { value: 'online', label: 'Online Consultation' },
    { value: 'in-person', label: 'In-Person Consultation' },
    { value: 'both', label: 'Both Online & In-Person' }
  ];

  const availabilityOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'portuguese', label: 'Portuguese' }
  ];

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Professional Details', description: 'Credentials & experience' },
    { id: 3, title: 'Consultation Settings', description: 'Services & availability' },
    { id: 4, title: 'Account Security', description: 'Password & verification' }
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormicaForm
      schema={doctorFormicaSchemas.doctorRegistration}
      onSubmit={onSubmit}
      onError={onError}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        specialty: '',
        licenseNumber: '',
        phone: '',
        experience: '',
        bio: '',
        consultationType: '',
        consultationFee: '',
        appointmentDuration: 30,
        availability: [],
        languages: [],
        ...defaultValues
      }}
      className={`auth-form ${className}`}
      {...props}
    >
      {({ Field, Select, isSubmitting, isValid }) => (
        <>
          {/* Step Indicator */}
          <div className="mb-10 px-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                        currentStep === step.id
                          ? 'bg-pink-500 text-white ring-4 ring-pink-200 scale-110'
                          : currentStep > step.id
                          ? 'bg-green-500 text-white ring-2 ring-green-200'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <span className="text-base">{step.id}</span>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-semibold ${
                        currentStep >= step.id ? 'text-pink-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 hidden md:block mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all duration-300 rounded-full ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 px-2">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600">Let's start with your basic details</p>
                </div>

                <div className="auth-form-row">
                  <div className="auth-field">
                    <Field
                      label="First Name"
                      name="firstName"
                      placeholder="Enter first name"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-field">
                    <Field
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter last name"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    className="auth-input"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6 px-2">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional Details</h3>
                  <p className="text-gray-600">Your medical credentials and experience</p>
                </div>

                <div className="auth-field">
                  <Select
                    label="Medical Specialty"
                    name="specialty"
                    placeholder="Select your medical specialty"
                    options={specialtyOptions}
                    required
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <Field
                    label="Medical License Number"
                    name="licenseNumber"
                    placeholder="Enter your medical license number"
                    required
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <Field
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    placeholder="Enter years of experience"
                    required
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <Field
                    label="Professional Bio"
                    name="bio"
                    type="textarea"
                    placeholder="Tell us about your professional background and expertise (minimum 50 characters)"
                    required
                    className="auth-input"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Consultation Settings */}
            {currentStep === 3 && (
              <div className="space-y-6 px-2">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Consultation Settings</h3>
                  <p className="text-gray-600">Set up your consultation preferences</p>
                </div>

                <div className="auth-field">
                  <Select
                    label="Consultation Type"
                    name="consultationType"
                    placeholder="Select consultation type"
                    options={consultationTypeOptions}
                    required
                    className="auth-input"
                  />
                </div>

                <div className="auth-form-row">
                  <div className="auth-field">
                    <Field
                      label="Consultation Fee (USD)"
                      name="consultationFee"
                      type="number"
                      placeholder="Enter consultation fee"
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-field">
                    <Field
                      label="Appointment Duration (minutes)"
                      name="appointmentDuration"
                      type="number"
                      placeholder="Enter appointment duration"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">
                    Available Days <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {availabilityOptions.map((day) => (
                      <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="availability"
                          value={day.value}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">
                    Languages Spoken <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {languageOptions.map((lang) => (
                      <label key={lang.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="languages"
                          value={lang.value}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">{lang.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Account Security */}
            {currentStep === 4 && (
              <div className="space-y-6 px-2">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h3>
                  <p className="text-gray-600">Create a secure password for your account</p>
                </div>

                <div className="auth-form-row">
                  <div className="auth-field auth-password-field">
                    <Field
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="auth-field auth-password-field">
                    <Field
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-pink-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting || !isValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="auth-footer mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/doctor/login" className="text-pink-600 hover:text-pink-500 font-medium">
                Sign in
              </a>
            </p>
          </div>
        </>
      )}
    </FormicaForm>
  );
};

export default DoctorRegisterForm;
