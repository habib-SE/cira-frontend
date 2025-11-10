import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Globe, 
  Save,
  Edit2,
  Camera,
  ArrowLeft,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [profileData, setProfileData] = useState({
    companyName: 'Acme Corporation',
    email: 'admin@acmecorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'United States',
    website: 'www.acmecorp.com',
    description: 'Leading healthcare technology company providing innovative solutions for modern healthcare needs.',
    password: '',
    confirmPassword: '',
    logo: null
  });

  // Load saved profile data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('companyProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...parsed, password: '', confirmPassword: '' }));
        if (parsed.logo) {
          setLogoPreview(parsed.logo);
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'companyName':
        if (!value || value.trim() === '') {
          error = 'Company name is required';
        } else if (value.length < 2) {
          error = 'Company name must be at least 2 characters';
        } else if (value.length > 100) {
          error = 'Company name must be less than 100 characters';
        }
        break;
      
      case 'email':
        if (!value || value.trim() === '') {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          } else if (value.length > 100) {
            error = 'Email must be less than 100 characters';
          }
        }
        break;
      
      case 'phone':
        if (!value || value.trim() === '') {
          error = 'Phone number is required';
        } else {
          const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
          if (!phoneRegex.test(value)) {
            error = 'Please enter a valid phone number';
          } else if (value.length > 20) {
            error = 'Phone number must be less than 20 characters';
          }
        }
        break;
      
      case 'address':
        if (!value || value.trim() === '') {
          error = 'Address is required';
        } else if (value.length < 5) {
          error = 'Address must be at least 5 characters';
        } else if (value.length > 200) {
          error = 'Address must be less than 200 characters';
        }
        break;
      
      case 'city':
        if (!value || value.trim() === '') {
          error = 'City is required';
        } else if (value.length < 2) {
          error = 'City must be at least 2 characters';
        } else if (value.length > 50) {
          error = 'City must be less than 50 characters';
        }
        break;
      
      case 'state':
        if (!value || value.trim() === '') {
          error = 'State/Province is required';
        } else if (value.length < 2) {
          error = 'State/Province must be at least 2 characters';
        } else if (value.length > 50) {
          error = 'State/Province must be less than 50 characters';
        }
        break;
      
      case 'zipCode':
        if (!value || value.trim() === '') {
          error = 'ZIP/Postal Code is required';
        } else if (value.length < 3) {
          error = 'ZIP/Postal Code must be at least 3 characters';
        } else if (value.length > 20) {
          error = 'ZIP/Postal Code must be less than 20 characters';
        }
        break;
      
      case 'country':
        if (!value || value.trim() === '') {
          error = 'Country is required';
        } else if (value.length < 2) {
          error = 'Country must be at least 2 characters';
        } else if (value.length > 50) {
          error = 'Country must be less than 50 characters';
        }
        break;
      
      case 'website':
        if (value && value.trim() !== '') {
          try {
            // Add protocol if missing
            let url = value;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              url = 'https://' + url;
            }
            new URL(url);
          } catch {
            error = 'Please enter a valid website URL';
          }
        }
        break;
      
      case 'description':
        if (value && value.length > 500) {
          error = 'Description must be less than 500 characters';
        }
        break;
      
      case 'password':
        if (isEditing && value && value.trim() !== '') {
          if (value.length < 8) {
            error = 'Password must be at least 8 characters';
          } else if (value.length > 50) {
            error = 'Password must be less than 50 characters';
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
          }
        }
        break;
      
      case 'confirmPassword':
        if (isEditing && profileData.password && value !== profileData.password) {
          error = 'Passwords do not match';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(profileData).forEach(key => {
      if (key !== 'logo' && key !== 'confirmPassword' && key !== 'password') {
        const error = validateField(key, profileData[key]);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });
    
    // Validate password if provided
    if (profileData.password) {
      const passwordError = validateField('password', profileData.password);
      if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      }
      
      const confirmPasswordError = validateField('confirmPassword', profileData.confirmPassword);
      if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
        isValid = false;
      }
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setProfileData(prev => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce max length limits
    let processedValue = value;
    if (name === 'email' && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (name === 'phone' && value.length > 20) {
      processedValue = value.slice(0, 20);
    } else if (name === 'companyName' && value.length > 100) {
      processedValue = value.slice(0, 100);
    } else if (name === 'city' && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (name === 'state' && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (name === 'zipCode' && value.length > 20) {
      processedValue = value.slice(0, 20);
    } else if (name === 'country' && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (name === 'address' && value.length > 200) {
      processedValue = value.slice(0, 200);
    } else if (name === 'description' && value.length > 500) {
      processedValue = value.slice(0, 500);
    } else if (name === 'password' && value.length > 50) {
      processedValue = value.slice(0, 50);
    }
    
    setProfileData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Validate field in real-time
    if (isEditing) {
      const error = validateField(name, processedValue);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    }
  };

  const handleSave = async () => {
    // Validate all fields before saving
    if (!validateAllFields()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare data to save (exclude password fields from profile data, but store separately)
      const profileToSave = {
        ...profileData,
        password: undefined,
        confirmPassword: undefined
      };
      
      // Save profile data
      localStorage.setItem('companyProfile', JSON.stringify({
        ...profileToSave,
        logo: logoPreview
      }));
      
      // Save credentials separately for login
      if (profileData.password && profileData.password.trim() !== '') {
        localStorage.setItem('companyCredentials', JSON.stringify({
          email: profileData.email,
          password: profileData.password
        }));
      } else {
        // If password not changed, keep existing credentials
        const existingCredentials = localStorage.getItem('companyCredentials');
        if (!existingCredentials) {
          // If no existing credentials, use current email with default password
          localStorage.setItem('companyCredentials', JSON.stringify({
            email: profileData.email,
            password: 'company123' // Default password
          }));
        } else {
          // Update email in existing credentials
          const creds = JSON.parse(existingCredentials);
          creds.email = profileData.email;
          localStorage.setItem('companyCredentials', JSON.stringify(creds));
        }
      }
      
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Clear password fields after saving
      setProfileData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors({});
    
    // Reload original data
    const savedProfile = localStorage.getItem('companyProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...parsed, password: '', confirmPassword: '' }));
        if (parsed.logo) {
          setLogoPreview(parsed.logo);
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/company')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your company profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
                     <div className="flex items-center justify-between mb-8">
             <div className="flex items-center space-x-6">
               <div className="relative">
                 {logoPreview ? (
                   <img 
                     src={logoPreview} 
                     alt="Company Logo" 
                     className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                   />
                 ) : (
                   <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                     {profileData.companyName.charAt(0)}
                   </div>
                 )}
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">{profileData.companyName}</h2>
                 <p className="text-gray-600">{profileData.email}</p>
               </div>
             </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Edit2 className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>

                     {/* Company Logo Section */}
           <div className="mb-8 pb-8 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
             <div className="flex items-center space-x-4">
               <div className="relative">
                 {logoPreview ? (
                   <img 
                     src={logoPreview} 
                     alt="Company Logo" 
                     className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                   />
                 ) : (
                   <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                     <Building className="h-10 w-10 text-gray-400" />
                   </div>
                 )}
               </div>
               <div>
                 <input
                   type="file"
                   ref={fileInputRef}
                   onChange={handleLogoUpload}
                   accept="image/*"
                   className="hidden"
                 />
                 <button 
                   onClick={handleLogoButtonClick}
                   className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
                 >
                   <Camera className="h-4 w-4" />
                   <span>Upload Logo</span>
                 </button>
                 <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
               </div>
             </div>
           </div>

           {/* Form Fields */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {validationErrors.companyName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  maxLength={20}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.website ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {validationErrors.website && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  maxLength={200}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                maxLength={50}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                  validationErrors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.city && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                maxLength={50}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                  validationErrors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.state && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={profileData.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                maxLength={20}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                  validationErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
                maxLength={50}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                  validationErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.country && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 resize-none ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-1">
                {validationErrors.description && (
                  <p className="text-sm text-red-600">{validationErrors.description}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {profileData.description.length}/500 characters
                </p>
              </div>
            </div>

            {/* Login Credentials Section - Always Visible */}
            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Credentials</h3>
              <p className="text-sm text-gray-600 mb-4">These credentials are used to login to the company panel</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                  maxLength={100}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email for login"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">This email is used for company panel login</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  maxLength={50}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isEditing ? "Enter new password (leave blank to keep current)" : "••••••••"}
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
              {!validationErrors.password && profileData.password && isEditing && (
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters with uppercase, lowercase, and number</p>
              )}
              {!isEditing && (
                <p className="mt-1 text-xs text-gray-500">Click "Edit Profile" to change password</p>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-slide-in">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Profile saved successfully!</span>
          </div>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage your password and security settings</p>
            <button className="text-pink-600 font-medium text-sm hover:text-pink-700">
              Manage Security →
            </button>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Control your notification preferences</p>
            <button className="text-pink-600 font-medium text-sm hover:text-pink-700">
              Configure →
            </button>
          </div>

          {/* Billing Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage your subscription and billing</p>
            <button 
              onClick={() => navigate('/company/billing')}
              className="text-pink-600 font-medium text-sm hover:text-pink-700"
            >
              View Billing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
