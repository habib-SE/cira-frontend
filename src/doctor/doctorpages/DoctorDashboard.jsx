import React, { useState } from 'react';
import { 
    Calendar, 
    Clock, 
    Users, 
    DollarSign, 
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Eye,
    MessageCircle,
    FileText,
    Star,
    Phone,
    Video,
    MapPin
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Today's appointments data
    const todaysAppointments = [
        {
            id: 1,
            patient: 'John Doe',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'confirmed',
            mode: 'clinic',
            duration: '30 min',
            condition: 'Hypertension',
            priority: 'normal',
            notes: 'Follow-up for blood pressure medication'
        },
        {
            id: 2,
            patient: 'Jane Smith',
            time: '10:30 AM',
            type: 'Follow-up',
            status: 'confirmed',
            mode: 'teleconsultation',
            duration: '20 min',
            condition: 'Diabetes',
            priority: 'high',
            notes: 'Review blood sugar levels'
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            time: '02:00 PM',
            type: 'Emergency',
            status: 'in-progress',
            mode: 'clinic',
            duration: '45 min',
            condition: 'Chest Pain',
            priority: 'urgent',
            notes: 'Acute chest pain - immediate attention needed'
        },
        {
            id: 4,
            patient: 'Sarah Williams',
            time: '03:30 PM',
            type: 'Consultation',
            status: 'waiting',
            mode: 'clinic',
            duration: '30 min',
            condition: 'General Check-up',
            priority: 'normal',
            notes: 'Annual health check-up'
        }
    ];

    // Upcoming appointments for quick cards
    const upcomingAppointments = [
        {
            id: 5,
            patient: 'Emily Davis',
            date: 'Tomorrow',
            time: '09:00 AM',
            type: 'Consultation',
            mode: 'teleconsultation'
        },
        {
            id: 6,
            patient: 'Robert Brown',
            date: 'Tomorrow',
            time: '11:00 AM',
            type: 'Follow-up',
            mode: 'clinic'
        },
        {
            id: 7,
            patient: 'Lisa Wilson',
            date: 'Dec 2, 2024',
            time: '10:00 AM',
            type: 'Check-up',
            mode: 'clinic'
        }
    ];

    // Quick stats
    const stats = [
        {
            title: "Today's Appointments",
            value: todaysAppointments.length.toString(),
            change: '+2 from yesterday',
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Patients',
            value: '248',
            change: '+12 this month',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Pending Reviews',
            value: '5',
            change: '2 urgent',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            title: 'Completed Today',
            value: '8',
            change: '67% completion',
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    // Recent AI reports
    const recentAIReports = [
        {
            id: 1,
            patient: 'John Doe',
            type: 'Health Assessment',
            status: 'completed',
            date: '2 hours ago',
            summary: 'Blood pressure readings show improvement with current medication'
        },
        {
            id: 2,
            patient: 'Jane Smith',
            type: 'Diagnostic Report',
            status: 'pending',
            date: '4 hours ago',
            summary: 'Blood sugar analysis indicates need for medication adjustment'
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            type: 'Emergency Assessment',
            status: 'urgent',
            date: '1 hour ago',
            summary: 'Chest pain analysis suggests possible cardiac event - immediate attention required'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'waiting':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'urgent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'high':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Dr. Smith! Here's your overview for today.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.change}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                            <span className="text-sm text-gray-500">{todaysAppointments.length} appointments</span>
                        </div>
                        
                        <div className="space-y-4">
                            {todaysAppointments.map((appointment) => (
                                <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                <span className="text-pink-600 font-semibold text-sm">
                                                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                                                <p className="text-sm text-gray-600">{appointment.condition}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getPriorityIcon(appointment.priority)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{appointment.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getModeIcon(appointment.mode)}
                                            <span className="text-gray-600 capitalize">{appointment.mode}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{appointment.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{appointment.type}</span>
                                        </div>
                                    </div>
                                    
                                    {appointment.notes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                                            <Eye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-800">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Start Consultation</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Quick Cards - Upcoming Appointments */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                        <div className="space-y-3">
                            {upcomingAppointments.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                                        <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getModeIcon(appointment.mode)}
                                        <span className="text-xs text-gray-500">{appointment.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent AI Reports */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Reports</h3>
                        <div className="space-y-3">
                            {recentAIReports.map((report) => (
                                <div key={report.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{report.patient}</h4>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{report.type}</p>
                                    <p className="text-xs text-gray-500">{report.date}</p>
                                    <p className="text-sm text-gray-700 mt-2">{report.summary}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <span>View Full Calendar</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                <FileText className="w-5 h-5 text-green-500" />
                                <span>Review AI Reports</span>
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