import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, User, Stethoscope } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const MedicalRecords = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [records, setRecords] = useState([]);

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

  // Sample medical records data
  const sampleRecords = [
    {
      id: 1,
      title: 'Blood Test Results',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      type: 'Lab Results',
      status: 'Available',
      description: 'Complete blood count and metabolic panel results'
    },
    {
      id: 2,
      title: 'X-Ray Report',
      date: '2024-01-10',
      doctor: 'Dr. Michael Chen',
      specialty: 'Radiology',
      type: 'Imaging',
      status: 'Available',
      description: 'Chest X-ray examination results'
    },
    {
      id: 3,
      title: 'Cardiology Consultation',
      date: '2024-01-05',
      doctor: 'Dr. Emily Davis',
      specialty: 'Cardiology',
      type: 'Consultation',
      status: 'Available',
      description: 'Heart examination and consultation notes'
    },
    {
      id: 4,
      title: 'Prescription Record',
      date: '2024-01-01',
      doctor: 'Dr. John Smith',
      specialty: 'General Medicine',
      type: 'Prescription',
      status: 'Active',
      description: 'Current medication prescriptions'
    }
  ];

  useEffect(() => {
    setRecords(sampleRecords);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Lab Results':
        return <FileText className="w-5 h-5" />;
      case 'Imaging':
        return <Eye className="w-5 h-5" />;
      case 'Consultation':
        return <Stethoscope className="w-5 h-5" />;
      case 'Prescription':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-600">View and manage your medical records and documents</p>
        </div>
        <button
          onClick={handleRefreshContent}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
        >
          Refresh
        </button>
      </div>

      {/* Content with loader */}
      <div className="relative">
        {isContentLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading medical records...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{records.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {records.filter(r => r.status === 'Available').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lab Results</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {records.filter(r => r.type === 'Lab Results').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imaging</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {records.filter(r => r.type === 'Imaging').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Records List */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All Medical Records</h3>
              <p className="text-sm text-gray-600">Click on any record to view details</p>
            </div>

            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-xl">
                      {getTypeIcon(record.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{record.title}</h4>
                      <p className="text-sm text-gray-600">{record.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{record.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
