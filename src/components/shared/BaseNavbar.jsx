import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Settings, LogOut, Menu, X, Search } from 'lucide-react';

const BaseNavbar = ({ 
  onMenuClick, 
  isMobileMenuOpen, 
  userRole = "user",
  showSearch = false,
  customNotifications = [],
  customUserMenu = [],
  className = ""
}) => {
  const { logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSignOut = () => {
    logout();
  };

  // Default notifications based on role
  const getDefaultNotifications = () => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 1, title: 'New patient registered', time: '2 min ago', type: 'info' },
          { id: 2, title: 'AI report generated', time: '5 min ago', type: 'success' },
          { id: 3, title: 'Appointment reminder', time: '10 min ago', type: 'warning' },
        ];
      case 'doctor':
        return [
          { id: 1, title: 'New appointment request', time: '5 min ago', type: 'info' },
          { id: 2, title: 'Patient lab results ready', time: '1 hour ago', type: 'success' },
          { id: 3, title: 'Appointment starting soon', time: '2 hours', type: 'warning' },
        ];
      case 'patient':
        return [
          { id: 1, title: 'Appointment confirmed', time: '1 hour ago', type: 'success' },
          { id: 2, title: 'Prescription ready', time: '3 hours ago', type: 'info' },
          { id: 3, title: 'Health report available', time: '1 day ago', type: 'success' },
        ];
      default:
        return [];
    }
  };

  const notifications = customNotifications.length > 0 ? customNotifications : getDefaultNotifications();

  // Default user menu based on role
  const getDefaultUserMenu = () => {
    const baseMenu = [
      { label: 'Profile', icon: User, onClick: () => console.log('Profile clicked') },
      { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
    ];
    
    if (customUserMenu.length > 0) {
      return customUserMenu;
    }
    
    return baseMenu;
  };

  const userMenu = getDefaultUserMenu();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin User';
      case 'doctor':
        return 'Doctor';
      case 'patient':
        return 'Patient';
      default:
        return 'User';
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Search bar (if enabled) */}
          {showSearch && (
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {isNotificationOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationIcon(notification.type)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName()}</p>
              </div>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {userMenu.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
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

export default BaseNavbar;

