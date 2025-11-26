import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Menu, X, Search, Settings, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import ConsentIndicator from '../../components/shared/ConsentIndicator';

const UnifiedNavbar = ({ 
  onMenuClick, 
  isMobileMenuOpen, 
  portalType = "admin", // "admin" | "doctor" | "patient"
  showSearch = false,
  className = ""
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNotification, setNewNotification] = useState({ title: '', type: 'info' });
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    // Navigate to profile page for each portal
    if (portalType === 'admin') {
      navigate('/admin/settings');
    } else if (portalType === 'company') {
      navigate('/company/profile');
    } else if (portalType === 'doctor') {
      navigate('/doctor/profile');
    } else if (portalType === 'user') {
      navigate('/user/profile');
    }
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // For admin portal, search across different sections
    if (portalType === 'admin') {
      // Try to find matches in different sections
      const searchLower = searchTerm.toLowerCase();
      
      // Check if it looks like an email
      if (searchLower.includes('@')) {
        navigate(`/admin/users?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if it's a status
      if (['active', 'suspended', 'pending', 'inactive'].includes(searchLower)) {
        navigate(`/admin/users?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if it contains doctor-related terms or starts with "dr."
      if (searchLower.includes('dr.') || 
          searchLower.includes('doctor') || 
          searchLower.includes('physician') ||
          searchLower.startsWith('dr ')) {
        navigate(`/admin/doctors?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check for medical specialties (likely doctors)
      const specialties = ['cardiology', 'neurology', 'dermatology', 'orthopedics', 'pediatrics', 'gynecology', 'psychiatry', 'radiology', 'anesthesiology', 'emergency'];
      if (specialties.some(specialty => searchLower.includes(specialty))) {
        navigate(`/admin/doctors?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check for actual doctor names from the system
      const doctorNames = ['sarah', 'michael', 'micheal', 'emily', 'david', 'lisa', 'johnson', 'chen', 'rodriguez', 'kim', 'wang'];
      if (doctorNames.some(name => searchLower.includes(name))) {
        navigate(`/admin/doctors?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if it contains appointment-related terms
      if (searchLower.includes('appointment') || searchLower.includes('schedule') || searchLower.includes('booking')) {
        navigate(`/admin/appointments?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if it contains report-related terms
      if (searchLower.includes('report') || searchLower.includes('health') || searchLower.includes('assessment')) {
        navigate(`/admin/reports?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if it contains payment-related terms
      if (searchLower.includes('payment') || searchLower.includes('billing') || searchLower.includes('invoice')) {
        navigate(`/admin/payments?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if user explicitly wants to search doctors
      if (searchLower.includes('find doctor') || searchLower.includes('search doctor') || searchLower.includes('doctor search')) {
        navigate(`/admin/doctors?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Check if user explicitly wants to search patients
      if (searchLower.includes('find patient') || searchLower.includes('search patient') || searchLower.includes('patient search')) {
        navigate(`/admin/users?search=${encodeURIComponent(searchTerm)}`);
        setSearchTerm('');
        return;
      }
      
      // Default to users page for general search (patients)
      navigate(`/admin/users?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    } else if (portalType === 'doctor') {
      // For doctor portal
      navigate('/doctor/appointments');
      setSearchTerm('');
    } else if (portalType === 'user') {
      // For patient portal
      navigate('/user/my-doctors');
      setSearchTerm('');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Load notifications from localStorage or use defaults
  const loadNotifications = () => {
    const storageKey = `notifications_${portalType}_${user?.id || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultNotifications();
      }
    }
    return getDefaultNotifications();
  };

  // Default notifications based on role
  const getDefaultNotifications = () => {
    switch (portalType) {
      case 'admin':
        return [
          { id: 1, title: 'New patient registered', time: '2 min ago', type: 'info', read: false, createdAt: Date.now() - 120000 },
          { id: 2, title: 'AI report generated', time: '5 min ago', type: 'success', read: false, createdAt: Date.now() - 300000 },
          { id: 3, title: 'Appointment reminder', time: '10 min ago', type: 'warning', read: false, createdAt: Date.now() - 600000 },
        ];
      case 'doctor':
        return [
          { id: 1, title: 'New appointment request', time: '5 min ago', type: 'info', read: false, createdAt: Date.now() - 300000 },
          { id: 2, title: 'Patient lab results ready', time: '1 hour ago', type: 'success', read: false, createdAt: Date.now() - 3600000 },
          { id: 3, title: 'Appointment starting soon', time: '2 hours', type: 'warning', read: false, createdAt: Date.now() - 7200000 },
        ];
      case 'user':
        return [
          { id: 1, title: 'Appointment confirmed', time: '1 hour ago', type: 'success', read: false, createdAt: Date.now() - 3600000 },
          { id: 2, title: 'Prescription ready', time: '3 hours ago', type: 'info', read: false, createdAt: Date.now() - 10800000 },
          { id: 3, title: 'Health report available', time: '1 day ago', type: 'success', read: false, createdAt: Date.now() - 86400000 },
        ];
      default:
        return [];
    }
  };

  const [notifications, setNotifications] = useState(() => loadNotifications());

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const storageKey = `notifications_${portalType}_${user?.id || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, portalType, user?.id]);

  // Portal-specific configurations
  const getPortalConfig = () => {
    switch (portalType) {
      case 'admin':
        return {
          userMenu: [],
          displayName: 'Admin User',
          showMobileMenu: true,
          padding: 'px-4 py-3'
        };
      case 'doctor':
        return {
          userMenu: [],
          displayName: 'Doctor',
          showMobileMenu: true,
          padding: 'px-3 sm:px-4 py-2 sm:py-3'
        };
      case 'user':
        return {
          userMenu: [
            { label: 'Profile', icon: User, onClick: () => console.log('Profile clicked') },
            { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
          ],
          displayName: 'user',
          showMobileMenu: true, // Show mobile menu toggle button
          padding: 'px-6 py-3'
        };
      default:
        return {
          userMenu: [],
          displayName: 'User',
          showMobileMenu: true,
          padding: 'px-4 py-3'
        };
    }
  };

  const config = getPortalConfig();

  // Add new notification
  const handleAddNotification = () => {
    if (!newNotification.title.trim()) return;

    const notification = {
      id: Date.now(),
      title: newNotification.title,
      type: newNotification.type,
      time: 'Just now',
      read: false,
      createdAt: Date.now()
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', type: 'info' });
    setShowAddNotification(false);
  };

  // Delete notification
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Mark notification as read
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
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
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder={`Search ${portalType === 'admin' ? 'people, doctors' : portalType === 'doctor' ? 'patients, appointments...' : 'doctors, appointments...'}`}
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64"
              />
            </form>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Consent/Privacy Indicator */}
          <ConsentIndicator />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {isNotificationOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        title="Mark all as read"
                      >
                        Mark all read
                      </button>
                    )}
                    {portalType === 'admin' && (
                      <button
                        onClick={() => setShowAddNotification(!showAddNotification)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Add notification"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Add Notification Form - Only for Admin */}
                {portalType === 'admin' && showAddNotification && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Notification title..."
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNotification();
                          }
                        }}
                      />
                      <div className="flex items-center space-x-2">
                        <select
                          value={newNotification.type}
                          onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="info">Info</option>
                          <option value="success">Success</option>
                          <option value="warning">Warning</option>
                          <option value="error">Error</option>
                        </select>
                        <button
                          onClick={handleAddNotification}
                          className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddNotification(false);
                            setNewNotification({ title: '', type: 'info' });
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationIcon(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            )}
                            {portalType === 'admin' && (
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-gray-600 hover:text-red-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer - Only for Admin */}
                {portalType === 'admin' && notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => {
                        setNotifications([]);
                        setIsNotificationOpen(false);
                      }}
                      className="w-full text-xs text-red-600 hover:text-red-800 font-medium text-center"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative" ref={profileRef}>
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
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
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
