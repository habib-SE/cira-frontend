import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Settings, LogOut, Menu, X, Search } from 'lucide-react';

const UnifiedNavbar = ({ 
  onMenuClick, 
  isMobileMenuOpen, 
  portalType = "admin", // "admin" | "doctor" | "patient"
  showSearch = false,
  className = ""
}) => {
  const { logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSignOut = () => {
    logout();
  };

  // Portal-specific configurations
  const getPortalConfig = () => {
    switch (portalType) {
      case 'admin':
        return {
          notifications: [
            { id: 1, title: 'New patient registered', time: '2 min ago', type: 'info' },
            { id: 2, title: 'AI report generated', time: '5 min ago', type: 'success' },
            { id: 3, title: 'Appointment reminder', time: '10 min ago', type: 'warning' },
          ],
          userMenu: [
            { label: 'Profile', icon: User, onClick: () => console.log('Profile clicked') },
            { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
          ],
          displayName: 'Admin User',
          showMobileMenu: true,
          padding: 'px-4 py-3'
        };
      case 'doctor':
        return {
          notifications: [
            { id: 1, title: 'New appointment request', time: '5 min ago', type: 'info' },
            { id: 2, title: 'Patient lab results ready', time: '1 hour ago', type: 'success' },
            { id: 3, title: 'Appointment starting soon', time: '2 hours', type: 'warning' },
          ],
          userMenu: [
            { label: 'Profile', icon: User, onClick: () => console.log('Profile clicked') },
            { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
          ],
          displayName: 'Doctor',
          showMobileMenu: true,
          padding: 'px-3 sm:px-4 py-2 sm:py-3'
        };
      case 'patient':
        return {
          notifications: [
            { id: 1, title: 'Appointment confirmed', time: '1 hour ago', type: 'success' },
            { id: 2, title: 'Prescription ready', time: '3 hours ago', type: 'info' },
            { id: 3, title: 'Health report available', time: '1 day ago', type: 'success' },
          ],
          userMenu: [
            { label: 'Profile', icon: User, onClick: () => console.log('Profile clicked') },
            { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
          ],
          displayName: 'Patient',
          showMobileMenu: false, // Patient sidebar is persistent on mobile
          padding: 'px-4 py-3'
        };
      default:
        return {
          notifications: [],
          userMenu: [],
          displayName: 'User',
          showMobileMenu: true,
          padding: 'px-4 py-3'
        };
    }
  };

  const config = getPortalConfig();

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

  return (
    <div className={`bg-white border-b border-gray-200 ${config.padding} ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          {config.showMobileMenu && (
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
          )}

          {/* Search bar (if enabled) */}
          {showSearch && (
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${portalType === 'admin' ? 'patients, doctors, reports...' : portalType === 'doctor' ? 'patients, appointments...' : 'doctors, appointments...'}`}
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
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {config.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                  {config.notifications.length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {config.notifications.map((notification) => (
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
                <p className="text-xs text-gray-500">{config.displayName}</p>
              </div>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {config.userMenu.map((item, index) => (
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

export default UnifiedNavbar;
