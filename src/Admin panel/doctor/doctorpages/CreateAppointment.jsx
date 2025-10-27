import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    Calendar,
    Clock,
    User,
    FileText,
    MapPin,
    Video,
    Phone,
    CheckCircle,
    AlertCircle,
    X
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const CreateAppointment = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [formData, setFormData] = useState({
        patient: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'Consultation',
        status: 'confirmed',
        duration: '30 min',
        mode: 'clinic',
        room: 'Room 301',
        reason: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.patient.trim()) {
            newErrors.patient = 'Patient name is required';
        }
        
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        
        if (!formData.time) {
            newErrors.time = 'Time is required';
        }
        
        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason for visit is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show confirmation modal
        setShowConfirmModal(true);
    };

    const handleConfirmCreate = async () => {
        setIsSubmitting(true);
        setShowConfirmModal(false);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create new appointment object
            const newAppointment = {
                id: Date.now(), // Generate unique ID
                patient: formData.patient,
                date: formData.date,
                time: formData.time,
                type: formData.type,
                status: formData.status,
                duration: formData.duration,
                mode: formData.mode,
                room: formData.room,
                reason: formData.reason,
                createdAt: new Date().toISOString(), // Add timestamp for sorting
                aiReport: {
                    id: `AI-2024-${Date.now()}`,
                    status: 'pending',
                    summary: 'AI health assessment will be generated after consultation',
                    priority: 'normal'
                }
            };
            
            // Save to localStorage
            const existingAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '[]');
            const updatedAppointments = [newAppointment, ...existingAppointments]; // Add to top
            localStorage.setItem('doctorAppointments', JSON.stringify(updatedAppointments));
            
            console.log('Appointment created:', newAppointment);
            
            // Show success modal
            setShowSuccessModal(true);
            setIsSubmitting(false);
            
            // Navigate back to appointments list after 2 seconds
            setTimeout(() => {
                navigate('/doctor/appointments');
            }, 2000);
        } catch (error) {
            console.error('Error creating appointment:', error);
            setIsSubmitting(false);
            setToastMessage('Failed to create appointment. Please try again.');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/doctor/appointments');
    };

    const handleCancel = () => {
        navigate('/doctor/appointments');
    };

    return (
        <div className="min-h-screen overflow-x-hidden">
            <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/doctor/appointments')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Appointment</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Schedule an appointment for a patient</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Form Content */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
                        {/* Patient Information */}
                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
                                    <p className="text-sm text-gray-600">Enter patient details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="patient"
                                        value={formData.patient}
                                        onChange={handleInputChange}
                                        placeholder="Enter patient name"
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                            errors.patient ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.patient && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.patient}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                                errors.date ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                                errors.time ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.time && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.time}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Appointment Details */}
                        <Card className="p-4 sm:p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
                                    <p className="text-sm text-gray-600">Configure appointment settings</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Appointment Type
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        >
                                            <option value="Consultation">Consultation</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Check-up">Check-up</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration
                                        </label>
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        >
                                            <option value="15 min">15 minutes</option>
                                            <option value="30 min">30 minutes</option>
                                            <option value="45 min">45 minutes</option>
                                            <option value="60 min">60 minutes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Consultation Mode
                                        </label>
                                        <select
                                            name="mode"
                                            value={formData.mode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        >
                                            <option value="clinic">Clinic</option>
                                            <option value="teleconsultation">Teleconsultation</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Room/Location
                                        </label>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handleInputChange}
                                            placeholder="Room number or location"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Visit <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        placeholder="Enter reason for appointment"
                                        rows={3}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
                                            errors.reason ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.reason && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="confirmed">Confirmed</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - Quick Info */}
                    <div className="lg:col-span-1 space-y-4 sm:space-y-6 min-w-0">
                        <Card className="p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Selected Date</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(formData.date).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Time & Duration</p>
                                        <p className="text-sm text-gray-600">
                                            {formData.time} • {formData.duration}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                    {formData.mode === 'clinic' ? (
                                        <MapPin className="w-5 h-5 text-purple-600" />
                                    ) : (
                                        <Video className="w-5 h-5 text-purple-600" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Mode</p>
                                        <p className="text-sm text-gray-600 capitalize">{formData.mode}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Type</p>
                                        <p className="text-sm text-gray-600">{formData.type}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Fill in all required fields marked with *</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Select appropriate duration for the type of consultation</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Choose clinic or teleconsultation based on patient needs</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Set status to pending if patient needs to confirm</span>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span>Create Appointment</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] overflow-y-auto overflow-x-hidden mx-2 sm:mx-4">
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-4 min-w-0">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">Confirm Appointment</h2>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">Please review the details below</p>
                                    </div>
                                </div>
                            </div>

                        <div className="space-y-3 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Patient:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">{formData.patient}</span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Date:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">
                                            {new Date(formData.date).toLocaleDateString('en-US', { 
                                                weekday: 'short', 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Time:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">{formData.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Type:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">{formData.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Mode:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2 capitalize">{formData.mode}</span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Duration:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">{formData.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between min-w-0">
                                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Status:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2 capitalize">{formData.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                                <p className="text-xs sm:text-sm text-blue-800 break-words">
                                    <strong>Note:</strong> Once confirmed, this appointment will be added to your schedule.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmCreate}
                                className="w-full flex items-center justify-center space-x-2 bg-pink-600 text-white py-2 sm:py-3 px-3 rounded-lg hover:bg-pink-700 transition-colors font-medium text-sm"
                            >
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">Confirm & Create</span>
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                        <div className="text-center">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Appointment Created!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The appointment has been successfully added to your schedule.
                            </p>
                            
                            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg mb-6 text-left">
                                <div className="flex items-start">
                                    <Calendar className="w-5 h-5 text-pink-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-pink-800 mb-1">
                                            Appointment Details
                                        </p>
                                        <p className="text-xs text-pink-600">
                                            {formData.patient} • {new Date(formData.date).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })} at {formData.time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCloseSuccessModal}
                                className="w-full bg-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-pink-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Go to Appointments
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-red-700 font-medium flex-1">{toastMessage}</span>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default CreateAppointment;

