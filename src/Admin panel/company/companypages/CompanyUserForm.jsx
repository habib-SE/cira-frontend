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
import { ConfirmationModal } from '../../../components/shared';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'Employee',
    status: 'Active',
    phone: '',
    position: '',
    startDate: '',
    notes: ''
  });

  // Load user data for edit/view modes
  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      // Mock user data - replace with actual API call
      const mockUser = {
        id: id,
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        role: 'Employee',
        status: 'Active',
        phone: '+1 (555) 123-4567',
        position: 'Software Engineer',
        startDate: '2024-01-15',
        notes: 'Experienced developer with 5 years of experience'
      };
      setFormData(mockUser);
    }
  }, [id, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (mode === 'create') {
        console.log('Creating user:', formData);
        alert('User created successfully!');
      } else if (mode === 'edit') {
        console.log('Updating user:', formData);
        alert('User updated successfully!');
      }
      
      navigate('/company/users');
    } catch (error) {
      alert('An error occurred. Please try again.');
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

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                    disabled={isViewMode}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter full name"
                  />
                  <UserPlus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
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
                    disabled={isViewMode}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter job position"
                />
              </div>
            </div>
          </div>

          {/* Department */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={isViewMode}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                  <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isViewMode}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={isViewMode}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Enter any additional notes about this user"
              />
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
          {!isViewMode && (
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
          )}

          {/* View Mode Actions */}
          {isViewMode && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/company/users/edit/${id}`)}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Edit User</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyUserForm;
