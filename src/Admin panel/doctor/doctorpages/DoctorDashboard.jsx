import React, { useState } from 'react';
import { 
    Calendar, 
    Clock, 
    Users, 
    DollarSign, 
    TrendingUp,
    TrendingDown,
    Phone,
    Video,
    MapPin,
    CheckCircle,
    AlertCircle,
    Clock as ClockIcon
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefreshContent = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    // Today's appointments data
    const todaysAppointments = [
        {
            id: 1,
            patient: 'John Doe',
            time: '09:00 AM',
            mode: 'clinic',
            status: 'confirmed',
            type: 'Follow-up',
            duration: '30 min'
        },
        {
            id: 2,
            patient: 'Jane Smith',
            time: '10:30 AM',
            mode: 'teleconsultation',
            status: 'confirmed',
            type: 'Initial Consultation',
            duration: '45 min'
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            time: '02:00 PM',
            mode: 'clinic',
            status: 'pending',
            type: 'Check-up',
            duration: '20 min'
        },
        {
            id: 4,
            patient: 'Sarah Williams',
            time: '03:30 PM',
            mode: 'teleconsultation',
            status: 'confirmed',
            type: 'Follow-up',
            duration: '30 min'
        }
    ];

    // Stats data
    const stats = [
        {
            icon: Users,
            title: 'Total Patients',
            value: '1,234',
            change: '+12% from last month',
            bgColor: 'bg-blue-50',
            color: 'text-blue-600'
        },
        {
            icon: Calendar,
            title: 'Today\'s Appointments',
            value: todaysAppointments.length.toString(),
            change: '4 scheduled',
            bgColor: 'bg-green-50',
            color: 'text-green-600'
        },
        {
            icon: DollarSign,
            title: 'Today\'s Earnings',
            value: '$1,250',
            change: '+8% from yesterday',
            bgColor: 'bg-purple-50',
            color: 'text-purple-600'
        },
        {
            icon: TrendingUp,
            title: 'Growth Rate',
            value: '+15%',
            change: 'This month',
            bgColor: 'bg-orange-50',
            color: 'text-orange-600'
        }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <ClockIcon className="w-4 h-4 text-yellow-500" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-green-500" />;
        }
    };

    const getModeIcon = (mode) => {
        switch (mode) {
            case 'teleconsultation':
                return <Video className="w-4 h-4 text-blue-500" />;
            case 'clinic':
                return <MapPin className="w-4 h-4 text-green-500" />;
            default:
                return <Phone className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                        <p className="text-sm sm:text-base text-gray-600 break-words">Welcome back, Dr. Smith! Here's your overview for today.</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={handleRefreshContent}
                            disabled={isRefreshing}
                            className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                        >
                            {isRefreshing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span className="hidden sm:inline">Refreshing...</span>
                                    <span className="sm:hidden">...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Refresh</span>
                                    <span className="sm:hidden">↻</span>
                                </>
                            )}
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-auto"
                        />
                    </div>
                </div>
            </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-3 sm:p-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500 truncate">{stat.change}</p>
                                </div>
                            </div>
                        </Card>
                    );
                        })}
                    </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today's Appointments</h2>
                            <span className="text-xs sm:text-sm text-gray-500">{todaysAppointments.length} appointments</span>
                        </div>
                        
                        <div className="space-y-3 sm:space-y-4">
                            {todaysAppointments.map((appointment) => (
                                <div key={appointment.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-pink-600 font-semibold text-xs sm:text-sm">
                                                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{appointment.patient}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            {getStatusIcon(appointment.status)}
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                appointment.status === 'confirmed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
                                        <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span>{appointment.time}</span>
                                        </div>
                                            <div className="flex items-center space-x-1">
                                            {getModeIcon(appointment.mode)}
                                                <span className="capitalize truncate">{appointment.mode}</span>
                                        </div>
                                            <div className="flex items-center space-x-1">
                                                <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span>{appointment.duration}</span>
                                        </div>
                                        </div>
                                        <button className="text-pink-600 hover:text-pink-700 font-medium text-xs sm:text-sm whitespace-nowrap">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <span>Schedule Appointment</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Users className="w-5 h-5 text-green-500" />
                                <span>View Patients</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <DollarSign className="w-5 h-5 text-purple-500" />
                                <span>View Earnings</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <TrendingUp className="w-5 h-5 text-orange-500" />
                                <span>Analytics</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;