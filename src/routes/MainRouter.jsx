import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import WelcomePage from '../Admin panel/admin/adminpages/WelcomePage';
// import { MainLoginPage, DoctorLoginPage } from '../components/auth';
import MainLoginPage from '../pages/authPages/login/MainLoginPage';
import DoctorLoginPage from '../pages/authPages/login/DoctorLoginPage';
import CompanyLoginPage from '../pages/authPages/login/CompanyLoginPage';
import EmailConfirmPage from '../Admin panel/admin/adminpages/EmailConfirmPage';
import EnablePermissionPage from '../Admin panel/admin/adminpages/EnablePermissionPage';
import PlusUnlockedPage from '../Admin panel/admin/adminpages/PlusUnlockedPage';
import SubscriptionPlansPage from '../Admin panel/admin/adminpages/SubscriptionPlansPage';

// Authentication Module Imports
// import { RegisterPage } from '../components/auth';
import RegisterPage from '../pages/authPages/Register/RegisterPage'

// Admin Portal Imports
import AdminLayout from '../Admin panel/admin/admincomponents/AdminLayout';
import Dashboard from '../Admin panel/admin/adminpages/Dashboard';
import Users from '../Admin panel/admin/adminpages/Users';
import Doctors from '../Admin panel/admin/adminpages/Doctors';
import AdminDoctorProfile from '../Admin panel/admin/adminpages/DoctorProfile';
import DoctorProfileDetail from '../Admin panel/admin/adminpages/DoctorProfileDetail';
import Patients from '../Admin panel/admin/adminpages/Patients';
import Appointments from '../Admin panel/admin/adminpages/Appointments';
import Reports from '../Admin panel/admin/adminpages/Reports';
import Payments from '../Admin panel/admin/adminpages/Payments';
import PaymentDetail from '../Admin panel/admin/adminpages/PaymentDetail';
import Settings from '../Admin panel/admin/adminpages/Settings';
import Referrals from '../Admin panel/admin/adminpages/Referrals';
import ReferralDetail from '../Admin panel/admin/adminpages/ReferralDetail';
import ReferralProviders from '../Admin panel/admin/adminpages/ReferralProviders';
import ReferralProviderEdit from '../Admin panel/admin/adminpages/ReferralProviderEdit';
import Plans from '../Admin panel/admin/adminpages/Plans';
import PlanEditor from '../Admin panel/admin/adminpages/PlanEditor';
import PlanDetail from '../Admin panel/admin/adminpages/PlanDetail';

// Patient Portal Imports
import PatientLayout from '../Admin panel/patient/patientcomponents/PatientLayout';
import AI_Nurse from '../Admin panel/patient/patientpages/AI_Nurse';
import PatientDashboard from '../Admin panel/patient/patientpages/PatientDashboard';
import PatientReports from '../Admin panel/patient/patientpages/PatientReports';
import PatientSubscriptions from '../Admin panel/patient/patientpages/PatientSubscriptions';
import Messages from '../Admin panel/patient/patientpages/Messages';
import History from '../Admin panel/patient/patientpages/History';
import ReferralCheckout from '../Admin panel/patient/patientpages/ReferralCheckout';
import PatientProfile from '../Admin panel/patient/patientpages/PatientProfile';
import PatientReportDetails from '../Admin panel/patient/patientpages/PatientReportDetails';
import MyDoctors from '../Admin panel/patient/patientpages/MyDoctors';
import PatientMessages from '../Admin panel/patient/patientpages/PatientMessages';
import PatientSettings from '../Admin panel/patient/patientpages/PatientSettings';
import Billing from '../Admin panel/patient/patientpages/Billing';

// Doctor Portal Imports
import DoctorLayout from '../Admin panel/doctor/doctorcomponents/DoctorLayout';
import DoctorDashboard from '../Admin panel/doctor/doctorpages/DoctorDashboard';
import ProfileWizard from '../Admin panel/doctor/doctorpages/ProfileWizard';
import DoctorSchedule from '../Admin panel/doctor/doctorpages/DoctorSchedule';
import AppointmentDetail from '../Admin panel/doctor/doctorpages/AppointmentDetail';
import CreateAppointment from '../Admin panel/doctor/doctorpages/CreateAppointment';
import AIReportView from '../Admin panel/doctor/doctorpages/AIReportView';
import Earnings from '../Admin panel/doctor/doctorpages/Earnings';
import DoctorSettings from '../Admin panel/doctor/doctorpages/DoctorSettings';
import DoctorProfile from '../Admin panel/doctor/doctorpages/DoctorProfile';
import DoctorPatientReports from '../Admin panel/doctor/doctorpages/PatientReports';
import DoctorPatientReportDetail from '../Admin panel/doctor/doctorpages/PatientReportDetail';
import BankDetails from '../Admin panel/doctor/doctorpages/BankDetails';

// Company Portal Imports
import CompanyLayout from '../Admin panel/company/companycomponents/CompanyLayout';
import CompanyDashboard from '../Admin panel/company/companypages/CompanyDashboard';
import CompanyUsers from '../Admin panel/company/companypages/CompanyUsers';
import CompanyUserForm from '../Admin panel/company/companypages/CompanyUserForm';
import CompanyReports from '../Admin panel/company/companypages/CompanyReports';
import CompanyConsultations from '../Admin panel/company/companypages/CompanyConsultations';
import CompanyBilling from '../Admin panel/company/companypages/CompanyBilling';
import CompanySettings from '../Admin panel/company/companypages/CompanySettings';

function MainRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      

      {/* Authentication Routes - Using centralized login pages */}
      <Route path="/login" element={<MainLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctor/login" element={<DoctorLoginPage />} />
      <Route path="/company/login" element={<CompanyLoginPage />} />
      
      
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
        <Route path="users/add" element={<Users />} />
        <Route path="users/edit/:id" element={<Users />} />
        <Route path="users/view/:id" element={<Users />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/edit/:id" element={<Doctors />} />
        <Route path="doctors/:id" element={<AdminDoctorProfile />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/add" element={<Appointments />} />
        <Route path="appointments/edit/:id" element={<Appointments />} />
        <Route path="appointments/view/:id" element={<Appointments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payments/:id" element={<PaymentDetail />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/create" element={<PlanEditor mode="create" />} />
        <Route path="plans/edit/:id" element={<PlanEditor mode="edit" />} />
        <Route path="plans/view/:id" element={<PlanDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="referrals/:id" element={<ReferralDetail />} />
        <Route path="referral-providers" element={<ReferralProviders />} />
        <Route path="referral-providers/edit/:id" element={<ReferralProviderEdit />} />
        <Route path="doctor-profile" element={<DoctorProfileDetail />} />
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
        <Route path="ai" element={<AI_Nurse />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="reports/:reportId" element={<PatientReportDetails />} />
        <Route path="book-doctor" element={<MyDoctors/>} />
        <Route path="Referralcheckout" element={<ReferralCheckout/>} />
        <Route path="profile" element={<PatientProfile/>} />
        <Route path="history" element={<History />} />
        <Route path="subscriptions" element={<PatientSubscriptions />} />
        <Route path="billing" element={<Billing />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>


      {/* Doctor Portal Routes - Protected */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<DoctorDashboard />} />
        <Route path="profile" element={<ProfileWizard />} />
        <Route path="appointments" element={<DoctorSchedule />} />
        <Route path="appointments/create" element={<CreateAppointment />} />
        <Route path="appointment-detail" element={<AppointmentDetail />} />
        <Route path="appointments/:id" element={<AppointmentDetail />} />
        <Route path="appointments/:id/report" element={<AIReportView />} />
        <Route path="patient-reports" element={<DoctorPatientReports />} />
        <Route path="patient-reports/:id" element={<DoctorPatientReportDetail />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="earnings/bank-details" element={<BankDetails />} />
        <Route path="settings" element={<DoctorSettings />} />
        <Route path="my-profile" element={<DoctorProfile />} />
      </Route>

      {/* Company Portal Routes - Protected */}
      <Route 
        path="/company" 
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<CompanyDashboard />} />
        <Route path="users" element={<CompanyUsers />} />
        <Route path="users/create" element={<CompanyUserForm mode="create" />} />
        <Route path="users/edit/:id" element={<CompanyUserForm mode="edit" />} />
        <Route path="users/view/:id" element={<CompanyUserForm mode="view" />} />
        <Route path="reports" element={<CompanyReports />} />
        <Route path="consultations" element={<CompanyConsultations />} />
        <Route path="billing" element={<CompanyBilling />} />
        <Route path="settings" element={<CompanySettings />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;