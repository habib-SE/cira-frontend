# CIRA Frontend - Complete Folder Structure

## 📁 **Root Directory**
```
cira-frontend/
├── dist/                          # Build output directory
├── node_modules/                  # Dependencies
├── public/                        # Static assets
├── src/                          # Source code
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── eslint.config.js              # ESLint configuration
├── index.html                    # Main HTML file
├── package.json                  # Project dependencies
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.js                # Vite build configuration
```

## 📁 **Source Code Structure (`src/`)**

### **Core Application Files**
```
src/
├── App.jsx                       # Main application component
├── App.css                       # Global application styles
├── main.jsx                      # Application entry point
├── index.css                     # Global CSS styles
└── styles.css                    # Additional global styles
```

### **Pages (`src/pages/`)**
```
src/pages/
├── Home.jsx                      # Landing page
├── landingpage/                  # Landing page components
│   ├── AdvanceTechDesign.jsx
│   ├── BGVedio.jsx
│   ├── Experience.jsx
│   ├── Footer.jsx
│   ├── Insights.jsx
│   ├── Integration.jsx
│   ├── YoutubeBackground.jsx
│   ├── ZofyIntro.jsx
│   ├── ZofySection.jsx
│   └── ZofyTalk.jsx
└── login/                        # Centralized login pages
    ├── index.js                  # Login pages exports
    ├── MainLoginPage.jsx         # Main login (Admin/Doctor/Patient)
    └── DoctorLoginPage.jsx       # Doctor-specific login
```

### **Components (`src/components/`)**
```
src/components/
├── Header.jsx                    # Main header component
├── HeroSection.jsx               # Hero section component
├── ProtectedRoute.jsx            # Route protection component
├── ResponsiveContainer.jsx       # Responsive wrapper
├── ResponsiveTable.jsx           # Responsive table component
├── TrustedSection.jsx            # Trusted partners section
├── forms/                        # Form components
│   ├── index.js                  # Form components exports
│   ├── FormCheckbox.jsx          # Checkbox form component
│   ├── FormField.jsx             # Basic form field
│   ├── FormicaForm.jsx           # Formica form wrapper
│   ├── FormicaFormField.jsx      # Formica form field
│   ├── FormicaFormSelect.jsx     # Formica select component
│   ├── FormicaFormTextarea.jsx   # Formica textarea component
│   ├── FormicaValidatedForm.jsx  # Formica validated form
│   ├── FormSelect.jsx            # Basic select component
│   ├── FormTextarea.jsx          # Basic textarea component
│   └── ValidatedForm.jsx         # Validated form component
├── shared/                       # Shared components
│   ├── index.js                  # Shared components exports
│   ├── BaseLayout.jsx            # Base layout component
│   ├── BaseNavbar.jsx            # Base navbar component
│   ├── Button.jsx                # Button component
│   ├── FormInput.jsx             # Form input component
│   ├── PageHeader.jsx            # Page header component
│   ├── PageLoader.jsx            # Loading component
│   ├── PageWrapper.jsx           # Page wrapper component
│   └── StatsCard.jsx             # Statistics card component
└── voice/                        # Voice-related components
    └── NurseAvatar.jsx           # Nurse avatar component
```

### **Admin Panel (`src/Admin panel/`)**
```
src/Admin panel/
├── admin/                        # Admin portal
│   ├── admincomponents/          # Admin-specific components
│   │   ├── AdminLayout.jsx       # Admin layout wrapper
│   │   ├── AuthWrapper.jsx       # Authentication wrapper
│   │   ├── Button.jsx            # Admin button component
│   │   ├── Card.jsx              # Card component
│   │   ├── Chart.jsx             # Chart component
│   │   ├── Header.jsx            # Admin header
│   │   ├── InputField.jsx        # Input field component
│   │   ├── PhoneNumberInput.css  # Phone input styles
│   │   ├── PhoneNumberInput.jsx  # Phone input component
│   │   └── ProfileIcon.jsx       # Profile icon component
│   └── adminpages/               # Admin pages
│       ├── AdminLandingPage.jsx  # Admin landing page
│       ├── AIReports.jsx         # AI reports page
│       ├── Appointments.jsx      # Appointments management
│       ├── Dashboard.jsx         # Admin dashboard
│       ├── DoctorProfile.jsx     # Doctor profile page
│       ├── DoctorProfileDetail.jsx # Doctor profile details
│       ├── Doctors.jsx           # Doctors management
│       ├── EmailConfirmPage.jsx  # Email confirmation
│       ├── EnablePermissionPage.jsx # Permission enablement
│       ├── OptimizedRegisterPage.jsx # Optimized registration
│       ├── Patients.jsx          # Patients management
│       ├── Payments.jsx          # Payments management
│       ├── PlusUnlockedPage.jsx  # Plus features page
│       ├── Referrals.jsx         # Referrals management
│       ├── RegisterPage.jsx      # Registration page
│       ├── Reports.jsx           # Reports page
│       ├── Settings.jsx          # Admin settings
│       ├── SubscriptionPlansPage.jsx # Subscription plans
│       ├── Users.jsx             # Users management
│       └── WelcomePage.jsx       # Welcome page
├── doctor/                       # Doctor portal
│   ├── doctorcomponents/         # Doctor-specific components
│   │   └── DoctorLayout.jsx      # Doctor layout wrapper
│   └── doctorpages/              # Doctor pages
│       ├── AppointmentDetail.jsx # Appointment details
│       ├── DoctorAnalytics.jsx   # Doctor analytics
│       ├── DoctorAppointments.jsx # Doctor appointments
│       ├── DoctorDashboard.jsx   # Doctor dashboard
│       ├── DoctorMessages.jsx    # Doctor messages
│       ├── DoctorPatients.jsx    # Doctor patients
│       ├── DoctorPrescriptions.jsx # Doctor prescriptions
│       ├── DoctorProfile.jsx     # Doctor profile
│       ├── DoctorRecords.jsx     # Doctor records
│       ├── DoctorSchedule.jsx    # Doctor schedule
│       ├── DoctorSettings.jsx    # Doctor settings
│       ├── Earnings.jsx          # Doctor earnings
│       └── ProfileWizard.jsx     # Profile setup wizard
├── patient/                      # Patient portal
│   ├── patientcomponents/        # Patient-specific components
│   │   └── PatientLayout.jsx     # Patient layout wrapper
│   └── patientpages/             # Patient pages
│       ├── AI_Nurse.jsx          # AI nurse interface
│       ├── History.jsx           # Medical history
│       ├── MedicalRecords.jsx    # Medical records
│       ├── Messages.jsx          # Patient messages
│       ├── MyDoctors.jsx         # My doctors list
│       ├── PatientAppointments.jsx # Patient appointments
│       ├── PatientDashboard.jsx  # Patient dashboard
│       ├── PatientMessages.jsx   # Patient messages
│       ├── PatientProfile.jsx    # Patient profile
│       ├── PatientReportDetails.jsx # Report details
│       ├── PatientReports.jsx    # Patient reports
│       ├── PatientSettings.jsx   # Patient settings
│       ├── PatientSubscriptions.jsx # Patient subscriptions
│       ├── Prescriptions.jsx     # Prescriptions
│       ├── ReferralCheckout.jsx  # Referral checkout
│       └── Settings.jsx          # Patient settings
└── shared/                       # Shared admin panel components
    ├── index.js                  # Shared components exports
    ├── UnifiedNavbar.jsx         # Unified navigation bar
    └── UnifiedSidebar.jsx        # Unified sidebar
```

### **Modules (`src/modules/`)**
```
src/modules/
└── auth/                         # Authentication module
    ├── index.js                  # Auth module exports
    ├── components/               # Auth components
    │   └── AuthLayout.jsx        # Authentication layout
    ├── forms/                    # Auth form components
    │   ├── DoctorRegisterForm.jsx # Doctor registration form
    │   ├── LoginForm.jsx         # Login form component
    │   └── RegisterForm.jsx      # Registration form
    ├── pages/                    # Auth pages
    │   └── RegisterPage.jsx      # Registration page
    └── styles/                   # Auth styles
        └── auth.css              # Authentication styles
```

### **Utilities (`src/utils/`)**
```
src/utils/
├── elevenLabsAgent.js            # ElevenLabs AI agent
└── validation/                   # Validation utilities
    ├── index.js                  # Validation exports
    ├── adminSchemas.js           # Admin validation schemas
    ├── authSchemas.js            # Auth validation schemas
    ├── doctorSchemas.js          # Doctor validation schemas
    ├── formica.js                # Formica validation library
    ├── patientSchemas.js         # Patient validation schemas
    ├── validationUtils.js        # Validation utilities
    └── formicaSchemas/           # Formica schema definitions
        ├── adminSchemas.js       # Admin Formica schemas
        ├── authSchemas.js        # Auth Formica schemas
        ├── commonSchemas.js      # Common Formica schemas
        ├── doctorSchemas.js      # Doctor Formica schemas
        ├── index.js              # Formica schemas exports
        └── patientSchemas.js     # Patient Formica schemas
```

### **Other Directories**
```
src/
├── agent/                        # AI agent functionality
│   └── realtime/                 # Real-time agent features
│       ├── CiraRealtimeAssistant.jsx # Real-time assistant
│       └── useRealtimeAgent.js   # Real-time agent hook
├── assets/                       # Static assets
│   ├── Logo.png                  # Main logo
│   ├── LoginLogo.png             # Login page logo
│   ├── doctor.png                # Doctor image
│   ├── doctorImage.png           # Doctor profile image
│   ├── orb.riv                   # Rive animation file
│   ├── react.svg                 # React logo
│   └── [various flag images]     # Country flags
├── assistant/                    # AI assistant components
│   ├── CiraAssistant.jsx         # Main assistant component
│   └── CiraMobileBanner.jsx      # Mobile banner
├── context/                      # React context providers
│   └── AuthContext.jsx           # Authentication context
├── routes/                       # Application routing
│   └── MainRouter.jsx            # Main router configuration
└── styles/                       # Global styles
    ├── banner.css                # Banner styles
    └── forms.css                 # Form styles
```

## 🎯 **Key Features by Directory**

### **Authentication System**
- **Login Pages**: `src/pages/login/` (centralized)
- **Auth Module**: `src/modules/auth/` (forms and components)
- **Context**: `src/context/AuthContext.jsx`

### **Portal Structure**
- **Admin Portal**: `src/Admin panel/admin/`
- **Doctor Portal**: `src/Admin panel/doctor/`
- **Patient Portal**: `src/Admin panel/patient/`
- **Shared Components**: `src/Admin panel/shared/`

### **Reusable Components**
- **Form Components**: `src/components/forms/`
- **Shared Components**: `src/components/shared/`
- **Voice Components**: `src/components/voice/`

### **Validation System**
- **Formica Schemas**: `src/utils/validation/formicaSchemas/`
- **Validation Utils**: `src/utils/validation/`

## 📊 **File Count Summary**
- **Total Files**: ~150+ files
- **React Components**: ~100+ JSX files
- **CSS Files**: ~10+ style files
- **Configuration**: ~5+ config files
- **Assets**: ~20+ image/asset files

## 🔧 **Build Configuration**
- **Vite**: Modern build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Frontend library
- **React Router**: Client-side routing
- **Formica**: Form validation library

---
*This structure represents a comprehensive healthcare management system with role-based access for administrators, doctors, and patients.*
