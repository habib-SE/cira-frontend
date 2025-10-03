import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Download, 
    Calendar, 
    DollarSign, 
    Clock, 
    Star, 
    FileText, 
    Award,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Save,
    Camera,
    Upload,
    Shield,
    GraduationCap,
    Briefcase,
    Languages,
    Clock3,
    User,
    Stethoscope,
    Activity
} from 'lucide-react';
import Card from '../admin/admincomponents/Card';

const DoctorProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    // Sample doctor data - in real app, this would be fetched from API
    const doctorsData = React.useMemo(() => [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@clinic.com',
            phone: '+1 (555) 123-4567',
            specialty: 'Cardiology',
            experience: '8 years',
            education: 'MD, Harvard Medical School',
            licenseNumber: 'MD12345',
            licenseExpiry: '2025-12-31',
            status: 'Approved',
            rating: 4.9,
            totalPatients: 245,
            totalAppointments: 450,
            consultationFee: 150,
            followUpFee: 100,
            emergencyFee: 250,
            languages: ['English', 'Spanish'],
            location: 'New York, NY',
            bio: 'Dr. Sarah Johnson is a board-certified cardiologist with extensive experience in treating cardiovascular diseases. She specializes in preventive cardiology and interventional procedures.',
            availability: {
                monday: { start: '09:00', end: '17:00', available: true },
                tuesday: { start: '09:00', end: '17:00', available: true },
                wednesday: { start: '09:00', end: '17:00', available: true },
                thursday: { start: '09:00', end: '17:00', available: true },
                friday: { start: '09:00', end: '15:00', available: true },
                saturday: { start: '10:00', end: '14:00', available: false },
                sunday: { start: '10:00', end: '14:00', available: false }
            },
            documents: [
                { name: 'Medical License', type: 'PDF', size: '2.3 MB', uploaded: '2023-01-15', status: 'Verified' },
                { name: 'Board Certification', type: 'PDF', size: '1.8 MB', uploaded: '2023-01-15', status: 'Verified' },
                { name: 'Malpractice Insurance', type: 'PDF', size: '1.2 MB', uploaded: '2023-01-15', status: 'Verified' },
                { name: 'DEA License', type: 'PDF', size: '0.9 MB', uploaded: '2023-01-15', status: 'Verified' }
            ],
            specialties: [
                'Interventional Cardiology',
                'Preventive Cardiology',
                'Heart Failure Management',
                'Cardiac Rehabilitation'
            ],
            achievements: [
                'Board Certified Cardiologist (2018)',
                'Fellow of American College of Cardiology',
                'Published 25+ research papers',
                'Speaker at 10+ medical conferences'
            ],
            recentActivity: [
                { action: 'Completed consultation', patient: 'John Doe', time: '2 hours ago', type: 'consultation' },
                { action: 'Updated patient record', patient: 'Jane Smith', time: '4 hours ago', type: 'record' },
                { action: 'Prescribed medication', patient: 'Mike Johnson', time: '6 hours ago', type: 'prescription' },
                { action: 'Scheduled follow-up', patient: 'Sarah Wilson', time: '1 day ago', type: 'appointment' }
            ],
            appointments: [
                { id: 1, patient: 'John Doe', date: '2024-01-16', time: '09:00 AM', type: 'Consultation', status: 'Scheduled' },
                { id: 2, patient: 'Jane Smith', date: '2024-01-16', time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
                { id: 3, patient: 'Mike Johnson', date: '2024-01-17', time: '02:00 PM', type: 'Check-up', status: 'Pending' }
            ]
        }
    ], []);

    useEffect(() => {
        // In real app, fetch doctor data by ID
        const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
        setDoctor(foundDoctor);
    }, [id, doctorsData]);

    const handleBack = () => {
        navigate('/admin/doctors');
    };

    const handleApproveDoctor = () => {
        // Implement approve functionality
    };

    const handleRejectDoctor = () => {
        // Implement reject functionality
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'Under Review':
                return 'bg-blue-100 text-blue-800';
            case 'Failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
            case 'Verified':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending':
            case 'Under Review':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Rejected':
            case 'Failed':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'fees', label: 'Fees & Services', icon: DollarSign },
        { id: 'activity', label: 'Recent Activity', icon: Clock3 },
        { id: 'appointments', label: 'Appointments', icon: Calendar }
    ];

    if (!doctor) {
        return (
            <div className="p-6">
                <Card className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading doctor profile...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Doctors</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                        <p className="text-gray-600">{doctor.specialty} • {doctor.experience} experience</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                        {getStatusIcon(doctor.status)}
                        <span>{doctor.status}</span>
                    </span>
                    {doctor.status === 'Pending' && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleApproveDoctor}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleRejectDoctor}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Rating</p>
                            <p className="text-xl font-bold text-gray-900">{doctor.rating}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Patients</p>
                            <p className="text-xl font-bold text-gray-900">{doctor.totalPatients}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Appointments</p>
                            <p className="text-xl font-bold text-gray-900">{doctor.totalAppointments}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Consultation Fee</p>
                            <p className="text-xl font-bold text-gray-900">${doctor.consultationFee}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Profile Sidebar */}
                <Card className="p-0">
                    <div className="p-6 text-center border-b border-gray-200">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h2>
                        <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                        </div>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                            {getStatusIcon(doctor.status)}
                            <span>{doctor.status}</span>
                        </span>
                    </div>
                    
                    <nav className="p-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <p className="text-gray-900">{doctor.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <p className="text-gray-900">{doctor.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        <p className="text-gray-900">{doctor.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <p className="text-gray-900">{doctor.location}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Professional Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                                        <p className="text-gray-900">{doctor.specialty}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                        <p className="text-gray-900">{doctor.experience}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                        <p className="text-gray-900">{doctor.education}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                                        <p className="text-gray-900">{doctor.licenseNumber}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Bio */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
                                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                            </Card>

                            {/* Specialties */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex px-3 py-1 text-sm font-medium bg-pink-100 text-pink-800 rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Languages */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.languages.map((language, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Document</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {doctor.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                                <p className="text-sm text-gray-500">{doc.type} • {doc.size} • Uploaded {doc.uploaded}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                                {getStatusIcon(doc.status)}
                                                <span>{doc.status}</span>
                                            </span>
                                            <button className="text-blue-600 hover:text-blue-800">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'schedule' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Schedule</h3>
                            <div className="space-y-4">
                                {Object.entries(doctor.availability).map(([day, schedule]) => (
                                    <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 text-sm font-medium text-gray-900 capitalize">
                                                {day}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {schedule.available ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm text-gray-900">
                                                            {schedule.start} - {schedule.end}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm text-gray-500">Not Available</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'fees' && (
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Fees</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                                        <h4 className="font-medium text-gray-900 mb-2">Consultation</h4>
                                        <p className="text-2xl font-bold text-pink-600">${doctor.consultationFee}</p>
                                        <p className="text-sm text-gray-500">Initial consultation</p>
                                    </div>
                                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                                        <h4 className="font-medium text-gray-900 mb-2">Follow-up</h4>
                                        <p className="text-2xl font-bold text-pink-600">${doctor.followUpFee}</p>
                                        <p className="text-sm text-gray-500">Follow-up visits</p>
                                    </div>
                                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                                        <h4 className="font-medium text-gray-900 mb-2">Emergency</h4>
                                        <p className="text-2xl font-bold text-pink-600">${doctor.emergencyFee}</p>
                                        <p className="text-sm text-gray-500">Emergency consultation</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-pink-600 mb-2">{doctor.totalPatients}</div>
                                        <div className="text-sm text-gray-600">Total Patients</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-pink-600 mb-2">{doctor.totalAppointments}</div>
                                        <div className="text-sm text-gray-600">Total Appointments</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-pink-600 mb-2">{doctor.rating}</div>
                                        <div className="text-sm text-gray-600">Average Rating</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {doctor.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{activity.action}</h4>
                                            <p className="text-sm text-gray-500">{activity.patient} • {activity.time}</p>
                                        </div>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {activity.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'appointments' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Appointments</h3>
                            <div className="space-y-4">
                                {doctor.appointments.map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                                                <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {appointment.type}
                                            </span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                appointment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileDetail;
