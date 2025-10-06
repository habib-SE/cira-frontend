import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Calendar, 
    FileText, 
    Clipboard,
    MessageSquare,
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Heart,
    Bot,
    LogOut,
    Stethoscope,
    UserPen,
    History,
    CreditCard 
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import loginLogo from '../../../assets/loginlogo.png';

const PatientSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patient' },
        { id: 'ai-nurse', label: 'AI Nurse', icon: Bot, path: '/patient/ai-nurse' },
        { id: ' Reports ', label: 'Reports', icon: FileText, path: '/patient/reports' },
        { id: 'ReportDetail', label: 'ReportDetail', icon: Clipboard, path: '/patient/reportsId' },
        { id: 'Book_Doctor', label: 'Book Doctor', icon: Stethoscope, path: '/patient/book-doctor' },
        { id: 'Referral_Checkout', label: 'Referral Checkout', icon: LogOut, path: '/patient/book-doctor/checkout' },
        { id: 'Profile', label: 'Profile', icon: UserPen, path: '/patient/profile' },
        { id: 'History', label: 'History', icon: History, path: '/patient/history' },
        { id: 'Subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/patient/subscriptions' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/patient/messages' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/patient/settings' },
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
                            <span className="text-sm font-medium text-pink-600">Health Status</span>
                        </div>
                        <p className="text-xs text-gray-600">All records up to date</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientSidebar;
