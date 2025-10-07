import React, { useState } from 'react';
import { 
    User, 
    Bell, 
    Shield, 
    Globe, 
    Calendar, 
    Clock, 
    Key, 
    Save, 
    Camera, 
    Mail, 
    Phone,
    Video,
    MapPin,
    Settings,
    ToggleLeft,
    ToggleRight,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Clock3,
    Monitor,
    Smartphone
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorSettings = () => {
    const [activeTab, setActiveTab] = useState('availability');
    const [settings, setSettings] = useState({
        // Availability Settings
        availability: {
            monday: { start: '09:00', end: '17:00', available: true, breaks: [{ start: '12:00', end: '13:00' }] },
            tuesday: { start: '09:00', end: '17:00', available: true, breaks: [{ start: '12:00', end: '13:00' }] },
            wednesday: { start: '09:00', end: '17:00', available: true, breaks: [{ start: '12:00', end: '13:00' }] },
            thursday: { start: '09:00', end: '17:00', available: true, breaks: [{ start: '12:00', end: '13:00' }] },
            friday: { start: '09:00', end: '17:00', available: true, breaks: [{ start: '12:00', end: '13:00' }] },
            saturday: { start: '10:00', end: '14:00', available: false, breaks: [] },
            sunday: { start: '10:00', end: '14:00', available: false, breaks: [] }
        },
        
        // Consultation Modes
        consultationModes: {
            teleconsultation: true,
            clinic: true,
            hybrid: false
        },
        
        // Notification Settings
        notifications: {
            email: {
                newAppointments: true,
                appointmentReminders: true,
                aiReports: true,
                earnings: true,
                systemUpdates: false
            },
            push: {
                newAppointments: true,
                appointmentReminders: true,
                aiReports: true,
                earnings: false,
                systemUpdates: true
            },
            sms: {
                urgentAppointments: true,
                emergencyAlerts: true,
                systemMaintenance: false
            }
        },
        
        // Practice Settings
        practice: {
            consultationDuration: 30,
            followUpDuration: 20,
            emergencyDuration: 45,
            bufferTime: 10,
            maxPatientsPerDay: 20,
            advanceBookingDays: 30,
            cancellationPolicy: '24 hours',
            autoConfirmAppointments: false
        },
        
        // Fees
        fees: {
            consultation: 150,
            followUp: 100,
            emergency: 250,
            teleconsultation: 120,
            weekendSurcharge: 25,
            holidaySurcharge: 50
        },
        
        // Profile
        profile: {
            firstName: 'Dr. Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@clinic.com',
            phone: '+1 (555) 123-4567',
            specialty: 'Cardiology',
            bio: 'Board-certified cardiologist with 8 years of experience',
            languages: ['English', 'Spanish'],
            timezone: 'America/New_York'
        }
    });

    const tabs = [
        { id: 'availability', label: 'Availability', icon: Calendar, description: 'Set your working hours and breaks' },
        { id: 'modes', label: 'Consultation Modes', icon: Video, description: 'Tele/clinic mode preferences' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, push, and SMS settings' },
        { id: 'practice', label: 'Practice Settings', icon: Settings, description: 'Appointment and practice preferences' },
        { id: 'fees', label: 'Fees & Pricing', icon: DollarSign, description: 'Service pricing and surcharges' },
        { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and preferences' },
        { id: 'security', label: 'Security', icon: Shield, description: 'Password and security settings' }
    ];

    const handleAvailabilityChange = (day, field, value) => {
        setSettings(prev => ({
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

    const handleModeChange = (mode, enabled) => {
        setSettings(prev => ({
            ...prev,
            consultationModes: {
                ...prev.consultationModes,
                [mode]: enabled
            }
        }));
    };

    const handleNotificationChange = (category, type, enabled) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [category]: {
                    ...prev.notifications[category],
                    [type]: enabled
                }
            }
        }));
    };

    const handlePracticeChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            practice: {
                ...prev.practice,
                [field]: value
            }
        }));
    };

    const handleFeeChange = (fee, value) => {
        setSettings(prev => ({
            ...prev,
            fees: {
                ...prev.fees,
                [fee]: value
            }
        }));
    };

    const handleProfileChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value
            }
        }));
    };

    const renderAvailabilitySettings = () => (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Weekly Availability</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Set your working hours for each day of the week</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {Object.entries(settings.availability).map(([day, schedule]) => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl gap-3">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-20 sm:w-24 text-xs sm:text-sm font-medium text-gray-900 capitalize flex-shrink-0">
                                {day}
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={schedule.available}
                                    onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                />
                                <span className="text-xs sm:text-sm text-gray-700">Available</span>
                            </label>
                        </div>
                        
                        {schedule.available && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pl-24 sm:pl-0">
                                <div className="flex items-center space-x-2 flex-wrap">
                                    <Clock className="w-4 h-4 text-gray-400 hidden sm:block flex-shrink-0" />
                                    <input
                                        type="time"
                                        value={schedule.start}
                                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                                        className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 flex-shrink-0"
                                    />
                                    <span className="text-gray-500 text-xs sm:text-sm">to</span>
                                    <input
                                        type="time"
                                        value={schedule.end}
                                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                                        className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 flex-shrink-0"
                                    />
                                </div>
                                <button className="text-xs sm:text-sm text-pink-600 hover:text-pink-700 whitespace-nowrap text-left sm:text-center">
                                    Add Break
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Quick Settings</h4>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 text-left sm:text-center whitespace-nowrap">
                        Set Weekdays (9 AM - 5 PM)
                    </button>
                    <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 text-left sm:text-center whitespace-nowrap">
                        Set Weekends (10 AM - 2 PM)
                    </button>
                    <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 text-left sm:text-center">
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );

    const renderConsultationModes = () => (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Consultation Modes</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Choose which consultation modes you want to offer</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl gap-3">
                    <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Teleconsultation</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Video consultations from anywhere</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={settings.consultationModes.teleconsultation}
                            onChange={(e) => handleModeChange('teleconsultation', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl gap-3">
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Clinic Visits</h4>
                            <p className="text-xs sm:text-sm text-gray-600">In-person consultations at your clinic</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={settings.consultationModes.clinic}
                            onChange={(e) => handleModeChange('clinic', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-xl gap-3">
                    <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Hybrid Mode</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Both teleconsultation and clinic visits</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={settings.consultationModes.hybrid}
                            onChange={(e) => handleModeChange('hybrid', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <p className="text-gray-600 mb-6">Choose how you want to be notified about different events</p>
            </div>

            <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Mail className="w-5 h-5" />
                        <span>Email Notifications</span>
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(settings.notifications.email).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Push Notifications */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Push Notifications</span>
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(settings.notifications.push).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SMS Notifications */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Smartphone className="w-5 h-5" />
                        <span>SMS Notifications</span>
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(settings.notifications.sms).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => handleNotificationChange('sms', key, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPracticeSettings = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Settings</h3>
                <p className="text-gray-600 mb-6">Configure your practice preferences and policies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Duration (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.practice.consultationDuration}
                        onChange={(e) => handlePracticeChange('consultationDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follow-up Duration (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.practice.followUpDuration}
                        onChange={(e) => handlePracticeChange('followUpDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Duration (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.practice.emergencyDuration}
                        onChange={(e) => handlePracticeChange('emergencyDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer Time (minutes)
                    </label>
                    <input
                        type="number"
                        value={settings.practice.bufferTime}
                        onChange={(e) => handlePracticeChange('bufferTime', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Patients Per Day
                    </label>
                    <input
                        type="number"
                        value={settings.practice.maxPatientsPerDay}
                        onChange={(e) => handlePracticeChange('maxPatientsPerDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advance Booking (days)
                    </label>
                    <input
                        type="number"
                        value={settings.practice.advanceBookingDays}
                        onChange={(e) => handlePracticeChange('advanceBookingDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Policy
                    </label>
                    <select
                        value={settings.practice.cancellationPolicy}
                        onChange={(e) => handlePracticeChange('cancellationPolicy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="24 hours">24 hours</option>
                        <option value="48 hours">48 hours</option>
                        <option value="72 hours">72 hours</option>
                        <option value="1 week">1 week</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={settings.practice.autoConfirmAppointments}
                        onChange={(e) => handlePracticeChange('autoConfirmAppointments', e.target.checked)}
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <label className="text-sm text-gray-700">Auto-confirm appointments</label>
                </div>
            </div>
        </div>
    );

    const renderFees = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Fees</h3>
                <p className="text-gray-600 mb-6">Set your consultation and service pricing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(settings.fees).map(([fee, value]) => (
                    <div key={fee}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {fee.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => handleFeeChange(fee, parseFloat(e.target.value))}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <p className="text-gray-600 mb-6">Update your personal and professional information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                        type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="tel"
                            value={settings.profile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <input
                        type="text"
                        value={settings.profile.specialty}
                        onChange={(e) => handleProfileChange('specialty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                        value={settings.profile.timezone}
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <p className="text-gray-600 mb-6">Manage your password and security preferences</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter current password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter new password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Confirm new password"
                    />
                </div>

                <button className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
                    Update Password
                </button>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'availability':
                return renderAvailabilitySettings();
            case 'modes':
                return renderConsultationModes();
            case 'notifications':
                return renderNotifications();
            case 'practice':
                return renderPracticeSettings();
            case 'fees':
                return renderFees();
            case 'profile':
                return renderProfile();
            case 'security':
                return renderSecurity();
            default:
                return null;
        }
    };

    return (
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Settings</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage your practice settings and preferences</p>
                </div>
                <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm sm:text-base whitespace-nowrap">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Settings Navigation */}
                <Card className="p-0 lg:col-span-1">
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Settings</h3>
                    </div>
                    <nav className="p-2">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-start space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-3 rounded-xl transition-all duration-200 text-left ${
                                        activeTab === tab.id
                                            ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <span className="font-medium text-xs lg:text-sm truncate block">{tab.label}</span>
                                        <p className="text-xs text-gray-500 mt-1 hidden lg:block">{tab.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                        </div>
                    </nav>
                </Card>

                {/* Settings Content */}
                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                    <Card className="p-4 sm:p-6">
                        {renderTabContent()}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DoctorSettings;

                                    <input

                                        type="checkbox"

                                        checked={value}

                                        onChange={(e) => handleNotificationChange('sms', key, e.target.checked)}

                                        className="sr-only peer"

                                    />

                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                </label>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );



    const renderPracticeSettings = () => (

        <div className="space-y-6">

                                    <div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Settings</h3>

                <p className="text-gray-600 mb-6">Configure your practice preferences and policies</p>

                                    </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Consultation Duration (minutes)

                    </label>

                    <input

                        type="number"

                        value={settings.practice.consultationDuration}

                        onChange={(e) => handlePracticeChange('consultationDuration', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Follow-up Duration (minutes)

                    </label>

                    <input

                        type="number"

                        value={settings.practice.followUpDuration}

                        onChange={(e) => handlePracticeChange('followUpDuration', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Emergency Duration (minutes)

                    </label>

                    <input

                        type="number"

                        value={settings.practice.emergencyDuration}

                        onChange={(e) => handlePracticeChange('emergencyDuration', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Buffer Time (minutes)

                    </label>

                    <input

                        type="number"

                        value={settings.practice.bufferTime}

                        onChange={(e) => handlePracticeChange('bufferTime', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Max Patients Per Day

                    </label>

                    <input

                        type="number"

                        value={settings.practice.maxPatientsPerDay}

                        onChange={(e) => handlePracticeChange('maxPatientsPerDay', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Advance Booking (days)

                    </label>

                    <input

                        type="number"

                        value={settings.practice.advanceBookingDays}

                        onChange={(e) => handlePracticeChange('advanceBookingDays', parseInt(e.target.value))}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Cancellation Policy

                    </label>

                    <select

                        value={settings.practice.cancellationPolicy}

                        onChange={(e) => handlePracticeChange('cancellationPolicy', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    >

                        <option value="24 hours">24 hours</option>

                        <option value="48 hours">48 hours</option>

                        <option value="72 hours">72 hours</option>

                        <option value="1 week">1 week</option>

                    </select>

                </div>



                <div className="flex items-center space-x-2">

                    <input

                        type="checkbox"

                        checked={settings.practice.autoConfirmAppointments}

                        onChange={(e) => handlePracticeChange('autoConfirmAppointments', e.target.checked)}

                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"

                    />

                    <label className="text-sm text-gray-700">Auto-confirm appointments</label>

                </div>

            </div>

        </div>

    );



    const renderFees = () => (

        <div className="space-y-6">

            <div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Fees</h3>

                <p className="text-gray-600 mb-6">Set your consultation and service pricing</p>

            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {Object.entries(settings.fees).map(([fee, value]) => (

                    <div key={fee}>

                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">

                            {fee.replace(/([A-Z])/g, ' $1').trim()}

                        </label>

                        <div className="relative">

                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input

                                type="number"

                                value={value}

                                onChange={(e) => handleFeeChange(fee, parseFloat(e.target.value))}

                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                            />

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );



    const renderProfile = () => (

        <div className="space-y-6">

            <div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

                <p className="text-gray-600 mb-6">Update your personal and professional information</p>

            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>

                    <input

                        type="text"

                        value={settings.profile.firstName}

                        onChange={(e) => handleProfileChange('firstName', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>

                    <input

                        type="text"

                        value={settings.profile.lastName}

                        onChange={(e) => handleProfileChange('lastName', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>

                    <div className="relative">

                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input

                            type="email"

                            value={settings.profile.email}

                            onChange={(e) => handleProfileChange('email', e.target.value)}

                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                        />

                    </div>

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>

                    <div className="relative">

                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input

                            type="tel"

                            value={settings.profile.phone}

                            onChange={(e) => handleProfileChange('phone', e.target.value)}

                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                        />

                    </div>

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>

                    <input

                        type="text"

                        value={settings.profile.specialty}

                        onChange={(e) => handleProfileChange('specialty', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>

                    <select

                        value={settings.profile.timezone}

                        onChange={(e) => handleProfileChange('timezone', e.target.value)}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    >

                        <option value="America/New_York">Eastern Time</option>

                        <option value="America/Chicago">Central Time</option>

                        <option value="America/Denver">Mountain Time</option>

                        <option value="America/Los_Angeles">Pacific Time</option>

                    </select>

                </div>



                <div className="md:col-span-2">

                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>

                    <textarea

                        value={settings.profile.bio}

                        onChange={(e) => handleProfileChange('bio', e.target.value)}

                        rows={4}

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                    />

                </div>

            </div>

        </div>

    );



    const renderSecurity = () => (

        <div className="space-y-6">

            <div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>

                <p className="text-gray-600 mb-6">Manage your password and security preferences</p>

            </div>



            <div className="space-y-4">

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>

                    <input

                        type="password"

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                        placeholder="Enter current password"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>

                    <input

                        type="password"

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                        placeholder="Enter new password"

                    />

                </div>



                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>

                    <input

                        type="password"

                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"

                        placeholder="Confirm new password"

                    />

                </div>



                <button className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">

                    Update Password

                                </button>

            </div>

        </div>

    );



    const renderTabContent = () => {

        switch (activeTab) {

            case 'availability':

                return renderAvailabilitySettings();

            case 'modes':

                return renderConsultationModes();

            case 'notifications':

                return renderNotifications();

            case 'practice':

                return renderPracticeSettings();

            case 'fees':

                return renderFees();

            case 'profile':

                return renderProfile();

            case 'security':

                return renderSecurity();

            default:

                return null;

        }

    };



    return (

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Settings</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage your practice settings and preferences</p>
                </div>

                <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-sm sm:text-base whitespace-nowrap">
                    <Save className="w-4 h-4" />

                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                </button>

            </div>



            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Settings Navigation */}

                <Card className="p-0 lg:col-span-1">
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Settings</h3>
                    </div>

                    <nav className="p-2">

                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                        {tabs.map((tab) => {

                            const Icon = tab.icon;

                            return (

                                <button

                                    key={tab.id}

                                    onClick={() => setActiveTab(tab.id)}

                                    className={`flex items-start space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-3 rounded-xl transition-all duration-200 text-left ${
                                        activeTab === tab.id

                                            ? 'bg-pink-50 text-pink-600 border border-pink-200'

                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'

                                    }`}

                                >

                                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <span className="font-medium text-xs lg:text-sm truncate block">{tab.label}</span>
                                        <p className="text-xs text-gray-500 mt-1 hidden lg:block">{tab.description}</p>
                                    </div>

                                </button>

                            );

                        })}

                        </div>
                    </nav>

                </Card>



                {/* Settings Content */}

                <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                    <Card className="p-4 sm:p-6">
                        {renderTabContent()}

                    </Card>

                </div>

            </div>

        </div>

    );

};



export default DoctorSettings;


