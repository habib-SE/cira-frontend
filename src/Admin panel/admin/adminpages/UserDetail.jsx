import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, AlertCircle } from 'lucide-react';
import Card from '../admincomponents/Card';

const UserDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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

    // Function to get role color
    const getRoleColor = (role) => {
        const colors = {
            'Admin': 'bg-purple-100 text-purple-800',
            'Doctor': 'bg-blue-100 text-blue-800',
            'User': 'bg-gray-100 text-gray-800',
            'Company': 'bg-green-100 text-green-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    // Function to get status color
    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 text-green-800',
            'Suspended': 'bg-yellow-100 text-yellow-800',
            'Inactive': 'bg-gray-100 text-gray-800',
            'Banned': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Load user data
    useEffect(() => {
        const loadUser = () => {
            setLoading(true);
            
            // Try to get from localStorage first
            const storedUsers = localStorage.getItem('adminUsers');
            if (storedUsers) {
                try {
                    const users = JSON.parse(storedUsers);
                    const foundUser = users.find(u => u.id === parseInt(id));
                    if (foundUser) {
                        setUser(foundUser);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing stored users:', error);
                }
            }

            // Default users data (fallback)
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
                    role: 'User',
                    status: 'Active',
                    joinDate: '2024-01-14',
                    lastActiveTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    totalAppointments: 3,
                    avatar: 'JS'
                },
                {
                    id: 3,
                    name: 'Dr. Sarah Johnson',
                    username: 'sarahjohnson',
                    email: 'sarah.johnson@clinic.com',
                    department: 'Medical',
                    role: 'Doctor',
                    status: 'Active',
                    joinDate: '2023-12-01',
                    lastActiveTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    totalAppointments: 45,
                    avatar: 'SJ'
                },
                {
                    id: 4,
                    name: 'Mike Johnson',
                    username: 'mikejohnson',
                    email: 'mike.johnson@email.com',
                    department: 'Sales',
                    role: 'User',
                    status: 'Suspended',
                    joinDate: '2024-01-10',
                    lastActiveTimestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    totalAppointments: 2,
                    avatar: 'MJ'
                }
            ];

            const foundUser = defaultUsers.find(u => u.id === parseInt(id));
            if (foundUser) {
                setUser(foundUser);
            }
            
            setLoading(false);
        };

        loadUser();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6">
                <Card className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user details...</p>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <Card className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Back to Users
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Users</span>
                    </button>
                </div>
            </div>

            {/* User Details Card */}
            <Card className="p-8">
                {/* User Header */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                            {user.avatar}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-sm text-gray-600">User Details</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-sm text-gray-900">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <p className="text-sm text-gray-900">{user.username || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <p className="text-sm text-gray-900">{user.department || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Join Date</label>
                        <p className="text-sm text-gray-900">{user.joinDate}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Last Active</label>
                        <p className="text-sm text-gray-900">
                            {user.lastActiveTimestamp 
                                ? getRelativeTime(user.lastActiveTimestamp)
                                : (user.lastActive || 'Never')}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Total Appointments</label>
                        <p className="text-sm text-gray-900">{user.totalAppointments || 0}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default UserDetail;

