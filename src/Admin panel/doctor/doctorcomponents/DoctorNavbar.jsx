import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Search, Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';

const DoctorNavbar = ({ onMenuClick, isMobileMenuOpen }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleSignOut = () => {
        logout();
    };

    const notifications = [
        { id: 1, title: 'New appointment request', time: '5 min ago', type: 'info' },
        { id: 2, title: 'Patient lab results ready', time: '1 hour ago', type: 'success' },
        { id: 3, title: 'Appointment starting soon', time: '2 hours', type: 'warning' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notification dropdown */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                <div className="p-3 sm:p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                                </div>
                                <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                                    notification.type === 'success' ? 'bg-green-500' :
                                                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200">
                                    <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Dr. Smith'}</p>
                                <p className="text-xs text-gray-500">Doctor</p>
                            </div>
                        </button>

                        {/* Profile dropdown menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                <div className="p-2">
                                    <button 
                                        onClick={() => {
                                            navigate('/doctor/settings');
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    >
                                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <hr className="my-2" />
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full flex items-center space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    >
                                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorNavbar;

