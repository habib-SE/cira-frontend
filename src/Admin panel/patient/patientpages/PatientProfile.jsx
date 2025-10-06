import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Shield, 
  Edit3, 
  Plus, 
  X, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Pill, 
  AlertTriangle, 
  CheckCircle,
  Save,
  Trash2
} from 'lucide-react';
import Card from '../../admin/admincomponents/Card';

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8900',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: '123 Main Street, City, State 12345',
    emergencyContact: 'Jane Doe (+1 234-567-8901)'
  });

  // Medical History State
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: [
      { id: 1, name: 'Hypertension', diagnosed: '2020-03-15', status: 'Active' },
      { id: 2, name: 'Type 2 Diabetes', diagnosed: '2019-08-22', status: 'Managed' },
      { id: 3, name: 'Asthma', diagnosed: '2015-05-10', status: 'Controlled' }
    ],
    medications: [
      { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribed: '2020-03-20' },
      { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribed: '2020-03-20' },
      { id: 3, name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed', prescribed: '2015-05-15' }
    ],
    allergies: [
      { id: 1, allergen: 'Penicillin', reaction: 'Rash, difficulty breathing', severity: 'Severe' },
      { id: 2, allergen: 'Shellfish', reaction: 'Hives, nausea', severity: 'Moderate' },
      { id: 3, allergen: 'Latex', reaction: 'Skin irritation', severity: 'Mild' }
    ]
  });

  // Consent Preferences State
  const [consentPreferences, setConsentPreferences] = useState({
    dataSharing: true,
    researchParticipation: false,
    emergencyContact: true,
    appointmentReminders: true,
    medicationReminders: true,
    healthAlerts: true,
    marketingCommunications: false,
    treatmentConsent: true
  });

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePersonalDetailsChange = (field, value) => {
    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConsentChange = (field) => {
    setConsentPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const addMedicalItem = (type, newItem) => {
    setMedicalHistory(prev => ({
      ...prev,
      [type]: [...prev[type], { id: Date.now(), ...newItem }]
    }));
  };

  const removeMedicalItem = (type, id) => {
    setMedicalHistory(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    setIsEditing(false);
    setShowAlert(true);
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe':
        return 'text-red-600 bg-red-50';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'Mild':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-red-600 bg-red-50';
      case 'Managed':
        return 'text-blue-600 bg-blue-50';
      case 'Controlled':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">Profile Updated Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">Your changes have been saved.</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 text-green-400 hover:text-green-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Health Information</h1>
              <p className="text-gray-600">Manage your personal details and medical information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Details Panel */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={personalDetails.firstName}
                    onChange={(e) => handlePersonalDetailsChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={personalDetails.lastName}
                    onChange={(e) => handlePersonalDetailsChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => handlePersonalDetailsChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={personalDetails.dateOfBirth}
                      onChange={(e) => handlePersonalDetailsChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    value={`${calculateAge(personalDetails.dateOfBirth)} years old`}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={personalDetails.gender}
                  onChange={(e) => handlePersonalDetailsChange('gender', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={personalDetails.address}
                    onChange={(e) => handlePersonalDetailsChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  value={personalDetails.emergencyContact}
                  onChange={(e) => handlePersonalDetailsChange('emergencyContact', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </Card>

          {/* Medical History Panel */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
            </div>

            <div className="space-y-6">
              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Medical Conditions</h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddCondition(true)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {medicalHistory.conditions.map((condition) => (
                    <div key={condition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{condition.name}</div>
                        <div className="text-sm text-gray-600">
                          Diagnosed: {condition.diagnosed} • 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(condition.status)}`}>
                            {condition.status}
                          </span>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeMedicalItem('conditions', condition.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Current Medications</h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddMedication(true)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {medicalHistory.medications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{medication.name}</div>
                        <div className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequency} • Prescribed: {medication.prescribed}
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeMedicalItem('medications', medication.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Allergies</h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowAddAllergy(true)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {medicalHistory.allergies.map((allergy) => (
                    <div key={allergy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{allergy.allergen}</div>
                        <div className="text-sm text-gray-600">
                          {allergy.reaction} • 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeMedicalItem('allergies', allergy.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Consent Preferences Panel */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Consent Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Data Sharing & Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Share data for research</div>
                      <div className="text-sm text-gray-600">Allow anonymized data to be used for medical research</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.dataSharing}
                        onChange={() => handleConsentChange('dataSharing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Research participation</div>
                      <div className="text-sm text-gray-600">Participate in clinical trials and studies</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.researchParticipation}
                        onChange={() => handleConsentChange('researchParticipation')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Emergency contact access</div>
                      <div className="text-sm text-gray-600">Allow emergency contacts to access your health data</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.emergencyContact}
                        onChange={() => handleConsentChange('emergencyContact')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Notifications & Communications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Appointment reminders</div>
                      <div className="text-sm text-gray-600">Receive notifications for upcoming appointments</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.appointmentReminders}
                        onChange={() => handleConsentChange('appointmentReminders')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Medication reminders</div>
                      <div className="text-sm text-gray-600">Get reminders for medication schedules</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.medicationReminders}
                        onChange={() => handleConsentChange('medicationReminders')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Health alerts</div>
                      <div className="text-sm text-gray-600">Receive important health-related notifications</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.healthAlerts}
                        onChange={() => handleConsentChange('healthAlerts')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Marketing communications</div>
                      <div className="text-sm text-gray-600">Receive promotional emails and offers</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentPreferences.marketingCommunications}
                        onChange={() => handleConsentChange('marketingCommunications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatment Consent */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Treatment consent</div>
                  <div className="text-sm text-gray-600">I consent to receive medical treatment and care as recommended by my healthcare providers</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentPreferences.treatmentConsent}
                    onChange={() => handleConsentChange('treatmentConsent')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;