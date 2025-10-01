import React from 'react';
import { Users, Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorDashboard = () => {
  const stats = [
    { 
      title: "Today's Appointments", 
      value: '12', 
      change: '+3 from yesterday',
      icon: Calendar, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Patients', 
      value: '248', 
      change: '+12 this month',
      icon: Users, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Pending Reviews', 
      value: '5', 
      change: '2 urgent',
      icon: Clock, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    { 
      title: 'Completed Today', 
      value: '8', 
      change: '67% completion',
      icon: CheckCircle, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
    { id: 2, patient: 'Jane Smith', time: '11:30 AM', type: 'Follow-up', status: 'confirmed' },
    { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Check-up', status: 'waiting' },
    { id: 4, patient: 'Sarah Williams', time: '3:30 PM', type: 'Consultation', status: 'confirmed' },
  ];

  const recentPatients = [
    { id: 1, name: 'Emily Davis', lastVisit: 'Sep 28, 2025', condition: 'Hypertension', status: 'Stable' },
    { id: 2, name: 'Robert Brown', lastVisit: 'Sep 27, 2025', condition: 'Diabetes', status: 'Under Treatment' },
    { id: 3, name: 'Lisa Anderson', lastVisit: 'Sep 26, 2025', condition: 'Asthma', status: 'Improving' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Dashboard</h1>
        <p className="text-gray-600">Welcome back, Doctor! Here's your practice overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Today's Appointments</h3>
            <p className="text-sm text-gray-600">Your schedule for today</p>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Patients */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Patients</h3>
            <p className="text-sm text-gray-600">Latest patient consultations</p>
          </div>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{patient.lastVisit}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200">
            <Calendar className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">View Schedule</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Patient List</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Pending Reviews</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-600">Write Prescription</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
