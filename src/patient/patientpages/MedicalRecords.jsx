import React from 'react';
import { FileText, Download, Upload, Search, Filter } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const MedicalRecords = () => {
  const records = [
    { id: 1, title: 'Blood Test Results', doctor: 'Dr. Sarah Johnson', date: 'Sep 28, 2025', type: 'Lab Report', size: '2.4 MB' },
    { id: 2, title: 'X-Ray Chest', doctor: 'Dr. James Wilson', date: 'Sep 20, 2025', type: 'Imaging', size: '5.2 MB' },
    { id: 3, title: 'Annual Checkup', doctor: 'Dr. Michael Chen', date: 'Sep 15, 2025', type: 'Report', size: '1.8 MB' },
    { id: 4, title: 'ECG Report', doctor: 'Dr. Sarah Johnson', date: 'Sep 10, 2025', type: 'Cardiac', size: '3.1 MB' },
    { id: 5, title: 'Allergy Test', doctor: 'Dr. Emily Davis', date: 'Aug 25, 2025', type: 'Lab Report', size: '1.5 MB' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-600">Access your medical history and reports securely</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
          <Upload className="w-5 h-5" />
          <span>Upload Record</span>
        </button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search records by title, doctor, or type..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </Card>

      {/* Records List */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Medical Records</h3>
          <p className="text-sm text-gray-600">All your medical documents and reports</p>
        </div>
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <FileText className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{record.title}</h3>
                  <p className="text-sm text-gray-600">{record.doctor} • {record.date}</p>
                  <p className="text-xs text-gray-500">{record.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {record.type}
                </span>
                <button className="flex items-center space-x-1 p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MedicalRecords;
