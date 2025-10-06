import React, { useState, useEffect } from 'react';
import { Pill, Calendar, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const Prescriptions = () => {
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);

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

  // Sample prescriptions data
  const samplePrescriptions = [
    {
      id: 1,
      medication: 'Metformin 500mg',
      dosage: '1 tablet twice daily',
      doctor: 'Dr. Sarah Johnson',
      datePrescribed: '2024-01-15',
      refillsRemaining: 3,
      status: 'Active',
      nextRefillDate: '2024-02-15',
      instructions: 'Take with food to reduce stomach upset'
    },
    {
      id: 2,
      medication: 'Lisinopril 10mg',
      dosage: '1 tablet once daily',
      doctor: 'Dr. Michael Chen',
      datePrescribed: '2024-01-10',
      refillsRemaining: 2,
      status: 'Active',
      nextRefillDate: '2024-02-10',
      instructions: 'Take at the same time each day'
    },
    {
      id: 3,
      medication: 'Amoxicillin 250mg',
      dosage: '1 capsule three times daily',
      doctor: 'Dr. Emily Davis',
      datePrescribed: '2024-01-05',
      refillsRemaining: 0,
      status: 'Completed',
      nextRefillDate: null,
      instructions: 'Take for 7 days, even if feeling better'
    },
    {
      id: 4,
      medication: 'Ibuprofen 400mg',
      dosage: '1 tablet as needed for pain',
      doctor: 'Dr. John Smith',
      datePrescribed: '2024-01-01',
      refillsRemaining: 1,
      status: 'Low Refills',
      nextRefillDate: '2024-01-25',
      instructions: 'Do not exceed 6 tablets per day'
    }
  ];

  useEffect(() => {
    setPrescriptions(samplePrescriptions);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Low Refills':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Low Refills':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Pill className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prescriptions</h1>
          <p className="text-gray-600">Manage your medications and prescription refills</p>
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
              <p className="text-gray-600 font-medium">Loading prescriptions...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Medications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.filter(p => p.status === 'Active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Pill className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Refills</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.filter(p => p.status === 'Low Refills').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {prescriptions.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Prescriptions List */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All Prescriptions</h3>
              <p className="text-sm text-gray-600">Click on any prescription to view details or request refills</p>
            </div>

            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-xl">
                      <Pill className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{prescription.medication}</h4>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                      <p className="text-xs text-gray-500 mt-1">{prescription.instructions}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{prescription.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{prescription.datePrescribed}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {prescription.refillsRemaining} refills left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(prescription.status)}`}>
                      {getStatusIcon(prescription.status)}
                      <span>{prescription.status}</span>
                    </span>
                    {prescription.status === 'Low Refills' && (
                      <button className="px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors">
                        Request Refill
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
              <p className="text-sm text-gray-600">Common prescription management tasks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Pill className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Request Refill</h4>
                    <p className="text-sm text-gray-600">Request refills for your medications</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Set Reminders</h4>
                    <p className="text-sm text-gray-600">Set medication reminders</p>
                  </div>
                </div>
              </button>
              <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Contact Doctor</h4>
                    <p className="text-sm text-gray-600">Ask questions about medications</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
