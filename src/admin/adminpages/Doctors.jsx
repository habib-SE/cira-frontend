import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Plus, Search, Filter, MoreVertical, X, Save, Phone, Mail, MapPin, Calendar, Award, Star, User, Building, Clock, Camera, Edit, Trash2, CalendarDays } from 'lucide-react';
import Card from '../admincomponents/Card';

const Doctors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [showFormInLayout, setShowFormInLayout] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showProfileInLayout, setShowProfileInLayout] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showEditFormInLayout, setShowEditFormInLayout] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        specialization: '',
        experience: '',
        hospital: '',
        availability: {
            monday: { available: false, startTime: '', endTime: '' },
            tuesday: { available: false, startTime: '', endTime: '' },
            wednesday: { available: false, startTime: '', endTime: '' },
            thursday: { available: false, startTime: '', endTime: '' },
            friday: { available: false, startTime: '', endTime: '' },
            saturday: { available: false, startTime: '', endTime: '' },
            sunday: { available: false, startTime: '', endTime: '' }
        },
        address: '',
        profileImage: null,
        profileImagePreview: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [doctors, setDoctors] = useState([
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            experience: '8 years',
            patients: 245,
            rating: 4.9,
            status: 'online',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurology',
            experience: '12 years',
            patients: 189,
            rating: 4.8,
            status: 'busy',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Dermatology',
            experience: '6 years',
            patients: 312,
            rating: 4.9,
            status: 'online',
            avatar: 'ER'
        },
        {
            id: 4,
            name: 'Dr. David Kim',
            specialty: 'Orthopedics',
            experience: '15 years',
            patients: 198,
            rating: 4.7,
            status: 'offline',
            avatar: 'DK'
        },
    ]);

    const validateForm = () => {
        const errors = {};
        
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email format is invalid';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = 'Phone must be 10-15 digits';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.specialization.trim()) errors.specialization = 'Specialization is required';
        if (!formData.experience.trim()) errors.experience = 'Years of experience is required';
        else if (isNaN(formData.experience) || parseInt(formData.experience) < 0) errors.experience = 'Experience must be a positive number';
        if (!formData.hospital.trim()) errors.hospital = 'Hospital/Clinic name is required';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAvailabilityChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability[day],
                    [field]: value
                }
            }
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: file,
                    profileImagePreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newDoctor = {
                id: doctors.length + 1,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                specialty: formData.specialization,
                experience: formData.experience ? `${formData.experience} years` : '',
                hospital: formData.hospital,
                availability: formData.availability,
                address: formData.address,
                profileImage: formData.profileImagePreview,
                avatar: formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
                rating: 4.5,
                patients: 0,
                status: 'offline'
            };
            
            setDoctors(prev => [...prev, newDoctor]);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                gender: '',
                specialization: '',
                experience: '',
                hospital: '',
                availability: {
                    monday: { available: false, startTime: '', endTime: '' },
                    tuesday: { available: false, startTime: '', endTime: '' },
                    wednesday: { available: false, startTime: '', endTime: '' },
                    thursday: { available: false, startTime: '', endTime: '' },
                    friday: { available: false, startTime: '', endTime: '' },
                    saturday: { available: false, startTime: '', endTime: '' },
                    sunday: { available: false, startTime: '', endTime: '' }
                },
                address: '',
                profileImage: null,
                profileImagePreview: null
            });
            setShowAddForm(false);
            setShowFormInLayout(false);
            setShowSuccessMessage(true);
            navigate('/admin/doctors');
            
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }
    };

    const handleViewProfile = (doctor) => {
        navigate(`/admin/doctors/view/${doctor.id}`);
    };

    const toggleDropdown = (doctorId) => {
        setShowDropdown(showDropdown === doctorId ? null : doctorId);
    };

    const handleEditDoctor = (doctor) => {
        navigate(`/admin/doctors/edit/${doctor.id}`);
    };

    const handleEditDoctorData = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            fullName: doctor.name || '',
            email: doctor.email || '',
            phone: doctor.phone || '',
            gender: doctor.gender || '',
            specialization: doctor.specialty || '',
            experience: doctor.experience ? 
                (doctor.experience.toString().includes('years') ? 
                    doctor.experience.replace(' years', '') : 
                    doctor.experience
                ) : '',
            hospital: doctor.hospital || '',
            availability: doctor.availability || {
                monday: { available: false, startTime: '', endTime: '' },
                tuesday: { available: false, startTime: '', endTime: '' },
                wednesday: { available: false, startTime: '', endTime: '' },
                thursday: { available: false, startTime: '', endTime: '' },
                friday: { available: false, startTime: '', endTime: '' },
                saturday: { available: false, startTime: '', endTime: '' },
                sunday: { available: false, startTime: '', endTime: '' }
            },
            address: doctor.address || '',
            profileImage: null,
            profileImagePreview: doctor.profileImage || null
        });
        setShowEditFormInLayout(true);
        setShowDropdown(null);
    };

    const handleDeleteDoctor = (doctorId) => {
        navigate(`/admin/doctors/delete/${doctorId}`);
    };

    const handleScheduleAppointment = (doctor) => {
        // Navigate to appointments page with doctor pre-selected
        navigate(`/admin/appointments/add?doctor=${encodeURIComponent(doctor.name)}`);
    };

    const handleViewAppointments = (doctor) => {
        // Navigate to appointments page filtered by doctor
        navigate(`/admin/appointments?doctor=${encodeURIComponent(doctor.name)}`);
    };

    // Function to get appointment count for a doctor (this would typically come from props or context)
    const getDoctorAppointmentCount = (doctorName) => {
        // This is a placeholder - in a real app, this would come from a shared state or API
        // For now, we'll return a random number to demonstrate the functionality
        const appointmentCounts = {
            'Dr. Sarah Johnson': 12,
            'Dr. Michael Chen': 8,
            'Dr. Emily Rodriguez': 15,
            'Dr. David Kim': 6
        };
        return appointmentCounts[doctorName] || 0;
    };

    const confirmDelete = () => {
        if (doctorToDelete) {
            setDoctors(prev => prev.filter(doctor => doctor.id !== doctorToDelete.id));
            setShowDeleteConfirm(false);
            setDoctorToDelete(null);
            navigate('/admin/doctors');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDoctorToDelete(null);
        navigate('/admin/doctors');
    };

    const handleUpdateDoctor = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setDoctors(prev => prev.map(doctor => 
                doctor.id === editingDoctor.id 
                    ? {
                        ...doctor,
                        name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        gender: formData.gender,
                        specialty: formData.specialization,
                        experience: formData.experience ? `${formData.experience} years` : '',
                        hospital: formData.hospital,
                        availability: formData.availability,
                        address: formData.address,
                        profileImage: formData.profileImagePreview,
                        avatar: formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                    }
                    : doctor
            ));
            
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                gender: '',
                specialization: '',
                experience: '',
                hospital: '',
                availability: {
                    monday: { available: false, startTime: '', endTime: '' },
                    tuesday: { available: false, startTime: '', endTime: '' },
                    wednesday: { available: false, startTime: '', endTime: '' },
                    thursday: { available: false, startTime: '', endTime: '' },
                    friday: { available: false, startTime: '', endTime: '' },
                    saturday: { available: false, startTime: '', endTime: '' },
                    sunday: { available: false, startTime: '', endTime: '' }
                },
                address: '',
                profileImage: null,
                profileImagePreview: null
            });
            setShowEditFormInLayout(false);
            setEditingDoctor(null);
            setShowSuccessMessage(true);
            
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }
    };

    // Handle URL-based actions
    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        const secondLastSegment = pathSegments[pathSegments.length - 2];
        
        // Debug logging
        console.log('Current pathname:', location.pathname);
        console.log('Path segments:', pathSegments);
        console.log('Last segment:', lastSegment);
        console.log('Second last segment:', secondLastSegment);
        
        // Reset all states first
        setShowProfile(false);
        setShowEditFormInLayout(false);
        setShowFormInLayout(false);
        setShowDeleteConfirm(false);
        
        // Check if the last segment is an action without an ID (like 'add')
        if (lastSegment === 'add') {
            console.log('Setting showFormInLayout to true');
            setShowFormInLayout(true);
        } 
        // Check if the second-to-last segment is an action and last segment is an ID
        else if (secondLastSegment && lastSegment && !isNaN(lastSegment)) {
            const action = secondLastSegment;
            const doctorId = parseInt(lastSegment);
            const doctor = doctors.find(d => d.id === doctorId);
            
            if (doctor) {
                switch (action) {
                    case 'view':
                        setSelectedDoctor(doctor);
                        setShowProfile(true);
                        break;
                    case 'edit':
                        handleEditDoctorData(doctor);
                        break;
                    case 'delete':
                        setDoctorToDelete(doctor);
                        setShowDeleteConfirm(true);
                        break;
                }
            }
        }
    }, [location.pathname, doctors]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // Filter doctors based on search term and filters
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = searchTerm === '' || 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doctor.hospital && doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSpecialty = filterSpecialty === '' || doctor.specialty === filterSpecialty;
        const matchesStatus = filterStatus === '' || doctor.status === filterStatus;
        
        return matchesSearch && matchesSpecialty && matchesStatus;
    });

    // Get unique specialties for filter dropdown
    const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'busy':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Doctor added successfully!</span>
                </div>
            )}

            {/* Header */}
            {!showFormInLayout && !showProfileInLayout && !showEditFormInLayout && (
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctors</h1>
                        <p className="text-gray-600">Manage your medical team and their schedules</p>
                    </div>
                        <button 
                            onClick={() => navigate('/admin/doctors/add')}
                            className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                        <Plus className="w-4 h-4" />
                        <span>Add Doctor</span>
                    </button>
                </div>
            )}

            {/* Add Doctor Form in Layout */}
            {showFormInLayout && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Add New Doctor</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/doctors')}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {formData.profileImagePreview ? (
                                    <img 
                                        src={formData.profileImagePreview} 
                                        alt="Profile preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.fullName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Dr. John Smith"
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="doctor@example.com"
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.phone ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {formErrors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.gender ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formErrors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                                )}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialization *
                                </label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.specialization ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Orthopedist">Orthopedist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Oncologist">Oncologist</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                    <option value="Radiologist">Radiologist</option>
                                    <option value="Surgeon">Surgeon</option>
                                    <option value="General Practitioner">General Practitioner</option>
                                </select>
                                {formErrors.specialization && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.experience ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="5"
                                />
                                {formErrors.experience && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                                )}
                            </div>

                            {/* Hospital */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hospital/Clinic Name *
                                </label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.hospital ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="City General Hospital"
                                />
                                {formErrors.hospital && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.hospital}</p>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Availability (Days & Time)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                {Object.entries(formData.availability).map(([day, schedule]) => (
                                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <input
                                                type="checkbox"
                                                checked={schedule.available}
                                                onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                                            />
                                            <label className="text-sm font-medium text-gray-700 capitalize">
                                                {day}
                                            </label>
                                        </div>
                                        {schedule.available && (
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={schedule.startTime}
                                                        onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={schedule.endTime}
                                                        onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address (Optional)
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                placeholder="123 Medical Center Dr, City, State 12345"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowFormInLayout(false)}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-4 h-4" />
                                <span>Add Doctor</span>
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Doctor Profile in Layout */}
            {showProfileInLayout && selectedDoctor && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Doctor Profile</h2>
                        </div>
                        <button 
                            onClick={() => setShowProfileInLayout(false)}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>
                    
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 mb-8 border border-pink-200 shadow-lg">
                        <div className="flex items-start space-x-8">
                            <div className="relative">
                                {selectedDoctor.profileImage ? (
                                    <img 
                                        src={selectedDoctor.profileImage} 
                                        alt={selectedDoctor.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                                        {selectedDoctor.avatar}
                                    </div>
                                )}
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg ${getStatusColor(selectedDoctor.status)}`}></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-4xl font-bold text-gray-900 mb-3">{selectedDoctor.name}</h3>
                                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-lg font-semibold mb-6 shadow-lg">
                                    {selectedDoctor.specialty}
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
                                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                        <span className="text-xl font-bold text-gray-900">{selectedDoctor.rating}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
                                        <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedDoctor.status)}`}></div>
                                        <span className="text-lg font-semibold text-gray-700 capitalize">{selectedDoctor.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <span>Contact Information</span>
                            </h4>
                            
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.email || 'No email provided'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.phone || 'No phone provided'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.address || 'No address provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
                            <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <span>Professional Information</span>
                            </h4>
                            
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                                            <p className="text-gray-900 font-semibold">
                                                {selectedDoctor.experience ? 
                                                    (selectedDoctor.experience.toString().includes('years') ? 
                                                        selectedDoctor.experience : 
                                                        `${selectedDoctor.experience} years`
                                                    ) : 
                                                    'No experience provided'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.gender || 'No gender provided'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <Building className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Hospital/Clinic</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.hospital || 'No hospital provided'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Patients</p>
                                            <p className="text-gray-900 font-semibold">{selectedDoctor.patients || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Availability Section */}
                    {selectedDoctor.availability && (
                        <div className="mt-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 border border-pink-200 shadow-lg">
                            <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <span>Availability Schedule</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(selectedDoctor.availability).map(([day, schedule]) => (
                                    <div key={day} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <h5 className="font-bold text-gray-900 capitalize mb-4 text-lg">{day}</h5>
                                        {schedule.available ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                                                    <span className="text-sm font-semibold text-green-700">Available</span>
                                                </div>
                                                <div className="text-sm text-gray-700 space-y-1">
                                                    <p className="font-medium">Start: {schedule.startTime || 'Not set'}</p>
                                                    <p className="font-medium">End: {schedule.endTime || 'Not set'}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                <span className="text-sm font-semibold text-gray-500">Not Available</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Search and Filter */}
            {!showFormInLayout && !showProfileInLayout && !showEditFormInLayout && (
                <Card className="p-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                            <Search className="w-3 h-3 text-pink-600" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search doctors by name, specialty, or hospital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300 hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        {/* Specialty Filter */}
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                                className="appearance-none w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300 bg-white text-gray-800 cursor-pointer hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                            >
                                <option value="" className="text-gray-500">All Specialties</option>
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty} className="text-gray-800 py-2">{specialty}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Filter */}
                        <div className="relative w-full sm:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-400 transition-all duration-300 bg-white text-gray-800 cursor-pointer hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                            >
                                <option value="" className="text-gray-500">All Status</option>
                                <option value="online" className="text-gray-800 py-2">Online</option>
                                <option value="busy" className="text-gray-800 py-2">Busy</option>
                                <option value="offline" className="text-gray-800 py-2">Offline</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {/* Clear Filters Button */}
                        {(searchTerm || filterSpecialty || filterStatus) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterSpecialty('');
                                    setFilterStatus('');
                                }}
                                className="w-full sm:w-auto px-6 py-3 text-pink-600 hover:bg-pink-50 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg font-medium text-sm"
                            >
                                <div className="w-4 h-4 bg-pink-100 rounded-full flex items-center justify-center">
                                    <X className="w-2.5 h-2.5" />
                                </div>
                                <span>Clear Filters</span>
                    </button>
                        )}
                    </div>
                </div>
            </Card>
            )}

            {/* Results Counter */}
            {!showFormInLayout && !showProfileInLayout && !showEditFormInLayout && (searchTerm || filterSpecialty || filterStatus) && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {filteredDoctors.length} of {doctors.length} doctors found
                    </p>
                </div>
            )}

            {/* Doctors Grid */}
            {!showFormInLayout && !showProfileInLayout && !showEditFormInLayout && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterSpecialty || filterStatus 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'No doctors have been added yet.'
                            }
                        </p>
                        {!searchTerm && !filterSpecialty && !filterStatus && (
                            <button
                                onClick={() => setShowFormInLayout(true)}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add First Doctor</span>
                            </button>
                        )}
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} hover className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    {doctor.profileImage ? (
                                        <img 
                                            src={doctor.profileImage} 
                                            alt={doctor.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                                    {doctor.avatar}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                    {doctor.hospital && (
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <Building className="w-3 h-3 mr-1" />
                                            {doctor.hospital}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="relative dropdown-container">
                                <button 
                                    onClick={() => toggleDropdown(doctor.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {showDropdown === doctor.id && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                        <button
                                            onClick={() => handleViewProfile(doctor)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200 flex items-center space-x-3"
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>View Profile</span>
                                        </button>
                                        <button
                                            onClick={() => handleScheduleAppointment(doctor)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 flex items-center space-x-3"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>Schedule Appointment</span>
                                        </button>
                                        <button
                                            onClick={() => handleViewAppointments(doctor)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3"
                                        >
                                            <CalendarDays className="w-4 h-4" />
                                            <span>View Appointments</span>
                                        </button>
                                        <button
                                            onClick={() => handleEditDoctor(doctor)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-200 flex items-center space-x-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit Doctor</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor.id)}
                                            className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center space-x-3"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete Doctor</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Experience</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {doctor.experience ? 
                                        (doctor.experience.toString().includes('years') ? 
                                            doctor.experience : 
                                            `${doctor.experience} years`
                                        ) : 
                                        'No experience'
                                    }
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Patients</span>
                                <span className="text-sm font-medium text-gray-900">{doctor.patients}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Rating</span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Appointments</span>
                                <div className="flex items-center space-x-1">
                                    <CalendarDays className="w-3 h-3 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-900">{getDoctorAppointmentCount(doctor.name)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(doctor.status)}`}></div>
                                <span className="text-sm text-gray-600 capitalize">{doctor.status}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleScheduleAppointment(doctor)}
                                    className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1"
                                >
                                    <Calendar className="w-3 h-3" />
                                    <span>Schedule</span>
                                </button>
                                <button 
                                    onClick={() => handleViewProfile(doctor)}
                                    className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </Card>
                    ))
                )}
            </div>
            )}

            {/* Add Doctor Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
                        <div className="sticky top-0 bg-pink-50 border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Add New Doctor</h2>
                            </div>
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 group"
                            >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    {formData.profileImagePreview ? (
                                        <img 
                                            src={formData.profileImagePreview} 
                                            alt="Profile preview"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                                            <Camera className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Image (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.fullName ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="Dr. John Smith"
                                    />
                                    {formErrors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.email ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="doctor@example.com"
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.phone ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {formErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.gender ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formErrors.gender && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                                    )}
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specialization *
                                    </label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.specialization ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Select Specialization</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Orthopedist">Orthopedist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Gynecologist">Gynecologist</option>
                                        <option value="Oncologist">Oncologist</option>
                                        <option value="Psychiatrist">Psychiatrist</option>
                                        <option value="Radiologist">Radiologist</option>
                                        <option value="Surgeon">Surgeon</option>
                                        <option value="General Practitioner">General Practitioner</option>
                                    </select>
                                    {formErrors.specialization && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        min="0"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.experience ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="5"
                                    />
                                    {formErrors.experience && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                                    )}
                                </div>

                                {/* Hospital */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hospital/Clinic Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.hospital ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="City General Hospital"
                                    />
                                    {formErrors.hospital && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.hospital}</p>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Availability (Days & Time)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                    {Object.entries(formData.availability).map(([day, schedule]) => (
                                        <div key={day} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={schedule.available}
                                                    onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                                                />
                                                <label className="text-sm font-medium text-gray-700 capitalize">
                                                    {day}
                                                </label>
                                            </div>
                                            {schedule.available && (
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500">Start Time</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.startTime}
                                                            onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">End Time</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.endTime}
                                                            onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address (Optional)
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                    placeholder="123 Medical Center Dr, City, State 12345"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/doctors')}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Add Doctor</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Doctor Form in Layout */}
            {showEditFormInLayout && editingDoctor && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <Edit className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Edit Doctor</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/doctors')}
                            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleUpdateDoctor} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {formData.profileImagePreview ? (
                                    <img 
                                        src={formData.profileImagePreview} 
                                        alt="Profile preview"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.fullName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Dr. John Smith"
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="doctor@example.com"
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.phone ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {formErrors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.gender ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formErrors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                                )}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialization *
                                </label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.specialization ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Orthopedist">Orthopedist</option>
                                    <option value="Pediatrician">Pediatrician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Oncologist">Oncologist</option>
                                    <option value="Psychiatrist">Psychiatrist</option>
                                    <option value="Radiologist">Radiologist</option>
                                    <option value="Surgeon">Surgeon</option>
                                    <option value="General Practitioner">General Practitioner</option>
                                </select>
                                {formErrors.specialization && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.experience ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="5"
                                />
                                {formErrors.experience && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                                )}
                            </div>

                            {/* Hospital */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hospital/Clinic Name *
                                </label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        formErrors.hospital ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="City General Hospital"
                                />
                                {formErrors.hospital && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.hospital}</p>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Availability (Days & Time)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                {Object.entries(formData.availability).map(([day, schedule]) => (
                                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <input
                                                type="checkbox"
                                                checked={schedule.available}
                                                onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <label className="text-sm font-medium text-gray-700 capitalize">
                                                {day}
                                            </label>
                                        </div>
                                        {schedule.available && (
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-xs text-gray-500">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={schedule.startTime}
                                                        onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={schedule.endTime}
                                                        onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address (Optional)
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="123 Medical Center Dr, City, State 12345"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/doctors')}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-4 h-4" />
                                <span>Update Doctor</span>
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Edit Doctor Form Modal */}
            {showEditForm && editingDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
                        <div className="sticky top-0 bg-blue-50 border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Edit className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Edit Doctor</h2>
                            </div>
                            <button 
                                onClick={() => setShowEditForm(false)}
                                className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 group"
                            >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateDoctor} className="p-8 space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    {formData.profileImagePreview ? (
                                        <img 
                                            src={formData.profileImagePreview} 
                                            alt="Profile preview"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                                            <Camera className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Image (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.fullName ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="Dr. John Smith"
                                    />
                                    {formErrors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.email ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="doctor@example.com"
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.phone ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {formErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.gender ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formErrors.gender && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>
                                    )}
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specialization *
                                    </label>
                                    <select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.specialization ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Select Specialization</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Orthopedist">Orthopedist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Gynecologist">Gynecologist</option>
                                        <option value="Oncologist">Oncologist</option>
                                        <option value="Psychiatrist">Psychiatrist</option>
                                        <option value="Radiologist">Radiologist</option>
                                        <option value="Surgeon">Surgeon</option>
                                        <option value="General Practitioner">General Practitioner</option>
                                    </select>
                                    {formErrors.specialization && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        min="0"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.experience ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="5"
                                    />
                                    {formErrors.experience && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>
                                    )}
                                </div>

                                {/* Hospital */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hospital/Clinic Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            formErrors.hospital ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder="City General Hospital"
                                    />
                                    {formErrors.hospital && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.hospital}</p>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Availability (Days & Time)
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                    {Object.entries(formData.availability).map(([day, schedule]) => (
                                        <div key={day} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={schedule.available}
                                                    onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <label className="text-sm font-medium text-gray-700 capitalize">
                                                    {day}
                                                </label>
                                            </div>
                                            {schedule.available && (
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500">Start Time</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.startTime}
                                                            onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">End Time</label>
                                                        <input
                                                            type="time"
                                                            value={schedule.endTime}
                                                            onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address (Optional)
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="123 Medical Center Dr, City, State 12345"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(false)}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Update Doctor</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Doctor Profile Modal */}
            {showProfile && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
                        <div className="sticky top-0 bg-pink-50 border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Doctor Profile</h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => {
                                        setShowProfile(false);
                                        navigate(`/admin/doctors/edit/${selectedDoctor.id}`);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/doctors')}
                                    className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 group"
                                >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                            </button>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 mb-8 border border-pink-200 shadow-lg">
                                <div className="flex items-start space-x-8">
                                    <div className="relative">
                                        {selectedDoctor.profileImage ? (
                                            <img 
                                                src={selectedDoctor.profileImage} 
                                                alt={selectedDoctor.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                                                {selectedDoctor.avatar}
                                            </div>
                                        )}
                                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg ${getStatusColor(selectedDoctor.status)}`}></div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-4xl font-bold text-gray-900 mb-3">{selectedDoctor.name}</h3>
                                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-lg font-semibold mb-6 shadow-lg">
                                            {selectedDoctor.specialty}
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
                                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                                <span className="text-xl font-bold text-gray-900">{selectedDoctor.rating}</span>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg">
                                                <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedDoctor.status)}`}></div>
                                                <span className="text-lg font-semibold text-gray-700 capitalize">{selectedDoctor.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Contact Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <span>Contact Information</span>
                                    </h4>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.email || 'No email provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.phone || 'No phone provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.address || 'No address provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <span>Professional Information</span>
                                    </h4>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                                                    <p className="text-gray-900 font-semibold">
                                                        {selectedDoctor.experience ? 
                                                            (selectedDoctor.experience.toString().includes('years') ? 
                                                                selectedDoctor.experience : 
                                                                `${selectedDoctor.experience} years`
                                                            ) : 
                                                            'No experience provided'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                                    <User className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.gender || 'No gender provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                    <Building className="w-5 h-5 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Hospital/Clinic</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.hospital || 'No hospital provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Patients</p>
                                                    <p className="text-gray-900 font-semibold">{selectedDoctor.patients || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Section */}
                            {selectedDoctor.availability && (
                                <div className="mt-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 border border-pink-200 shadow-lg">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <span>Availability Schedule</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Object.entries(selectedDoctor.availability).map(([day, schedule]) => (
                                            <div key={day} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                                <h5 className="font-bold text-gray-900 capitalize mb-4 text-lg">{day}</h5>
                                                {schedule.available ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                                                            <span className="text-sm font-semibold text-green-700">Available</span>
                                                        </div>
                                                        <div className="text-sm text-gray-700 space-y-1">
                                                            <p className="font-medium">Start: {schedule.startTime || 'Not set'}</p>
                                                            <p className="font-medium">End: {schedule.endTime || 'Not set'}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                        <span className="text-sm font-semibold text-gray-500">Not Available</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && doctorToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Doctor</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="relative">
                                    {doctorToDelete.profileImage ? (
                                        <img 
                                            src={doctorToDelete.profileImage} 
                                            alt={doctorToDelete.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                                            {doctorToDelete.avatar}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">{doctorToDelete.name}</h4>
                                    <p className="text-sm text-gray-600">{doctorToDelete.specialty}</p>
                                    <p className="text-xs text-gray-500">{doctorToDelete.hospital}</p>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="flex items-start space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">!</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-red-800 mb-1">Warning</p>
                                        <p className="text-sm text-red-700">
                                            Are you sure you want to delete <strong>{doctorToDelete.name}</strong>? 
                                            This will permanently remove all their data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium flex items-center space-x-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Doctors;
