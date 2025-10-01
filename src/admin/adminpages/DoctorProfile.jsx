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
    AlertCircle
} from 'lucide-react';
import Card from '../admincomponents/Card';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

    // Sample doctor data - in real app, this would be fetched from API
    const doctorsData = [
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
                {
                    id: 1,
                    name: 'Medical License',
                    type: 'License',
                    uploadDate: '2023-01-15',
                    status: 'Verified',
                    fileUrl: '#'
                },
                {
                    id: 2,
                    name: 'Board Certification',
                    type: 'Certification',
                    uploadDate: '2023-01-15',
                    status: 'Verified',
                    fileUrl: '#'
                },
                {
                    id: 3,
                    name: 'Insurance Certificate',
                    type: 'Insurance',
                    uploadDate: '2023-01-20',
                    status: 'Verified',
                    fileUrl: '#'
                },
                {
                    id: 4,
                    name: 'DEA Registration',
                    type: 'Registration',
                    uploadDate: '2023-02-01',
                    status: 'Pending',
                    fileUrl: '#'
                }
            ],
            recentAppointments: [
                {
                    id: 1,
                    patient: 'John Doe',
                    date: '2024-01-15',
                    time: '10:00 AM',
                    type: 'Consultation',
                    status: 'Completed'
                },
                {
                    id: 2,
                    patient: 'Jane Smith',
                    date: '2024-01-15',
                    time: '11:30 AM',
                    type: 'Follow-up',
                    status: 'Completed'
                },
                {
                    id: 3,
                    patient: 'Mike Johnson',
                    date: '2024-01-16',
                    time: '09:00 AM',
                    type: 'Consultation',
                    status: 'Scheduled'
                }
            ]
        }
    ];

    useEffect(() => {
        // In real app, fetch doctor data by ID
        const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
        setDoctor(foundDoctor);
    }, [id]);

    if (!doctor) {
        return (
            <div className="p-6">
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">Doctor not found</h3>
                        <p className="text-gray-600">The requested doctor profile could not be found.</p>
                        <button
                            onClick={() => navigate('/admin/doctors')}
                            className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                        >
                            Back to Doctors
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDocumentStatusIcon = (status) => {
        switch (status) {
            case 'Verified':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'Rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const handleApproveDoctor = () => {
        console.log('Approve doctor:', doctor.id);
        // Implement approval logic
    };

    const handleRejectDoctor = () => {
        console.log('Reject doctor:', doctor.id);
        // Implement rejection logic
    };

    const handleDownloadDocument = (document) => {
        console.log('Download document:', document);
        // Implement download logic
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/doctors')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                        <p className="text-gray-600">{doctor.specialty} • {doctor.experience} experience</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                        {doctor.status}
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
                            <Clock className="w-5 h-5 text-purple-600" />
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

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Doctor Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{doctor.email}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{doctor.phone}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{doctor.location}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Languages</label>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{doctor.languages.join(', ')}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Education</label>
                                <div className="flex items-center space-x-2">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{doctor.education}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Bio</label>
                                <p className="text-gray-900">{doctor.bio}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Documents */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Verification</h3>
                        <div className="space-y-4">
                            {doctor.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {doc.type} • Uploaded {doc.uploadDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            {getDocumentStatusIcon(doc.status)}
                                            <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadDocument(doc)}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                            title="Download Document"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Appointments */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
                        <div className="space-y-3">
                            {doctor.recentAppointments.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                                        <p className="text-sm text-gray-600">
                                            {appointment.date} at {appointment.time} • {appointment.type}
                                        </p>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Fees & Availability */}
                <div className="space-y-6">
                    {/* Fee Structure */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Consultation</span>
                                <span className="font-semibold text-gray-900">${doctor.consultationFee}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Follow-up</span>
                                <span className="font-semibold text-gray-900">${doctor.followUpFee}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Emergency</span>
                                <span className="font-semibold text-gray-900">${doctor.emergencyFee}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Availability */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                        <div className="space-y-3">
                            {Object.entries(doctor.availability).map(([day, schedule]) => (
                                <div key={day} className="flex items-center justify-between">
                                    <span className="capitalize text-gray-600">{day}</span>
                                    <div className="flex items-center space-x-2">
                                        {schedule.available ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm text-gray-900">
                                                    {schedule.start} - {schedule.end}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-gray-500">Not available</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* License Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">License Number</label>
                                <p className="text-gray-900 font-mono">{doctor.licenseNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Expiry Date</label>
                                <p className="text-gray-900">{doctor.licenseExpiry}</p>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor('Verified')}`}>
                                    License Verified
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
