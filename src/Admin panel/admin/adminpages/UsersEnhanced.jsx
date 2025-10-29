import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  Trash2, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  UserPlus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  EyeOff, 
  Edit,
  Download,
  RefreshCw,
  Plus
} from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';
import DataTable from '../../../components/shared/DataTable';

const Users = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [density, setDensity] = useState('regular');
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Default users data
    const defaultUsers = [
        {
            id: 1,
            name: 'John Doe',
            username: 'johndoe',
            email: 'john.doe@email.com',
            department: 'Engineering',
            role: 'User',
            status: 'Active',
            joinDate: '2024-01-15',
            lastActiveTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            totalAppointments: 5,
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: 'janesmith',
            email: 'jane.smith@email.com',
            department: 'Marketing',
            role: 'Admin',
            status: 'Active',
            joinDate: '2024-01-10',
            lastActiveTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            totalAppointments: 12,
            avatar: 'JS'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            username: 'bobjohnson',
            email: 'bob.johnson@email.com',
            department: 'Sales',
            role: 'User',
            status: 'Inactive',
            joinDate: '2024-01-05',
            lastActiveTimestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            totalAppointments: 3,
            avatar: 'BJ'
        },
        {
            id: 4,
            name: 'Alice Brown',
            username: 'alicebrown',
            email: 'alice.brown@email.com',
            department: 'HR',
            role: 'User',
            status: 'Active',
            joinDate: '2024-01-20',
            lastActiveTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            totalAppointments: 8,
            avatar: 'AB'
        },
        {
            id: 5,
            name: 'Charlie Wilson',
            username: 'charliewilson',
            email: 'charlie.wilson@email.com',
            department: 'Engineering',
            role: 'User',
            status: 'Pending',
            joinDate: '2024-01-25',
            lastActiveTimestamp: null,
            totalAppointments: 0,
            avatar: 'CW'
        }
    ];

    const [users, setUsers] = useState(defaultUsers);

    // Function to calculate relative time
    const getRelativeTime = (timestamp) => {
        if (!timestamp) return 'Never';
        
        const now = new Date();
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

    // DataTable configuration
    const columns = [
        {
            key: 'avatar',
            label: 'User',
            type: 'avatar',
            sortable: true
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true
        },
        {
            key: 'department',
            label: 'Department',
            sortable: true
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true
        },
        {
            key: 'status',
            label: 'Status',
            type: 'status',
            sortable: true
        },
        {
            key: 'joinDate',
            label: 'Join Date',
            type: 'date',
            sortable: true
        },
        {
            key: 'lastActiveTimestamp',
            label: 'Last Active',
            render: (value) => getRelativeTime(value),
            sortable: true
        },
        {
            key: 'totalAppointments',
            label: 'Appointments',
            sortable: true
        }
    ];

    const filters = [
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending', label: 'Pending' }
            ]
        },
        {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { value: 'Admin', label: 'Admin' },
                { value: 'User', label: 'User' }
            ]
        },
        {
            key: 'department',
            label: 'Department',
            type: 'select',
            options: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'HR', label: 'HR' }
            ]
        },
        {
            key: 'joinDate',
            label: 'Join Date',
            type: 'date'
        }
    ];

    const bulkActions = [
        {
            label: 'Activate',
            icon: UserCheck,
            onClick: (selectedIds) => {
                setUsers(prev => prev.map(user => 
                    selectedIds.includes(user.id) 
                        ? { ...user, status: 'Active' }
                        : user
                ));
                setSelectedUsers([]);
                setToast({ show: true, message: `${selectedIds.length} users activated`, type: 'success' });
            }
        },
        {
            label: 'Deactivate',
            icon: UserX,
            variant: 'danger',
            onClick: (selectedIds) => {
                setUsers(prev => prev.map(user => 
                    selectedIds.includes(user.id) 
                        ? { ...user, status: 'Inactive' }
                        : user
                ));
                setSelectedUsers([]);
                setToast({ show: true, message: `${selectedIds.length} users deactivated`, type: 'success' });
            }
        }
    ];

    const handleRowAction = (action, user) => {
        switch (action) {
            case 'view':
                navigate(`/admin/users/view/${user.id}`);
                break;
            case 'edit':
                navigate(`/admin/users/edit/${user.id}`);
                break;
            case 'delete':
                if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                    setUsers(prev => prev.filter(u => u.id !== user.id));
                    setToast({ show: true, message: 'User deleted successfully', type: 'success' });
                }
                break;
            case 'activate':
                setUsers(prev => prev.map(u => 
                    u.id === user.id ? { ...u, status: 'Active' } : u
                ));
                setToast({ show: true, message: 'User activated', type: 'success' });
                break;
            case 'deactivate':
                setUsers(prev => prev.map(u => 
                    u.id === user.id ? { ...u, status: 'Inactive' } : u
                ));
                setToast({ show: true, message: 'User deactivated', type: 'success' });
                break;
        }
    };

    const handleRowSelect = (userId, checked) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Name', 'Email', 'Department', 'Role', 'Status', 'Join Date', 'Last Active', 'Appointments'],
            ...users.map(user => [
                user.name,
                user.email,
                user.department,
                user.role,
                user.status,
                user.joinDate,
                getRelativeTime(user.lastActiveTimestamp),
                user.totalAppointments
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        setToast({ show: true, message: 'Users exported successfully', type: 'success' });
    };

    const handleRefresh = () => {
        setIsContentLoading(true);
        setError(null);
        
        // Simulate API call
        setTimeout(() => {
            setLastUpdated(new Date());
            setIsContentLoading(false);
            setToast({ show: true, message: 'Data refreshed', type: 'success' });
        }, 1000);
    };

    const handleRetry = () => {
        setError(null);
        handleRefresh();
    };

    // Simulate error for demonstration
    const simulateError = () => {
        setError({
            message: 'Failed to load users data',
            id: 'ERR_' + Math.random().toString(36).substr(2, 9)
        });
    };

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Users</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage platform users and their access</p>
                    <MetaChips 
                        status="Active" 
                        id={`Total: ${users.length}`}
                        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        owner="Admin"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-xl font-bold text-gray-900">{users.length}</p>
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
                            <p className="text-xl font-bold text-gray-900">
                                {users.filter(u => u.status === 'Active').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-xl font-bold text-gray-900">
                                {users.filter(u => u.status === 'Pending').length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <UserX className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Inactive</p>
                            <p className="text-xl font-bold text-gray-900">
                                {users.filter(u => u.status === 'Inactive').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Enhanced DataTable */}
            <DataTable
                title="Users"
                count={users.length}
                columns={columns}
                data={users}
                searchPlaceholder="Search users by name, email, or department..."
                filters={filters}
                loading={isContentLoading}
                error={error}
                onRetry={handleRetry}
                lastUpdated={lastUpdated}
                density={density}
                onDensityChange={setDensity}
                selectedRows={selectedUsers}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onRowAction={handleRowAction}
                bulkActions={bulkActions}
                onExport={handleExport}
                onRefresh={handleRefresh}
                primaryCTA={{
                    label: 'Add User',
                    icon: Plus,
                    onClick: () => navigate('/admin/users/add')
                }}
                secondaryActions={[
                    {
                        label: 'Simulate Error',
                        icon: AlertCircle,
                        onClick: simulateError,
                        variant: 'secondary'
                    }
                ]}
                emptyState={
                    <div className="text-center py-8">
                        <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first user.</p>
                        <button
                            onClick={() => navigate('/admin/users/add')}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Add User
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default Users;

