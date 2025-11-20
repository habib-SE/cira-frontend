import React, { useState } from 'react';
import { 
  Camera, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  FileText, 
  Phone, 
  Video, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample activity data
  const activities = [
    {
      id: 1,
      type: 'scan',
      title: 'Health Scan Completed',
      description: 'AI-powered health assessment using camera scan',
      timestamp: '2025-01-15T10:30:00Z',
      status: 'completed',
      details: 'Scanned vital signs, skin analysis, and posture assessment'
    },
    {
      id: 2,
      type: 'chat',
      title: 'AI Nurse Consultation',
      description: 'Chat session with AI healthcare assistant',
      timestamp: '2025-01-15T09:15:00Z',
      status: 'completed',
      details: 'Discussed symptoms and received health recommendations'
    },
    {
      id: 3,
      type: 'booking',
      title: 'Appointment Booked',
      description: 'Scheduled consultation with Dr. Sarah Johnson',
      timestamp: '2025-01-14T16:45:00Z',
      status: 'upcoming',
      details: 'Cardiology consultation scheduled for Jan 20, 2025 at 2:00 PM'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Processed',
      description: 'Referral service payment completed',
      timestamp: '2025-01-14T16:30:00Z',
      status: 'completed',
      details: 'Payment of $299.00 processed via credit card ending in 4242'
    },
    {
      id: 5,
      type: 'chat',
      title: 'Follow-up Chat',
      description: 'Follow-up discussion about treatment plan',
      timestamp: '2025-01-13T14:20:00Z',
      status: 'completed',
      details: 'Reviewed medication schedule and side effects'
    },
    {
      id: 6,
      type: 'scan',
      title: 'Daily Health Check',
      description: 'Routine health monitoring scan',
      timestamp: '2025-01-13T08:00:00Z',
      status: 'completed',
      details: 'Morning health check including blood pressure and heart rate'
    },
    {
      id: 7,
      type: 'booking',
      title: 'Appointment Rescheduled',
      description: 'Rescheduled appointment with Dr. Michael Chen',
      timestamp: '2025-01-12T11:30:00Z',
      status: 'completed',
      details: 'Moved from Jan 15 to Jan 18 due to schedule conflict'
    },
    {
      id: 8,
      type: 'chat',
      title: 'Emergency Consultation',
      description: 'Urgent health concern discussion',
      timestamp: '2025-01-11T20:15:00Z',
      status: 'completed',
      details: 'Addressed acute symptoms and received immediate guidance'
    },
    {
      id: 9,
      type: 'scan',
      title: 'Symptom Analysis',
      description: 'AI analysis of reported symptoms',
      timestamp: '2025-01-11T19:45:00Z',
      status: 'completed',
      details: 'Analyzed headache patterns and recommended pain management'
    },
    {
      id: 10,
      type: 'payment',
      title: 'Subscription Renewal',
      description: 'Monthly subscription payment processed',
      timestamp: '2025-01-10T00:00:00Z',
      status: 'completed',
      details: 'Premium healthcare plan renewed for $49.99/month'
    }
  ];

  const activityTypes = {
    scan: {
      icon: Camera,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    chat: {
      icon: MessageSquare,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    booking: {
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    payment: {
      icon: CreditCard,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'upcoming':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Activity History</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your healthcare activities and interactions</p>
        </div>

        {/* Filters and Search - Full Width */}
        <div className="mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search - Full Width */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filter Dropdown - Full Width on Mobile */}
              <div className="relative w-full sm:w-auto sm:min-w-[200px]">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Activities</option>
                  <option value="scan">Health Scans</option>
                  <option value="chat">AI Consultations</option>
                  <option value="booking">Appointments</option>
                  <option value="payment">Payments</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline - Full Width */}
        <div className="relative w-full">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden sm:block"></div>

          <div className="space-y-4 sm:space-y-6 w-full">
            {filteredActivities.map((activity, index) => {
              const activityType = activityTypes[activity.type];
              const IconComponent = activityType.icon;
              
              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-6 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10 hidden sm:flex items-center justify-center" style={{backgroundColor: activityType.color === 'blue' ? '#dbeafe' : activityType.color === 'green' ? '#dcfce7' : activityType.color === 'purple' ? '#f3e8ff' : '#fed7aa'}}>
                    <IconComponent className={`h-4 w-4 ${activityType.iconColor}`} />
                  </div>

                  {/* Activity Card - Full Width */}
                  <div className={`ml-0 sm:ml-20 w-full ${activityType.bgColor} ${activityType.borderColor} border rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                      

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                {activity.status}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{activity.description}</p>
                            
                            {activity.details && (
                              <p className="text-sm text-gray-500 mb-4">{activity.details}</p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                {getStatusIcon(activity.status)}
                                <span>{formatTimestamp(activity.timestamp)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {activity.type === 'scan' && (
                                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Download className="h-4 w-4" />
                                  </button>
                                )}
                                {activity.type === 'chat' && (
                                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <MessageSquare className="h-4 w-4" />
                                  </button>
                                )}
                                {activity.type === 'booking' && (
                                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Calendar className="h-4 w-4" />
                                  </button>
                                )}
                                {activity.type === 'payment' && (
                                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <FileText className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Your activity history will appear here'}
              </p>
            </div>
          )}
        </div>

        {/* Activity Summary - Full Width */}
        <div className="mt-8 sm:mt-12 w-full">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
              {Object.entries(activityTypes).map(([type, config]) => {
                const count = activities.filter(activity => activity.type === type).length;
                const IconComponent = config.icon;
                
                return (
                  <div key={type} className="text-center">
                    <div className={`w-12 h-12 ${config.bgColor} ${config.borderColor} border rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type}s</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;
