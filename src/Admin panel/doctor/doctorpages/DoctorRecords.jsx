import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, Download, Eye, Edit, Trash2, Calendar, User } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const records = [
    { id: 1, patient: 'John Doe', title: 'Blood Test Results', type: 'Lab Report', date: 'Sep 28, 2025', status: 'Completed', size: '2.4 MB', notes: 'Complete blood count and lipid panel' },
    { id: 2, patient: 'Jane Smith', title: 'X-Ray Chest', type: 'Imaging', date: 'Sep 25, 2025', status: 'Completed', size: '5.2 MB', notes: 'Chest X-ray for respiratory symptoms' },
    { id: 3, patient: 'Mike Johnson', title: 'ECG Report', type: 'Cardiac', date: 'Sep 22, 2025', status: 'Completed', size: '1.8 MB', notes: '12-lead ECG for heart rhythm analysis' },
    { id: 4, patient: 'Sarah Williams', title: 'MRI Brain', type: 'Imaging', date: 'Sep 20, 2025', status: 'Pending', size: '15.6 MB', notes: 'Brain MRI for neurological assessment' },
    { id: 5, patient: 'Robert Brown', title: 'Pathology Report', type: 'Lab Report', date: 'Sep 18, 2025', status: 'Completed', size: '3.1 MB', notes: 'Tissue biopsy analysis results' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Lab Report': return 'bg-blue-100 text-blue-800';
      case 'Imaging': return 'bg-purple-100 text-purple-800';
      case 'Cardiac': return 'bg-red-100 text-red-800';
      case 'Pathology': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-600">Manage patient medical records and reports</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records by patient, title, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Lab Report">Lab Report</option>
              <option value="Imaging">Imaging</option>
              <option value="Cardiac">Cardiac</option>
              <option value="Pathology">Pathology</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                  <p className="text-gray-600 mt-1">Patient: {record.patient}</p>
                  <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Date: {record.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>Size: {record.size}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Type: {record.type}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(record.type)}`}>
                    {record.type}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-600">No medical records match your current filters.</p>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Download className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Eye className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Views Today</p>
              <p className="text-xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRecords;
