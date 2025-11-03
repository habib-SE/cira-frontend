import React, { useState, useEffect } from 'react';
import {
  Bot, 
  Calendar,
  FileText,
  CreditCard,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Bell
} from 'lucide-react';
import { StatsCard } from '../../../components/shared';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lastAIReport: null,
    upcomingAppointment: null,
    subscriptionStatus: {
      plan: '',
      status: '',
      usage: {
        aiSessions: 0,
        maxSessions: 0,
        vitalsScans: 0,
        maxScans: 0
      }
    },
    recentReports: [],
    healthMetrics: {
      bloodPressure: '-',
      heartRate: '-',
      temperature: '-',
      weight: '-',
      lastUpdated: new Date().toISOString()
    },
    notifications: []
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    setDashboardData({
      lastAIReport: {
        id: 'RPT-001',
        date: '2024-01-20T10:30:00Z',
        symptoms: 'Headache, fatigue, mild fever',
        vitals: 'BP: 120/80, HR: 72, Temp: 99.1°F',
        status: 'finalized',
        recommendations: 'Rest, hydration, monitor temperature',
        conditions: ['Mild viral infection', 'Dehydration']
      },
      upcomingAppointment: {
        id: 'APT-001',
        doctor: 'Dr. Jane Smith',
        date: '2024-01-25',
        time: '02:00 PM',
        type: 'Online',
        status: 'confirmed',
        specialty: 'General Medicine'
      },
      subscriptionStatus: {
        plan: 'Premium',
        status: 'active',
        renewalDate: '2024-02-15',
        usage: {
          aiSessions: 8,
          maxSessions: 20,
          vitalsScans: 12,
          maxScans: 50
        }
      },
      recentReports: [
        {
          id: 'RPT-001',
          date: '2024-01-20',
          symptoms: 'Headache, fatigue',
          status: 'finalized'
        },
        {
          id: 'RPT-002',
          date: '2024-01-18',
          symptoms: 'Cough, congestion',
          status: 'finalized'
        },
        {
          id: 'RPT-003',
          date: '2024-01-15',
          symptoms: 'Stomach pain',
          status: 'draft'
        }
      ],
      healthMetrics: {
        bloodPressure: '120/80',
        heartRate: '72',
        temperature: '98.6°F',
        weight: '150 lbs',
        lastUpdated: '2024-01-20T08:00:00Z'
      },
      notifications: [
        {
          id: 'NOT-001',
          type: 'appointment',
          message: 'Appointment reminder: Dr. Jane Smith tomorrow at 2:00 PM',
          time: '2 hours ago',
          read: false
        },
        {
          id: 'NOT-002',
          type: 'report',
          message: 'Your AI health report is ready for review',
          time: '1 day ago',
          read: true
        }
      ]
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'finalized': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'report': return FileText;
      case 'payment': return CreditCard;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your health overview.</p>
      </div>

        {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">AI Health Assistant</h2>
              <p className="text-pink-100">Get instant health insights and recommendations</p>
          </div>
            <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Start AI Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="AI Sessions Used"
          value={`${dashboardData.subscriptionStatus.usage.aiSessions}/${dashboardData.subscriptionStatus.usage.maxSessions}`}
          icon={Bot}
          color="purple"
          change="8 sessions this month"
          changeType="neutral"
        />
        <StatsCard
          title="Vitals Scans"
          value={`${dashboardData.subscriptionStatus.usage.vitalsScans}/${dashboardData.subscriptionStatus.usage.maxScans}`}
          icon={Heart}
          color="red"
          change="12 scans completed"
          changeType="positive"
        />
        <StatsCard
          title="Health Reports"
          value={dashboardData.recentReports.length}
          icon={FileText}
          color="blue"
          change="3 reports generated"
          changeType="positive"
        />
        <StatsCard
          title="Subscription"
          value={dashboardData.subscriptionStatus.plan}
          icon={CreditCard}
          color="green"
          change="Active until Feb 15"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Last AI Report */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Last AI Report</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dashboardData.lastAIReport?.status)}`}>
                {dashboardData.lastAIReport?.status}
              </span>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.lastAIReport ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Symptoms Reported</h3>
                  <p className="text-sm text-gray-600">{dashboardData.lastAIReport.symptoms}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Vitals Captured</h3>
                  <p className="text-sm text-gray-600">{dashboardData.lastAIReport.vitals}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Possible Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.lastAIReport.conditions.map((condition, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                  <p className="text-sm text-gray-600">{dashboardData.lastAIReport.recommendations}</p>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100">
                    View Full Report
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Share with Doctor
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No AI reports yet</p>
                <button className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100">
                  Start Your First AI Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointment</h2>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.upcomingAppointment ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{dashboardData.upcomingAppointment.doctor}</h3>
                    <p className="text-sm text-gray-600">{dashboardData.upcomingAppointment.specialty}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-medium">{dashboardData.upcomingAppointment.date} at {dashboardData.upcomingAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{dashboardData.upcomingAppointment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dashboardData.upcomingAppointment.status)}`}>
                      {dashboardData.upcomingAppointment.status}
                </span>
              </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    Join Appointment
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Reschedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <button className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100">
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Health Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.healthMetrics.bloodPressure}</div>
                <div className="text-sm text-gray-600">Blood Pressure</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.healthMetrics.heartRate}</div>
                <div className="text-sm text-gray-600">Heart Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.healthMetrics.temperature}</div>
                <div className="text-sm text-gray-600">Temperature</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{dashboardData.healthMetrics.weight}</div>
                <div className="text-sm text-gray-600">Weight</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Last updated: {new Date(dashboardData.healthMetrics.lastUpdated).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <button className="text-sm text-pink-600 hover:text-pink-700">View All</button>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.recentReports.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{report.id}</h3>
                      <p className="text-sm text-gray-600">{report.symptoms}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <button className="text-pink-600 hover:text-pink-700">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reports yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <span className="text-sm text-gray-500">{dashboardData.notifications.filter(n => !n.read).length} unread</span>
          </div>
        </div>
        <div className="p-6">
          {dashboardData.notifications.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className={`flex items-start space-x-3 p-4 rounded-lg ${!notification.read ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-4 h-4 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
                </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </div>
      </div>
  );
};

export default PatientDashboard;