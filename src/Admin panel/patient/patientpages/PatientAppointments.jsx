import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Video, MessageSquare, Plus } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientAppointments = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefreshContent = () => {
    setIsContentLoading(true);
    setTimeout(() => {
      setIsContentLoading(false);
    }, 1000);
  };

  // Sample appointments data
  const sampleAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-01-20',
      time: '10:00 AM',
      duration: '30 minutes',
      type: 'In-person',
      status: 'Upcoming',
      location: 'Medical Center, Room 205',
      phone: '+1 (555) 123-4567',
      notes: 'Follow-up consultation for heart condition'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: '2024-01-18',
      time: '2:30 PM',
      duration: '45 minutes',
      type: 'Video Call',
      status: 'Completed',
      location: 'Online',
      phone: '+1 (555) 234-5678',
      notes: 'Annual check-up and blood pressure monitoring'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Davis',
      specialty: 'Dermatologist',
      date: '2024-01-15',
      time: '11:15 AM',
      duration: '20 minutes',
      type: 'In-person',
      status: 'Completed',
      location: 'Skin Clinic, Room 101',
      phone: '+1 (555) 345-6789',
      notes: 'Skin examination and mole check'
    },
    {
      id: 4,
      doctor: 'Dr. John Smith',
      specialty: 'Orthopedist',
      date: '2024-01-25',
      time: '3:00 PM',
      duration: '60 minutes',
      type: 'In-person',
      status: 'Upcoming',
      location: 'Orthopedic Center, Room 301',
      phone: '+1 (555) 456-7890',
      notes: 'Knee pain consultation and X-ray review'
    }
  ];

  useEffect(() => {
    setAppointments(sampleAppointments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video Call':
        return <Video className="w-4 h-4" />;
      case 'In-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments and consultations</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={handleRefreshContent}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content with loader */}
      <div className="relative">
        {isContentLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading appointments...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => a.status === 'Upcoming').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => a.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {appointments.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Card className="p-4">
            <div className="flex space-x-4">
              {['all', 'upcoming', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    filter === filterType
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          {/* Appointments List */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Appointments</h3>
              <p className="text-sm text-gray-600">
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-xl">
                      {getTypeIcon(appointment.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{appointment.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-gray-600">Common appointment management tasks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Book New Appointment</h4>
                    <p className="text-sm text-gray-600">Schedule with your preferred doctor</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Video className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Join Video Call</h4>
                    <p className="text-sm text-gray-600">Start your virtual consultation</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Message Doctor</h4>
                    <p className="text-sm text-gray-600">Send a message to your doctor</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
