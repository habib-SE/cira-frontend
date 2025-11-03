import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Bell
} from 'lucide-react';
import { StatsCard } from '../../../components/shared';

const DoctorWorkspaceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todaySchedule: [],
    pendingConfirmations: [],
    unreadMessages: [],
    earnings: {},
    verificationStatus: 'verified',
    upcomingAppointments: []
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    setDashboardData({
      todaySchedule: [
        {
          id: 'APT-001',
          patient: 'John Doe',
          time: '09:00 AM',
          type: 'Online',
          status: 'confirmed',
          duration: '30 min'
        },
        {
          id: 'APT-002',
          patient: 'Jane Smith',
          time: '10:30 AM',
          type: 'Offline',
          status: 'confirmed',
          duration: '45 min'
        },
        {
          id: 'APT-003',
          patient: 'Mike Johnson',
          time: '02:00 PM',
          type: 'Online',
          status: 'pending',
          duration: '30 min'
        }
      ],
      pendingConfirmations: [
        {
          id: 'APT-004',
          patient: 'Sarah Wilson',
          date: '2024-01-22',
          time: '11:00 AM',
          type: 'Online'
        },
        {
          id: 'APT-005',
          patient: 'David Brown',
          date: '2024-01-22',
          time: '03:30 PM',
          type: 'Offline'
        }
      ],
      unreadMessages: [
        {
          id: 'MSG-001',
          patient: 'John Doe',
          subject: 'Follow-up question',
          time: '2 hours ago',
          priority: 'normal'
        },
        {
          id: 'MSG-002',
          patient: 'Jane Smith',
          subject: 'Prescription refill',
          time: '4 hours ago',
          priority: 'urgent'
        }
      ],
      earnings: {
        monthToDate: 8500.00,
        yearToDate: 45000.00,
        nextPayout: 8500.00,
        payoutDate: '2024-01-31'
      },
      verificationStatus: 'verified',
      upcomingAppointments: [
        {
          id: 'APT-006',
          patient: 'Alice Johnson',
          date: '2024-01-23',
          time: '09:00 AM',
          type: 'Online'
        },
        {
          id: 'APT-007',
          patient: 'Bob Wilson',
          date: '2024-01-23',
          time: '02:00 PM',
          type: 'Offline'
        }
      ]
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your practice overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Appointments"
          value={dashboardData.todaySchedule.length}
          icon={Calendar}
          color="blue"
          change="+2 from yesterday"
          changeType="positive"
        />
        <StatsCard
          title="Pending Confirmations"
          value={dashboardData.pendingConfirmations.length}
          icon={Clock}
          color="yellow"
          change="3 need attention"
          changeType="warning"
        />
        <StatsCard
          title="Unread Messages"
          value={dashboardData.unreadMessages.length}
          icon={MessageSquare}
          color="purple"
          change="1 urgent"
          changeType="warning"
        />
        <StatsCard
          title="Earnings This Month"
          value={`$${dashboardData.earnings.monthToDate.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          change="+12% from last month"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.todaySchedule.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-pink-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                          <p className="text-sm text-gray-500">{appointment.time} • {appointment.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <span className="text-xs text-gray-500">{appointment.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Confirmations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Confirmations</h2>
              <span className="text-sm text-yellow-600 font-medium">{dashboardData.pendingConfirmations.length} pending</span>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.pendingConfirmations.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.pendingConfirmations.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.type} consultation</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200">
                        Confirm
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">All appointments confirmed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Unread Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Unread Messages</h2>
              <span className="text-sm text-purple-600 font-medium">{dashboardData.unreadMessages.length} unread</span>
            </div>
          </div>
          <div className="p-6">
            {dashboardData.unreadMessages.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.unreadMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{message.patient}</h3>
                      <p className="text-sm text-gray-600">{message.subject}</p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No unread messages</p>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Earnings Summary</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Month to Date</span>
                <span className="font-semibold text-gray-900">${dashboardData.earnings.monthToDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Year to Date</span>
                <span className="font-semibold text-gray-900">${dashboardData.earnings.yearToDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Payout</span>
                <span className="font-semibold text-green-600">${dashboardData.earnings.nextPayout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payout Date</span>
                <span className="text-sm text-gray-500">{new Date(dashboardData.earnings.payoutDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100">
                View Detailed Earnings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Verification Status</h2>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Verified</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Your profile is verified and active</p>
              <p className="text-sm text-gray-500 mt-1">Last verified: January 15, 2024</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorWorkspaceDashboard;
