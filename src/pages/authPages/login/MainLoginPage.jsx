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
import logo from '../../../assets/Logo.png';
import { 
  FormicaValidatedForm, 
  FormicaFormField 
} from '../../../components/forms';
import { authFormicaSchemas } from '../../../utils/validation/formicaSchemas';
import { Building } from 'lucide-react';

const MainLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState('user');
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
          <img src={logo} alt="CIRA Logo" className="h-16 mx-auto mb-4" />
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
                      defaultValue={selectedRole === 'user' ? 'user@cira.com' : selectedRole === 'admin' ? 'admin@cira.com' : selectedRole === 'doctor' ? 'doctor@cira.com' : 'company@cira.com'}
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
                      defaultValue={selectedRole === 'user' ? 'user123' : selectedRole === 'admin' ? 'admin123' : selectedRole === 'doctor' ? 'doctor123' : 'company123'}
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
                  className="w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign in
                </button>
              </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </p>
          </div>
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

