import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, Calendar, Activity, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';
import Chart from '../../admin/admincomponents/Chart';

const DoctorAnalytics = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Navigation and action functions
  const handleGenerateReport = () => {
    // Generate analytics report
    setToastMessage('Generating analytics report...');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePatientInsights = () => {
    navigate('/doctor/patients');
  };

  const handleScheduleAnalysis = () => {
    navigate('/doctor/appointments');
  };

  const handleExportData = () => {
    // Export analytics data
    setToastMessage('Exporting analytics data...');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const patientData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 55 },
    { name: 'Jun', value: 67 },
  ];

  const appointmentData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 18 },
    { name: 'Thu', value: 14 },
    { name: 'Fri', value: 16 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 5 },
  ];

  const diagnosisData = [
    { name: 'Cardiology', value: 35 },
    { name: 'General Medicine', value: 25 },
    { name: 'Dermatology', value: 20 },
    { name: 'Orthopedics', value: 20 },
  ];

  const statsCards = [
    {
      title: 'Total Patients',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Appointments Today',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Completed This Week',
      value: '45',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Average Wait Time',
      value: '15 min',
      change: '-5 min',
      changeType: 'positive',
      icon: Clock,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Patient John Doe checked in', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Prescription sent to pharmacy', time: '5 min ago', status: 'success' },
    { id: 3, action: 'Lab results received', time: '8 min ago', status: 'success' },
    { id: 4, action: 'Appointment rescheduled', time: '12 min ago', status: 'warning' },
    { id: 5, action: 'Emergency alert triggered', time: '15 min ago', status: 'error' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights into your practice performance and patient care</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    <span className="text-sm text-gray-500">from last week</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Patient Growth</h3>
            <p className="text-sm text-gray-600">Monthly patient registration trends</p>
          </div>
          <Chart type="line" data={patientData} height={300} />
        </Card>

        {/* Weekly Appointments Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Weekly Appointments</h3>
            <p className="text-sm text-gray-600">Appointment distribution by day</p>
          </div>
          <Chart type="bar" data={appointmentData} height={300} />
        </Card>
      </div>

      {/* Specialties and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diagnosis Distribution */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Diagnosis Distribution</h3>
            <p className="text-sm text-gray-600">Most common conditions treated</p>
          </div>
          <Chart type="pie" data={diagnosisData} height={300} />
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-sm text-gray-600">Latest practice activities</p>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-pink-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">95%</h4>
            <p className="text-sm text-gray-600">Patient Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">15 min</h4>
            <p className="text-sm text-gray-600">Average Consultation Time</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">98%</h4>
            <p className="text-sm text-gray-600">On-Time Appointments</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={handleGenerateReport}
            className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200"
          >
            <BarChart3 className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">Generate Report</span>
          </button>
          <button 
            onClick={handlePatientInsights}
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Patient Insights</span>
          </button>
          <button 
            onClick={handleScheduleAnalysis}
            className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Schedule Analysis</span>
          </button>
          <button 
            onClick={handleExportData}
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-600">Export Data</span>
          </button>
        </div>
      </Card>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg shadow-lg flex items-center space-x-3 px-4 py-3 max-w-sm">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-pink-500" />
            </div>
            <span className="text-pink-700 font-medium flex-1">{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 text-pink-500 hover:text-pink-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAnalytics;
