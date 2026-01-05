import React, { useState, useEffect } from 'react';
import { 
    User, 
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
    Clock3
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({});

    // Sample doctor data - in real app, this would be fetched from API
    const doctorData = {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@clinic.com',
        phone: '+1 (555) 123-4567',
        specialty: 'Cardiology',
        experience: '8 years',
        education: 'MD, Harvard Medical School',
        licenseNumber: 'MD12345',
        licenseExpiry: '2025-12-31',
        status: 'Active',
        consultationType: 'online', // 'online', 'offline', 'busy'
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
        ]
    };

    useEffect(() => {
        setDoctor(doctorData);
        setFormData(doctorData);
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({ ...doctor });
    };

    const handleSave = () => {
        setDoctor({ ...formData });
        setIsEditing(false);
        // Save to localStorage or API
        localStorage.setItem('doctorProfile', JSON.stringify(formData));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ ...doctor });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Expired':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Expired':
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
        { id: 'activity', label: 'Recent Activity', icon: Clock3 }
    ];

    if (!doctor) {
        return (
            <div className="p-6">
                <Card className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage your professional profile and practice information</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                        >
                            <Edit className="w-4 h-4 flex-shrink-0" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                            >
                                <Save className="w-4 h-4 flex-shrink-0" />
                                <span>Save Changes</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors whitespace-nowrap text-sm sm:text-base"
                            >
                                <XCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Cancel</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Profile Sidebar */}
                <Card className="p-0">
                    <div className="p-4 sm:p-6 text-center border-b border-gray-200">
                        <div className="relative inline-block">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-pink-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-pink-400 text-white rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            )}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{doctor.name}</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-2 truncate">{doctor.specialty}</p>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {doctor.status}
                            </span>
                            {isEditing ? (
                                <select
                                    value={formData.consultationType || 'online'}
                                    onChange={(e) => handleInputChange('consultationType', e.target.value)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="busy">Busy</option>
                                </select>
                            ) : (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                    doctor.consultationType === 'online' ? 'bg-green-100 text-green-800' :
                                    doctor.consultationType === 'offline' ? 'bg-gray-100 text-gray-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                    {doctor.consultationType === 'online' && <CheckCircle className="w-3 h-3" />}
                                    {doctor.consultationType === 'offline' && <XCircle className="w-3 h-3" />}
                                    {doctor.consultationType === 'busy' && <AlertCircle className="w-3 h-3" />}
                                    {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <nav className="p-2 sm:p-3">
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 tab-scroll-container">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap lg:w-full min-w-max lg:min-w-0 ${
                                            activeTab === tab.id
                                                ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                        <span className="font-medium text-xs sm:text-sm">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'overview' && (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Basic Information */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={doctor.name}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{doctor.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={doctor.email}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{doctor.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={doctor.phone}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{doctor.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.location || doctor.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{doctor.location}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                                        {isEditing ? (
                                            <select
                                                value={formData.consultationType || doctor.consultationType || 'online'}
                                                onChange={(e) => handleInputChange('consultationType', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            >
                                                <option value="online">Online</option>
                                                <option value="offline">Offline</option>
                                                <option value="busy">Busy</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${
                                                doctor.consultationType === 'online' ? 'bg-green-100 text-green-800' :
                                                doctor.consultationType === 'offline' ? 'bg-gray-100 text-gray-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {doctor.consultationType === 'online' && <CheckCircle className="w-4 h-4" />}
                                                {doctor.consultationType === 'offline' && <XCircle className="w-4 h-4" />}
                                                {doctor.consultationType === 'busy' && <AlertCircle className="w-4 h-4" />}
                                                {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                            </span>
                                        )}
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
                                {isEditing ? (
                                    <textarea
                                        value={doctor.bio}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                                )}
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500 transition-colors whitespace-nowrap">
                                    <Upload className="w-4 h-4 flex-shrink-0" />
                                    <span>Upload Document</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {doctor.documents.map((doc, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-5 h-5 text-red-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                                                <p className="text-xs sm:text-sm text-gray-500 truncate">{doc.type} • {doc.size} • Uploaded {doc.uploaded}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 flex-shrink-0">
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
                                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 flex-1">
                                            <div className="text-sm font-medium text-gray-900 capitalize whitespace-nowrap flex-shrink-0">
                                                {day}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {schedule.available ? (
                                                    <>
                                                        <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-900 whitespace-nowrap">
                                                            {schedule.start} - {schedule.end}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-500 whitespace-nowrap">Not Available</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <button className="text-pink-600 hover:text-pink-800 self-end sm:self-auto flex-shrink-0">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
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
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
