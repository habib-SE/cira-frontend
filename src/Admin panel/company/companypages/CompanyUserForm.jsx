import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Mail, 
  Building,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ConfirmationModal, AlertModal } from '../../../components/shared';

const CompanyUserForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    buttonText: 'OK'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    status: 'Active',
    role: 'User',
    notes: '',
    password: ''
  });

  // Load user data for edit/view modes
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      // Load user data from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('companyUsers') || '[]');
      const user = existingUsers.find(u => u.id === parseInt(id));
      
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          username: user.username || '',
          phone: user.phone || '',
          status: user.status || 'Active',
          role: user.role || 'User',
          notes: user.notes || '',
          password: ''
        });
      }
    }
  }, [id, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showAlert = (config) => {
    setAlertModal({
      isOpen: true,
      type: config.type || 'success',
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK'
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('companyUsers') || '[]');
      
      if (mode === 'create') {
        // Create new user
        const newUser = {
          ...formData,
          id: Date.now(), // Generate a unique ID
          createdAt: new Date().toISOString().split('T')[0]
        };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('companyUsers', JSON.stringify(updatedUsers));
        // Dispatch event to notify users list to reload
        window.dispatchEvent(new Event('companyUsersUpdated'));
        
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'User created successfully!'
        });
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/company/users');
        }, 1500);
      } else if (mode === 'edit') {
        // Update existing user
        const updatedUsers = existingUsers.map(user => 
          user.id === parseInt(id) ? { ...user, ...formData } : user
        );
        localStorage.setItem('companyUsers', JSON.stringify(updatedUsers));
        // Dispatch event to notify users list to reload
        window.dispatchEvent(new Event('companyUsersUpdated'));
        
        showAlert({
          type: 'success',
          title: 'Success',
          message: 'User updated successfully!'
        });
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate('/company/users');
        }, 1500);
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company/users');
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isCreateMode && 'Add New User'}
            {isEditMode && 'Edit User'}
            {isViewMode && 'User Details'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isCreateMode && 'Create a new employee account'}
            {isEditMode && 'Update user information and permissions'}
            {isViewMode && 'View user information and activity'}
          </p>
        </div>
      </div>

      {/* View Mode User Profile */}
      {isViewMode && (
        <>
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-5xl font-bold text-pink-600 shadow-inner">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{formData.name}</h2>
                  <div className={`px-4 py-1.5 rounded-lg font-semibold text-sm ${
                    formData.status === 'Active' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : formData.status === 'Suspended' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}>
                    {formData.status}
                  </div>
                </div>
                <p className="text-gray-600 text-lg">{formData.email}</p>
                {formData.username && (
                  <p className="text-gray-500">@{formData.username}</p>
                )}
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              {/* User Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">User Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{formData.name}</p>
                  </div>
                  {formData.username && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Username</p>
                      <p className="text-sm font-medium text-gray-900">@{formData.username}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">{formData.email}</p>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Account Status</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">{formData.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Form */}
      {!isViewMode && (
        <div className="rounded-lg shadow-sm border border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                      placeholder="Enter full name"
                    />
                    <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                      placeholder="Enter email address"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Enter any additional information or notes about this user"
                  />
                </div>
              </div>
            </div>

          {/* Password Section - Only for create mode */}
          {isCreateMode && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Setup</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter temporary password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  User will be required to change this password on first login
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isCreateMode ? 'Creating...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isCreateMode ? 'Create User' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* View Mode Actions */}
      {isViewMode && (
        <div className="flex justify-start mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        buttonText={alertModal.buttonText}
      />
    </div>
  );
};

export default CompanyUserForm;
