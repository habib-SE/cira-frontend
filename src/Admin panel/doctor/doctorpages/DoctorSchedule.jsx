import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    Clock, 
    Plus, 
    Filter, 
    Search, 
    Video, 
    Phone, 
    MapPin,
    Eye,
    MessageCircle,
    FileText,
    AlertCircle,
    CheckCircle,
    User,
    ChevronLeft,
    ChevronRight,
    Download
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorSchedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('week'); // day, week, month
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

    // Sample appointments data with AI reports
    const appointments = [
        {
            id: 1,
            patient: 'John Doe',
            date: '2024-01-15',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'confirmed',
            duration: '30 min',
            mode: 'clinic',
            room: 'Room 301',
            reason: 'Follow-up for blood pressure management',
            aiReport: {
                id: 'AI-2024-001',
                status: 'completed',
                summary: 'Blood pressure readings show improvement with current medication',
                priority: 'normal'
            }
        },
        {
            id: 2,
            patient: 'Jane Smith',
            date: '2024-01-15',
            time: '10:30 AM',
            type: 'Follow-up',
            status: 'confirmed',
            duration: '20 min',
            mode: 'teleconsultation',
            room: 'Virtual',
            reason: 'Review blood sugar levels',
            aiReport: {
                id: 'AI-2024-002',
                status: 'pending',
                summary: 'Blood sugar analysis indicates need for medication adjustment',
                priority: 'high'
            }
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            date: '2024-01-15',
            time: '02:00 PM',
            type: 'Emergency',
            status: 'in-progress',
            duration: '45 min',
            mode: 'clinic',
            room: 'Room 301',
            reason: 'Acute chest pain - immediate attention needed',
            aiReport: {
                id: 'AI-2024-003',
                status: 'urgent',
                summary: 'Chest pain analysis suggests possible cardiac event - immediate attention required',
                priority: 'urgent'
            }
        },
        {
            id: 4,
            patient: 'Sarah Williams',
            date: '2024-01-15',
            time: '03:30 PM',
            type: 'Consultation',
            status: 'waiting',
            duration: '30 min',
            mode: 'clinic',
            room: 'Room 301',
            reason: 'Annual health check-up',
            aiReport: {
                id: 'AI-2024-004',
                status: 'completed',
                summary: 'General health assessment shows stable condition',
                priority: 'normal'
            }
        },
        {
            id: 5,
            patient: 'Emily Davis',
            date: '2024-01-16',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'scheduled',
            duration: '30 min',
            mode: 'teleconsultation',
            room: 'Virtual',
            reason: 'Initial consultation for diabetes management',
            aiReport: {
                id: 'AI-2024-005',
                status: 'pending',
                summary: 'Pre-consultation health screening in progress',
                priority: 'normal'
            }
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
            case 'scheduled':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'in-progress':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'waiting':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'scheduled':
                return <Calendar className="w-4 h-4 text-purple-500" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Consultation':
                return 'bg-blue-100 text-blue-800';
            case 'Follow-up':
                return 'bg-purple-100 text-purple-800';
            case 'Check-up':
                return 'bg-green-100 text-green-800';
            case 'Emergency':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'normal':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAIReportStatusColor = (status) => {
        switch (status) {
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

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = searchTerm === '' || 
            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || appointment.status === filterStatus;
        const matchesType = filterType === '' || appointment.type === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
    });

    // Group appointments by date
    const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
        const date = appointment.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(appointment);
        return groups;
    }, {});

    const viewModes = [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' }
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'waiting', label: 'Waiting' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'Consultation', label: 'Consultation' },
        { value: 'Follow-up', label: 'Follow-up' },
        { value: 'Check-up', label: 'Check-up' },
        { value: 'Emergency', label: 'Emergency' }
    ];

    const handleViewAppointment = (appointmentId) => {
        navigate(`/doctor/appointments/${appointmentId}`);
    };

    const handleViewAIReport = (appointmentId) => {
        // Navigate to AI report view
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-600">Manage your appointments and view AI reports</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
                        <Plus className="w-5 h-5" />
                        <span>Add Appointment</span>
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>

                    {/* View Mode */}
                    <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                        {viewModes.map((mode) => (
                            <button
                                key={mode.value}
                                onClick={() => setViewMode(mode.value)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    viewMode === mode.value
                                        ? 'bg-white text-pink-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        {typeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {(searchTerm || filterStatus || filterType) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterStatus('');
                                setFilterType('');
                            }}
                            className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </Card>

            {/* Calendar View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Calendar</h3>
                            <div className="flex items-center space-x-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Confirmed ({filteredAppointments.filter(a => a.status === 'confirmed').length})</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span>Waiting ({filteredAppointments.filter(a => a.status === 'waiting').length})</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>In Progress ({filteredAppointments.filter(a => a.status === 'in-progress').length})</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-3">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {viewMode === 'day' ? 'Today\'s Appointments' : 
                                 viewMode === 'week' ? 'This Week\'s Appointments' : 
                                 'This Month\'s Appointments'}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                    {filteredAppointments.length} appointments
                                </span>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {Object.keys(groupedAppointments).length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                                <p className="text-gray-600">Try adjusting your filters or add a new appointment.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
                                    <div key={date}>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            {new Date(date).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </h4>
                                        <div className="space-y-3">
                                            {dayAppointments.map((appointment) => (
                                                <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                                <User className="w-5 h-5 text-pink-600" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-gray-900">{appointment.patient}</h5>
                                                                <p className="text-sm text-gray-600">{appointment.reason}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {getStatusIcon(appointment.status)}
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                                {appointment.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
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
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-600">{appointment.room}</span>
                                                        </div>
                                                    </div>

                                                    {/* AI Report Section */}
                                                    <div className="border-t border-gray-200 pt-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <FileText className="w-4 h-4 text-blue-500" />
                                                                <span className="text-sm font-medium text-gray-700">AI Report</span>
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAIReportStatusColor(appointment.aiReport.status)}`}>
                                                                    {appointment.aiReport.status}
                                                                </span>
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appointment.aiReport.priority)}`}>
                                                                    {appointment.aiReport.priority} priority
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleViewAIReport(appointment.id)}
                                                                    className="flex items-center space-x-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    <span>View Report</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2">{appointment.aiReport.summary}</p>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                                        <button
                                                            onClick={() => handleViewAppointment(appointment.id)}
                                                            className="flex items-center space-x-1 px-3 py-1 text-sm text-pink-600 hover:text-pink-800"
                                                        >
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;
