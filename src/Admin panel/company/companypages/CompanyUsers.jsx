import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  UserX,
  Download,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { ConfirmationModal, AlertModal } from '../../../components/shared';

const CompanyUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isLoading: false
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    buttonText: 'OK'
  });

  // Mock data - replace with actual API calls
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Employee',
      status: 'Active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      role: 'Admin',
      status: 'Active',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-19'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'Sales',
      role: 'Employee',
      status: 'Suspended',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-18'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'HR',
      role: 'Employee',
      status: 'Active',
      createdAt: '2024-01-12',
      lastLogin: '2024-01-20'
    }
  ];

  const showConfirmationModal = (config) => {
    setConfirmationModal({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title,
      message: config.message,
      onConfirm: config.onConfirm,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      isLoading: false
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false
    }));
  };

  const showAlert = (config) => {
    setAlertModal({
      isOpen: true,
      type: config.type || 'info',
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK'
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleConfirmAction = async () => {
    if (confirmationModal.onConfirm) {
      setConfirmationModal(prev => ({ ...prev, isLoading: true }));
      try {
        await confirmationModal.onConfirm();
        closeConfirmationModal();
      } catch (error) {
        console.error('Action failed:', error);
        setConfirmationModal(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleAddUser = () => {
    navigate('/company/users/create');
  };

  const handleViewUser = (userId) => {
    navigate(`/company/users/view/${userId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/company/users/edit/${userId}`);
  };

  const handleSuspendUser = (userId) => {
    showConfirmationModal({
      type: 'warning',
      title: 'Suspend User',
      message: `Are you sure you want to suspend this user? They will lose access to the platform until reactivated.`,
      confirmText: 'Suspend User',
      cancelText: 'Cancel',
      onConfirm: async () => {
        // In a real app, this would make an API call
        console.log(`Suspending user ${userId}`);
        showAlert({
          type: 'success',
          title: 'User Suspended',
          message: `User ${userId} has been successfully suspended and will lose access to the platform.`,
          buttonText: 'OK'
        });
        handleRefresh();
      }
    });
  };

  const handleDeleteUser = (userId) => {
    showConfirmationModal({
      type: 'danger',
      title: 'Delete User',
      message: `Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data.`,
      confirmText: 'Delete User',
      cancelText: 'Cancel',
      onConfirm: async () => {
        // In a real app, this would make an API call
        console.log(`Deleting user ${userId}`);
        showAlert({
          type: 'success',
          title: 'User Deleted',
          message: `User ${userId} has been permanently deleted from the system.`,
          buttonText: 'OK'
        });
        handleRefresh();
      }
    });
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Department', 'Status', 'Created At'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.department,
        user.status,
        user.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `company-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status.toLowerCase() === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage employee accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleAddUser}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button 
              onClick={handleExportUsers}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewUser(user.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="View User"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleSuspendUser(user.id)}
                        className="text-gray-400 hover:text-yellow-600 p-1"
                        title="Suspend User"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
          <span className="font-medium">4</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-pink-600 text-white rounded-md text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        isLoading={confirmationModal.isLoading}
      />

      {/* Custom Alert Modal */}
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

export default CompanyUsers;
