import React, { useState } from 'react';
import { Users as UsersIcon, Search, Filter, Eye, Ban, Trash2, MoreVertical, UserCheck, UserX } from 'lucide-react';
import Card from '../admin/admincomponents/Card';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Sample users data
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@email.com',
            role: 'Patient',
            status: 'Active',
            joinDate: '2024-01-15',
            lastActive: '2 hours ago',
            totalAppointments: 5,
            avatar: 'JD'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            role: 'Patient',
            status: 'Active',
            joinDate: '2024-01-14',
            lastActive: '1 day ago',
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
            lastActive: '30 min ago',
            totalAppointments: 45,
            avatar: 'SJ'
        },
        {
            id: 4,
            name: 'Mike Johnson',
            email: 'mike.johnson@email.com',
            role: 'Patient',
            status: 'Suspended',
            joinDate: '2024-01-10',
            lastActive: '5 days ago',
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
            lastActive: '1 hour ago',
            totalAppointments: 12,
            avatar: 'MC'
        },
        {
            id: 6,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@email.com',
            role: 'Patient',
            status: 'Active',
            joinDate: '2024-01-12',
            lastActive: '3 hours ago',
            totalAppointments: 7,
            avatar: 'SW'
        }
    ];

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
            case 'Patient':
                return 'bg-purple-100 text-purple-800';
            case 'Admin':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' || 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || user.status === filterStatus;
        const matchesRole = filterRole === '' || user.role === filterRole;
        
        return matchesSearch && matchesStatus && matchesRole;
    });

    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const suspendedUsers = users.filter(u => u.status === 'Suspended').length;
    const pendingUsers = users.filter(u => u.status === 'Pending').length;

    const handleViewUser = (user) => {
        // Navigate to user detail page
    };

    const handleSuspendUser = (user) => {
        // Implement suspend functionality
    };

    const handleDeleteUser = (user) => {
        // Implement delete functionality
    };

    const handleActivateUser = (user) => {
        // Implement activate functionality
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
                    <p className="text-gray-600">Manage all platform users and their access</p>
                </div>
            </div>

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
                            placeholder="Search users by name or email..."
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
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Admin">Admin</option>
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
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Active
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Appointments
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
                                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.joinDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.lastActive}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.totalAppointments}</div>
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
    );
};

export default Users;
