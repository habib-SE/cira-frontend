import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users as UsersIcon, Search, Filter, Eye, Ban, Trash2, MoreVertical, UserCheck, UserX, UserPlus, X, CheckCircle, AlertCircle, EyeOff, Edit } from 'lucide-react';
import Card from '../admincomponents/Card';

const Users = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [_isContentLoading, _setIsContentLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'User',
        status: 'Active',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showEditFormInLayout, setShowEditFormInLayout] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editFormErrors, setEditFormErrors] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());

    // Function to calculate relative time
    const getRelativeTime = (timestamp) => {
        if (!timestamp) return 'Never';
        
        const now = currentTime;
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        }
        
        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
        }
        
        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    };

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);
    
    // Default users data
    const defaultUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@email.com',
            role: 'User',
            status: 'Active',
            joinDate: '2024-01-15',
            lastActiveTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            totalAppointments: 5,
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            role: 'User',
            status: 'Active',
            joinDate: '2024-01-14',
            lastActiveTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            totalAppointments: 3,
            avatar: 'JS'
        },
        {
            id: 3,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@clinic.com',
            role: 'Doctor',
            status: 'Active',
            joinDate: '2023-12-01',
            lastActiveTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
            totalAppointments: 45,
            avatar: 'SJ'
        },
        {
            id: 4,
            name: 'Mike Johnson',
            email: 'mike.johnson@email.com',
            role: 'User',
            status: 'Suspended',
            joinDate: '2024-01-10',
            lastActiveTimestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            totalAppointments: 2,
            avatar: 'MJ'
        },
        {
            id: 5,
            name: 'Dr. Michael Chen',
            email: 'michael.chen@clinic.com',
            role: 'Doctor',
            status: 'Pending',
            joinDate: '2024-01-20',
            lastActiveTimestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
            totalAppointments: 12,
            avatar: 'MC'
        },
        {
            id: 6,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com',
            role: 'User',
            status: 'Active',
            joinDate: '2024-01-12',
            lastActiveTimestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            totalAppointments: 7,
            avatar: 'SW'
        }
    ];

    // Initialize users from localStorage or use default users
    const [users, setUsers] = useState(() => {
        try {
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                const parsedUsers = JSON.parse(savedUsers);
                // Migrate old data format (lastActive) to new format (lastActiveTimestamp)
                const migratedUsers = parsedUsers.map(user => {
                    if (user.lastActive && !user.lastActiveTimestamp) {
                        // Convert old format to new format
                        // For "Just now", use current time
                        // For "X ago" format, calculate approximate timestamp
                        let timestamp = new Date().toISOString();
                        if (user.lastActive !== 'Just now') {
                            const match = user.lastActive.match(/(\d+)\s*(min|mins|hour|hours|day|days|month|months|year|years)\s*ago/);
                            if (match) {
                                const value = parseInt(match[1]);
                                const unit = match[2];
                                let milliseconds = 0;
                                if (unit.includes('min')) milliseconds = value * 60 * 1000;
                                else if (unit.includes('hour')) milliseconds = value * 60 * 60 * 1000;
                                else if (unit.includes('day')) milliseconds = value * 24 * 60 * 60 * 1000;
                                else if (unit.includes('month')) milliseconds = value * 30 * 24 * 60 * 60 * 1000;
                                else if (unit.includes('year')) milliseconds = value * 365 * 24 * 60 * 60 * 1000;
                                timestamp = new Date(Date.now() - milliseconds).toISOString();
                            }
                        }
                        return { ...user, lastActiveTimestamp: timestamp };
                    }
                    return user;
                });
                return migratedUsers;
            }
            return defaultUsers;
        } catch (error) {
            console.error('Error loading users from localStorage:', error);
            return defaultUsers;
        }
    });

    const handleCreateUser = () => {
        navigate('/admin/users/add');
    };

    const handleCloseForm = () => {
        navigate('/admin/users');
        setFormData({
            name: '',
            email: '',
            role: 'User',
            status: 'Active',
            password: '',
            confirmPassword: ''
        });
        setFormErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 4000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create new user object
            const newUser = {
                id: Math.max(...users.map(u => u.id)) + 1, // Generate new ID
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                joinDate: new Date().toISOString().split('T')[0], // Today's date
                lastActiveTimestamp: new Date().toISOString(), // Current timestamp
                totalAppointments: 0,
                avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() // Generate avatar initials
            };
            
            // Add new user to the users array
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            
            // Save to localStorage
            try {
                localStorage.setItem('users', JSON.stringify(updatedUsers));
            } catch (error) {
                console.error('Error saving users to localStorage:', error);
            }
            
            // Reset form and navigate back
            handleCloseForm();
            
            // Show success toast
            showToast('User created successfully!', 'success');
            
        } catch (error) {
            console.error('Error creating user:', error);
            showToast('Error creating user. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Suspended':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Doctor':
                return 'bg-blue-100 text-blue-800';
            case 'User':
                return 'bg-purple-100 text-purple-800';
            case 'Admin':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        
        // Check if search term starts with "dr" or "dr."
        const isDoctorSearch = searchLower.startsWith('dr') || searchLower.startsWith('dr.');
        
        // If searching for doctor, only show Doctor role users
        // If not searching for doctor, only show non-Doctor role users
        const roleMatchesSearch = searchTerm === '' || !isDoctorSearch || user.role === 'Doctor';
        const nonDoctorMatchesSearch = searchTerm === '' || isDoctorSearch || user.role !== 'Doctor';
        
        const matchesSearch = searchTerm === '' || 
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
            roleMatchesSearch && nonDoctorMatchesSearch;
        
        const matchesStatus = filterStatus === '' || user.status === filterStatus;
        const matchesRole = filterRole === '' || user.role === filterRole;
        
        return matchesSearch && matchesStatus && matchesRole;
    });

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const suspendedUsers = users.filter(u => u.status === 'Suspended').length;
    const pendingUsers = users.filter(u => u.status === 'Pending').length;

    // Helper function to save users to localStorage
    const saveUsersToStorage = (updatedUsers) => {
        try {
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedUser(null);
    };

    const handleSuspendUser = (user) => {
        const updatedUsers = users.map(u => 
            u.id === user.id ? { ...u, status: 'Suspended' } : u
        );
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        showToast(`${user.name} has been suspended`, 'success');
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            const updatedUsers = users.filter(u => u.id !== userToDelete.id);
            setUsers(updatedUsers);
            saveUsersToStorage(updatedUsers);
            showToast(`${userToDelete.name} has been deleted`, 'success');
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const cancelDeleteUser = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleEditUser = (user) => {
        navigate(`/admin/users/edit/${user.id}`);
    };

    const handleCloseEditModal = () => {
        navigate('/admin/users');
        setShowEditFormInLayout(false);
        setUserToEdit(null);
        setEditFormData({});
        setEditFormErrors({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (editFormErrors[name]) {
            setEditFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEditForm = () => {
        const errors = {};
        
        if (!editFormData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!editFormData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
            errors.email = 'Email is invalid';
        }
        
        return errors;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateEditForm();
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }
        
        try {
            // Update user in the users array
            const updatedUsers = users.map(u => 
                u.id === userToEdit.id ? {
                    ...u,
                    name: editFormData.name,
                    email: editFormData.email,
                    role: editFormData.role,
                    status: editFormData.status,
                    totalAppointments: parseInt(editFormData.totalAppointments)
                } : u
            );
            
            setUsers(updatedUsers);
            saveUsersToStorage(updatedUsers);
            
            // Navigate back and show success message
            navigate('/admin/users');
            showToast(`${editFormData.name} has been updated successfully!`, 'success');
            
        } catch (error) {
            console.error('Error updating user:', error);
            showToast('Error updating user. Please try again.', 'error');
        }
    };

    const handleActivateUser = (user) => {
        const updatedUsers = users.map(u => 
            u.id === user.id ? { ...u, status: 'Active' } : u
        );
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        showToast(`${user.name} has been activated`, 'success');
    };


    // Auto-trigger loader on component mount
    useEffect(() => {
        _setIsContentLoading(true);
        setTimeout(() => {
            _setIsContentLoading(false);
        }, 2000);
    }, []);

    // Check if we're on the add route
    useEffect(() => {
        if (location.pathname === '/admin/users/add') {
            setShowCreateForm(true);
            setFormData({
                name: '',
                email: '',
                role: 'User',
                status: 'Active',
                password: '',
                confirmPassword: ''
            });
            setFormErrors({});
        } else {
            setShowCreateForm(false);
        }
    }, [location.pathname]);

    // Check if we're on the edit route
    useEffect(() => {
        const pathMatch = location.pathname.match(/^\/admin\/users\/edit\/(\d+)$/);
        if (pathMatch) {
            const userId = parseInt(pathMatch[1]);
            const user = users.find(u => u.id === userId);
            if (user) {
                setUserToEdit(user);
                setEditFormData({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    totalAppointments: user.totalAppointments
                });
                setEditFormErrors({});
                setShowEditFormInLayout(true);
            } else {
                navigate('/admin/users');
            }
        } else {
            setShowEditFormInLayout(false);
        }
    }, [location.pathname, users]);

    // Check for search term from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    return (
        <div className="p-6 space-y-6">
            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>

            {showEditFormInLayout && userToEdit ? (
                /* Edit User Form */
                <Card className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit User</h2>
                        <button
                            onClick={handleCloseEditModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name || ''}
                                    onChange={handleEditInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        editFormErrors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {editFormErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editFormData.email || ''}
                                    onChange={handleEditInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        editFormErrors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {editFormErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.email}</p>
                                )}
                            </div>

                            {/* Role Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={editFormData.role || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="User">User</option>
                                </select>
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={editFormData.status || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Total Appointments Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Appointments
                                </label>
                                <input
                                    type="number"
                                    name="totalAppointments"
                                    value={editFormData.totalAppointments || ''}
                                    onChange={handleEditInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter total appointments"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Update User</span>
                            </button>
                        </div>
                    </form>
                </Card>
            ) : showCreateForm ? (
                /* Create User Form */
                <Card className="p-4 sm:p-6 lg:p-8">
                    {/* Form Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New User</h2>
                        <button
                            onClick={handleCloseForm}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.name ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {formErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.email ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Role Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role *
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="User">User</option>
                                </select>
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                            formErrors.password ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                            formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {formErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Create User</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Card>
            ) : (
                <>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
                    <p className="text-gray-600">Manage all platform users and their access</p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 flex items-center space-x-2"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Create User</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-xl font-bold text-gray-900">{activeUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-xl font-bold text-gray-900">{pendingUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <UserX className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Suspended</p>
                            <p className="text-xl font-bold text-gray-900">{suspendedUsers}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Roles</option>
                            <option value="User">User</option>
                        </select>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterStatus || filterRole) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('');
                                    setFilterRole('');
                                }}
                                className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
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
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleViewUser(user)}
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleEditUser(user)}
                                                className="text-purple-600 hover:text-purple-900 p-1"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {user.status === 'Active' ? (
                                                <button 
                                                    onClick={() => handleSuspendUser(user)}
                                                    className="text-yellow-600 hover:text-yellow-900 p-1"
                                                    title="Suspend User"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleActivateUser(user)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Activate User"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteUser(user)}
                                                className="text-red-600 hover:text-red-900 p-1"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600">
                                {searchTerm || filterStatus || filterRole
                                    ? 'No users match your current filters.'
                                    : 'No users have been registered yet.'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
            )}
            </div>
                </>
            )}


            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
                        toast.type === 'success' 
                            ? 'bg-pink-50 border-pink-500 text-pink-800' 
                            : 'bg-pink-50 border-pink-500 text-pink-800'
                    }`}>
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-pink-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-pink-600" />
                        )}
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: 'success' })}
                            className="ml-2 text-pink-600 hover:text-pink-800"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {selectedUser.avatar}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                                    <p className="text-sm text-gray-600">User Details</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseViewModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* User Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                    <p className="text-sm text-gray-900">{selectedUser.joinDate}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Last Active</label>
                                    <p className="text-sm text-gray-900">
                                        {selectedUser.lastActiveTimestamp 
                                            ? getRelativeTime(selectedUser.lastActiveTimestamp)
                                            : (selectedUser.lastActive || 'Never')}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Total Appointments</label>
                                    <p className="text-sm text-gray-900">{selectedUser.totalAppointments}</p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleCloseViewModal}
                                    className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>? 
                                This will permanently remove the user and all associated data.
                            </p>
                            
                            {/* User Info Preview */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {userToDelete.avatar}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{userToDelete.name}</p>
                                        <p className="text-sm text-gray-600">{userToDelete.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={cancelDeleteUser}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteUser}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Users;
