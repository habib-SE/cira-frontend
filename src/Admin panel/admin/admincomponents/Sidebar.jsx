import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Users, 
    Calendar, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Stethoscope,
    FileText,
    CreditCard,
    TrendingUp,
    User
} from 'lucide-react';
import logo from '../../../assets/Logo.png';
import loginLogo from '../../../assets/LoginLogo.png';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
        { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
        { id: 'doctor-profile', label: 'Doctor Profile Detail', icon: User, path: '/admin/doctor-profile' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
        { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
        { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
        { id: 'referrals', label: 'Referrals', icon: TrendingUp, path: '/admin/referrals' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 h-screen flex flex-col overflow-hidden ${
            isCollapsed ? 'w-20' : 'w-64'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
                {!isCollapsed ? (
                    <div className="flex items-center">
                        <img 
                            src={logo} 
                            alt="Doctor AI Logo" 
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
                            alt="Doctor AI Login Logo" 
                            className="w-20 h-13 object-contain"
                        />
                    </button>
                )}
                {!isCollapsed && (
                    <button
                        onClick={toggleCollapse}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}
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
                            }`}
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
                            <span className="text-sm font-medium text-pink-600">AI Status</span>
                        </div>
                        <p className="text-xs text-gray-600">All systems operational</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
