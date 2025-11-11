// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
// import logo from '../../assets/Logo.png';
// import { 
//   FormicaValidatedForm, 
//   FormicaFormField 
// } from '../../../components/forms';
// import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import logo from '../../../assets/ciratestinglogo.png';
import { 
  FormicaValidatedForm, 
  FormicaFormField 
} from '../../../components/forms';
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';
import { Building } from 'lucide-react';

const MainLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (data) => {
    setLoginError('');

    try {
      const result = login(data.email, data.password, selectedRole);
      
      if (!result.success) {
        setLoginError(result.message);
      }
    } catch {
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  const handleError = (error) => {
    console.error('Formica validation error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="CIRA Logo" className="h-28 mx-auto " />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Admin:</strong> admin@cira.com / admin123</p>
              <p><strong>User:</strong> user@cira.com / user123</p>
              <p><strong>Doctor:</strong> doctor@cira.com / doctor123</p>
              <p><strong>Company:</strong> company@cira.com / company123</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email') || e.target.email.value;
            const password = formData.get('password') || e.target.password.value;
            handleSubmit({ email, password });
          }}>
            <div className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['user', 'doctor', 'admin', 'company'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          selectedRole === role
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {role === 'company' ? (
                          <Building className="h-5 w-5 mx-auto mb-1" />
                        ) : (
                          <UserIcon className="h-5 w-5 mx-auto mb-1" />
                        )}
                        <span className="text-sm font-medium capitalize">{role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={''}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      defaultValue={''}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedRole}
                  className={`w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium transition-colors ${
                    selectedRole ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  Sign in
                </button>
              </div>
          </form>

          {/* Register Link (only for Doctor role) */}
          {selectedRole === 'doctor' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/doctor/login?mode=register')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Register as Doctor
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLoginPage;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import {
//   EyeIcon,
//   EyeSlashIcon,
//   UserIcon,
//   LockClosedIcon,
//   EnvelopeIcon,
// } from '@heroicons/react/24/outline';
// import { Building } from 'lucide-react';
// import logo from '../../../assets/ciratestinglogo.png';

// const roles = [
//   { key: 'user', label: 'User', icon: UserIcon },
//   { key: 'doctor', label: 'Doctor', icon: UserIcon },
//   { key: 'admin', label: 'Admin', icon: UserIcon },
//   { key: 'company', label: 'Company', icon: Building },
// ];

// const MainLoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [selectedRole, setSelectedRole] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginError, setLoginError] = useState('');
//   const [showDemo, setShowDemo] = useState(false);

//   const handleSubmit = ({ email, password }) => {
//     setLoginError('');
//     try {
//       const result = login(email, password, selectedRole);
//       if (!result.success) setLoginError(result.message || 'Login failed.');
//     } catch {
//       setLoginError('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#fff0fb] via-[#fdfbff] to-[#e4f0ff] flex items-center justify-center px-4">
//       {/* soft glow blobs */}
//       <div className="pointer-events-none absolute -top-32 -left-10 h-72 w-72 bg-pink-400/20 blur-3xl rounded-full" />
//       <div className="pointer-events-none absolute -bottom-32 -right-10 h-72 w-72 bg-purple-400/20 blur-3xl rounded-full" />

//       <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
//         {/* Left Hero Side */}
//         <div className="flex flex-col gap-6 text-center lg:text-left">
//           <div className="flex items-center justify-center lg:justify-start gap-3">
//             <img src={logo} alt="Cira Logo" className="h-20 w-auto" />
//             <span className="px-3 py-1 rounded-full bg-white/70 shadow-sm text-xs font-semibold text-pink-500">
//               Cira Health • Secure & Simple
//             </span>
//           </div>

//           <div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
//               Welcome back,
//               <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
//                 {' '}let&apos;s get you in.
//               </span>
//             </h1>
//             <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0">
//               One login for Admins, Doctors, Companies, and Users.
//               Clean dashboard, instant insights.
//             </p>
//           </div>

//           {/* Fun / trust badges */}
//           <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-xs">
//             <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 shadow-sm border border-pink-100">
//               <span className="text-pink-500 text-base">★</span>
//               <span className="font-medium text-slate-700">Modern & friendly UI</span>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 shadow-sm border border-purple-100">
//               <span className="text-purple-500 text-base">🔐</span>
//               <span className="font-medium text-slate-700">Secure access control</span>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 shadow-sm border border-blue-100">
//               <span className="text-blue-500 text-base">⚡</span>
//               <span className="font-medium text-slate-700">Fast & responsive</span>
//             </div>
//           </div>

//           {/* Demo toggle */}
//           <div className="mt-2">
//             <button
//               type="button"
//               onClick={() => setShowDemo((v) => !v)}
//               className="text-xs sm:text-sm text-pink-500 hover:text-pink-600 font-semibold underline-offset-4 hover:underline"
//             >
//               {showDemo ? 'Hide demo credentials' : 'Show demo credentials'}
//             </button>

//             {showDemo && (
//               <div className="mt-3 p-4 bg-white/90 border border-pink-100 rounded-2xl shadow-sm text-left max-w-xs mx-auto lg:mx-0">
//                 <p className="text-xs font-semibold text-slate-800 mb-1">Demo Credentials</p>
//                 <ul className="text-[10px] sm:text-xs text-slate-700 space-y-1">
//                   <li><strong>Admin:</strong> admin@cira.com / admin123</li>
//                   <li><strong>User:</strong> user@cira.com / user123</li>
//                   <li><strong>Doctor:</strong> doctor@cira.com / doctor123</li>
//                   <li><strong>Company:</strong> company@cira.com / company123</li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Login Card */}
//         <div className="flex justify-center">
//           <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.12)] rounded-3xl p-6 sm:p-8">
//             {/* playful header */}
//             <div className="mb-5">
//               <p className="text-xs font-medium text-pink-500 mb-1">
//                 Sign in to continue
//               </p>
//               <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
//                 Choose your role &amp; jump in
//               </h2>
//             </div>

//             {loginError && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
//                 {loginError}
//               </div>
//             )}

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.target);
//                 const email = formData.get('email');
//                 const password = formData.get('password');
//                 if (!selectedRole) return;
//                 handleSubmit({ email, password });
//               }}
//               className="space-y-5"
//             >
//               {/* Role selection */}
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-2">
//                   I&apos;m logging in as
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {roles.map(({ key, label, icon: Icon }) => {
//                     const active = selectedRole === key;
//                     return (
//                       <button
//                         key={key}
//                         type="button"
//                         onClick={() => setSelectedRole(key)}
//                         className={[
//                           'flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl border text-[11px] sm:text-xs font-medium transition-all',
//                           active
//                             ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-md scale-[1.02]'
//                             : 'bg-white/70 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50/80',
//                         ].join(' ')}
//                       >
//                         <Icon className="h-4 w-4" />
//                         <span>{label}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//                 {!selectedRole && (
//                   <p className="mt-1 text-[10px] text-pink-500">
//                     Select your role to enable sign in.
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="space-y-1">
//                 <label
//                   htmlFor="email"
//                   className="block text-xs font-semibold text-slate-700"
//                 >
//                   Email
//                 </label>
//                 <div className="relative">
//                   <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-1">
//                 <label
//                   htmlFor="password"
//                   className="block text-xs font-semibold text-slate-700"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     className="w-full pl-9 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white/90 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((v) => !v)}
//                     className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-4 w-4" />
//                     ) : (
//                       <EyeIcon className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember / Forgot */}
//               <div className="flex items-center justify-between gap-3">
//                 <label className="flex items-center gap-2">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-3.5 w-3.5 rounded border-slate-300 text-pink-500 focus:ring-pink-400"
//                   />
//                   <span className="text-[10px] sm:text-xs text-slate-600">
//                     Remember me
//                   </span>
//                 </label>
//                 <button
//                   type="button"
//                   className="text-[10px] sm:text-xs font-semibold text-pink-500 hover:text-pink-600 hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={!selectedRole}
//                 className={`w-full py-2.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-md transition-all
//                 ${
//                   selectedRole
//                     ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:shadow-lg hover:translate-y-0.5'
//                     : 'bg-slate-200 text-slate-500 cursor-not-allowed'
//                 }`}
//               >
//                 Sign in
//               </button>
//             </form>

//             {/* Doctor register */}
//             {selectedRole === 'doctor' && (
//               <div className="mt-5 text-center">
//                 <p className="text-[10px] sm:text-xs text-slate-600">
//                   New here?{' '}
//                   <button
//                     onClick={() =>
//                       navigate('/doctor/login?mode=register')
//                     }
//                     className="font-semibold text-pink-500 hover:text-pink-600 hover:underline"
//                   >
//                     Register as Doctor
//                   </button>
//                 </p>
//               </div>
//             )}

//             {/* Security line */}
//             <p className="mt-4 text-[9px] sm:text-[10px] text-slate-400 text-center">
//               🔒 Your data is protected with modern encryption & secure access policies.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLoginPage;