import React, { useState } from 'react';
import { Clipboard, Search, Filter, Plus, Download, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const prescriptions = [
    { id: 1, patient: 'John Doe', medication: 'Amoxicillin 500mg', dosage: 'Twice daily', duration: '7 days', prescribed: 'Sep 28, 2025', status: 'Active', refills: 2, notes: 'For bacterial infection' },
    { id: 2, patient: 'Jane Smith', medication: 'Lisinopril 10mg', dosage: 'Once daily', duration: '30 days', prescribed: 'Sep 25, 2025', status: 'Active', refills: 1, notes: 'Blood pressure management' },
    { id: 3, patient: 'Mike Johnson', medication: 'Ibuprofen 400mg', dosage: 'As needed', duration: '14 days', prescribed: 'Sep 20, 2025', status: 'Completed', refills: 0, notes: 'Pain management' },
    { id: 4, patient: 'Sarah Williams', medication: 'Metformin 500mg', dosage: 'Twice daily', duration: '30 days', prescribed: 'Sep 18, 2025', status: 'Active', refills: 3, notes: 'Diabetes management' },
    { id: 5, patient: 'Robert Brown', medication: 'Atorvastatin 20mg', dosage: 'Once daily', duration: '30 days', prescribed: 'Sep 15, 2025', status: 'Active', refills: 2, notes: 'Cholesterol control' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Completed': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'Cancelled': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescriptions</h1>
          <p className="text-gray-600">Manage patient prescriptions and medications</p>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions by patient or medication..."
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
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-3 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors">
              <Filter className="h-5 w-5" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clipboard className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{prescription.medication}</h3>
                  <p className="text-gray-600 mt-1">Patient: {prescription.patient}</p>
                  <p className="text-sm text-gray-500 mt-1">{prescription.notes}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Dosage: {prescription.dosage}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clipboard className="h-4 w-4" />
                      <span>Duration: {prescription.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Refills: {prescription.refills}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Prescribed: {prescription.prescribed}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(prescription.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
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

      {filteredPrescriptions.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">No prescriptions match your current filters.</p>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Prescriptions</p>
              <p className="text-xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clipboard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Refills</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Download className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Downloads Today</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
