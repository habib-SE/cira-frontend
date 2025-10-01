import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from '../admin/adminpages/WelcomePage';
import RegisterPage from '../admin/adminpages/RegisterPage';
import LoginPage from '../admin/adminpages/LoginPage';
import EmailConfirmPage from '../admin/adminpages/EmailConfirmPage';
import EnablePermissionPage from '../admin/adminpages/EnablePermissionPage';
import PlusUnlockedPage from '../admin/adminpages/PlusUnlockedPage';
import SubscriptionPlansPage from '../admin/adminpages/SubscriptionPlansPage';
import AdminLandingPage from '../admin/adminpages/AdminLandingPage';
import AdminLayout from '../admin/admincomponents/AdminLayout';
import Dashboard from '../admin/adminpages/Dashboard';
import Doctors from '../admin/adminpages/Doctors';
import Patients from '../admin/adminpages/Patients';
import Appointments from '../admin/adminpages/Appointments';
import AIReports from '../admin/adminpages/AIReports';
import Reports from '../admin/adminpages/Reports';
import Settings from '../admin/adminpages/Settings';

function MainRouter() {
  return (
    <Routes>
      {/* Welcome page */}
      <Route path="/welcome" element={<WelcomePage />} />
      
      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Email confirmation page */}
      <Route path="/email-confirm" element={<EmailConfirmPage />} />
      
     
      
      {/* Plus unlocked page */}
      <Route path="/plus-unlocked" element={<PlusUnlockedPage />} />
      
      {/* Subscription plans page */}
      <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
      
      {/* Admin Landing Page */}
      <Route path="/admin" element={<AdminLandingPage />} />
      
      {/* Admin Panel Routes */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doctors/*" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments/*" element={<Appointments />} />
        <Route path="ai-reports" element={<AIReports />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;