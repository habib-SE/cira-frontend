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
  User,
  DollarSign,
  LogIn,
  Clipboard,
  MessageSquare,
  Heart,
  Bot,
  LogOut,
  UserPen,
  History
} from 'lucide-react';
import logo from '../../assets/logo.png';
import loginLogo from '../../assets/loginlogo.png';

const UnifiedSidebar = ({ 
  isCollapsed, 
  setIsCollapsed, 
  portalType = "admin" // "admin" | "doctor" | "patient"
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Portal-specific menu configurations
  const getMenuItems = () => {
    switch (portalType) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
          { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
          { id: 'doctors', label: 'Doctors', icon: Stethoscope, path: '/admin/doctors' },
          { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/admin/appointments' },
          { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports' },
          { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
          { id: 'plans', label: 'Subscriptions', icon: CreditCard, path: '/admin/plans' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
          { id: 'referrals', label: 'Referrals', icon: TrendingUp, path: '/admin/referrals' },
        ];
      case 'doctor':
        return [
          { id: 'login', label: 'Login/Registration', icon: LogIn, path: '/doctor/login' },
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/doctor' },
          { id: 'profile', label: 'Profile Wizard', icon: User, path: '/doctor/profile' },
          { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
          // { id: 'appointment-detail', label: 'Appointment Detail', icon: FileText, path: '/doctor/appointment-detail' },
          { id: 'patient-reports', label: 'Patient Reports', icon: Clipboard, path: '/doctor/patient-reports' },
          { id: 'earnings', label: 'Earnings', icon: DollarSign, path: '/doctor/earnings' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/doctor/settings' },
          { id: 'my-profile', label: 'My Profile', icon: User, path: '/doctor/my-profile' },
        ];
      case 'patient':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/patient' },
          { id: 'ai-nurse', label: 'AI Nurse', icon: Bot, path: '/patient/ai' },
          { id: 'reports', label: 'Reports', icon: FileText, path: '/patient/reports' },
          { id: 'book-doctor', label: 'Book Doctor', icon: Stethoscope, path: '/patient/book-doctor' },
          { id: 'referral-checkout', label: 'Referral Checkout', icon: LogOut, path: '/patient/Referralcheckout' },
          { id: 'profile', label: 'Profile', icon: UserPen, path: '/patient/profile' },
          { id: 'history', label: 'History', icon: History, path: '/patient/history' },
          { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/patient/subscriptions' },
          { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/patient/messages' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/patient/settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    // Exact match for base paths (dashboard)
    if (location.pathname === path) {
      return true;
    }
    
    // For non-base paths, only match if it's a sub-route
    // Prevent /patient from matching /patient/something
    const basePaths = ['/admin', '/doctor', '/patient'];
    if (basePaths.includes(path)) {
      return location.pathname === path;
    }
    
    // For other paths, match if current path starts with the menu path
    return location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative overflow-hidden">
        {/* Main Logo - Shows when expanded */}
        <div 
          className="flex items-center space-x-2"
          style={{
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: !isCollapsed ? 1 : 0,
            pointerEvents: !isCollapsed ? 'auto' : 'none'
          }}
        >
          <img 
            src={logo} 
            alt="CIRA Logo" 
            className="h-11 py-1 w-auto"
          />
        </div>

        {/* Login Logo - Shows when collapsed - Fixed in center */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isCollapsed ? 1 : 0,
            pointerEvents: 'none'
          }}
        >
          <img 
            src={loginLogo} 
            alt="CIRA Logo" 
            className="h-12"
          />
        </div>

        {/* Collapse button - Shows when expanded */}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 z-10"
          style={{
            transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: !isCollapsed ? 1 : 0,
            pointerEvents: !isCollapsed ? 'auto' : 'none'
          }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Expand button - Shows when collapsed - Outside header */}
      <div 
        className="absolute top-5
         right-[-15px] z-[99999]"
        style={{
          zIndex: '99999 !important',
          position: 'absolute',
          isolation: 'isolate'
        }}
      >
        <button
          onClick={toggleCollapse}
          className="p-1 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl border border-gray-200"
          style={{
            zIndex: '99999 !important',
            position: 'relative',
            transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms ease-in-out',
            opacity: isCollapsed ? 1 : 0,
            pointerEvents: isCollapsed ? 'auto' : 'none',
            transform: 'translateZ(0)',
            willChange: 'opacity, transform'
          }}
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center text-sm font-medium rounded-lg transition-all duration-300 ease-in-out ${
                  active
                    ? 'bg-pink-50 text-pink-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingTop: '10px',
                  paddingBottom: '10px'
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 " />
                </div>
                {!isCollapsed && (
                  <span className="ml-3 truncate transition-opacity duration-300 ease-in-out whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        {!isCollapsed ? (
          <div className="text-xs text-gray-500 text-center transition-all duration-300 ease-in-out opacity-100">
            <p>© 2024 CIRA</p>
            <p>AI Healthcare Platform</p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center transition-all duration-300 ease-in-out">
            <p>© 2024</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSidebar;
