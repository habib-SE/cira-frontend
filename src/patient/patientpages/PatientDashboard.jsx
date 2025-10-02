import React from 'react';
import { Calendar, FileText, Clipboard, Heart, TrendingUp, Clock } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientDashboard = () => {
  const stats = [
    { 
      title: 'Upcoming Appointments', 
      value: '3', 
      change: '+2 this week',
      icon: Calendar, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Medical Records', 
      value: '12', 
      change: '+3 new files',
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Active Prescriptions', 
      value: '2', 
      change: 'Refill available',
      icon: Clipboard, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'My Doctors', 
      value: '5', 
      change: 'All verified',
      icon: Heart, 
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Oct 5, 2025', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Oct 8, 2025', time: '2:30 PM' },
    { id: 3, doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', date: 'Oct 12, 2025', time: '11:15 AM' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Health Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your health information.</p>
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

      {/* Upcoming Appointments */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Upcoming Appointments</h3>
          <p className="text-sm text-gray-600">Your scheduled medical visits</p>
        </div>
        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{appointment.date}</p>
                <p className="text-sm text-gray-600">{appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200">
            <Calendar className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">Book Appointment</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">View Records</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <Clipboard className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Prescriptions</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
