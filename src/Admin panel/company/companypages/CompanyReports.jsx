import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity,
  FileText,
  BarChart3,
  RefreshCw,
  Printer
} from 'lucide-react';
import { AlertModal } from '../../../components/shared';

const CompanyReports = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    buttonText: 'OK'
  });

  // Mock data - replace with actual API calls
  const reportData = {
    overview: {
      title: 'Company Health Overview',
      metrics: [
        { label: 'Total Employees', value: '156', change: '+12%' },
        { label: 'Active Users', value: '142', change: '+8%' },
        { label: 'Health Consultations', value: '89', change: '+15%' },
        { label: 'AI Interactions', value: '1,247', change: '+23%' }
      ]
    },
    engagement: {
      title: 'Employee Engagement',
      metrics: [
        { label: 'Daily Active Users', value: '89%', change: '+5%' },
        { label: 'Weekly Active Users', value: '94%', change: '+3%' },
        { label: 'Monthly Active Users', value: '98%', change: '+2%' },
        { label: 'Feature Adoption', value: '76%', change: '+12%' }
      ]
    },
    health: {
      title: 'Health Analytics',
      metrics: [
        { label: 'Vitals Scans', value: '456', change: '+18%' },
        { label: 'Health Assessments', value: '234', change: '+25%' },
        { label: 'Doctor Consultations', value: '89', change: '+15%' },
        { label: 'AI Health Insights', value: '1,247', change: '+23%' }
      ]
    }
  };

  const showAlert = (config) => {
    setAlertModal({
      isOpen: true,
      type: config.type || 'info',
      title: config.title,
      message: config.message,
      buttonText: config.buttonText || 'OK'
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportReport = (format) => {
    const data = currentReport.metrics;
    let content, mimeType, extension;
    
    switch (format) {
      case 'pdf':
        showAlert({
          type: 'info',
          title: 'PDF Export',
          message: 'PDF export functionality will be implemented in the next update. For now, you can use the Print option to save as PDF.',
          buttonText: 'Got it'
        });
        return;
      case 'csv':
        content = [
          ['Metric', 'Value', 'Change'],
          ...data.map(metric => [metric.label, metric.value, metric.change])
        ].map(row => row.join(',')).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'excel':
        showAlert({
          type: 'info',
          title: 'Excel Export',
          message: 'Excel export functionality will be implemented in the next update. For now, you can use the CSV export option.',
          buttonText: 'Got it'
        });
        return;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentReport = reportData[selectedReport];

  const exportOptions = [
    { label: 'PDF Report', icon: FileText, action: () => handleExportReport('pdf') },
    { label: 'CSV Data', icon: Download, action: () => handleExportReport('csv') },
    { label: 'Excel Spreadsheet', icon: BarChart3, action: () => handleExportReport('excel') }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">View AI & consultation analytics for your organization</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedReport('overview')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedReport === 'overview'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-6 w-6 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">Overview</h4>
            <p className="text-sm text-gray-600">Company health metrics and KPIs</p>
          </button>
          <button
            onClick={() => setSelectedReport('engagement')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedReport === 'engagement'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="h-6 w-6 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">Engagement</h4>
            <p className="text-sm text-gray-600">Employee usage and adoption rates</p>
          </button>
          <button
            onClick={() => setSelectedReport('health')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedReport === 'health'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Activity className="h-6 w-6 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">Health Analytics</h4>
            <p className="text-sm text-gray-600">Health data and consultation insights</p>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{currentReport.title}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintReport}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              {exportOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={option.action}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currentReport.metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Chart</h4>
            <p className="text-gray-600">Visual representation of your data will appear here</p>
          </div>
        </div>
      </div>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Health consultation completed</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">AI interaction completed</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Generate Monthly Report</h4>
              <p className="text-sm text-gray-600">Create comprehensive monthly analytics</p>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Export User Data</h4>
              <p className="text-sm text-gray-600">Download employee health engagement data</p>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-medium text-gray-900">Schedule Report</h4>
              <p className="text-sm text-gray-600">Set up automated report delivery</p>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        buttonText={alertModal.buttonText}
      />
    </div>
  );
};

export default CompanyReports;
