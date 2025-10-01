import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Calendar, 
    Users,
    Clipboard,
    FileText,
    BarChart3,
    MessageSquare,
    Settings, 
    ChevronLeft, 
    ChevronRight
} from 'lucide-react';
import logo from '../../assets/Logo.png';

const DoctorSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/doctor' },
        { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/doctor/schedule' },
        { id: 'patients', label: 'My Patients', icon: Users, path: '/doctor/patients' },
        { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
        { id: 'prescriptions', label: 'Prescriptions', icon: Clipboard, path: '/doctor/prescriptions' },
        { id: 'records', label: 'Medical Records', icon: FileText, path: '/doctor/records' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/doctor/analytics' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/doctor/messages' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/doctor/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`bg-white border-r-2 border-gray-200 transition-all duration-300 h-screen flex flex-col overflow-hidden ${
            isCollapsed ? 'w-18' : 'w-64'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
                {!isCollapsed ? (
                    <div className="flex items-center">
                        <img 
                            src={logo} 
                            alt="CIRA Logo" 
                            className="w-20 h-16 object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex justify-center w-full">
                        <img 
                            src={logo} 
                            alt="CIRA Logo" 
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
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
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-pink-50 text-pink-600 border border-pink-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {!isCollapsed && (
                                <span className="font-medium">{item.label}</span>
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
                            <span className="text-sm font-medium text-pink-600">Practice Status</span>
                        </div>
                        <p className="text-xs text-gray-600">All systems operational</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorSidebar;
