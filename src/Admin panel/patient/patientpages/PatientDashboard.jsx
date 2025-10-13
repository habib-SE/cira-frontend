import React from 'react';
import { Calendar, FileText, Clipboard, Heart, TrendingUp, Clock, Stethoscope, Bot } from 'lucide-react';
import { PageWrapper, PageHeader, StatsCard } from '../../../components/shared';
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
      title: 'My Reports', 
      value: '12', 
      change: '+3 new files',
      icon: FileText, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Start AI Nurse', 
      value: '---', 
      change: 'Start Now',
      icon: Bot,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Book A Doctors', 
      value: '1', 
      change: 'View All',
      icon:  Stethoscope, 
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
    <>
      {/* Fixed Heading - Always Visible */}
      <PageHeader
        title="My Health Dashboard"
        description="Welcome back! Here's an overview of your health information."
      />

      {/* Content Below Heading - Gets Loader */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={Icon}
                color={stat.color}
                bgColor={stat.bgColor}
              />
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
              <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className='px-5 lg:px-0'>
                    <p className="font-semibold text-gray-900 ">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  </div>
                </div>
                <div className="text-left pl-20 lg:pl-0 sm:text-right w-full sm:w-auto">
                  <p className="font-medium text-gray-900">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default PatientDashboard;
