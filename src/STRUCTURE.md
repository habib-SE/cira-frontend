# Project Structure

## Directory Organization

```
src/
├── Admin panel/                  # All portal modules (Admin, Doctor, Patient)
│   ├── admin/                   # Admin Portal
│   │   ├── admincomponents/     # Admin-specific components
│   │   │   ├── AdminLayout.jsx  # Uses BaseLayout
│   │   │   ├── Navbar.jsx       # DEPRECATED - Use BaseNavbar
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   └── adminpages/          # Admin pages
│   │       ├── Dashboard.jsx
│   │       ├── Appointments.jsx
│   │       ├── Users.jsx
│   │       └── ...
│   │
│   ├── doctor/                  # Doctor Portal
│   │   ├── doctorcomponents/    # Doctor-specific components
│   │   │   ├── DoctorLayout.jsx # Uses BaseLayout
│   │   │   ├── DoctorNavbar.jsx # DEPRECATED - Use BaseNavbar
│   │   │   └── DoctorSidebar.jsx
│   │   └── doctorpages/         # Doctor pages
│   │       ├── DoctorDashboard.jsx
│   │       ├── DoctorAppointments.jsx
│   │       ├── DoctorPatients.jsx
│   │       └── ...
│   │
│   └── patient/                 # Patient Portal
│       ├── patientcomponents/   # Patient-specific components
│       │   ├── PatientLayout.jsx # Uses BaseLayout
│       │   ├── PatientNavbar.jsx # DEPRECATED - Use BaseNavbar
│       │   └── PatientSidebar.jsx
│       └── patientpages/        # Patient pages
│           ├── PatientDashboard.jsx
│           ├── PatientAppointments.jsx
│           ├── PatientProfile.jsx
│           └── ...
│
├── components/                  # Shared/Global components
│   ├── shared/                  # NEW: Reusable components
│   │   ├── BaseLayout.jsx      # Base layout for all portals
│   │   ├── BaseNavbar.jsx      # Unified navbar component
│   │   ├── PageLoader.jsx      # Loading states
│   │   ├── PageWrapper.jsx     # Page wrapper
│   │   ├── PageHeader.jsx      # Page headers
│   │   ├── FormInput.jsx       # Form inputs
│   │   ├── Button.jsx          # Buttons
│   │   ├── StatsCard.jsx       # Stats cards
│   │   ├── README.md           # Documentation
│   │   └── index.js            # Exports
│   │
│   ├── forms/                   # Form components
│   ├── ProtectedRoute.jsx
│   └── ...
│
├── context/                     # React contexts
│   └── AuthContext.jsx
│
├── routes/                      # Routing configuration
│   └── MainRouter.jsx
│
├── utils/                       # Utility functions
│   └── validation/
│
└── assets/                      # Static assets
```

## Portal Structure

### Admin Portal
**Path:** `src/Admin panel/admin/`
- **Layout:** Uses `BaseLayout` with admin sidebar
- **Features:** User management, doctor management, appointments, reports, payments
- **Access:** Admin role only

### Doctor Portal
**Path:** `src/Admin panel/doctor/`
- **Layout:** Uses `BaseLayout` with doctor sidebar
- **Features:** Patient management, appointments, prescriptions, analytics, earnings
- **Access:** Doctor role only

### Patient Portal
**Path:** `src/Admin panel/patient/`
- **Layout:** Uses `BaseLayout` with patient sidebar (persistent on mobile)
- **Features:** Health dashboard, appointments, reports, prescriptions, AI nurse
- **Access:** Patient role only
- **Special:** Pink background theme

## Shared Components

All portals now use shared components from `src/components/shared/`:

1. **BaseLayout** - Unified layout component
2. **BaseNavbar** - Unified navbar with role-based customization
3. **PageLoader** - Loading states (default & blur variants)
4. **PageWrapper** - Page wrapper with consistent styling
5. **PageHeader** - Standardized page headers
6. **FormInput** - Standardized form inputs
7. **Button** - Standardized buttons
8. **StatsCard** - Reusable stats cards

## Deprecated Components

The following components are deprecated and should be migrated to shared components:

- `Admin panel/admin/admincomponents/Navbar.jsx` → Use `BaseNavbar`
- `Admin panel/doctor/doctorcomponents/DoctorNavbar.jsx` → Use `BaseNavbar`
- `Admin panel/patient/patientcomponents/PatientNavbar.jsx` → Use `BaseNavbar`

## Migration Guide

### For New Pages

```jsx
// Use shared components
import { PageWrapper, PageHeader, Button, StatsCard } from '../../../components/shared';

const MyNewPage = () => (
  <PageWrapper>
    <PageHeader
      title="Page Title"
      description="Page description"
      actionButton={<Button variant="primary">Action</Button>}
    />
    {/* Content */}
  </PageWrapper>
);
```

### For Existing Pages

1. Import shared components
2. Replace custom headers with `PageHeader`
3. Replace custom wrappers with `PageWrapper`
4. Replace custom buttons with `Button`
5. Replace custom stats with `StatsCard`

## Benefits

✅ **Consistency** - All portals use the same components
✅ **Maintainability** - Changes apply to all portals
✅ **Reusability** - Components can be used anywhere
✅ **Performance** - Reduced bundle size
✅ **Scalability** - Easy to add new portals

## Cleanup Completed

- ✅ Removed duplicate `src/doctor/` folder
- ✅ Removed standalone `src/Admin panel/Appointments.jsx`
- ✅ Consolidated all portals into `Admin panel/` folder
- ✅ Created shared components
- ✅ Optimized layouts to use BaseLayout
