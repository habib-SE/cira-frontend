import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ onMenuClick, isMobileMenuOpen }) => {
    const { logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleSignOut = () => {
        logout();
    };

    const notifications = [
        { id: 1, title: 'New patient registered', time: '2 min ago', type: 'info' },
        { id: 2, title: 'AI report generated', time: '5 min ago', type: 'success' },
        { id: 3, title: 'Appointment reminder', time: '10 min ago', type: 'warning' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
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

                    {/* Search bar */}
                    {/* <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients, doctors, reports..."
                            className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                        />
                    </div> */}
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    {/* <div className="relative">
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
                        </button> */}

                        {/* Notification dropdown */}
                        {/* {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                                    notification.type === 'success' ? 'bg-green-500' :
                                                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                                }`}></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
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
                        )} */}
                    {/* </div> */}

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
                                <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                        </button>

                        {/* Profile dropdown menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                                <div className="p-2">
                                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <hr className="my-2" />
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
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

export default Navbar;
