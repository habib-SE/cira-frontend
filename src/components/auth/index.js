// Authentication Module Exports
// This module provides all authentication-related components and pages

// Layout Components
export { default as AuthLayout } from './AuthLayout';

// Form Components
export { default as LoginForm } from './authForms/LoginForm';
export { default as RegisterForm } from './authForms/RegisterForm';
export { default as DoctorRegisterForm } from './authForms/DoctorRegisterForm';

// Page Components
export { default as MainLoginPage } from '../../pages/authPages/login/MainLoginPage';
export { default as DoctorLoginPage } from '../../pages/authPages/login/DoctorLoginPage';
export { default as RegisterPage } from '../../pages/authPages/Register/RegisterPage';

// Styles
import './styles/auth.css';
