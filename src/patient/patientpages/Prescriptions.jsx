import React from 'react';
import { Clipboard, Calendar, Clock, AlertCircle, CheckCircle, Download } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const Prescriptions = () => {
  const prescriptions = [
    { id: 1, medication: 'Amoxicillin 500mg', doctor: 'Dr. Michael Chen', prescribed: 'Sep 28, 2025', duration: '7 days', status: 'active', dosage: 'Twice daily', refills: 2 },
    { id: 2, medication: 'Lisinopril 10mg', doctor: 'Dr. Sarah Johnson', prescribed: 'Sep 10, 2025', duration: '30 days', status: 'active', dosage: 'Once daily', refills: 1 },
    { id: 3, medication: 'Ibuprofen 400mg', doctor: 'Dr. James Wilson', prescribed: 'Aug 15, 2025', duration: '14 days', status: 'completed', dosage: 'As needed', refills: 0 },
  ];

  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <CheckCircle className="h-5 w-5 text-green-600" /> : 
      <AlertCircle className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
        <p className="text-gray-600">View and manage your current and past medications</p>
      </div>

      {/* Prescriptions List */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Current & Past Prescriptions</h3>
          <p className="text-sm text-gray-600">All your prescribed medications and their details</p>
        </div>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Clipboard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{prescription.medication}</h3>
                    <p className="text-gray-600 mt-1">Prescribed by {prescription.doctor}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Prescribed: {prescription.prescribed}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {prescription.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Dosage: {prescription.dosage}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Refills remaining: {prescription.refills}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(prescription.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </div>
                  <button className="flex items-center space-x-1 px-4 py-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Prescriptions;
