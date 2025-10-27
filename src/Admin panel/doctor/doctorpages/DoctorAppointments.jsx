import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Phone, MapPin, Filter, Search, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);


  // Auto-trigger loader on component mount
  useEffect(() => {
    setIsContentLoading(true);
    setTimeout(() => {
      setIsContentLoading(false);
    }, 2000);
  }, []);

  const appointments = {
    today: [
      { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Consultation', status: 'confirmed', duration: '30 min', room: 'Room 301', notes: 'Follow-up for hypertension' },
      { id: 2, patient: 'Jane Smith', time: '11:30 AM', type: 'Follow-up', status: 'confirmed', duration: '45 min', room: 'Room 301', notes: 'Diabetes management' },
      { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Check-up', status: 'waiting', duration: '30 min', room: 'Room 301', notes: 'Annual physical' },
      { id: 4, patient: 'Sarah Williams', time: '3:30 PM', type: 'Consultation', status: 'confirmed', duration: '60 min', room: 'Room 301', notes: 'New patient consultation' },
    ],
    upcoming: [
      { id: 5, patient: 'Robert Brown', time: '10:00 AM', type: 'Follow-up', status: 'confirmed', duration: '30 min', room: 'Room 301', notes: 'Heart condition monitoring', date: 'Oct 1, 2025' },
      { id: 6, patient: 'Emily Davis', time: '2:00 PM', type: 'Consultation', status: 'pending', duration: '45 min', room: 'Room 301', notes: 'Skin condition review', date: 'Oct 2, 2025' },
    ],
    past: [
      { id: 7, patient: 'Lisa Anderson', time: '9:00 AM', type: 'Check-up', status: 'completed', duration: '30 min', room: 'Room 301', notes: 'Routine examination', date: 'Sep 29, 2025' },
      { id: 8, patient: 'David Wilson', time: '11:00 AM', type: 'Follow-up', status: 'completed', duration: '45 min', room: 'Room 301', notes: 'Post-surgery check', date: 'Sep 28, 2025' },
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consultation': return 'bg-blue-100 text-blue-800';
      case 'Follow-up': return 'bg-purple-100 text-purple-800';
      case 'Check-up': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'waiting': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const currentAppointments = appointments[activeTab] || [];

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Appointments</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your patient appointments and schedule</p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button className="flex items-center space-x-2 bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium text-sm sm:text-base">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Schedule New</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Loader */}
      <div className="relative min-h-[600px]">
        {/* Content Loader */}
        {isContentLoading && (
          <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading appointments...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Tabs */}
          <Card className="p-0">
        <div className="border-b border-gray-200">
          <div className="flex">
            {Object.keys(appointments).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab} ({appointments[tab].length})
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors text-sm sm:text-base flex-shrink-0">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {currentAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="bg-pink-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{appointment.patient}</h3>
                      <p className="text-sm sm:text-base text-gray-600 truncate">{appointment.notes}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{appointment.room}</span>
                        </div>
                        <span>{appointment.duration}</span>
                        {appointment.date && <span>• {appointment.date}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTypeColor(appointment.type)}`}>
                      {appointment.type}
                    </span>
                    <div className="flex space-x-1 sm:space-x-2">
                      <button className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your current filters.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Confirmed Today</p>
              <p className="text-xl font-bold text-gray-900">
                {appointments.today.filter(apt => apt.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Waiting</p>
              <p className="text-xl font-bold text-gray-900">
                {appointments.today.filter(apt => apt.status === 'waiting').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Video Calls</p>
              <p className="text-xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
