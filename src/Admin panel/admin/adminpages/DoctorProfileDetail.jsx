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
    Activity,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Target,
    Zap,
    Users,
    MessageSquare,
    Video,
    Heart,
    Brain,
    Eye,
    Bone,
    Baby,
    Bell,
    Settings,
    RefreshCw,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Award as AwardIcon,
    Trophy,
    BookOpen,
    GraduationCap as GraduationCapIcon,
    Briefcase as BriefcaseIcon,
    MapPin as LocationIcon,
    Phone as PhoneIcon,
    Mail as MailIcon,
    Globe as GlobeIcon
} from 'lucide-react';
import Card from '../admincomponents/Card';

const DoctorProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);

    

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
            ],
            // Enhanced analytics data
            analytics: {
                monthlyRevenue: [
                    { month: 'Jan', revenue: 12500, appointments: 85 },
                    { month: 'Feb', revenue: 13800, appointments: 92 },
                    { month: 'Mar', revenue: 15200, appointments: 101 },
                    { month: 'Apr', revenue: 16800, appointments: 112 },
                    { month: 'May', revenue: 17500, appointments: 117 },
                    { month: 'Jun', revenue: 18900, appointments: 126 }
                ],
                patientDemographics: {
                    ageGroups: [
                        { age: '18-25', count: 45, percentage: 18 },
                        { age: '26-35', count: 78, percentage: 32 },
                        { age: '36-45', count: 67, percentage: 27 },
                        { age: '46-55', count: 35, percentage: 14 },
                        { age: '55+', count: 20, percentage: 9 }
                    ],
                    genderDistribution: [
                        { gender: 'Male', count: 120, percentage: 49 },
                        { gender: 'Female', count: 125, percentage: 51 }
                    ]
                },
                performanceMetrics: {
                    averageConsultationTime: 35,
                    patientSatisfactionScore: 4.8,
                    noShowRate: 8.5,
                    repeatPatientRate: 72,
                    responseTime: 15,
                    completionRate: 96
                },
                weeklyStats: {
                    thisWeek: { appointments: 28, revenue: 4200, patients: 25 },
                    lastWeek: { appointments: 32, revenue: 4800, patients: 28 },
                    growth: { appointments: -12.5, revenue: -12.5, patients: -10.7 }
                }
            },
            // Patient reviews and feedback
            reviews: [
                {
                    id: 1,
                    patient: 'John Doe',
                    rating: 5,
                    comment: 'Dr. Johnson is an excellent cardiologist. She took the time to explain everything clearly and made me feel comfortable throughout the consultation.',
                    date: '2024-01-10',
                    verified: true
                },
                {
                    id: 2,
                    patient: 'Jane Smith',
                    rating: 5,
                    comment: 'Very professional and knowledgeable. The follow-up care was exceptional. Highly recommend!',
                    date: '2024-01-08',
                    verified: true
                },
                {
                    id: 3,
                    patient: 'Mike Johnson',
                    rating: 4,
                    comment: 'Good doctor, but the wait time was a bit long. The consultation itself was thorough and helpful.',
                    date: '2024-01-05',
                    verified: true
                },
                {
                    id: 4,
                    patient: 'Sarah Wilson',
                    rating: 5,
                    comment: 'Dr. Johnson saved my life. Her quick diagnosis and treatment were outstanding. Forever grateful!',
                    date: '2024-01-03',
                    verified: true
                }
            ],
            // Detailed schedule with time slots
            detailedSchedule: {
                monday: [
                    { time: '09:00', patient: 'John Doe', type: 'Consultation', status: 'Confirmed' },
                    { time: '10:30', patient: 'Jane Smith', type: 'Follow-up', status: 'Confirmed' },
                    { time: '14:00', patient: 'Mike Johnson', type: 'Check-up', status: 'Pending' },
                    { time: '15:30', patient: 'Sarah Wilson', type: 'Consultation', status: 'Confirmed' }
                ],
                tuesday: [
                    { time: '09:00', patient: 'Alice Brown', type: 'Follow-up', status: 'Confirmed' },
                    { time: '11:00', patient: 'Bob Davis', type: 'Consultation', status: 'Confirmed' },
                    { time: '14:30', patient: 'Carol Green', type: 'Check-up', status: 'Pending' }
                ],
                wednesday: [
                    { time: '09:30', patient: 'David Lee', type: 'Consultation', status: 'Confirmed' },
                    { time: '11:30', patient: 'Emma White', type: 'Follow-up', status: 'Confirmed' },
                    { time: '15:00', patient: 'Frank Black', type: 'Check-up', status: 'Confirmed' }
                ],
                thursday: [
                    { time: '10:00', patient: 'Grace Taylor', type: 'Consultation', status: 'Confirmed' },
                    { time: '13:00', patient: 'Henry Clark', type: 'Follow-up', status: 'Confirmed' },
                    { time: '16:00', patient: 'Ivy Miller', type: 'Check-up', status: 'Pending' }
                ],
                friday: [
                    { time: '09:00', patient: 'Jack Wilson', type: 'Consultation', status: 'Confirmed' },
                    { time: '11:00', patient: 'Kate Moore', type: 'Follow-up', status: 'Confirmed' }
                ]
            },
            // Professional achievements and certifications
            certifications: [
                {
                    name: 'Board Certified Cardiologist',
                    issuer: 'American Board of Internal Medicine',
                    date: '2018-03-15',
                    expiry: '2028-03-15',
                    status: 'Active'
                },
                {
                    name: 'Fellow of American College of Cardiology',
                    issuer: 'American College of Cardiology',
                    date: '2019-06-20',
                    expiry: null,
                    status: 'Active'
                },
                {
                    name: 'Advanced Cardiac Life Support',
                    issuer: 'American Heart Association',
                    date: '2023-01-10',
                    expiry: '2025-01-10',
                    status: 'Active'
                }
            ],
            // Research and publications
            publications: [
                {
                    title: 'Advances in Interventional Cardiology: A Comprehensive Review',
                    journal: 'Journal of Cardiovascular Medicine',
                    date: '2023-08-15',
                    authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
                    impact: 'High'
                },
                {
                    title: 'Preventive Cardiology Strategies in High-Risk Patients',
                    journal: 'American Journal of Cardiology',
                    date: '2023-05-20',
                    authors: ['Dr. Sarah Johnson'],
                    impact: 'Medium'
                }
            ]
        }
    ], []);

    useEffect(() => {
        // In real app, fetch doctor data by ID
        const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
        if (foundDoctor) {
            setDoctor(foundDoctor);
        } else {
            // If no doctor found by ID, use the first doctor as default
            setDoctor(doctorsData[0]);
        }
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
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'fees', label: 'Fees & Services', icon: DollarSign },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'publications', label: 'Publications', icon: BookOpen },
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
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Doctors</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                    </div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                        <p className="text-sm sm:text-base text-gray-600">{doctor.specialty} • {doctor.experience} experience</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                        {getStatusIcon(doctor.status)}
                        <span>{doctor.status}</span>
                    </span>
                    {doctor.status === 'Pending' && (
                        <>
                            <button
                                onClick={handleApproveDoctor}
                                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleRejectDoctor}
                                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Rating</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{doctor.rating}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Total Patients</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{doctor.totalPatients}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Appointments</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{doctor.totalAppointments}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Consultation Fee</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">${doctor.consultationFee}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Profile Sidebar */}
                    <Card className="p-0 lg:col-span-1">
                    <div className="p-4 sm:p-6 text-center border-b border-gray-200">
                        <div className="relative inline-block">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-pink-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl font-bold mx-auto mb-3 sm:mb-4">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{doctor.name}</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-2 truncate">{doctor.specialty}</p>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900">{doctor.rating}</span>
                        </div>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                            {getStatusIcon(doctor.status)}
                            <span className="truncate">{doctor.status}</span>
                        </span>
                    </div>
                    
                    <nav className="p-2">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-xl transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                        <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                                        <span className="font-medium text-xs lg:text-sm truncate">{tab.label}</span>
                                </button>
                            );
                        })}
                        </div>
                    </nav>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Full Name</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{doctor.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{doctor.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone</label>
                                        <p className="text-sm sm:text-base text-gray-900">{doctor.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Location</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{doctor.location}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Professional Information */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Specialty</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{doctor.specialty}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Experience</label>
                                        <p className="text-sm sm:text-base text-gray-900">{doctor.experience}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Education</label>
                                        <p className="text-sm sm:text-base text-gray-900 truncate">{doctor.education}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">License Number</label>
                                        <p className="text-sm sm:text-base text-gray-900 font-mono">{doctor.licenseNumber}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Bio */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Biography</h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{doctor.bio}</p>
                            </Card>

                            {/* Specialties */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-pink-100 text-pink-800 rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Languages */}
                            <Card className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.languages.map((language, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            {/* Performance Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Patient Satisfaction</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.patientSatisfactionScore}</p>
                                            <div className="flex items-center mt-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                <span className="text-xs text-gray-600 ml-1">out of 5.0</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Star className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Avg Consultation Time</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.averageConsultationTime}</p>
                                            <p className="text-xs text-gray-600">minutes</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">No-Show Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.noShowRate}%</p>
                                            <p className="text-xs text-gray-600">this month</p>
                                        </div>
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                            <AlertCircle className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Repeat Patient Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.repeatPatientRate}%</p>
                                            <p className="text-xs text-gray-600">loyalty rate</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Response Time</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.responseTime}</p>
                                            <p className="text-xs text-gray-600">minutes</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Completion Rate</p>
                                            <p className="text-2xl font-bold text-gray-900">{doctor.analytics.performanceMetrics.completionRate}%</p>
                                            <p className="text-xs text-gray-600">appointments</p>
                                        </div>
                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Target className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Revenue Trends */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                                        <p className="text-sm text-gray-600">Monthly revenue and appointment trends</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">+15.2%</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {doctor.analytics.monthlyRevenue.map((month, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                                <span className="font-medium text-gray-900">{month.month}</span>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">${month.revenue.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-600">Revenue</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">{month.appointments}</p>
                                                    <p className="text-xs text-gray-600">Appointments</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Patient Demographics */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                                    <div className="space-y-3">
                                        {doctor.analytics.patientDemographics.ageGroups.map((ageGroup, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                                    <span className="text-sm font-medium text-gray-900">{ageGroup.age}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-pink-500 h-2 rounded-full" 
                                                            style={{ width: `${ageGroup.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{ageGroup.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                                    <div className="space-y-3">
                                        {doctor.analytics.patientDemographics.genderDistribution.map((gender, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    <span className="text-sm font-medium text-gray-900">{gender.gender}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-blue-500 h-2 rounded-full" 
                                                            style={{ width: `${gender.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{gender.count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Weekly Comparison */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">This Week</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-2xl font-bold text-pink-600">{doctor.analytics.weeklyStats.thisWeek.appointments}</p>
                                                <p className="text-sm text-gray-600">Appointments</p>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-green-600">${doctor.analytics.weeklyStats.thisWeek.revenue}</p>
                                                <p className="text-sm text-gray-600">Revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Last Week</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-2xl font-bold text-pink-600">{doctor.analytics.weeklyStats.lastWeek.appointments}</p>
                                                <p className="text-sm text-gray-600">Appointments</p>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-green-600">${doctor.analytics.weeklyStats.lastWeek.revenue}</p>
                                                <p className="text-sm text-gray-600">Revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Growth</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center space-x-1">
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                                <p className="text-lg font-bold text-red-600">{doctor.analytics.weeklyStats.growth.appointments}%</p>
                                            </div>
                                            <div className="flex items-center justify-center space-x-1">
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                                <p className="text-lg font-bold text-red-600">{doctor.analytics.weeklyStats.growth.revenue}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Patient Reviews</h3>
                                    <p className="text-sm text-gray-600">Feedback from patients</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                    <span className="text-lg font-bold text-gray-900">{doctor.rating}</span>
                                    <span className="text-sm text-gray-600">({doctor.reviews.length} reviews)</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {doctor.reviews.map((review) => (
                                    <div key={review.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{review.patient}</h4>
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">{review.date}</p>
                                                {review.verified && (
                                                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span>Verified</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'documents' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-pink-400 text-white rounded-xl hover:bg-pink-500 transition-colors">
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
                        <div className="space-y-6">
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

                            {/* Detailed Schedule */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Schedule</h3>
                                <div className="space-y-6">
                                    {Object.entries(doctor.detailedSchedule).map(([day, appointments]) => (
                                        <div key={day} className="border border-gray-200 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-900 mb-3 capitalize">{day}</h4>
                                            <div className="space-y-2">
                                                {appointments.map((appointment, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                                            <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                                                            <span className="text-sm text-gray-600">{appointment.patient}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {appointment.type}
                                                            </span>
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                                appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {appointment.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
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

                    {activeTab === 'certifications' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Professional Certifications</h3>
                                    <p className="text-sm text-gray-600">Medical licenses and certifications</p>
                                </div>
                                <Award className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="space-y-4">
                                {doctor.certifications.map((cert, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <Award className="w-6 h-6 text-pink-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                                                <p className="text-sm text-gray-600">{cert.issuer}</p>
                                                <p className="text-xs text-gray-500">
                                                    Issued: {cert.date} {cert.expiry && `• Expires: ${cert.expiry}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cert.status)}`}>
                                                {getStatusIcon(cert.status)}
                                                <span>{cert.status}</span>
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

                    {activeTab === 'publications' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Research Publications</h3>
                                    <p className="text-sm text-gray-600">Published research papers and articles</p>
                                </div>
                                <BookOpen className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="space-y-4">
                                {doctor.publications.map((pub, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-2">{pub.title}</h4>
                                                <p className="text-sm text-gray-600 mb-1">{pub.journal}</p>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Published: {pub.date} • Authors: {pub.authors.join(', ')}
                                                </p>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                pub.impact === 'High' ? 'bg-green-100 text-green-800' :
                                                pub.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {pub.impact} Impact
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                                                <Download className="w-4 h-4" />
                                                <span className="text-sm">Download</span>
                                            </button>
                                            <button className="flex items-center space-x-1 text-green-600 hover:text-green-800">
                                                <Globe className="w-4 h-4" />
                                                <span className="text-sm">View Online</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
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
        </div>
    );
};

export default DoctorProfileDetail;
