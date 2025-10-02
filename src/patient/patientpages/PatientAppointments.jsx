import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Video, RotateCcw, X } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const appointments = {
    upcoming: [
      { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Oct 5, 2025', time: '10:00 AM', location: 'Room 301', status: 'confirmed' },
      { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: 'Oct 8, 2025', time: '2:30 PM', location: 'Room 105', status: 'confirmed' },
      { id: 3, doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', date: 'Oct 12, 2025', time: '11:15 AM', location: 'Room 202', status: 'pending' },
    ],
    past: [
      { id: 4, doctor: 'Dr. James Wilson', specialty: 'Orthopedic', date: 'Sep 20, 2025', time: '3:00 PM', location: 'Room 404', status: 'completed' },
      { id: 5, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Sep 10, 2025', time: '10:30 AM', location: 'Room 301', status: 'completed' },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments and schedule new ones</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Upcoming ({appointments.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Past ({appointments.past.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {appointments[activeTab].map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{appointment.doctor}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{appointment.specialty}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CalendarIcon className="h-5 w-5" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <ClockIcon className="h-5 w-5" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPinIcon className="h-5 w-5" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                  {activeTab === 'upcoming' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Join Video Call
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
