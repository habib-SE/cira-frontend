import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Eye, MessageCircle, Calendar, Phone, Mail } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const patients = [
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', condition: 'Hypertension', lastVisit: 'Sep 28, 2025', status: 'Active', phone: '+1 (555) 123-4567', email: 'john.doe@email.com' },
    { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', condition: 'Diabetes Type 2', lastVisit: 'Sep 27, 2025', status: 'Active', phone: '+1 (555) 234-5678', email: 'jane.smith@email.com' },
    { id: 3, name: 'Mike Johnson', age: 58, gender: 'Male', condition: 'Arthritis', lastVisit: 'Sep 25, 2025', status: 'Active', phone: '+1 (555) 345-6789', email: 'mike.johnson@email.com' },
    { id: 4, name: 'Sarah Williams', age: 41, gender: 'Female', condition: 'Asthma', lastVisit: 'Sep 24, 2025', status: 'Active', phone: '+1 (555) 456-7890', email: 'sarah.williams@email.com' },
    { id: 5, name: 'Robert Brown', age: 63, gender: 'Male', condition: 'Heart Disease', lastVisit: 'Sep 22, 2025', status: 'Under Treatment', phone: '+1 (555) 567-8901', email: 'robert.brown@email.com' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Treatment': return 'bg-yellow-100 text-yellow-800';
      case 'Recovered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">View and manage your patient list</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, condition, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Recovered">Recovered</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Patients Table */}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Age/Gender</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age} / {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.condition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-pink-600 hover:text-pink-900 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors duration-200">
            <Users className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-pink-600">Add Patient</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-600">Schedule Visit</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-600">Send Message</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200">
            <Mail className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-600">Export List</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DoctorPatients;