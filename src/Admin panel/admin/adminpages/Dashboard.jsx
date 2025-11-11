import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Stethoscope, TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Plus } from 'lucide-react';
import Card from '../admincomponents/Card';
import Chart from '../admincomponents/Chart';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Sample data for charts
    const patientData = [
        { name: 'Jan', value: 120 },
        { name: 'Feb', value: 150 },
        { name: 'Mar', value: 180 },
        { name: 'Apr', value: 200 },
        { name: 'May', value: 220 },
        { name: 'Jun', value: 250 },
    ];

    const appointmentData = [
        { name: 'Mon', value: 45 },
        { name: 'Tue', value: 52 },
        { name: 'Wed', value: 38 },
        { name: 'Thu', value: 61 },
        { name: 'Fri', value: 48 },
        { name: 'Sat', value: 35 },
        { name: 'Sun', value: 28 },
    ];

    const diagnosisData = [
        { name: 'Cardiology', value: 35 },
        { name: 'Neurology', value: 25 },
        { name: 'Dermatology', value: 20 },
        { name: 'Orthopedics', value: 20 },
    ];

    const aiActivityLogs = [
        { id: 1, action: 'AI Diagnosis Generated', patient: 'John Doe', time: '2 min ago', status: 'success' },
        { id: 2, action: 'Risk Assessment Completed', patient: 'Jane Smith', time: '5 min ago', status: 'success' },
        { id: 3, action: 'Treatment Recommendation', patient: 'Mike Johnson', time: '8 min ago', status: 'warning' },
        { id: 4, action: 'Health Report Analyzed', patient: 'Sarah Wilson', time: '12 min ago', status: 'success' },
        { id: 5, action: 'Emergency Alert Triggered', patient: 'David Brown', time: '15 min ago', status: 'error' },
    ];

    const statsCards = [
        {
            title: 'Total Users',
            value: '2,847',
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Active Doctors',
            value: '47',
            change: '+8%',
            changeType: 'positive',
            icon: Stethoscope,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Appointments Today',
            value: '23',
            change: '+15%',
            changeType: 'positive',
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Revenue This Month',
            value: '$45,230',
            change: '+23%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
        },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your platform.</p>
                    <MetaChips 
                        status="Active"
                        id="Admin Dashboard"
                        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        owner="System"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="inline-block w-auto">
                <Card className="p-4 sm:p-6">
                    <div className="text-sm font-semibold text-gray-500 mb-3">
                        • Quick actions:
                    </div>
                    <div className="flex flex-row gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/admin/appointments/add')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 
                            rounded-lg hover:bg-pink-100 transition-colors font-medium text-xs whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 flex-shrink-0" />
                            New Appointment
                        </button>
                        <button
                            onClick={() => navigate('/admin/doctors')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-50
                             text-pink-600 rounded-lg hover:bg-pink-100 transition-colors 
                             font-medium text-xs whitespace-nowrap"
                        >
                            <Stethoscope className="w-4 h-4 flex-shrink-0" />
                            Manage Doctors
                        </button>
                    </div>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4 sm:space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} hover className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <div className="flex items-center space-x-1">
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-green-600 font-medium">{stat.change}</span>
                                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">from last month</span>
                                    </div>
                                </div>
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                        })}
                    </div>

                    {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* User Growth Chart */}
                <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">User Growth</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Monthly user registration trends</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Chart type="line" data={patientData} height={250} />
                    </div>
                </Card>

                {/* Appointments Chart */}
                <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Weekly Appointments</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Appointment distribution by day</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Chart type="bar" data={appointmentData} height={250} />
                    </div>
                </Card>
            </div>

            {/* Doctor Specialties and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Doctor Specialties Distribution */}
                <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Doctor Specialties</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Distribution by medical specialty</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Chart type="pie" data={diagnosisData} height={250} />
                    </div>
                </Card>

                {/* Recent System Activity */}
                <Card className="p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Latest platform activities</p>
                    </div>
                    <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
                        {aiActivityLogs.map((log) => (
                            <div key={log.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(log.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                        {log.action}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {log.patient} • {log.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    </div>
    );
};

export default Dashboard;
