# 🔐 CIRA Authentication & Security Guide

## Overview
This document explains how the authentication system works for the three different user portals: **Admin**, **Patient**, and **Doctor**.

---

## 📋 Table of Contents
1. [User Types & Credentials](#user-types--credentials)
2. [How to Login](#how-to-login)
3. [Security Features](#security-features)
4. [Protected Routes](#protected-routes)
5. [How It Works](#how-it-works)
6. [Integration with Backend API](#integration-with-backend-api)

---

## 👥 User Types & Credentials

### Demo Accounts (For Testing)

| User Type | Email | Password | Access To |
|-----------|-------|----------|-----------|
| **Admin** | admin@cira.com | admin123 | Admin Portal (`/admin`) |
| **Patient** | patient@cira.com | patient123 | Patient Portal (`/patient`) |
| **Doctor** | doctor@cira.com | doctor123 | Doctor Portal (`/doctor`) |

---

## 🚪 How to Login

### Step 1: Access Login Page
Visit: `http://localhost:5175/login`

### Step 2: Select Your Role
Click on one of the three role buttons:
- **Patient** - For patients accessing their health records
- **Doctor** - For doctors managing their practice
- **Admin** - For administrators managing the system

### Step 3: Enter Credentials
- **Email**: Enter your email address
- **Password**: Enter your password (minimum 6 characters)

### Step 4: Sign In
Click the "Sign in" button to authenticate.

### Step 5: Automatic Redirect
Upon successful login, you'll be automatically redirected to your portal:
- Admin → `/admin` (Dashboard)
- Patient → `/patient` (Dashboard)
- Doctor → `/doctor` (Dashboard)

---

## 🔒 Security Features

### 1. **Input Validation**
- ✅ Email format validation (RFC 5322 compliant)
- ✅ Password minimum length (6 characters)
- ✅ Real-time error feedback
- ✅ Required field validation

### 2. **Route Protection**
- ✅ All portal routes are protected
- ✅ Unauthorized users redirected to login
- ✅ Role-based access control (RBAC)
- ✅ Auto-redirect to appropriate portal based on role

### 3. **Session Management**
- ✅ Token-based authentication
- ✅ Persistent sessions (localStorage)
- ✅ Auto-logout on token expiration
- ✅ Session cleanup on logout

### 4. **Password Security**
- ✅ Password visibility toggle (eye icon)
- ✅ Secure password input (type="password")
- 🔜 In production: Bcrypt/Argon2 hashing on backend
- 🔜 In production: HTTPS enforcement

### 5. **XSS Protection**
- ✅ React's built-in XSS protection
- ✅ Sanitized user inputs
- ✅ No innerHTML usage

### 6. **CSRF Protection**
- 🔜 In production: CSRF tokens
- 🔜 In production: SameSite cookie attributes

---

## 🛡️ Protected Routes

### Admin Routes (Requires `role: admin`)
```
/admin                    - Admin Dashboard
/admin/users              - User Management
/admin/doctors            - Doctor Management
/admin/appointments       - Appointments
/admin/reports            - Reports
/admin/payments           - Payments
/admin/settings           - Settings
/admin/referrals          - Referrals
```

### Patient Routes (Requires `role: patient`)
```
/patient                  - Patient Dashboard
/patient/appointments     - My Appointments
/patient/records          - Medical Records
/patient/prescriptions    - Prescriptions
/patient/doctors          - My Doctors
/patient/messages         - Messages
/patient/settings         - Settings
```

### Doctor Routes (Requires `role: doctor`)
```
/doctor                   - Doctor Dashboard
/doctor/schedule          - My Schedule
/doctor/patients          - Patient List
/doctor/appointments      - Appointments
/doctor/prescriptions     - Prescriptions
/doctor/records           - Medical Records
/doctor/analytics         - Analytics
/doctor/messages          - Messages
/doctor/settings          - Settings
```

---

## ⚙️ How It Works

### 1. **Authentication Flow**

```
User enters credentials
        ↓
Validation (client-side)
        ↓
Login API call (simulated)
        ↓
Receive token + user data
        ↓
Store in localStorage
        ↓
Update Auth Context
        ↓
Redirect to appropriate portal
```

### 2. **Protected Route Logic**

```jsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminLayout />
</ProtectedRoute>
```

**What happens:**
1. Check if user is authenticated (has token)
2. Check if user role matches allowed roles
3. If NO → Redirect to login
4. If YES → Render protected component

### 3. **Logout Flow**

```
User clicks "Sign out"
        ↓
Clear localStorage
        ↓
Clear sessionStorage
        ↓
Update Auth Context (user = null)
        ↓
Redirect to login page
```

---

## 🔧 Integration with Backend API

### Current Setup (Development)
The system currently uses **mock authentication** for testing purposes.

### Production Implementation

Replace the mock login in `src/context/AuthContext.jsx`:

```javascript
const login = async (email, password, role) => {
  try {
    // Replace this with your actual API endpoint
    const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      setUser(data.user);

      // Redirect based on role
      switch (data.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
      }

      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    return { success: false, message: 'Network error occurred' };
  }
};
```

### Backend API Requirements

Your backend should provide:

1. **Login Endpoint** (`POST /auth/login`)
   - Input: `{ email, password, role }`
   - Output: `{ token, user: { id, email, name, role } }`

2. **Token Verification** (`GET /auth/verify`)
   - Header: `Authorization: Bearer <token>`
   - Output: `{ user: { id, email, name, role } }`

3. **Logout Endpoint** (`POST /auth/logout`)
   - Header: `Authorization: Bearer <token>`
   - Output: `{ success: true }`

### Security Best Practices for Backend

1. **Password Hashing**: Use bcrypt or Argon2
2. **JWT Tokens**: Use secure, short-lived tokens
3. **Refresh Tokens**: Implement token refresh mechanism
4. **Rate Limiting**: Prevent brute force attacks
5. **HTTPS Only**: Enforce SSL/TLS
6. **CORS**: Configure proper CORS policies
7. **Input Sanitization**: Validate and sanitize all inputs
8. **SQL Injection Prevention**: Use parameterized queries

---

## 📝 File Structure

```
src/
├── context/
│   └── AuthContext.jsx           # Authentication context provider
├── components/
│   └── ProtectedRoute.jsx        # Route protection wrapper
├── admin/
│   └── adminpages/
│       └── EnhancedLoginPage.jsx # Enhanced login page
├── routes/
│   └── MainRouter.jsx            # Protected routing configuration
└── App.jsx                       # App with AuthProvider wrapper
```

---

## 🚀 Quick Start

### 1. Start the development server
```bash
npm run dev
```

### 2. Visit the login page
```
http://localhost:5175/login
```

### 3. Login with demo credentials
- **Patient**: patient@cira.com / patient123
- **Doctor**: doctor@cira.com / doctor123
- **Admin**: admin@cira.com / admin123

### 4. Explore your portal!

---

## 🔍 Troubleshooting

### Problem: Can't access portal routes
**Solution**: Make sure you're logged in. Try accessing `/login` first.

### Problem: Redirected to wrong portal
**Solution**: Sign out and select the correct role during login.

### Problem: Session expires too quickly
**Solution**: In production, implement refresh tokens for longer sessions.

### Problem: "Invalid email or password" error
**Solution**: 
- Check if email format is correct
- Ensure password is at least 6 characters
- Verify you're using the correct demo credentials

---

## 📊 Security Checklist for Production

- [ ] Replace mock authentication with real API
- [ ] Implement password hashing (bcrypt/Argon2)
- [ ] Add JWT token expiration
- [ ] Implement refresh token mechanism
- [ ] Add rate limiting for login attempts
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Add email verification
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add password reset functionality
- [ ] Set up session timeout
- [ ] Implement audit logging
- [ ] Add CAPTCHA for login form
- [ ] Regular security audits

---

## 📞 Support

For questions or issues with authentication:
1. Check this guide first
2. Review the code in `src/context/AuthContext.jsx`
3. Check browser console for errors
4. Verify localStorage contains `userToken` and `userData`

---

## 🎯 Key Features Summary

✅ **Role-Based Access Control (RBAC)**
✅ **Protected Routes**
✅ **Input Validation**
✅ **Secure Session Management**
✅ **Password Visibility Toggle**
✅ **Auto-Redirect Based on Role**
✅ **Remember Me Feature**
✅ **Beautiful UI/UX**
✅ **Mobile Responsive**
✅ **Demo Credentials Provided**

---

**Last Updated**: September 30, 2025
**Version**: 1.0.0

