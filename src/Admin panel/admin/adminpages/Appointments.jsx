import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Plus, Search, Filter, Clock, User, Stethoscope, X, Save, Edit, Trash2, Eye, Phone, Mail, MapPin, AlertCircle, CheckCircle, FileText, TrendingUp, BarChart3, PieChart, Activity, Bell, Star, Award, Target, Zap, Users, Calendar as CalendarIcon, Clock as ClockIcon, DollarSign, MessageSquare, Video, MapPin as LocationIcon } from 'lucide-react';
import Card from '../admincomponents/Card';
import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import MetaChips from '../../../components/shared/MetaChips';

const Appointments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State management
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [_isContentLoading, _setIsContentLoading] = useState(false);

    // Check for search term from URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    

    // Additional analytics data
    const appointmentAnalytics = {
        totalAppointments: 1247,
        completedThisMonth: 89,
        pendingAppointments: 23,
        cancelledThisWeek: 5,
        averageDuration: 35,
        patientSatisfaction: 4.8,
        revenueThisMonth: 45600,
        topSpecialty: 'Cardiology',
        peakHours: '9:00 AM - 11:00 AM',
        noShowRate: 8.5
    };

    // Upcoming appointments for today
    const todaysSchedule = [
        {
            id: 101,
            patient: 'Alice Johnson',
            doctor: 'Dr. Sarah Johnson',
            time: '09:00 AM',
            type: 'Consultation',
            status: 'Confirmed',
            priority: 'High'
        },
        {
            id: 102,
            patient: 'Bob Wilson',
            doctor: 'Dr. Michael Chen',
            time: '10:30 AM',
            type: 'Follow-up',
            status: 'Confirmed',
            priority: 'Normal'
        },
        {
            id: 103,
            patient: 'Carol Davis',
            doctor: 'Dr. Emily Rodriguez',
            time: '02:00 PM',
            type: 'Check-up',
            status: 'Pending',
            priority: 'Normal'
        },
        {
            id: 104,
            patient: 'David Brown',
            doctor: 'Dr. Sarah Johnson',
            time: '03:30 PM',
            type: 'Emergency',
            status: 'Confirmed',
            priority: 'Urgent'
        }
    ];

    // Appointment trends data
    const appointmentTrends = [
        { month: 'Jan', appointments: 120, revenue: 18000 },
        { month: 'Feb', appointments: 135, revenue: 20250 },
        { month: 'Mar', appointments: 142, revenue: 21300 },
        { month: 'Apr', appointments: 158, revenue: 23700 },
        { month: 'May', appointments: 165, revenue: 24750 },
        { month: 'Jun', appointments: 172, revenue: 25800 }
    ];

    // Specialty distribution
    const specialtyDistribution = [
        { specialty: 'Cardiology', count: 45, percentage: 25 },
        { specialty: 'Neurology', count: 38, percentage: 21 },
        { specialty: 'Dermatology', count: 32, percentage: 18 },
        { specialty: 'Orthopedics', count: 28, percentage: 16 },
        { specialty: 'Pediatrics', count: 22, percentage: 12 },
        { specialty: 'Others', count: 15, percentage: 8 }
    ];

    // Recent activities
    const recentActivities = [
        {
            id: 1,
            type: 'appointment_scheduled',
            message: 'New appointment scheduled for John Doe with Dr. Sarah Johnson',
            time: '2 minutes ago',
            icon: Calendar,
            color: 'text-blue-600'
        },
        {
            id: 2,
            type: 'appointment_cancelled',
            message: 'Appointment cancelled by Jane Smith',
            time: '15 minutes ago',
            icon: X,
            color: 'text-red-600'
        },
        {
            id: 3,
            type: 'appointment_completed',
            message: 'Appointment completed for Mike Johnson',
            time: '1 hour ago',
            icon: CheckCircle,
            color: 'text-green-600'
        },
        {
            id: 4,
            type: 'reminder_sent',
            message: 'Reminder sent to 12 patients for tomorrow\'s appointments',
            time: '2 hours ago',
            icon: Bell,
            color: 'text-yellow-600'
        }
    ];

    // Default appointments data
    const defaultAppointments = [
        {
            id: 1,
            patient: 'John Doe',
            patientEmail: 'john.doe@email.com',
            patientPhone: '+1 (555) 123-4567',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: new Date().toISOString().split('T')[0], // Today
            time: '09:00 AM',
            status: 'Scheduled',
            type: 'Follow-up',
            notes: 'Regular follow-up for heart condition',
            priority: 'Normal',
            duration: '30 minutes'
        },
        {
            id: 2,
            patient: 'Jane Smith',
            patientEmail: 'jane.smith@email.com',
            patientPhone: '+1 (555) 234-5678',
            doctor: 'Dr. Michael Chen',
            specialty: 'Neurology',
            date: new Date().toISOString().split('T')[0], // Today
            time: '10:30 AM',
            status: 'Confirmed',
            type: 'Consultation',
            notes: 'Initial consultation for migraines',
            priority: 'High',
            duration: '45 minutes'
        },
        {
            id: 3,
            patient: 'Mike Johnson',
            patientEmail: 'mike.johnson@email.com',
            patientPhone: '+1 (555) 345-6789',
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'Dermatology',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: '02:00 PM',
            status: 'In Progress',
            type: 'Check-up',
            notes: 'Annual skin check-up',
            priority: 'Normal',
            duration: '20 minutes'
        },
        {
            id: 4,
            patient: 'Sarah Wilson',
            patientEmail: 'sarah.wilson@email.com',
            patientPhone: '+1 (555) 456-7890',
            doctor: 'Dr. David Kim',
            specialty: 'Orthopedics',
            date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
            time: '11:15 AM',
            status: 'Scheduled',
            type: 'Consultation',
            notes: 'Knee pain consultation',
            priority: 'Low',
            duration: '30 minutes'
        },
        {
            id: 5,
            patient: 'Robert Brown',
            patientEmail: 'robert.brown@email.com',
            patientPhone: '+1 (555) 567-8901',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], // 3 days from now
            time: '03:30 PM',
            status: 'Completed',
            type: 'Follow-up',
            notes: 'Post-surgery follow-up',
            priority: 'High',
            duration: '30 minutes'
        },
        {
            id: 6,
            patient: 'Lisa Davis',
            patientEmail: 'lisa.davis@email.com',
            patientPhone: '+1 (555) 678-9012',
            doctor: 'Dr. Michael Chen',
            specialty: 'Neurology',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
            time: '01:00 PM',
            status: 'Cancelled',
            type: 'Consultation',
            notes: 'Patient cancelled due to emergency',
            priority: 'Normal',
            duration: '45 minutes'
        },
    ];

    // Initialize appointments from localStorage or use default
    const [appointments, setAppointments] = useState(() => {
        const savedAppointments = localStorage.getItem('appointments');
        return savedAppointments ? JSON.parse(savedAppointments) : defaultAppointments;
    });

    // Helper function to save appointments to localStorage
    const saveAppointmentsToStorage = (appointmentsList) => {
        localStorage.setItem('appointments', JSON.stringify(appointmentsList));
    };

    // Toast notification helper
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Form state
    const [showFormInLayout, setShowFormInLayout] = useState(false);
    const [showEditFormInLayout, setShowEditFormInLayout] = useState(false);
    const [showViewFormInLayout, setShowViewFormInLayout] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [viewingAppointment, setViewingAppointment] = useState(null);
    const [formData, setFormData] = useState({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        doctor: '',
        department: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: '',
        status: 'Scheduled',
        notes: '',
        priority: 'Normal',
        duration: '30'
    });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterType, setFilterType] = useState('');

    // Doctors data (matching the structure from Doctors.jsx)
    const doctors = React.useMemo(() => [
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
    ], []);

    // Appointment types
    const appointmentTypes = ['Consultation', 'Check-up', 'Follow-up', 'Emergency', 'Surgery', 'Therapy', 'Vaccination'];
    
    // Status options
    const statusOptions = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    
    // Priority options
    const priorityOptions = ['Low', 'Normal', 'High', 'Urgent'];
    
    // Duration options
    const durationOptions = ['15', '30', '45', '60', '90', '120'];

    // Route handling
    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const secondLastSegment = pathSegments[pathSegments.length - 2];
        const thirdLastSegment = pathSegments[pathSegments.length - 3];
        
        // Reset form state
        setShowFormInLayout(false);
        setShowEditFormInLayout(false);
        setShowViewFormInLayout(false);
        
        // Check if we're on the appointments add route
        if (lastSegment === 'add' && secondLastSegment === 'appointments') {
            setShowFormInLayout(true);
            
            // Check for doctor parameter in URL
            const urlParams = new URLSearchParams(location.search);
            const doctorParam = urlParams.get('doctor');
            if (doctorParam) {
                setFormData(prev => ({
                    ...prev,
                    doctor: doctorParam,
                    department: doctors.find(d => d.name === doctorParam)?.specialty || ''
                }));
            }
        }
        
        // Check if we're on the appointments edit route
        if (lastSegment && secondLastSegment === 'edit' && thirdLastSegment === 'appointments') {
            const appointmentId = parseInt(lastSegment);
            const appointment = appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                setEditingAppointment(appointment);
                setFormData({
                    patientName: appointment.patient,
                    patientEmail: appointment.patientEmail,
                    patientPhone: appointment.patientPhone,
                    doctor: appointment.doctor,
                    department: appointment.specialty,
                    appointmentDate: appointment.date,
                    appointmentTime: appointment.time,
                    appointmentType: appointment.type,
                    status: appointment.status,
                    notes: appointment.notes || '',
                    priority: appointment.priority,
                    duration: appointment.duration.replace(' minutes', '')
                });
                setShowEditFormInLayout(true);
            }
        }
        
        // Check if we're on the appointments view route
        if (lastSegment && secondLastSegment === 'view' && thirdLastSegment === 'appointments') {
            const appointmentId = parseInt(lastSegment);
            const appointment = appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                setViewingAppointment(appointment);
                setShowViewFormInLayout(true);
            }
        }
        
        // Check for doctor filter parameter
        const urlParams = new URLSearchParams(location.search);
        const doctorFilter = urlParams.get('doctor');
        if (doctorFilter && lastSegment === 'appointments') {
            setFilterDoctor(doctorFilter);
        }
    }, [location.pathname, location.search, appointments, doctors]);

    // Form handling functions
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Auto-fill department when doctor is selected
        if (name === 'doctor') {
            const selectedDoctor = doctors.find(d => d.name === value);
            if (selectedDoctor) {
                setFormData(prev => ({
                    ...prev,
                    doctor: value,
                    department: selectedDoctor.specialty
                }));
            }
        }
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.patientName.trim()) {
            errors.patientName = 'Patient name is required';
        }
        if (!formData.patientEmail.trim()) {
            errors.patientEmail = 'Patient email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
            errors.patientEmail = 'Please enter a valid email address';
        }
        if (!formData.patientPhone.trim()) {
            errors.patientPhone = 'Patient phone number is required';
        } else if (!/^[+]?[0-9][\d]{7,15}$/.test(formData.patientPhone.replace(/\D/g, ''))) {
            errors.patientPhone = 'Please enter a valid phone number';
        }
        if (!formData.doctor) {
            errors.doctor = 'Please select a doctor';
        }
        if (!formData.appointmentDate) {
            errors.appointmentDate = 'Appointment date is required';
        } else {
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errors.appointmentDate = 'Appointment date must be today or in the future';
            }
        }
        if (!formData.appointmentTime) {
            errors.appointmentTime = 'Appointment time is required';
        }
        if (!formData.appointmentType) {
            errors.appointmentType = 'Please select appointment type';
        }
        if (!formData.duration) {
            errors.duration = 'Please select appointment duration';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newAppointment = {
                id: appointments.length + 1,
                patient: formData.patientName,
                patientEmail: formData.patientEmail,
                patientPhone: formData.patientPhone,
                doctor: formData.doctor,
                specialty: formData.department,
                date: formData.appointmentDate,
                time: formData.appointmentTime,
                status: formData.status,
                type: formData.appointmentType,
                notes: formData.notes,
                priority: formData.priority,
                duration: formData.duration + ' minutes'
            };
            
            const updatedAppointments = [...appointments, newAppointment];
            setAppointments(updatedAppointments);
            saveAppointmentsToStorage(updatedAppointments);
            
            // Reset form and navigate back
            setFormData({
                patientName: '',
                patientEmail: '',
                patientPhone: '',
                doctor: '',
                department: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentType: '',
                status: 'Scheduled',
                notes: '',
                priority: 'Normal',
                duration: '30'
            });
            setFormErrors({});
            setShowFormInLayout(false);
            showToast('Appointment scheduled successfully!', 'success');
            navigate('/admin/appointments');
        }
    };

    const closeForm = () => {
        setShowFormInLayout(false);
        setFormData({
            patientName: '',
            patientEmail: '',
            patientPhone: '',
            doctor: '',
            department: '',
            appointmentDate: '',
            appointmentTime: '',
            appointmentType: '',
            status: 'Scheduled',
            notes: '',
            priority: 'Normal',
            duration: '30'
        });
        setFormErrors({});
        navigate('/admin/appointments');
    };

    // Appointment action handlers
    const handleViewAppointment = (appointment) => {
        navigate(`/admin/appointments/view/${appointment.id}`);
    };

    const handleEditAppointment = (appointment) => {
        navigate(`/admin/appointments/edit/${appointment.id}`);
    };

    const handleDeleteAppointment = (appointment) => {
        setAppointmentToDelete(appointment);
        setShowDeleteModal(true);
    };

    const confirmDeleteAppointment = () => {
        if (!appointmentToDelete) return;

        const updatedAppointments = appointments.filter(
            apt => apt.id !== appointmentToDelete.id
        );
        setAppointments(updatedAppointments);
        saveAppointmentsToStorage(updatedAppointments);

        setToast({
            show: true,
            message: 'Appointment deleted successfully!',
            type: 'warning'
        });

        setAppointmentToDelete(null);
        setShowDeleteModal(false);
    };

    const cancelDeleteAppointment = () => {
        setAppointmentToDelete(null);
        setShowDeleteModal(false);
    };

    useEffect(() => {
        if (!showDeleteModal) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [showDeleteModal]);

    const handleSendReminders = () => {
        // Get upcoming appointments (next 24 hours)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const upcomingAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate <= tomorrow && ['Scheduled', 'Confirmed'].includes(apt.status);
        });

        if (upcomingAppointments.length === 0) {
            showToast('No upcoming appointments to send reminders for', 'error');
            return;
        }

        // Simulate sending reminders
        const reminderCount = upcomingAppointments.length;
        showToast(`Reminders sent to ${reminderCount} patients for upcoming appointments`, 'success');
    };


    const handleUpdateAppointment = (e) => {
        e.preventDefault();
        if (validateForm() && editingAppointment) {
            const updatedAppointments = appointments.map(apt => 
                apt.id === editingAppointment.id 
                    ? {
                        ...apt,
                        patient: formData.patientName,
                        patientEmail: formData.patientEmail,
                        patientPhone: formData.patientPhone,
                        doctor: formData.doctor,
                        specialty: formData.department,
                        date: formData.appointmentDate,
                        time: formData.appointmentTime,
                        status: formData.status,
                        type: formData.appointmentType,
                        notes: formData.notes,
                        priority: formData.priority,
                        duration: formData.duration + ' minutes'
                    }
                    : apt
            );
            
            setAppointments(updatedAppointments);
            saveAppointmentsToStorage(updatedAppointments);
            
            setShowEditFormInLayout(false);
            setEditingAppointment(null);
            setFormData({
                patientName: '',
                patientEmail: '',
                patientPhone: '',
                doctor: '',
                department: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentType: '',
                status: 'Scheduled',
                notes: '',
                priority: 'Normal',
                duration: '30'
            });
            setFormErrors({});
            showToast('Appointment updated successfully!', 'success');
            navigate('/admin/appointments');
        }
    };

    const closeViewForm = () => {
        setShowViewFormInLayout(false);
        setViewingAppointment(null);
        navigate('/admin/appointments');
    };

    const closeEditForm = () => {
        setShowEditFormInLayout(false);
        setEditingAppointment(null);
        setFormData({
            patientName: '',
            patientEmail: '',
            patientPhone: '',
            doctor: '',
            department: '',
            appointmentDate: '',
            appointmentTime: '',
            appointmentType: '',
            status: 'Scheduled',
            notes: '',
            priority: 'Normal',
            duration: '30'
        });
        setFormErrors({});
        navigate('/admin/appointments');
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = searchTerm === '' || 
            appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.date.includes(searchTerm) ||
            appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === '' || appointment.status === filterStatus;
        const matchesDoctor = filterDoctor === '' || appointment.doctor === filterDoctor;
        const matchesPriority = filterPriority === '' || appointment.priority === filterPriority;
        const matchesType = filterType === '' || appointment.type === filterType;
        
        return matchesSearch && matchesStatus && matchesDoctor && matchesPriority && matchesType;
    });

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(apt => apt.date === today).length;
    const completedAppointments = appointments.filter(apt => apt.status === 'Completed').length;
    const pendingAppointments = appointments.filter(apt => ['Scheduled', 'Confirmed'].includes(apt.status)).length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'Cancelled').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Consultation':
                return 'bg-purple-100 text-purple-800';
            case 'Follow-up':
                return 'bg-pink-100 text-pink-800';
            case 'Check-up':
                return 'bg-green-100 text-green-800';
            case 'Emergency':
                return 'bg-red-100 text-red-800';
            case 'Surgery':
                return 'bg-orange-100 text-orange-800';
            case 'Therapy':
                return 'bg-blue-100 text-blue-800';
            case 'Vaccination':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'bg-gray-100 text-gray-800';
            case 'Normal':
                return 'bg-blue-100 text-blue-800';
            case 'High':
                return 'bg-orange-100 text-orange-800';
            case 'Urgent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Low':
                return <Clock className="w-3 h-3" />;
            case 'Normal':
                return <CheckCircle className="w-3 h-3" />;
            case 'High':
                return <AlertCircle className="w-3 h-3" />;
            case 'Urgent':
                return <AlertCircle className="w-3 h-3" />;
            default:
                return <Clock className="w-3 h-3" />;
        }
    };

    const deleteModal = showDeleteModal && appointmentToDelete
        ? createPortal(
            <div className="fixed inset-0 z-[1000] flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Appointment</h3>
                                <p className="text-sm text-gray-500">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete the appointment for{' '}
                            <span className="font-semibold text-gray-900">
                                {appointmentToDelete.patient}
                            </span>{' '}
                            with{' '}
                            <span className="font-semibold text-gray-900">
                                {appointmentToDelete.doctor}
                            </span>{' '}
                            scheduled on{' '}
                            <span className="font-semibold text-gray-900">
                                {appointmentToDelete.date} at {appointmentToDelete.time}
                            </span>
                            ?
                        </p>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            onClick={cancelDeleteAppointment}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDeleteAppointment}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {deleteModal}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border max-w-sm ${
                        toast.type === 'success' 
                            ? 'bg-pink-50 border-pink-500 text-pink-800' 
                            : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                        <div className={`w-5 h-5 flex-shrink-0 ${
                            toast.type === 'success' ? 'text-pink-600' : 'text-red-600'
                        }`}>
                            {toast.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                        </div>
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: '' })}
                            className={`ml-2 text-sm ${
                                toast.type === 'success' ? 'text-pink-600' : 'text-red-600'
                            } hover:opacity-70`}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Add Appointment Form in Layout - At the top when visible */}
            {showFormInLayout && (
                <Card className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Schedule New Appointment</h2>
                        <button
                            onClick={closeForm}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Name *
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient name"
                                />
                                {formErrors.patientName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientName}</p>
                                )}
                            </div>

                            {/* Patient Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Email *
                                </label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientEmail ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient email"
                                />
                                {formErrors.patientEmail && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientEmail}</p>
                                )}
                            </div>

                            {/* Patient Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    value={formData.patientPhone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientPhone ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient phone number"
                                />
                                {formErrors.patientPhone && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientPhone}</p>
                                )}
                            </div>

                            {/* Doctor Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Doctor *
                                </label>
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.doctor ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select a doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.name}>
                                            {doctor.name} - {doctor.specialty}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.doctor && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.doctor}</p>
                                )}
                            </div>

                            {/* Department (Auto-filled) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                                    placeholder="Auto-filled when doctor is selected"
                                />
                            </div>

                            {/* Appointment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Date *
                                </label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentDate ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {formErrors.appointmentDate && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentDate}</p>
                                )}
                            </div>

                            {/* Appointment Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Time *
                                </label>
                                <input
                                    type="time"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentTime ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {formErrors.appointmentTime && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentTime}</p>
                                )}
                            </div>

                            {/* Appointment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Type *
                                </label>
                                <select
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentType ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select appointment type</option>
                                    {appointmentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {formErrors.appointmentType && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentType}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {priorityOptions.map(priority => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes) *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.duration ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select duration</option>
                                    {durationOptions.map(duration => (
                                        <option key={duration} value={duration}>{duration} minutes</option>
                                    ))}
                                </select>
                                {formErrors.duration && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Enter any additional notes about the appointment..."
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-4 h-4" />
                                <span>Schedule Appointment</span>
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Edit Appointment Form in Layout - At the top when visible */}
            {showEditFormInLayout && (
                <Card className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
                        <button
                            onClick={closeEditForm}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleUpdateAppointment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Name *
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientName ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient name"
                                />
                                {formErrors.patientName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientName}</p>
                                )}
                            </div>

                            {/* Patient Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Email *
                                </label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientEmail ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient email"
                                />
                                {formErrors.patientEmail && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientEmail}</p>
                                )}
                            </div>

                            {/* Patient Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    value={formData.patientPhone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.patientPhone ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                    placeholder="Enter patient phone number"
                                />
                                {formErrors.patientPhone && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.patientPhone}</p>
                                )}
                            </div>

                            {/* Doctor Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Doctor *
                                </label>
                                <select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.doctor ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select a doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.name}>
                                            {doctor.name} - {doctor.specialty}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.doctor && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.doctor}</p>
                                )}
                            </div>

                            {/* Department (Auto-filled) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                                    placeholder="Auto-filled when doctor is selected"
                                />
                            </div>

                            {/* Appointment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Date *
                                </label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentDate ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {formErrors.appointmentDate && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentDate}</p>
                                )}
                            </div>

                            {/* Appointment Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Time *
                                </label>
                                <input
                                    type="time"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentTime ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {formErrors.appointmentTime && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentTime}</p>
                                )}
                            </div>

                            {/* Appointment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Type *
                                </label>
                                <select
                                    name="appointmentType"
                                    value={formData.appointmentType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.appointmentType ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select appointment type</option>
                                    {appointmentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {formErrors.appointmentType && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.appointmentType}</p>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {priorityOptions.map(priority => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes) *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                        formErrors.duration ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                >
                                    <option value="">Select duration</option>
                                    {durationOptions.map(duration => (
                                        <option key={duration} value={duration}>{duration} minutes</option>
                                    ))}
                                </select>
                                {formErrors.duration && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="Enter any additional notes about the appointment..."
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeEditForm}
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-4 h-4" />
                                <span>Update Appointment</span>
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* View Appointment Form in Layout - At the top when visible */}
            {showViewFormInLayout && viewingAppointment && (
                <div className="space-y-6">
                    <Card className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white flex items-center justify-center text-xl font-semibold shadow-lg shadow-pink-200/50">
                                        {viewingAppointment.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {viewingAppointment.patient}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Booked with {viewingAppointment.doctor} · {viewingAppointment.date} at {viewingAppointment.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(viewingAppointment.type)}`}>
                                        {viewingAppointment.type}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingAppointment.status)}`}>
                                        {viewingAppointment.status}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(viewingAppointment.priority)}`}>
                                        {getPriorityIcon(viewingAppointment.priority)}
                                        <span className="ml-2">{viewingAppointment.priority}</span>
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700">
                                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                        {viewingAppointment.duration}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate(`/admin/appointments/edit/${viewingAppointment.id}`)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit appointment
                                </button>
                                <button
                                    onClick={closeViewForm}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200 shadow-lg shadow-pink-200/60"
                                >
                                    Back to list
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-pink-500" />
                                    Patient Information
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Email</span>
                                        <span className="text-gray-900">{viewingAppointment.patientEmail}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Phone</span>
                                        <span className="text-gray-900">{viewingAppointment.patientPhone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-blue-500" />
                                    Care Team
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Doctor</span>
                                        <span className="text-gray-900">{viewingAppointment.doctor}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Specialty</span>
                                        <span className="text-gray-900">{viewingAppointment.specialty}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-amber-500" />
                                    Schedule
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Date</span>
                                        <span className="text-gray-900">{viewingAppointment.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Time</span>
                                        <span className="text-gray-900">{viewingAppointment.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-purple-500" />
                                    Status Overview
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Appointment Status</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewingAppointment.status)}`}>
                                            {viewingAppointment.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-500">Priority</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(viewingAppointment.priority)}`}>
                                            {getPriorityIcon(viewingAppointment.priority)}
                                            <span className="ml-2">{viewingAppointment.priority}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {viewingAppointment.notes && (
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-yellow-500" />
                                    Notes
                                </h3>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 text-gray-700 leading-relaxed">
                                    {viewingAppointment.notes}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Breadcrumbs */}
            {!showFormInLayout && !showEditFormInLayout && !showViewFormInLayout && (
            <Breadcrumbs />
            )}

            {/* Header - Only show when form is not visible */}
            {!showFormInLayout && !showEditFormInLayout && !showViewFormInLayout && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Appointments</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage patient appointments and schedules</p>
                    <MetaChips 
                        status={`${appointmentAnalytics.pendingAppointments} Pending`}
                        id={`Total: ${appointmentAnalytics.totalAppointments}`}
                        date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        owner="Admin"
                    />
                </div>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                    <button 
                        onClick={() => navigate('/admin/appointments/add')}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Schedule Appointment</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>
            )}

            {/* Main Content Area with Loader - Only show when form is not visible */}
            {!showFormInLayout && !showEditFormInLayout && !showViewFormInLayout && (
            <div className="relative min-h-[600px]">
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Today's Appointments</p>
                                <p className="text-xl font-bold text-gray-900">{todaysAppointments}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-xl font-bold text-gray-900">{completedAppointments}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-xl font-bold text-gray-900">{pendingAppointments}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Cancelled</p>
                                <p className="text-xl font-bold text-gray-900">{cancelledAppointments}</p>
                        </div>
                    </div>
                </Card>
                    </div>

                    {/* Enhanced Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Appointment Trends Chart */}
                        <Card className="p-6 lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Appointment Trends</h3>
                                    <p className="text-sm text-gray-600">Monthly appointment and revenue trends</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">+12.5%</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {appointmentTrends.map((trend, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                            <span className="font-medium text-gray-900">{trend.month}</span>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{trend.appointments}</p>
                                                <p className="text-xs text-gray-600">Appointments</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">${trend.revenue.toLocaleString()}</p>
                                                <p className="text-xs text-gray-600">Revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Today's Schedule */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <CalendarIcon className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="space-y-3">
                                {todaysSchedule.map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                appointment.priority === 'Urgent' ? 'bg-red-500' :
                                                appointment.priority === 'High' ? 'bg-orange-500' : 'bg-green-500'
                                            }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                                                <p className="text-xs text-gray-600">{appointment.doctor}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                                            <p className="text-xs text-gray-600">{appointment.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Specialty Distribution and Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Specialty Distribution */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Specialty Distribution</h3>
                                    <p className="text-sm text-gray-600">Appointments by medical specialty</p>
                                </div>
                                <PieChart className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="space-y-3">
                                {specialtyDistribution.map((specialty, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                            <span className="text-sm font-medium text-gray-900">{specialty.specialty}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-pink-500 h-2 rounded-full" 
                                                    style={{ width: `${specialty.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-8 text-right">{specialty.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                    <p className="text-sm text-gray-600">Common appointment tasks</p>
                                </div>
                                <Zap className="w-5 h-5 text-pink-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => navigate('/admin/appointments/add')}
                                    className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-pink-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">New Appointment</span>
                                </button>
                                <button 
                                    onClick={handleSendReminders}
                                    className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Bell className="w-6 h-6 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">Send Reminders</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/reports')}
                                    className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">View Reports</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/admin/users')}
                                    className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <Users className="w-6 h-6 text-purple-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">Manage Patients</span>
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.patientSatisfaction}</p>
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
                                    <p className="text-sm text-gray-600">Average Duration</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.averageDuration}</p>
                                    <p className="text-xs text-gray-600">minutes</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ClockIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">No-Show Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointmentAnalytics.noShowRate}%</p>
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
                                    <p className="text-sm text-gray-600">Peak Hours</p>
                                    <p className="text-lg font-bold text-gray-900">{appointmentAnalytics.peakHours}</p>
                                    <p className="text-xs text-gray-600">most active</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activities */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                                <p className="text-sm text-gray-600">Latest appointment-related activities</p>
                            </div>
                            <Activity className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                                            <Icon className={`w-4 h-4 ${activity.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
            )}

            {/* Search and Filter - Only show when form is not visible */}
            {!showFormInLayout && !showEditFormInLayout && !showViewFormInLayout && (
            <Card className="p-4">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                                placeholder="Search appointments by patient, doctor, email, notes, or date..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                        
                        {/* Filter Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            >
                                <option value="">All Status</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <select
                                value={filterDoctor}
                                onChange={(e) => setFilterDoctor(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            >
                                <option value="">All Doctors</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                                ))}
                            </select>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            >
                                <option value="">All Priority</option>
                                {priorityOptions.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            >
                                <option value="">All Types</option>
                                {appointmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            
                            {/* Clear Filters Button */}
                            {(searchTerm || filterStatus || filterDoctor || filterPriority || filterType) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('');
                                        setFilterDoctor('');
                                        setFilterPriority('');
                                        setFilterType('');
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
            )}

            {/* Appointments List - Only show when form is not visible */}
            {!showFormInLayout && !showEditFormInLayout && !showViewFormInLayout && (
            <div className="space-y-4">
                    {filteredAppointments.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchTerm || filterStatus || filterDoctor || filterPriority || filterType
                                            ? 'No appointments match your current filters.'
                                            : 'No appointments have been scheduled yet.'
                                        }
                                    </p>
                                    {!searchTerm && !filterStatus && !filterDoctor && !filterPriority && !filterType && (
                                        <button
                                            onClick={() => navigate('/admin/appointments/add')}
                                            className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Schedule First Appointment</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        filteredAppointments.map((appointment) => (
                    <Card key={appointment.id} hover className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                                </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{appointment.patient}</h3>
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appointment.priority)} flex-shrink-0`}>
                                                    {getPriorityIcon(appointment.priority)}
                                                    <span className="ml-1">{appointment.priority}</span>
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{appointment.doctor} • {appointment.specialty}</p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1 min-w-0">
                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{appointment.patientEmail}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 min-w-0">
                                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{appointment.patientPhone}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                                    <span>{appointment.duration}</span>
                                                </div>
                                            </div>
                                            {appointment.notes && (
                                                <p className="text-xs text-gray-500 mt-2 italic">"{appointment.notes}"</p>
                                            )}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className="text-left sm:text-right">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900">{appointment.date}</p>
                                    <p className="text-xs sm:text-sm text-gray-600">{appointment.time}</p>
                                </div>
                                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                                        {appointment.type}
                                    </span>
                                </div>
                                        <div className="flex items-center space-x-1 flex-shrink-0">
                                            <button 
                                                onClick={() => handleViewAppointment(appointment)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200" 
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button 
                                                onClick={() => handleEditAppointment(appointment)}
                                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200" 
                                                title="Edit Appointment"
                                            >
                                                <Edit className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAppointment(appointment)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200" 
                                                title="Delete Appointment"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                        ))
                    )}
            </div>
            )}

        </div>
    );
};

export default Appointments;
