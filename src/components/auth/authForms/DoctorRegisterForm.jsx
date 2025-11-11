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




// import React, { useState } from 'react';
// import { Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
// import { FormicaForm } from '../../../components/forms';
// import { doctorFormicaSchemas } from '../../../utils/validation/formicaSchemas';

// const DoctorRegisterForm = ({
//   onSubmit,
//   onError,
//   defaultValues = {},
//   className = '',
//   ...props
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const specialtyOptions = [
//     { value: 'cardiology', label: 'Cardiology' },
//     { value: 'dermatology', label: 'Dermatology' },
//     { value: 'endocrinology', label: 'Endocrinology' },
//     { value: 'gastroenterology', label: 'Gastroenterology' },
//     { value: 'hematology', label: 'Hematology' },
//     { value: 'infectious_disease', label: 'Infectious Disease' },
//     { value: 'internal_medicine', label: 'Internal Medicine' },
//     { value: 'neurology', label: 'Neurology' },
//     { value: 'oncology', label: 'Oncology' },
//     { value: 'orthopedics', label: 'Orthopedics' },
//     { value: 'pediatrics', label: 'Pediatrics' },
//     { value: 'psychiatry', label: 'Psychiatry' },
//     { value: 'pulmonology', label: 'Pulmonology' },
//     { value: 'radiology', label: 'Radiology' },
//     { value: 'surgery', label: 'Surgery' },
//     { value: 'urology', label: 'Urology' },
//     { value: 'other', label: 'Other' },
//   ];

//   const consultationTypeOptions = [
//     { value: 'online', label: 'Online Consultation' },
//     { value: 'in-person', label: 'In-Person Consultation' },
//     { value: 'both', label: 'Both Online & In-Person' },
//   ];

//   const availabilityOptions = [
//     { value: 'monday', label: 'Monday' },
//     { value: 'tuesday', label: 'Tuesday' },
//     { value: 'wednesday', label: 'Wednesday' },
//     { value: 'thursday', label: 'Thursday' },
//     { value: 'friday', label: 'Friday' },
//     { value: 'saturday', label: 'Saturday' },
//     { value: 'sunday', label: 'Sunday' },
//   ];

//   const languageOptions = [
//     { value: 'english', label: 'English' },
//     { value: 'spanish', label: 'Spanish' },
//     { value: 'french', label: 'French' },
//     { value: 'german', label: 'German' },
//     { value: 'chinese', label: 'Chinese' },
//     { value: 'arabic', label: 'Arabic' },
//     { value: 'hindi', label: 'Hindi' },
//     { value: 'portuguese', label: 'Portuguese' },
//   ];

//   const steps = [
//     { id: 1, title: 'Personal Info' },
//     { id: 2, title: 'Professional' },
//     { id: 3, title: 'Consultation' },
//     { id: 4, title: 'Security' },
//   ];

//   const totalSteps = steps.length;

//   const handleNext = () => {
//     if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
//   };

//   const handlePrevious = () => {
//     if (currentStep > 1) setCurrentStep((s) => s - 1);
//   };

//   return (
//     <div className="w-full flex items-center justify-center">
//       <FormicaForm
//         schema={doctorFormicaSchemas.doctorRegistration}
//         onSubmit={onSubmit}
//         onError={onError}
//         defaultValues={{
//           firstName: '',
//           lastName: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           specialty: '',
//           licenseNumber: '',
//           phone: '',
//           experience: '',
//           bio: '',
//           consultationType: '',
//           consultationFee: '',
//           appointmentDuration: 30,
//           availability: [],
//           languages: [],
//           ...defaultValues,
//         }}
//         className={`
//           w-full max-w-4xl 
//           bg-white/95 backdrop-blur-xl
//           rounded-3xl 
//           shadow-[0_18px_60px_rgba(15,23,42,0.14)]
//           border border-slate-100
//           px-6 py-6 sm:px-8 sm:py-7
//           flex flex-col
//           max-h-[82vh]
//           ${className}
//         `}
//         {...props}
//       >
//         {({ Field, Select, isSubmitting, isValid }) => (
//           <>
//             {/* Header */}
//             <div className="flex items-center justify-between gap-4 mb-4">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
//                   Join Cira&apos;s Doctor Network
//                 </h2>
//                 <p className="text-[10px] sm:text-xs text-slate-500">
//                   A short, guided signup. You&apos;ll be ready to see patients in minutes.
//                 </p>
//               </div>
//               <div className="hidden sm:flex flex-col items-end">
//                 <span className="text-[10px] text-slate-500">
//                   Step {currentStep} of {totalSteps}
//                 </span>
//                 <div className="mt-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all"
//                     style={{ width: `${(currentStep / totalSteps) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Stepper (compact) */}
//             <div className="mb-4">
//               <div className="flex items-center justify-between gap-2">
//                 {steps.map((step, idx) => {
//                   const active = currentStep === step.id;
//                   const done = currentStep > step.id;
//                   return (
//                     <React.Fragment key={step.id}>
//                       <div className="flex flex-col items-center flex-1">
//                         <div
//                           className={`
//                             w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold
//                             transition-all duration-300
//                             ${active
//                               ? 'bg-pink-500 text-white shadow-md scale-110'
//                               : done
//                               ? 'bg-emerald-500 text-white shadow-sm'
//                               : 'bg-slate-100 text-slate-400'}
//                           `}
//                         >
//                           {done ? (
//                             <CheckCircle className="w-4 h-4" />
//                           ) : (
//                             step.id
//                           )}
//                         </div>
//                         <span
//                           className={`
//                             mt-1 text-[9px] sm:text-[10px] font-medium
//                             ${active || done ? 'text-pink-500' : 'text-slate-400'}
//                           `}
//                         >
//                           {step.title}
//                         </span>
//                       </div>
//                       {idx < steps.length - 1 && (
//                         <div
//                           className={`
//                             flex-1 h-0.5 rounded-full
//                             ${currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-100'}
//                           `}
//                         />
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Content (height-limited, scroll if needed) */}
//             <div className="flex-1 overflow-y-auto pr-1 step-content">
//               {/* Step 1: Personal Info */}
//               {currentStep === 1 && (
//                 <div className="space-y-4">
//                   <p className="text-xs text-slate-500 mb-1">
//                     Tell us who you are. This helps patients recognize you.
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field
//                       label="First Name"
//                       name="firstName"
//                       placeholder="First name"
//                       required
//                       className="auth-input"
//                     />
//                     <Field
//                       label="Last Name"
//                       name="lastName"
//                       placeholder="Last name"
//                       required
//                       className="auth-input"
//                     />
//                   </div>
//                   <Field
//                     label="Email Address"
//                     name="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     required
//                     className="auth-input"
//                   />
//                   <Field
//                     label="Phone Number"
//                     name="phone"
//                     type="tel"
//                     placeholder="e.g. +1 555 000 1234"
//                     required
//                     className="auth-input"
//                   />
//                 </div>
//               )}

//               {/* Step 2: Professional Details */}
//               {currentStep === 2 && (
//                 <div className="space-y-4">
//                   <p className="text-xs text-slate-500 mb-1">
//                     A quick snapshot of your medical background.
//                   </p>
//                   <Select
//                     label="Medical Specialty"
//                     name="specialty"
//                     placeholder="Select your specialty"
//                     options={specialtyOptions}
//                     required
//                     className="auth-input"
//                   />
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field
//                       label="License Number"
//                       name="licenseNumber"
//                       placeholder="License / registration ID"
//                       required
//                       className="auth-input"
//                     />
//                     <Field
//                       label="Years of Experience"
//                       name="experience"
//                       type="number"
//                       placeholder="e.g. 5"
//                       required
//                       className="auth-input"
//                     />
//                   </div>
//                   <Field
//                     label="Short Bio"
//                     name="bio"
//                     type="textarea"
//                     rows={3}
//                     placeholder="Briefly describe your expertise and focus areas."
//                     required
//                     className="auth-input"
//                   />
//                 </div>
//               )}

//               {/* Step 3: Consultation Settings */}
//               {currentStep === 3 && (
//                 <div className="space-y-4">
//                   <p className="text-xs text-slate-500 mb-1">
//                     Define how and when you see patients.
//                   </p>
//                   <Select
//                     label="Consultation Type"
//                     name="consultationType"
//                     placeholder="Select consultation type"
//                     options={consultationTypeOptions}
//                     required
//                     className="auth-input"
//                   />
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field
//                       label="Consultation Fee (USD)"
//                       name="consultationFee"
//                       type="number"
//                       placeholder="e.g. 50"
//                       required
//                       className="auth-input"
//                     />
//                     <Field
//                       label="Appointment Duration (minutes)"
//                       name="appointmentDuration"
//                       type="number"
//                       placeholder="e.g. 20"
//                       required
//                       className="auth-input"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="auth-label text-xs font-semibold">
//                       Available Days <span className="text-pink-500">*</span>
//                     </label>
//                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
//                       {availabilityOptions.map((day) => (
//                         <label
//                           key={day.value}
//                           className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-slate-200 text-[10px] text-slate-700 cursor-pointer hover:border-pink-300 hover:bg-pink-50/60"
//                         >
//                           <input
//                             type="checkbox"
//                             name="availability"
//                             value={day.value}
//                             className="w-3 h-3 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
//                           />
//                           {day.label}
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="auth-label text-xs font-semibold">
//                       Languages Spoken <span className="text-pink-500">*</span>
//                     </label>
//                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
//                       {languageOptions.map((lang) => (
//                         <label
//                           key={lang.value}
//                           className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-slate-200 text-[10px] text-slate-700 cursor-pointer hover:border-pink-300 hover:bg-pink-50/60"
//                         >
//                           <input
//                             type="checkbox"
//                             name="languages"
//                             value={lang.value}
//                             className="w-3 h-3 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
//                           />
//                           {lang.label}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Step 4: Account Security */}
//               {currentStep === 4 && (
//                 <div className="space-y-4">
//                   <p className="text-xs text-slate-500 mb-1">
//                     Secure your account with a strong password.
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="relative">
//                       <Field
//                         label="Password"
//                         name="password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="Create a strong password"
//                         required
//                         className="auth-input pr-9"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword((v) => !v)}
//                         className="absolute right-2.5 bottom-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
//                         tabIndex={-1}
//                       >
//                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                       </button>
//                     </div>
//                     <div className="relative">
//                       <Field
//                         label="Confirm Password"
//                         name="confirmPassword"
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         placeholder="Re-enter password"
//                         required
//                         className="auth-input pr-9"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword((v) => !v)}
//                         className="absolute right-2.5 bottom-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
//                         tabIndex={-1}
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="w-4 h-4" />
//                         ) : (
//                           <Eye className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Navigation */}
//             <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
//               <button
//                 type="button"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all
//                   ${
//                     currentStep === 1
//                       ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
//                       : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-pink-300'
//                   }
//                 `}
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Previous</span>
//               </button>

//               {currentStep < totalSteps ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold
//                     bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
//                     text-white shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all"
//                 >
//                   <span>Next</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={!isValid || isSubmitting}
//                   className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all
//                     ${
//                       !isValid || isSubmitting
//                         ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
//                         : 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-lg hover:translate-y-0.5'
//                     }
//                   `}
//                 >
//                   {isSubmitting ? (
//                     <span>Creating Account...</span>
//                   ) : (
//                     <>
//                       <span>Create Account</span>
//                       <CheckCircle className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>

//             {/* Login Link */}
//             <div className="mt-3 text-center">
//               <p className="text-[10px] sm:text-xs text-slate-500">
//                 Already registered?{' '}
//                 <a
//                   href="/doctor/login"
//                   className="text-pink-500 hover:text-pink-600 font-semibold"
//                 >
//                   Sign in
//                 </a>
//               </p>
//             </div>
//           </>
//         )}
//       </FormicaForm>
//     </div>
//   );
// };

// export default DoctorRegisterForm;