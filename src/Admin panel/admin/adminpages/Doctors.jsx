import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Award, X, Star, Calendar, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

const Doctors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);

    

    // Sample doctors data with new status system
    const [doctors, setDoctors] = useState(() => {
        // Load pending doctors, rejected doctors, and suspended doctors from localStorage and merge with sample data
        const pendingDoctors = JSON.parse(localStorage.getItem('pendingDoctors') || '[]');
        const rejectedDoctors = JSON.parse(localStorage.getItem('rejectedDoctors') || '[]');
        const suspendedDoctors = JSON.parse(localStorage.getItem('suspendedDoctors') || '[]');
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
            joinDate: '2023-01-15',
            consultationType: 'online'
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
            joinDate: '2023-03-20',
            consultationType: 'offline'
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
            joinDate: '2024-01-05',
            rejectedDate: '2024-01-10'
        },
        {
            id: 6,
            name: 'Dr. James Wilson',
            specialty: 'Cardiology',
            experience: '8 years',
            patients: 0,
            rating: 0,
            status: 'Rejected',
            avatar: 'JW',
            verificationStatus: 'Failed',
            documents: ['License'],
            joinDate: '2024-01-08',
            rejectedDate: '2024-01-10'
        },
        {
            id: 7,
            name: 'Dr. Maria Garcia',
            specialty: 'Oncology',
            experience: '15 years',
            patients: 0,
            rating: 0,
            status: 'Rejected',
            avatar: 'MG',
            verificationStatus: 'Failed',
            documents: ['License', 'Certification'],
            joinDate: '2024-01-05',
            rejectedDate: '2024-01-09'
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
        // Merge pending doctors, rejected doctors, and suspended doctors from localStorage
        ...pendingDoctors,
        ...rejectedDoctors,
        ...suspendedDoctors
    ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [activeTab, setActiveTab] = useState('approved'); // 'approved', 'rejected', or 'suspended'
    const [showEditFormInLayout, setShowEditFormInLayout] = useState(false);
    const [doctorToEdit, setDoctorToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editFormErrors, setEditFormErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
            const rejectedDoctors = JSON.parse(localStorage.getItem('rejectedDoctors') || '[]');
            const suspendedDoctors = JSON.parse(localStorage.getItem('suspendedDoctors') || '[]');
            setDoctors(prev => {
                // Remove old pending, rejected, and suspended doctors (those from localStorage) and add new ones
                const withoutPending = prev.filter(d => d.status !== 'Pending' || !d.createdAt);
                const withoutRejected = withoutPending.filter(d => {
                    // Keep only hardcoded rejected doctors or those not from localStorage
                    return d.status !== 'Rejected' || !rejectedDoctors.find(rd => rd.id === d.id);
                });
                const withoutSuspended = withoutRejected.filter(d => {
                    // Keep only hardcoded suspended doctors or those not from localStorage
                    return d.status !== 'Suspended' || !suspendedDoctors.find(sd => sd.id === d.id);
                });
                return [...withoutSuspended, ...pendingDoctors, ...rejectedDoctors, ...suspendedDoctors];
            });
        };

        // Listen for storage changes (works across tabs)
        window.addEventListener('storage', handleStorageChange);
        
        // Listen for custom event (works in same tab)
        window.addEventListener('doctorsUpdated', handleStorageChange);
        
        // Check localStorage on mount
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('doctorsUpdated', handleStorageChange);
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

    // Filter doctors by status
    const approvedDoctorsList = doctors.filter(doctor => doctor.status === 'Approved');
    const rejectedDoctorsList = doctors.filter(doctor => doctor.status === 'Rejected');
    const suspendedDoctorsList = doctors.filter(doctor => doctor.status === 'Suspended');
    
    const filterDoctors = (doctorsList) => {
        return doctorsList.filter(doctor => {
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
            
            return matchesSearch && matchesSpecialty;
        });
    };

    const filteredApprovedDoctors = filterDoctors(approvedDoctorsList);
    const filteredRejectedDoctors = filterDoctors(rejectedDoctorsList);
    const filteredSuspendedDoctors = filterDoctors(suspendedDoctorsList);

    // Calculate statistics
    const approvedCount = approvedDoctorsList.length;
    const rejectedCount = rejectedDoctorsList.length;
    const suspendedCount = suspendedDoctorsList.length;
    const totalDoctors = approvedCount;

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

    const handleSuspendDoctor = (doctor) => {
        setDoctors(prev => prev.map(d => 
            d.id === doctor.id 
                ? { ...d, status: 'Suspended', verificationStatus: 'Suspended', suspendedDate: new Date().toISOString().split('T')[0] }
                : d
        ));
        
        // Update localStorage - store suspended doctors
        const suspendedDoctors = JSON.parse(localStorage.getItem('suspendedDoctors') || '[]');
        const suspendedDoctor = {
            ...doctor,
            status: 'Suspended',
            verificationStatus: 'Suspended',
            suspendedDate: new Date().toISOString().split('T')[0]
        };
        // Check if already exists, if not add it
        if (!suspendedDoctors.find(d => d.id === doctor.id)) {
            suspendedDoctors.push(suspendedDoctor);
            localStorage.setItem('suspendedDoctors', JSON.stringify(suspendedDoctors));
        }
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleViewDoctorProfile = (doctor) => {
        navigate(`/admin/doctors/${doctor.id}`);
    };

    const handleEditDoctor = (doctor) => {
        navigate(`/admin/doctors/edit/${doctor.id}`);
    };

    const handleCloseEditModal = () => {
        navigate('/admin/doctors');
        setShowEditFormInLayout(false);
        setDoctorToEdit(null);
        setEditFormData({});
        setEditFormErrors({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (editFormErrors[name]) {
            setEditFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEditForm = () => {
        const errors = {};
        if (!editFormData.name?.trim()) {
            errors.name = 'Name is required';
        }
        if (!editFormData.specialty?.trim()) {
            errors.specialty = 'Specialty is required';
        }
        if (!editFormData.experience?.trim()) {
            errors.experience = 'Experience is required';
        }
        return errors;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const errors = validateEditForm();
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }
        
        try {
            const updatedDoctors = doctors.map(d => 
                d.id === doctorToEdit.id ? {
                    ...d,
                    name: editFormData.name,
                    specialty: editFormData.specialty,
                    experience: editFormData.experience,
                    patients: parseInt(editFormData.patients),
                    rating: parseFloat(editFormData.rating),
                    consultationType: editFormData.consultationType || 'online',
                    status: editFormData.status,
                    joinDate: editFormData.joinDate
                } : d
            );
            setDoctors(updatedDoctors);
            navigate('/admin/doctors');
            setToast({ show: true, message: `${editFormData.name} has been updated successfully!`, type: 'success' });
            setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
        } catch (error) {
            console.error('Error updating doctor:', error);
            setToast({ show: true, message: 'Error updating doctor. Please try again.', type: 'error' });
            setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
        }
    };

    // Check if we're on the edit route
    useEffect(() => {
        const pathMatch = location.pathname.match(/^\/admin\/doctors\/edit\/(\d+)$/);
        if (pathMatch) {
            const doctorId = parseInt(pathMatch[1]);
            const doctor = doctors.find(d => d.id === doctorId);
            if (doctor) {
                setDoctorToEdit(doctor);
                setEditFormData({
                    name: doctor.name,
                    specialty: doctor.specialty,
                    experience: doctor.experience,
                    patients: doctor.patients,
                    consultationType: doctor.consultationType || 'online',
                    rating: doctor.rating,
                    status: doctor.status,
                    joinDate: doctor.joinDate
                });
                setEditFormErrors({});
                setShowEditFormInLayout(true);
            } else {
                navigate('/admin/doctors');
            }
        } else {
            setShowEditFormInLayout(false);
        }
    }, [location.pathname, doctors]);

    // Get unique specialties for filter dropdown - from all doctors
    const allDoctorsForSpecialties = [...approvedDoctorsList, ...rejectedDoctorsList, ...suspendedDoctorsList];
    const specialties = [...new Set(allDoctorsForSpecialties.map(doctor => doctor.specialty))];

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

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
                        toast.type === 'success' 
                            ? 'bg-pink-50 border-pink-500 text-pink-800' 
                            : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: 'success' })}
                            className="ml-2 text-pink-600 hover:text-pink-800"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Doctor Form - Separate Page */}
            {showEditFormInLayout && doctorToEdit ? (
                <Card className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Doctor</h2>
                        <button
                            onClick={handleCloseEditModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Doctor Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name || ''}
                                    onChange={handleEditInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        editFormErrors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter doctor name"
                                />
                                {editFormErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.name}</p>
                                )}
                            </div>

                            {/* Specialty Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialty *
                                </label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={editFormData.specialty || ''}
                                    onChange={handleEditInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        editFormErrors.specialty ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter specialty"
                                />
                                {editFormErrors.specialty && (
                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.specialty}</p>
                                )}
                            </div>

                            {/* Experience Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience *
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={editFormData.experience || ''}
                                    onChange={handleEditInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        editFormErrors.experience ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter experience (e.g., 8 years)"
                                />
                                {editFormErrors.experience && (
                                    <p className="text-red-500 text-sm mt-1">{editFormErrors.experience}</p>
                                )}
                            </div>

                            {/* Patients Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Patients
                                </label>
                                <input
                                    type="number"
                                    name="patients"
                                    value={editFormData.patients || ''}
                                    onChange={handleEditInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter total patients"
                                />
                            </div>

                            {/* Rating Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={editFormData.rating || ''}
                                    onChange={handleEditInputChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter rating (0-5)"
                                />
                            </div>

                            {/* Status Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={editFormData.status || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="Approved">Approved</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Consultation Type Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Type
                                </label>
                                <select
                                    name="consultationType"
                                    value={editFormData.consultationType || 'online'}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="busy">Busy</option>
                                </select>
                            </div>

                            {/* Join Date Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Join Date
                                </label>
                                <input
                                    type="date"
                                    name="joinDate"
                                    value={editFormData.joinDate || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Update Doctor</span>
                            </button>
                        </div>
                    </form>
                </Card>
            ) : (
                <>
            {/* Breadcrumbs */}
            <Breadcrumbs />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Doctors</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage doctor verification and platform access</p>
                    <MetaChips 
                        status={`${approvedCount} Active`}
                        id={`Total: ${totalDoctors}`}
                        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        owner="Admin"
                    />
                </div>
            </div>

            {/* Main Content Area with Loader */}
            <div className="relative min-h-[600px]">
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Approved Doctors</p>
                            <p className="text-xl font-bold text-gray-900">{totalDoctors}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
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
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterSpecialty) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterSpecialty('');
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

            {/* Tab Switcher */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'approved'
                            ? 'text-pink-600 border-b-2 border-pink-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Approved Doctors ({approvedCount})
                </button>
                <button
                    onClick={() => setActiveTab('rejected')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'rejected'
                            ? 'text-pink-600 border-b-2 border-pink-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Rejected Doctors ({rejectedCount})
                </button>
                <button
                    onClick={() => setActiveTab('suspended')}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'suspended'
                            ? 'text-pink-600 border-b-2 border-pink-600'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Suspended Doctors ({suspendedCount})
                </button>
            </div>

            {/* Approved Doctors */}
            {activeTab === 'approved' && (
            <div className="space-y-8">
                {filteredApprovedDoctors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved doctors found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterSpecialty 
                                        ? 'No approved doctors match your current filters.'
                                        : 'No approved doctors available.'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Award className="w-5 h-5 text-green-600 mr-2" />
                                    Approved Doctors ({filteredApprovedDoctors.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredApprovedDoctors.map((doctor) => (
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
                                                <button
                                                    onClick={() => handleEditDoctor(doctor)}
                                                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                                                    title="Edit Doctor"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
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
                                            
                                            {/* Consultation Type */}
                                            <div className="mb-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getConsultationTypeColor(doctor.consultationType || 'online')}`}>
                                                    {getConsultationTypeIcon(doctor.consultationType || 'online')}
                                                    {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                                                    {doctor.status}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSuspendDoctor(doctor)}
                                                        className="px-2 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
                                                        title="Suspend Doctor"
                                                    >
                                                        Suspend
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDoctorProfile(doctor)}
                                                        className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                )}
            </div>
            )}

            {/* Rejected Doctors */}
            {activeTab === 'rejected' && (
            <div className="space-y-8">
                {filteredRejectedDoctors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No rejected doctors found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterSpecialty 
                                        ? 'No rejected doctors match your current filters.'
                                        : 'No rejected doctors available.'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <X className="w-5 h-5 text-red-600 mr-2" />
                            Rejected Doctors ({filteredRejectedDoctors.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRejectedDoctors.map((doctor) => (
                                <Card key={doctor.id} className="p-6 border-l-4 border-l-red-500">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {doctor.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditDoctor(doctor)}
                                            className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                                            title="Edit Doctor"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {doctor.rating > 0 && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>{doctor.rating}</span>
                                            </div>
                                        )}
                                        {doctor.patients > 0 && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-blue-500" />
                                                <span>{doctor.patients}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Award className="w-4 h-4 text-purple-500" />
                                            <span>{doctor.experience}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-red-500" />
                                            <span>{doctor.rejectedDate || doctor.joinDate}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Consultation Type */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getConsultationTypeColor(doctor.consultationType || 'online')}`}>
                                            {getConsultationTypeIcon(doctor.consultationType || 'online')}
                                            {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                        </span>
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
            </div>
            )}

            {/* Suspended Doctors */}
            {activeTab === 'suspended' && (
            <div className="space-y-8">
                {filteredSuspendedDoctors.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No suspended doctors found</h3>
                                <p className="text-gray-600">
                                    {searchTerm || filterSpecialty 
                                        ? 'No suspended doctors match your current filters.'
                                        : 'No suspended doctors available.'
                                    }
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <X className="w-5 h-5 text-orange-600 mr-2" />
                            Suspended Doctors ({filteredSuspendedDoctors.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSuspendedDoctors.map((doctor) => (
                                <Card key={doctor.id} className="p-6 border-l-4 border-l-orange-500">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {doctor.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditDoctor(doctor)}
                                            className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                                            title="Edit Doctor"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {doctor.rating > 0 && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>{doctor.rating}</span>
                                            </div>
                                        )}
                                        {doctor.patients > 0 && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-blue-500" />
                                                <span>{doctor.patients}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Award className="w-4 h-4 text-purple-500" />
                                            <span>{doctor.experience}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span>{doctor.suspendedDate || doctor.joinDate}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Consultation Type */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getConsultationTypeColor(doctor.consultationType || 'online')}`}>
                                            {getConsultationTypeIcon(doctor.consultationType || 'online')}
                                            {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                        </span>
                                    </div>
                                    
                                    {/* Consultation Type */}
                                    <div className="mb-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getConsultationTypeColor(doctor.consultationType || 'online')}`}>
                                            {getConsultationTypeIcon(doctor.consultationType || 'online')}
                                            {doctor.consultationType ? doctor.consultationType.charAt(0).toUpperCase() + doctor.consultationType.slice(1) : 'Online'}
                                        </span>
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
            </div>
            )}
        </div>
    </div>
    </>
            )}
        </div>
    );
};

export default Doctors;
