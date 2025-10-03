import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import WelcomePage from '../admin/adminpages/WelcomePage';
import RegisterPage from '../admin/adminpages/RegisterPage';
import LoginPage from '../admin/adminpages/LoginPage';
import EnhancedLoginPage from '../admin/adminpages/EnhancedLoginPage';
import EmailConfirmPage from '../admin/adminpages/EmailConfirmPage';
import EnablePermissionPage from '../admin/adminpages/EnablePermissionPage';
import PlusUnlockedPage from '../admin/adminpages/PlusUnlockedPage';
import SubscriptionPlansPage from '../admin/adminpages/SubscriptionPlansPage';

// Admin Portal Imports
import AdminLayout from '../admin/admincomponents/AdminLayout';
import Dashboard from '../admin/adminpages/Dashboard';
import Users from '../admin/adminpages/Users';
import Doctors from '../admin/adminpages/Doctors';
import AdminDoctorProfile from '../admin/adminpages/DoctorProfile';
import DoctorProfileDetail from '../admin/adminpages/DoctorProfileDetail';
import Patients from '../admin/adminpages/Patients';
import Appointments from '../admin/adminpages/Appointments';
import Reports from '../admin/adminpages/Reports';
import Payments from '../admin/adminpages/Payments';
import Settings from '../admin/adminpages/Settings';
import Referrals from '../admin/adminpages/Referrals';

// Patient Portal Imports
import PatientLayout from '../patient/patientcomponents/PatientLayout';
import PatientDashboard from '../patient/patientpages/PatientDashboard';
import PatientAppointments from '../patient/patientpages/PatientAppointments';
import MedicalRecords from '../patient/patientpages/MedicalRecords';
import Prescriptions from '../patient/patientpages/Prescriptions';
import MyDoctors from '../patient/patientpages/MyDoctors';
import PatientMessages from '../patient/patientpages/PatientMessages';
import PatientSettings from '../patient/patientpages/PatientSettings';

// Doctor Portal Imports
import DoctorLayout from '../doctor/doctorcomponents/DoctorLayout';
import DoctorLogin from '../doctor/doctorpages/DoctorLogin';
import DoctorDashboard from '../doctor/doctorpages/DoctorDashboard';
import ProfileWizard from '../doctor/doctorpages/ProfileWizard';
import DoctorSchedule from '../doctor/doctorpages/DoctorSchedule';
import AppointmentDetail from '../doctor/doctorpages/AppointmentDetail';
import Earnings from '../doctor/doctorpages/Earnings';
import DoctorSettings from '../doctor/doctorpages/DoctorSettings';
import DoctorProfile from '../doctor/doctorpages/DoctorProfile';

function MainRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      
      {/* Login pages - Enhanced with role-based authentication */}
      <Route path="/login" element={<EnhancedLoginPage />} />
      <Route path="/login-old" element={<LoginPage />} />
      
      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Email confirmation page */}
      <Route path="/email-confirm" element={<EmailConfirmPage />} />
      
     
      
      {/* Plus unlocked page */}
      <Route path="/plus-unlocked" element={<PlusUnlockedPage />} />
      
      {/* Subscription plans page */}
      <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
      
      {/* Admin Panel Routes - Protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<AdminDoctorProfile />} />
        <Route path="doctor-profile" element={<DoctorProfileDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="payments" element={<Payments />} />
        <Route path="settings" element={<Settings />} />
        <Route path="referrals" element={<Referrals />} />
      </Route>

      {/* Patient Portal Routes - Protected */}
      <Route 
        path="/patient" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="doctors" element={<MyDoctors />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>

      {/* Doctor Login/Registration - Public */}
      <Route path="/doctor/login" element={<DoctorLogin />} />

      {/* Doctor Portal Routes - Protected */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="login" element={<DoctorLogin />} />
        <Route path="" element={<DoctorDashboard />} />
        <Route path="profile" element={<ProfileWizard />} />
        <Route path="appointments" element={<DoctorSchedule />} />
        <Route path="appointment-detail" element={<AppointmentDetail />} />
        <Route path="appointments/:id" element={<AppointmentDetail />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="settings" element={<DoctorSettings />} />
        <Route path="my-profile" element={<DoctorProfile />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;