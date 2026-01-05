import React, { useState } from 'react';
import { User, Star, Phone, Mail, Calendar, Clock, MessageCircle, Video, Search, Filter, MapPin } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const MyDoctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', hospital: 'City Medical Center', location: 'New York, NY', phone: '+1 234-567-8900', email: 'sarah.j@hospital.com', lastVisit: 'Sep 28, 2025', rating: 4.9, experience: '15 years', status: 'online' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'General Physician', hospital: 'Health Plus Clinic', location: 'Los Angeles, CA', phone: '+1 234-567-8901', email: 'michael.c@hospital.com', lastVisit: 'Sep 15, 2025', rating: 4.8, experience: '12 years', status: 'busy' },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatologist', hospital: 'Skin Care Center', location: 'Chicago, IL', phone: '+1 234-567-8902', email: 'emily.d@hospital.com', lastVisit: 'Aug 25, 2025', rating: 4.7, experience: '8 years', status: 'offline' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedic', hospital: 'Bone & Joint Hospital', location: 'Houston, TX', phone: '+1 234-567-8903', email: 'james.w@hospital.com', lastVisit: 'Sep 20, 2025', rating: 4.6, experience: '20 years', status: 'online' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter doctors by name, specialty, or location
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.specialty.toLowerCase().includes(searchLower) ||
      doctor.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-pink-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Healthcare Team</h1>
        <p className="text-gray-600">Your trusted healthcare providers and specialists</p>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-2">
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Search className="w-12 h-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? `No doctors match "${searchTerm}". Try searching by name, specialty, or location.`
                      : 'No doctors available.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
          <Card key={doctor.id} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <User className="h-8 w-8 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-pink-600 font-medium">{doctor.specialty}</p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.hospital}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{doctor.rating}/5.0</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Clock className="h-4 w-4" />
                <span>{doctor.experience} experience</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="h-4 w-4" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="h-4 w-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Last visit: {doctor.lastVisit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-1 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>Book</span>
              </button>
              <button className="flex items-center justify-center space-x-1 bg-pink-100 text-pink-700 py-2 px-3 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium">
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </button>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200">
            <User className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">Find New Doctor</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <Video className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Video Consultation</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Emergency Contact</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default MyDoctors;
