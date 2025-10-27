import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Eye, MessageCircle, Mail, X, Calendar, MapPin } from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: { min: '', max: '' },
    gender: 'all',
    condition: 'all',
    lastVisitRange: { from: '', to: '' },
    hasAppointment: 'all'
  });

  // Navigation and action functions
  const handleSendMessage = (patientId) => {
    // Navigate to messages with patient pre-selected
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      navigate('/doctor/messages', { 
        state: { 
          selectedPatient: patient,
          selectedChatId: patientId,
          composeMessage: true
        } 
      });
    } else {
      navigate('/doctor/messages');
    }
  };

  const handleExportList = () => {
    // Export patients list to CSV
    const csvContent = [
      ['Name', 'Age', 'Gender', 'Condition', 'Last Visit', 'Status', 'Phone', 'Email'],
      ...patients.map(patient => [
        patient.name,
        patient.age,
        patient.gender,
        patient.condition,
        patient.lastVisit,
        patient.status,
        patient.phone,
        patient.email
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleViewPatient = (patientId) => {
    // Navigate to patient detail view
    navigate(`/doctor/patients/${patientId}`);
  };

  const handleEmailPatient = (email, patientName) => {
    // Open email client with pre-filled subject
    const subject = `Medical Consultation - ${patientName}`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
  };

  // Filter functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAgeRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      ageRange: {
        ...prev.ageRange,
        [type]: value
      }
    }));
  };

  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      lastVisitRange: {
        ...prev.lastVisitRange,
        [type]: value
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      ageRange: { min: '', max: '' },
      gender: 'all',
      condition: 'all',
      lastVisitRange: { from: '', to: '' },
      hasAppointment: 'all'
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };


  // Auto-trigger loader on component mount
  useEffect(() => {
    setIsContentLoading(true);
    setTimeout(() => {
      setIsContentLoading(false);
    }, 2000);
  }, []);

  const patients = [
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', condition: 'Hypertension', lastVisit: 'Sep 28, 2025', status: 'Active', phone: '+1 (555) 123-4567', email: 'john.doe@email.com', hasAppointment: true, lastVisitDate: new Date('2025-09-28') },
    { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', condition: 'Diabetes Type 2', lastVisit: 'Sep 27, 2025', status: 'Active', phone: '+1 (555) 234-5678', email: 'jane.smith@email.com', hasAppointment: false, lastVisitDate: new Date('2025-09-27') },
    { id: 3, name: 'Mike Johnson', age: 58, gender: 'Male', condition: 'Arthritis', lastVisit: 'Sep 25, 2025', status: 'Active', phone: '+1 (555) 345-6789', email: 'mike.johnson@email.com', hasAppointment: true, lastVisitDate: new Date('2025-09-25') },
    { id: 4, name: 'Sarah Williams', age: 41, gender: 'Female', condition: 'Asthma', lastVisit: 'Sep 24, 2025', status: 'Active', phone: '+1 (555) 456-7890', email: 'sarah.williams@email.com', hasAppointment: false, lastVisitDate: new Date('2025-09-24') },
    { id: 5, name: 'Robert Brown', age: 63, gender: 'Male', condition: 'Heart Disease', lastVisit: 'Sep 22, 2025', status: 'Under Treatment', phone: '+1 (555) 567-8901', email: 'robert.brown@email.com', hasAppointment: true, lastVisitDate: new Date('2025-09-22') },
    { id: 6, name: 'Emily Davis', age: 29, gender: 'Female', condition: 'Migraine', lastVisit: 'Sep 20, 2025', status: 'Recovered', phone: '+1 (555) 678-9012', email: 'emily.davis@email.com', hasAppointment: false, lastVisitDate: new Date('2025-09-20') },
    { id: 7, name: 'David Wilson', age: 55, gender: 'Male', condition: 'Hypertension', lastVisit: 'Sep 18, 2025', status: 'Active', phone: '+1 (555) 789-0123', email: 'david.wilson@email.com', hasAppointment: true, lastVisitDate: new Date('2025-09-18') },
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
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    // Age range filter
    const matchesAge = (!filters.ageRange.min || patient.age >= parseInt(filters.ageRange.min)) &&
                      (!filters.ageRange.max || patient.age <= parseInt(filters.ageRange.max));
    
    // Gender filter
    const matchesGender = filters.gender === 'all' || patient.gender === filters.gender;
    
    // Condition filter
    const matchesCondition = filters.condition === 'all' || patient.condition === filters.condition;
    
    // Last visit date range filter
    const matchesLastVisit = (!filters.lastVisitRange.from || patient.lastVisitDate >= new Date(filters.lastVisitRange.from)) &&
                           (!filters.lastVisitRange.to || patient.lastVisitDate <= new Date(filters.lastVisitRange.to));
    
    // Appointment filter
    const matchesAppointment = filters.hasAppointment === 'all' || 
                              (filters.hasAppointment === 'yes' && patient.hasAppointment) ||
                              (filters.hasAppointment === 'no' && !patient.hasAppointment);
    
    return matchesSearch && matchesStatus && matchesAge && matchesGender && 
           matchesCondition && matchesLastVisit && matchesAppointment;
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">My Patients</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage your patient list</p>
        </div>
      </div>

      {/* Main Content Area with Loader */}
      <div className="relative min-h-[600px]">
        {/* Content Loader */}
        {isContentLoading && (
          <div className="absolute inset-0 flex items-start justify-center z-50 pt-32">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading patients...</p>
            </div>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isContentLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
            <button 
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
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
                      <button 
                        onClick={() => handleViewPatient(patient.id)}
                        className="text-pink-600 hover:text-pink-900 transition-colors"
                        title="View Patient Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleSendMessage(patient.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Send Message"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEmailPatient(patient.email, patient.name)}
                        className="text-orange-600 hover:text-orange-900 transition-colors"
                        title="Email Patient"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
          </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-6">
                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min Age"
                        value={filters.ageRange.min}
                        onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max Age"
                        value={filters.ageRange.max}
                        onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="all">All Conditions</option>
                    <option value="Hypertension">Hypertension</option>
                    <option value="Diabetes Type 2">Diabetes Type 2</option>
                    <option value="Arthritis">Arthritis</option>
                    <option value="Asthma">Asthma</option>
                    <option value="Heart Disease">Heart Disease</option>
                    <option value="Migraine">Migraine</option>
                  </select>
                </div>

                {/* Last Visit Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit Date Range</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="date"
                        value={filters.lastVisitRange.from}
                        onChange={(e) => handleDateRangeChange('from', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="flex-1">
                      <input
                        type="date"
                        value={filters.lastVisitRange.to}
                        onChange={(e) => handleDateRangeChange('to', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Has Appointment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upcoming Appointment</label>
                  <select
                    value={filters.hasAppointment}
                    onChange={(e) => handleFilterChange('hasAppointment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="all">All Patients</option>
                    <option value="yes">Has Appointment</option>
                    <option value="no">No Appointment</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All
          </button>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
          </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Apply Filters
          </button>
        </div>
              </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
