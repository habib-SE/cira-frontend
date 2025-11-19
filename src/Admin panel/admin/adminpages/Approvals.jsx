import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, AlertCircle, User, Edit } from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

// Default dummy pending doctors data
const defaultPendingDoctors = [
            {
                id: 1,
                name: 'Dr. Michael Chen',
                specialty: 'Neurology',
                experience: '12 years',
                email: 'michael.chen@email.com',
                phone: '+1 (555) 123-4567',
                status: 'Pending',
                avatar: 'MC',
                documents: ['License', 'Certification'],
                submittedDate: '2024-01-10',
                verificationStatus: 'Under Review'
            },
            {
                id: 2,
                name: 'Dr. Lisa Wang',
                specialty: 'Pediatrics',
                experience: '5 years',
                email: 'lisa.wang@email.com',
                phone: '+1 (555) 234-5678',
                status: 'Pending',
                avatar: 'LW',
                documents: ['License', 'Certification'],
                submittedDate: '2024-01-12',
                verificationStatus: 'Under Review'
            },
            {
                id: 3,
                name: 'Dr. Robert Martinez',
                specialty: 'Dermatology',
                experience: '7 years',
                email: 'robert.martinez@email.com',
                phone: '+1 (555) 345-6789',
                status: 'Pending',
                avatar: 'RM',
                documents: ['License'],
                submittedDate: '2024-01-15',
                verificationStatus: 'Under Review'
            },
            {
                id: 4,
                name: 'Dr. Jennifer Thompson',
                specialty: 'Cardiology',
                experience: '10 years',
                email: 'jennifer.thompson@email.com',
                phone: '+1 (555) 456-7890',
                status: 'Pending',
                avatar: 'JT',
                documents: ['License', 'Certification', 'Board Certification'],
                submittedDate: '2024-01-16',
                verificationStatus: 'Under Review'
            },
            {
                id: 5,
                name: 'Dr. Christopher Lee',
                specialty: 'Orthopedics',
                experience: '14 years',
                email: 'christopher.lee@email.com',
                phone: '+1 (555) 567-8901',
                status: 'Pending',
                avatar: 'CL',
                documents: ['License', 'Certification'],
                submittedDate: '2024-01-17',
                verificationStatus: 'Under Review'
            },
            {
                id: 6,
                name: 'Dr. Amanda Foster',
                specialty: 'Pediatrics',
                experience: '6 years',
                email: 'amanda.foster@email.com',
                phone: '+1 (555) 678-9012',
                status: 'Pending',
                avatar: 'AF',
                documents: ['License', 'Certification'],
                submittedDate: '2024-01-18',
                verificationStatus: 'Under Review'
            },
            {
                id: 7,
                name: 'Dr. Daniel Brown',
                specialty: 'Neurology',
                experience: '11 years',
                email: 'daniel.brown@email.com',
                phone: '+1 (555) 789-0123',
                status: 'Pending',
                avatar: 'DB',
                documents: ['License', 'Certification', 'Fellowship Certificate'],
                submittedDate: '2024-01-19',
                verificationStatus: 'Under Review'
            },
            {
                id: 8,
                name: 'Dr. Sophia Anderson',
                specialty: 'Dermatology',
                experience: '9 years',
                email: 'sophia.anderson@email.com',
                phone: '+1 (555) 890-1234',
                status: 'Pending',
                avatar: 'SA',
                documents: ['License', 'Certification'],
                submittedDate: '2024-01-20',
                verificationStatus: 'Under Review'
            }
        ];

const Approvals = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [pendingDoctors, setPendingDoctors] = useState(() => {
        const stored = localStorage.getItem('adminPendingDoctors');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // If stored data is empty, use default data
                if (Array.isArray(parsed) && parsed.length === 0) {
                    return defaultPendingDoctors;
                }
                return parsed;
            } catch {
                return defaultPendingDoctors;
            }
        }
        return defaultPendingDoctors;
    });

    // Initialize with dummy data if localStorage is empty (first load)
    useEffect(() => {
        const stored = localStorage.getItem('adminPendingDoctors');
        if (!stored || stored === '[]') {
            localStorage.setItem('adminPendingDoctors', JSON.stringify(defaultPendingDoctors));
            setPendingDoctors(defaultPendingDoctors);
        }
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        if (pendingDoctors.length > 0) {
            localStorage.setItem('adminPendingDoctors', JSON.stringify(pendingDoctors));
        }
    }, [pendingDoctors]);

    const filteredDoctors = pendingDoctors.filter(doctor => {
        const matchesSearch = !searchTerm || 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecialty = !filterSpecialty || doctor.specialty === filterSpecialty;
        
        return matchesSearch && matchesSpecialty;
    });

    const specialties = [...new Set(pendingDoctors.map(d => d.specialty))];

    const handleApprove = (doctorId) => {
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
        setToast({ show: true, message: 'Doctor approved successfully', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
        // In real app, this would update the doctors list
    };

    const handleReject = (doctorId) => {
        const doctor = pendingDoctors.find(d => d.id === doctorId);
        if (doctor) {
            // Remove from pending
            setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
            
            // Add to rejected doctors in localStorage (for Doctors page)
            const rejectedDoctors = JSON.parse(localStorage.getItem('rejectedDoctors') || '[]');
            const rejectedDoctor = {
                ...doctor,
                status: 'Rejected',
                verificationStatus: 'Failed',
                rejectedDate: new Date().toISOString().split('T')[0],
                patients: 0,
                rating: 0
            };
            rejectedDoctors.push(rejectedDoctor);
            localStorage.setItem('rejectedDoctors', JSON.stringify(rejectedDoctors));
            
            // Dispatch custom event to notify Doctors page
            window.dispatchEvent(new Event('doctorsUpdated'));
            
            setToast({ show: true, message: 'Doctor rejected', type: 'error' });
            setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
        }
    };

    const handleView = (doctor) => {
        navigate(`/admin/doctors/${doctor.id}`);
    };

    const stats = {
        total: pendingDoctors.length,
        neurology: pendingDoctors.filter(d => d.specialty === 'Neurology').length,
        pediatrics: pendingDoctors.filter(d => d.specialty === 'Pediatrics').length,
        dermatology: pendingDoctors.filter(d => d.specialty === 'Dermatology').length
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Approvals</h1>
                    <p className="text-sm sm:text-base text-gray-600">Review and approve pending doctor applications</p>
                    <MetaChips 
                        status={`${stats.total} Pending`}
                        id="Doctor Approvals"
                        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        owner="Admin"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pending</p>
                            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Neurology</p>
                            <p className="text-xl font-bold text-gray-900">{stats.neurology}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pediatrics</p>
                            <p className="text-xl font-bold text-gray-900">{stats.pediatrics}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Dermatology</p>
                            <p className="text-xl font-bold text-gray-900">{stats.dermatology}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <select
                            value={filterSpecialty}
                            onChange={(e) => setFilterSpecialty(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Pending Doctors List */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
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
                                <button
                                    onClick={() => navigate(`/admin/doctors/edit/${doctor.id}`)}
                                    className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded transition-colors"
                                    title="Edit Doctor"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
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
                                    <span className="font-medium">{doctor.submittedDate}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleView(doctor)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Review
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleApprove(doctor.id)}
                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(doctor.id)}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No pending approvals found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Approvals;


