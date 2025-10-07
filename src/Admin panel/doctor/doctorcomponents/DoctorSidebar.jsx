import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Calendar, 
    Settings,
    User,
    ChevronLeft, 
    ChevronRight,
    DollarSign,
    FileText,
    LogIn
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import loginLogo from '../../../assets/loginlogo.png';

const DoctorSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'login', label: 'Login/Registration', icon: LogIn, path: '/doctor/login' },
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/doctor' },
        { id: 'profile', label: 'Profile Wizard', icon: User, path: '/doctor/profile' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
        { id: 'appointment-detail', label: 'Appointment Detail', icon: FileText, path: '/doctor/appointment-detail' },
        { id: 'earnings', label: 'Earnings', icon: DollarSign, path: '/doctor/earnings' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/doctor/settings' },
        { id: 'my-profile', label: 'My Profile', icon: User, path: '/doctor/my-profile' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col  ${
            isCollapsed ? 'w-20' : 'w-64'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0 relative">
                {!isCollapsed ? (
                    <div className="flex items-center">
                        <img 
                            src={logo} 
                            alt="CIRA Logo" 
                            className="w-20 h-13 object-contain"
                        />
                    </div>
                ) : (
                    <button 
                        onClick={toggleCollapse}
                        className="flex justify-center w-full p-0 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <img 
                            src={loginLogo} 
                            alt="CIRA Login Logo" 
                            className="w-20 h-13 object-contain"
                        />
                    </button>
                )}
                {/* Floating edge toggle button */}
                <button
                    onClick={toggleCollapse}
                    className={`flex absolute top-1/2 -translate-y-1/2  w-6 h-6 rounded-full bg-pink-600 text-white shadow-lg items-center justify-center hover:bg-pink-700 transition-colors duration-200 z-50 ${isCollapsed ? 'right-[-12px]' : 'right-[-12px]'}`}
                    aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar '}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } ${!isCollapsed ? 'justify-left' : 'justify-center'}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="font-medium text-sm truncate">{item.label}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 flex-shrink-0 bg-white">
                    <div className="bg-pink-50 rounded-xl p-3 border border-pink-200">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-pink-600">Doctor Status</span>
                        </div>
                        <p className="text-xs text-gray-600">All systems operational</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSidebar;
