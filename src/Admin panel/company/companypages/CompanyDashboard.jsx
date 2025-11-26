import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  TrendingUp,
  Calendar,
  CreditCard,
  Settings,
  RefreshCw,
  Download,
  Plus,
  Stethoscope
} from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshContent = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addUser':
        navigate('/company/users/create');
        break;
      case 'billing':
        navigate('/company/billing');
        break;
      case 'settings':
        navigate('/company/settings');
        break;
      default:
        break;
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      totalInteractions: 1247,
      totalConsultations: 89,
      vitalsScans: 456,
      scenariosHandled: 234,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `company-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Mock data - replace with actual API calls
  const kpis = [
    {
      title: 'Total Interactions',
      value: '1,247',
      description: 'All AI or chat sessions initiated by company users',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Consultations',
      value: '89',
      description: 'Number of doctor consultations by company users',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Vitals Scans',
      value: '456',
      description: 'Count of total health or vitals scans performed under the company',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      title: 'Health Cases Analyzed',
      value: '234',
      description: 'Unique health cases analyzed by the AI',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', status: 'Suspended' },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your organization's health services and employee wellness</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={handleExportData}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 sm:gap-2 transition-colors text-xs sm:text-sm"
            title="Export Data"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={handleRefreshContent}
            disabled={isRefreshing}
            className="px-3 sm:px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50 text-xs sm:text-sm"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            <span className="sm:hidden">{isRefreshing ? '...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-3">
          • Quick actions:
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/company/appointments/new')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-xs sm:text-sm"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">New Appointment</span>
          </button>
          <button
            onClick={() => navigate('/company/users/new')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-xs sm:text-sm"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">New User</span>
          </button>
          <button
            onClick={() => navigate('/company/billing')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium text-xs sm:text-sm"
          >
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Billing</span>
          </button>
        </div>
        <div className="mt-3 text-[10px] sm:text-xs text-gray-400">
          (Company)
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{kpi.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${kpi.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2 line-clamp-2">{kpi.description}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Users</h3>
            <p className="text-xs sm:text-sm text-gray-600">Employee usage stats and subscription status</p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.department}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => navigate('/company/users')}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                View all users →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-xs sm:text-sm text-gray-600">Common administrative tasks</p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button 
                onClick={() => handleQuickAction('addUser')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add User</p>
              </button>
              <button 
                onClick={() => handleQuickAction('billing')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Billing</p>
              </button>
              <button 
                onClick={() => handleQuickAction('settings')}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6 text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Settings</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
