import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, X, Clock, AlertCircle, Eye, FileText, User } from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

const Approvals = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Sample pending doctors data
    const [pendingDoctors, setPendingDoctors] = useState([
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
        }
    ]);

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
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
        setToast({ show: true, message: 'Doctor rejected', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
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
            <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
                <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                        <span className="text-pink-600 font-semibold text-sm">
                                            {doctor.avatar}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-yellow-500" />
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                        {doctor.verificationStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="text-sm">
                                    <p className="text-gray-500">Email</p>
                                    <p className="text-gray-900">{doctor.email}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-500">Phone</p>
                                    <p className="text-gray-900">{doctor.phone}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-500">Experience</p>
                                    <p className="text-gray-900">{doctor.experience}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-500">Submitted</p>
                                    <p className="text-gray-900">{doctor.submittedDate}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-500 mb-1">Documents</p>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.documents.map((doc, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            {doc}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => handleView(doctor)}
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm">View Details</span>
                                </button>
                                <button
                                    onClick={() => handleApprove(doctor.id)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">Approve</span>
                                </button>
                                <button
                                    onClick={() => handleReject(doctor.id)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="text-sm">Reject</span>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredDoctors.length === 0 && (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No pending approvals found</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Approvals;


