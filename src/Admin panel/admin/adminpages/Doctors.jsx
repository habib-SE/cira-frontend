import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Clock, Award, X, Star, Calendar } from 'lucide-react';
import Card from '../admincomponents/Card';

const Doctors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    
    const [isContentLoading, setIsContentLoading] = useState(false);
    
    const handleRefreshContent = () => {
        setIsRefreshing(true);
        setIsContentLoading(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setIsContentLoading(false);
        }, 1500);
    };

    

    // Sample doctors data with new status system
    const [doctors, setDoctors] = useState(() => {
        // Load pending doctors from localStorage and merge with sample data
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        return [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            experience: '8 years',
            patients: 245,
            rating: 4.9,
            status: 'Approved',
            avatar: 'SJ',
            verificationStatus: 'Verified',
            documents: ['License', 'Certification'],
            joinDate: '2023-01-15'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            experience: '12 years',
            patients: 189,
            rating: 4.8,
            status: 'Pending',
            avatar: 'MC',
            verificationStatus: 'Under Review',
            documents: ['License'],
            joinDate: '2024-01-10'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Dermatology',
            experience: '6 years',
            patients: 312,
            rating: 4.9,
            status: 'Approved',
            avatar: 'ER',
            verificationStatus: 'Verified',
            documents: ['License', 'Certification', 'Insurance'],
            joinDate: '2023-03-20'
        },
        {
            id: 4,
            name: 'Dr. David Kim',
            specialty: 'Orthopedics',
            experience: '15 years',
            patients: 198,
            rating: 4.7,
            status: 'Rejected',
            avatar: 'DK',
            verificationStatus: 'Failed',
            documents: ['License'],
            joinDate: '2024-01-05'
        },
        {
            id: 5,
            name: 'Dr. Lisa Wang',
            specialty: 'Pediatrics',
            experience: '5 years',
            patients: 156,
            rating: 4.8,
            status: 'Pending',
            avatar: 'LW',
            verificationStatus: 'Under Review',
            documents: ['License', 'Certification'],
            joinDate: '2024-01-12'
        },
        // Merge pending doctors from localStorage
        ...pendingDoctors
    ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Read search term from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    // Refresh doctors list when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
            setDoctors(prev => {
                // Remove old pending doctors and add new ones
                const withoutPending = prev.filter(d => d.status !== 'Pending' || !d.createdAt);
                return [...withoutPending, ...pendingDoctors];
            });
        };

        // Listen for storage changes
        window.addEventListener('storage', handleStorageChange);
        
        // Also check localStorage on mount
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Helper functions for status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationStatusColor = (status) => {
        switch (status) {
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

    // Filter doctors
    const filteredDoctors = doctors.filter(doctor => {
        const searchLower = searchTerm.toLowerCase();
        const doctorNameLower = doctor.name.toLowerCase();
        const specialtyLower = doctor.specialty.toLowerCase();
        
        // Normal search match
        let matchesSearch = searchTerm === '' || 
            doctorNameLower.includes(searchLower) ||
            specialtyLower.includes(searchLower);
        
        // Handle "Michael" vs "Micheal" typo variation
        if (!matchesSearch && searchLower.includes('micheal')) {
            matchesSearch = doctorNameLower.includes('michael');
        }
        if (!matchesSearch && searchLower.includes('michael')) {
            matchesSearch = doctorNameLower.includes('micheal');
        }
        
        const matchesSpecialty = filterSpecialty === '' || doctor.specialty === filterSpecialty;
        const matchesStatus = filterStatus === '' || doctor.status === filterStatus;
        
        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    // Group doctors by status
    const pendingDoctors = filteredDoctors.filter(d => d.status === 'Pending');
    const approvedDoctors = filteredDoctors.filter(d => d.status === 'Approved');
    const rejectedDoctors = filteredDoctors.filter(d => d.status === 'Rejected');

    // Calculate statistics
    const totalDoctors = doctors.length;
    const pendingCount = doctors.filter(d => d.status === 'Pending').length;
    const approvedCount = doctors.filter(d => d.status === 'Approved').length;
    const rejectedCount = doctors.filter(d => d.status === 'Rejected').length;

    const handleApproveDoctor = (doctor) => {
        setDoctors(prev => prev.map(d => 
            d.id === doctor.id 
                ? { ...d, status: 'Approved', verificationStatus: 'Verified' }
                : d
        ));
        
        // Update localStorage - remove from pending doctors
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        const updatedPendingDoctors = pendingDoctors.filter(d => d.id !== doctor.id);
        localStorage.setItem('pendingDoctors', JSON.stringify(updatedPendingDoctors));
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleRejectDoctor = (doctor) => {
        setDoctors(prev => prev.map(d => 
            d.id === doctor.id 
                ? { ...d, status: 'Rejected', verificationStatus: 'Failed' }
                : d
        ));
        
        // Update localStorage - remove from pending doctors
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        const updatedPendingDoctors = pendingDoctors.filter(d => d.id !== doctor.id);
        localStorage.setItem('pendingDoctors', JSON.stringify(updatedPendingDoctors));
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleViewDoctorProfile = (doctor) => {
        navigate(`/admin/doctors/${doctor.id}`);
    };

    // Get unique specialties for filter dropdown
    const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-2 right-2 sm:top-4 sm:right-4 bg-green-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 text-xs sm:text-sm">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="hidden sm:inline">Doctor status updated successfully!</span>
                    <span className="sm:hidden">Updated!</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Doctors</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage doctor verification and platform access</p>
                </div>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                {/* Content Loader */}
                {isRefreshing && (
                    <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
                            <p className="text-gray-600 font-medium">Loading content...</p>
                        </div>
                    </div>
                )}
                
                <div className={`space-y-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Doctors</p>
                            <p className="text-xl font-bold text-gray-900">{totalDoctors}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-xl font-bold text-gray-900">{approvedCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <X className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-xl font-bold text-gray-900">{rejectedCount}</p>
                        </div>
                    </div>
                </Card>
                    </div>

                    {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filterSpecialty}
                            onChange={(e) => setFilterSpecialty(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterSpecialty || filterStatus) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterSpecialty('');
                                    setFilterStatus('');
                                }}
                                className="px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Doctors by Status */}
            <div className="space-y-8">
                {filteredDoctors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterSpecialty || filterStatus 
                                        ? 'No doctors match your current filters.'
                                        : 'No doctors have been registered yet.'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Pending Doctors */}
                        {pendingDoctors.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                                    Pending Verification ({pendingDoctors.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingDoctors.map((doctor) => (
                                        <Card key={doctor.id} className="p-6 border-l-4 border-l-yellow-500">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {doctor.avatar}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Experience:</span>
                                                    <span className="font-medium">{doctor.experience}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Documents:</span>
                                                    <span className="font-medium">{doctor.documents.length}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Joined:</span>
                                                    <span className="font-medium">{doctor.joinDate}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleViewDoctorProfile(doctor)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Review
                                                </button>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleApproveDoctor(doctor)}
                                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectDoctor(doctor)}
                                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Approved Doctors */}
                        {approvedDoctors.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Award className="w-5 h-5 text-green-600 mr-2" />
                                    Approved Doctors ({approvedDoctors.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {approvedDoctors.map((doctor) => (
                                        <Card key={doctor.id} className="p-6 border-l-4 border-l-green-500">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {doctor.avatar}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span>{doctor.rating}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4 text-blue-500" />
                                                    <span>{doctor.patients}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Award className="w-4 h-4 text-purple-500" />
                                                    <span>{doctor.experience}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-green-500" />
                                                    <span>{doctor.joinDate}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                                                    {doctor.status}
                                                </span>
                                                <button
                                                    onClick={() => handleViewDoctorProfile(doctor)}
                                                    className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rejected Doctors */}
                        {rejectedDoctors.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <X className="w-5 h-5 text-red-600 mr-2" />
                                    Rejected Doctors ({rejectedDoctors.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {rejectedDoctors.map((doctor) => (
                                        <Card key={doctor.id} className="p-6 border-l-4 border-l-red-500">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {doctor.avatar}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Experience:</span>
                                                    <span className="font-medium">{doctor.experience}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Documents:</span>
                                                    <span className="font-medium">{doctor.documents.length}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Applied:</span>
                                                    <span className="font-medium">{doctor.joinDate}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                                                    {doctor.status}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDoctorProfile(doctor)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveDoctor(doctor)}
                                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    </div>
    </div>
    );
};

export default Doctors;
